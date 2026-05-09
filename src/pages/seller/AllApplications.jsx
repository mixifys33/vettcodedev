import { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material'
import {
  Search,
  Add,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  GridView,
  ViewList,
  FilterList,
  Apps as AppsIcon,
  CheckCircle,
  Schedule,
  Cancel,
  Settings as SettingsIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import useAuthStore from '../../store/authStore'
import { formatCurrency } from '../../utils/helpers'
import { APP_CATEGORIES, VERIFICATION_STATUS } from '../../utils/constants'

const AllApplications = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [applications, setApplications] = useState([])
  const [filteredApps, setFilteredApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedApp, setSelectedApp] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchApplications()
  }, [])

  useEffect(() => {
    filterApplications()
  }, [applications, searchQuery, categoryFilter, statusFilter])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const sellerId = user?.id || user?._id
      const response = await api.get(`/applications/seller/${sellerId}`)

      if (response.data.success) {
        setApplications(response.data.applications || [])
      }
    } catch (error) {
      if (error.response?.status === 404) {
        // No applications found - this is okay
        setApplications([])
      } else {
        toast.error('Failed to fetch applications')
        console.error(error)
      }
    } finally {
      setLoading(false)
    }
  }

  const filterApplications = () => {
    let filtered = [...applications]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app.appName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.appCategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.tags?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((app) => app.appCategory === categoryFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((app) => app.verificationStatus === statusFilter)
    }

    setFilteredApps(filtered)
  }

  const handleMenuOpen = (event, app) => {
    setAnchorEl(event.currentTarget)
    setSelectedApp(app)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedApp(null)
  }

  const handleView = (app) => {
    navigate(`/seller/applications/preview/${app._id}`)
    handleMenuClose()
  }

  const handleEdit = (app) => {
    navigate(`/seller/applications/edit/${app._id}`)
    handleMenuClose()
  }

  const handleDeliverySettings = (app) => {
    navigate(`/seller/applications/${app._id}/delivery`)
    handleMenuClose()
  }

  const handleDeleteClick = (app) => {
    setSelectedApp(app)
    setDeleteDialog(true)
    handleMenuClose()
  }

  const handleDelete = async () => {
    if (!selectedApp) return

    try {
      setDeleting(true)
      const response = await api.delete(`/applications/${selectedApp._id}`)

      if (response.data.success) {
        toast.success('Application deleted successfully')
        setApplications(applications.filter((app) => app._id !== selectedApp._id))
        setDeleteDialog(false)
        setSelectedApp(null)
      }
    } catch (error) {
      toast.error('Failed to delete application')
      console.error(error)
    } finally {
      setDeleting(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle sx={{ fontSize: 16 }} />
      case 'pending':
        return <Schedule sx={{ fontSize: 16 }} />
      case 'rejected':
        return <Cancel sx={{ fontSize: 16 }} />
      default:
        return <Schedule sx={{ fontSize: 16 }} />
    }
  }

  const getStatusColor = (status) => {
    const statusMeta = VERIFICATION_STATUS[status] || VERIFICATION_STATUS.pending
    return statusMeta.color
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            My Applications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your application catalogue
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/seller/applications/create')}
          size="large"
        >
          Create Application
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {APP_CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="verified">Verified</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, newMode) => newMode && setViewMode(newMode)}
                fullWidth
              >
                <ToggleButton value="grid">
                  <GridView />
                </ToggleButton>
                <ToggleButton value="list">
                  <ViewList />
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Results Count */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredApps.length} of {applications.length} applications
        </Typography>
      </Box>

      {/* Applications Grid/List */}
      {filteredApps.length === 0 ? (
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <AppsIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                  ? 'No applications found'
                  : 'No applications yet'}
              </Typography>
              {!searchQuery && categoryFilter === 'all' && statusFilter === 'all' && (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => navigate('/seller/applications/create')}
                >
                  Create Your First Application
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {filteredApps.map((app) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={app._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="div"
                    sx={{
                      height: 180,
                      bgcolor: 'background.default',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleView(app)}
                  >
                    {app.screenshots?.[0] ? (
                      <img
                        src={app.screenshots[0].url || app.screenshots[0]}
                        alt={app.appName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <AppsIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                    )}
                  </CardMedia>

                  <Chip
                    icon={getStatusIcon(app.verificationStatus)}
                    label={app.verificationStatus || 'pending'}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'white',
                      color: getStatusColor(app.verificationStatus),
                      fontWeight: 600,
                      textTransform: 'capitalize',
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
                    onClick={(e) => handleMenuOpen(e, app)}
                  >
                    <MoreVert />
                  </IconButton>
                </Box>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 0.5, cursor: 'pointer' }}
                    onClick={() => handleView(app)}
                    noWrap
                  >
                    {app.appName}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} noWrap>
                    {app.appCategory}
                  </Typography>

                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {formatCurrency(app.price, app.currency)}
                  </Typography>

                  {!app.deliverySettings && (
                    <Chip
                      label="Setup Delivery"
                      size="small"
                      color="warning"
                      sx={{ mt: 1 }}
                      onClick={() => handleDeliverySettings(app)}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card>
          <CardContent sx={{ p: 0 }}>
            {filteredApps.map((app, index) => (
              <Box
                key={app._id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  borderBottom: index < filteredApps.length - 1 ? 1 : 0,
                  borderColor: 'divider',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 2,
                    bgcolor: 'background.default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0,
                    cursor: 'pointer',
                  }}
                  onClick={() => handleView(app)}
                >
                  {app.screenshots?.[0] ? (
                    <img
                      src={app.screenshots[0].url || app.screenshots[0]}
                      alt={app.appName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <AppsIcon sx={{ fontSize: 32, color: 'text.disabled' }} />
                  )}
                </Box>

                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 0.5, cursor: 'pointer' }}
                    onClick={() => handleView(app)}
                  >
                    {app.appName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {app.appCategory}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip
                      icon={getStatusIcon(app.verificationStatus)}
                      label={app.verificationStatus || 'pending'}
                      size="small"
                      sx={{
                        color: getStatusColor(app.verificationStatus),
                        fontWeight: 600,
                        textTransform: 'capitalize',
                      }}
                    />
                    {!app.deliverySettings && (
                      <Chip label="Setup Delivery" size="small" color="warning" />
                    )}
                  </Box>
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mr: 2 }}>
                  {formatCurrency(app.price, app.currency)}
                </Typography>

                <IconButton onClick={(e) => handleMenuOpen(e, app)}>
                  <MoreVert />
                </IconButton>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Context Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleView(selectedApp)}>
          <Visibility sx={{ mr: 1 }} fontSize="small" />
          View
        </MenuItem>
        <MenuItem onClick={() => handleEdit(selectedApp)}>
          <Edit sx={{ mr: 1 }} fontSize="small" />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDeliverySettings(selectedApp)}>
          <SettingsIcon sx={{ mr: 1 }} fontSize="small" />
          Delivery Settings
        </MenuItem>
        <MenuItem onClick={() => handleDeleteClick(selectedApp)} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} fontSize="small" />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => !deleting && setDeleteDialog(false)}>
        <DialogTitle>Delete Application?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedApp?.appName}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting && <CircularProgress size={16} />}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AllApplications
