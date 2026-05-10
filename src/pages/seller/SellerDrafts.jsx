import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material'
import {
  Drafts as DraftsIcon,
  MoreVert,
  Edit,
  Delete,
  Publish,
  Apps as AppsIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import useAuthStore from '../../store/authStore'
import { formatCurrency, formatRelativeTime } from '../../utils/helpers'

const SellerDrafts = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [drafts, setDrafts] = useState([])
  const [loading, setLoading] = useState(true)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedDraft, setSelectedDraft] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [publishDialog, setPublishDialog] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchDrafts()
  }, [])

  const fetchDrafts = async () => {
    try {
      setLoading(true)
      const sellerId = user?.id || user?._id
      const response = await api.get(`/applications/drafts/seller/${sellerId}`)

      if (response.data.success) {
        setDrafts(response.data.drafts || [])
      }
    } catch (error) {
      toast.error('Failed to fetch drafts')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleMenuOpen = (event, draft) => {
    setAnchorEl(event.currentTarget)
    setSelectedDraft(draft)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedDraft(null)
  }

  const handleEdit = (draft) => {
    navigate(`/seller/applications/edit/${draft._id}`)
    handleMenuClose()
  }

  const handlePublishClick = (draft) => {
    setSelectedDraft(draft)
    setPublishDialog(true)
    handleMenuClose()
  }

  const handlePublish = async () => {
    if (!selectedDraft) return

    try {
      setActionLoading(true)
      
      // Fetch the full draft data first
      const draftResponse = await api.get(`/applications/${selectedDraft._id}`)
      
      if (!draftResponse.data.success) {
        toast.error('Failed to load draft data')
        return
      }
      
      const draftData = draftResponse.data.application
      
      // Validate required fields before publishing
      const validationErrors = []
      if (!draftData.appName?.trim()) validationErrors.push('App name is required')
      if (!draftData.shortDescription?.trim()) validationErrors.push('Short description is required')
      if (!draftData.detailedDescription?.trim()) validationErrors.push('Detailed description is required')
      if (!draftData.appCategory) validationErrors.push('App category is required')
      if (!draftData.technologyStack || draftData.technologyStack.length === 0) {
        validationErrors.push('At least one technology is required')
      }
      if (!draftData.licenseType) validationErrors.push('License type is required')
      if (!draftData.screenshots || draftData.screenshots.length === 0) {
        validationErrors.push('At least one screenshot is required')
      }
      if (!draftData.appIcon) validationErrors.push('App icon is required')
      
      if (validationErrors.length > 0) {
        toast.error('Please complete all required fields before publishing')
        validationErrors.forEach(err => toast.error(err))
        setPublishDialog(false)
        // Navigate to edit page
        navigate(`/seller/applications/edit/${selectedDraft._id}`)
        return
      }
      
      // Update the draft to published status
      const response = await api.put(`/applications/${selectedDraft._id}`, {
        ...draftData,
        isDraft: false,
        verificationStatus: 'pending',
        publishedAt: new Date().toISOString(),
      })

      if (response.data.success) {
        toast.success('Draft published successfully! It will be reviewed by admin.')
        setDrafts(drafts.filter((d) => d._id !== selectedDraft._id))
        setPublishDialog(false)
        setSelectedDraft(null)
      }
    } catch (error) {
      console.error('Publish error:', error)
      
      // Show detailed error messages
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        error.response.data.errors.forEach(err => toast.error(err))
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Failed to publish draft. Please ensure all required fields are filled.')
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteClick = (draft) => {
    setSelectedDraft(draft)
    setDeleteDialog(true)
    handleMenuClose()
  }

  const handleDelete = async () => {
    if (!selectedDraft) return

    try {
      setActionLoading(true)
      const response = await api.delete(`/applications/${selectedDraft._id}`)

      if (response.data.success) {
        toast.success('Draft deleted successfully')
        setDrafts(drafts.filter((d) => d._id !== selectedDraft._id))
        setDeleteDialog(false)
        setSelectedDraft(null)
      }
    } catch (error) {
      toast.error('Failed to delete draft')
      console.error(error)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          Drafts
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Continue editing your saved drafts
        </Typography>
      </Box>

      {/* Drafts Grid */}
      {drafts.length === 0 ? (
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <DraftsIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                No drafts found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Drafts are automatically saved when you create or edit applications
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/seller/applications/create')}
              >
                Create Application
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {drafts.map((draft) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={draft._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <Box
                    sx={{
                      height: 180,
                      bgcolor: 'background.default',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleEdit(draft)}
                  >
                    {draft.screenshots?.[0] ? (
                      <img
                        src={draft.screenshots[0].url || draft.screenshots[0]}
                        alt={draft.appName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <AppsIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                    )}
                  </Box>

                  <Chip
                    label="Draft"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'warning.main',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />

                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      bgcolor: 'white',
                      '&:hover': { bgcolor: 'white' },
                    }}
                    onClick={(e) => handleMenuOpen(e, draft)}
                  >
                    <MoreVert />
                  </IconButton>
                </Box>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 0.5, cursor: 'pointer' }}
                    onClick={() => handleEdit(draft)}
                    noWrap
                  >
                    {draft.appName || 'Untitled Draft'}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} noWrap>
                    {draft.appCategory || 'No category'}
                  </Typography>

                  {draft.price && (
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                      {formatCurrency(draft.price, draft.currency)}
                    </Typography>
                  )}

                  <Typography variant="caption" color="text.secondary">
                    Saved {formatRelativeTime(draft.updatedAt)}
                  </Typography>
                </CardContent>

                <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => handleEdit(draft)}
                  >
                    Edit
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    startIcon={<Publish />}
                    onClick={() => handlePublishClick(draft)}
                  >
                    Publish
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Context Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleEdit(selectedDraft)}>
          <Edit sx={{ mr: 1 }} fontSize="small" />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handlePublishClick(selectedDraft)}>
          <Publish sx={{ mr: 1 }} fontSize="small" />
          Publish
        </MenuItem>
        <MenuItem onClick={() => handleDeleteClick(selectedDraft)} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} fontSize="small" />
          Delete
        </MenuItem>
      </Menu>

      {/* Publish Dialog */}
      <Dialog open={publishDialog} onClose={() => !actionLoading && setPublishDialog(false)}>
        <DialogTitle>Publish Draft?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to publish "{selectedDraft?.appName}"? It will be submitted for
            review.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPublishDialog(false)} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            onClick={handlePublish}
            variant="contained"
            disabled={actionLoading}
            startIcon={actionLoading && <CircularProgress size={16} />}
          >
            {actionLoading ? 'Publishing...' : 'Publish'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onClose={() => !actionLoading && setDeleteDialog(false)}>
        <DialogTitle>Delete Draft?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedDraft?.appName}"? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={actionLoading}
            startIcon={actionLoading && <CircularProgress size={16} />}
          >
            {actionLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default SellerDrafts
