import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  CircularProgress,
  Divider,
  TextField,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Avatar,
  ImageList,
  ImageListItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Stack,
} from '@mui/material'
import {
  ArrowBack,
  CheckCircle,
  Cancel,
  Schedule,
  Star,
  Code,
  ExpandMore,
  Person,
  AttachMoney,
  Category,
  Description,
  Image,
  Link as LinkIcon,
  Android,
  Apple,
  Language,
  Build,
  Security,
  Speed,
  Verified,
} from '@mui/icons-material'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const STATUS_CONFIG = {
  pending: { color: 'warning', label: 'Pending', icon: Schedule },
  verified: { color: 'success', label: 'Verified', icon: CheckCircle },
  rejected: { color: 'error', label: 'Rejected', icon: Cancel },
}

const AdminApplicationDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [reviewDialog, setReviewDialog] = useState({ open: false, action: null })
  const [reviewData, setReviewData] = useState({
    rating: 0,
    reason: '',
    notes: '',
  })

  useEffect(() => {
    fetchApplicationDetail()
  }, [id])

  const getToken = () => localStorage.getItem('adminToken')

  const fetchApplicationDetail = async () => {
    try {
      const token = getToken()
      const response = await api.get(`/admin/applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.data.success) {
        setApplication(response.data.application)
        setReviewData({
          rating: response.data.application.adminRating || 0,
          reason: response.data.application.verificationNotes || '',
          notes: response.data.application.adminNotes || '',
        })
      }
    } catch (error) {
      console.error('Failed to fetch application:', error)
      toast.error('Failed to load application details')
    } finally {
      setLoading(false)
    }
  }

  const handleReviewSubmit = async () => {
    const { action } = reviewDialog

    if (action === 'rejected' && !reviewData.reason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }

    if (action === 'verified' && reviewData.rating === 0) {
      toast.error('Please provide a rating')
      return
    }

    setActionLoading(true)

    try {
      const token = getToken()
      const payload = {
        status: action,
        adminRating: reviewData.rating,
        adminNotes: reviewData.notes,
      }

      if (action === 'rejected') {
        payload.reason = reviewData.reason
      }

      const response = await api.patch(
        `/admin/applications/${id}/review`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        toast.success(`Application ${action} successfully`)
        setReviewDialog({ open: false, action: null })
        fetchApplicationDetail()
      }
    } catch (error) {
      console.error('Review failed:', error)
      toast.error('Failed to submit review')
    } finally {
      setActionLoading(false)
    }
  }

  const openReviewDialog = (action) => {
    setReviewDialog({ open: true, action })
  }

  const closeReviewDialog = () => {
    setReviewDialog({ open: false, action: null })
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!application) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Application not found
        </Typography>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/admin/applications')}
          sx={{ mt: 2 }}
        >
          Back to Applications
        </Button>
      </Box>
    )
  }

  const statusConfig = STATUS_CONFIG[application.verificationStatus] || STATUS_CONFIG.pending
  const StatusIcon = statusConfig.icon
  const isPending = application.verificationStatus === 'pending'

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/admin/applications')}
          sx={{ mb: 2 }}
        >
          Back to Applications
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              {application.appName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                icon={<StatusIcon />}
                label={statusConfig.label}
                color={statusConfig.color}
              />
              {application.adminRating > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Star sx={{ fontSize: 20, color: 'secondary.main' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {application.adminRating}/5
                  </Typography>
                </Box>
              )}
              {application.completionScore > 0 && (
                <Chip
                  label={`${application.completionScore}% Complete`}
                  size="small"
                  color="info"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>

          {/* Action Buttons */}
          {isPending && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={() => openReviewDialog('verified')}
              >
                Verify
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Cancel />}
                onClick={() => openReviewDialog('rejected')}
              >
                Reject
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Main Info */}
        <Grid item xs={12} md={8}>
          {/* Basic Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Basic Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Category sx={{ color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Category
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {application.appCategory}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <AttachMoney sx={{ color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Price
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        ${application.price || 0}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Person sx={{ color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Seller
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {application.sellerId?.name || 'Unknown'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Schedule sx={{ color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Submitted
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {new Date(application.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Description */}
          {application.description && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  <Description sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Description
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                  {application.description}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Screenshots */}
          {application.screenshots && application.screenshots.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  <Image sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Screenshots ({application.screenshots.length})
                </Typography>
                <ImageList cols={3} gap={8}>
                  {application.screenshots.map((screenshot, index) => (
                    <ImageListItem key={index}>
                      <img
                        src={screenshot.url || screenshot.uri}
                        alt={`Screenshot ${index + 1}`}
                        loading="lazy"
                        style={{ borderRadius: 8, objectFit: 'cover', height: 200 }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </CardContent>
            </Card>
          )}

          {/* Technical Details */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                <Build sx={{ mr: 1, verticalAlign: 'middle' }} />
                Technical Details
              </Typography>

              {/* Platforms */}
              {application.platforms && application.platforms.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Platforms
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {application.platforms.map((platform) => (
                      <Chip
                        key={platform}
                        label={platform}
                        size="small"
                        icon={
                          platform.toLowerCase().includes('android') ? <Android /> :
                          platform.toLowerCase().includes('ios') ? <Apple /> :
                          <Language />
                        }
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Technology Stack */}
              {application.technologyStack && application.technologyStack.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Technology Stack
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {application.technologyStack.map((tech) => (
                      <Chip key={tech} label={tech} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Features */}
              {application.features && application.features.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Features
                  </Typography>
                  <List dense>
                    {application.features.map((feature, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={`• ${feature}`} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Links & Resources */}
          {(application.demoUrl || application.githubUrl || application.documentationUrl) && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  <LinkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Links & Resources
                </Typography>
                <Stack spacing={1}>
                  {application.demoUrl && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Demo URL
                      </Typography>
                      <Typography variant="body2">
                        <a href={application.demoUrl} target="_blank" rel="noopener noreferrer">
                          {application.demoUrl}
                        </a>
                      </Typography>
                    </Box>
                  )}
                  {application.githubUrl && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        GitHub URL
                      </Typography>
                      <Typography variant="body2">
                        <a href={application.githubUrl} target="_blank" rel="noopener noreferrer">
                          {application.githubUrl}
                        </a>
                      </Typography>
                    </Box>
                  )}
                  {application.documentationUrl && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Documentation
                      </Typography>
                      <Typography variant="body2">
                        <a href={application.documentationUrl} target="_blank" rel="noopener noreferrer">
                          {application.documentationUrl}
                        </a>
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Right Column - Review & Stats */}
        <Grid item xs={12} md={4}>
          {/* Quality Scores */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Quality Scores
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      Completion
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {application.completionScore || 0}%
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      height: 8,
                      bgcolor: 'grey.200',
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        width: `${application.completionScore || 0}%`,
                        bgcolor: 'primary.main',
                      }}
                    />
                  </Box>
                </Box>

                {application.adminRating > 0 && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Admin Rating
                    </Typography>
                    <Rating value={application.adminRating} readOnly precision={0.5} />
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>

          {/* Badges */}
          {application.badges && application.badges.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  <Verified sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Badges
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {application.badges.map((badge) => (
                    <Chip key={badge} label={badge} size="small" color="primary" />
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Admin Notes */}
          {application.adminNotes && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Admin Notes
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                  {application.adminNotes}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Rejection Reason */}
          {application.verificationStatus === 'rejected' && application.verificationNotes && (
            <Card sx={{ mb: 3, borderColor: 'error.main', borderWidth: 1, borderStyle: 'solid' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'error.main' }}>
                  Rejection Reason
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                  {application.verificationNotes}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Update Review (if already reviewed) */}
          {!isPending && (
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Update Review
                </Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => openReviewDialog(application.verificationStatus)}
                >
                  Edit Review
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Review Dialog */}
      <Dialog
        open={reviewDialog.open}
        onClose={closeReviewDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {reviewDialog.action === 'verified' ? 'Verify Application' : 'Reject Application'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* Rating */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Rating {reviewDialog.action === 'verified' && <span style={{ color: 'red' }}>*</span>}
              </Typography>
              <Rating
                value={reviewData.rating}
                onChange={(e, newValue) => setReviewData({ ...reviewData, rating: newValue })}
                size="large"
                precision={0.5}
              />
            </Box>

            {/* Rejection Reason (only for reject) */}
            {reviewDialog.action === 'rejected' && (
              <TextField
                label="Rejection Reason"
                multiline
                rows={4}
                fullWidth
                required
                value={reviewData.reason}
                onChange={(e) => setReviewData({ ...reviewData, reason: e.target.value })}
                placeholder="Explain why this application is being rejected..."
              />
            )}

            {/* Admin Notes */}
            <TextField
              label="Admin Notes (Optional)"
              multiline
              rows={3}
              fullWidth
              value={reviewData.notes}
              onChange={(e) => setReviewData({ ...reviewData, notes: e.target.value })}
              placeholder="Internal notes about this application..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeReviewDialog} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleReviewSubmit}
            variant="contained"
            color={reviewDialog.action === 'verified' ? 'success' : 'error'}
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={24} /> : 'Submit Review'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminApplicationDetail
