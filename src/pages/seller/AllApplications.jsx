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
  alpha,
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
  Apps as AppsIcon,
  CheckCircle,
  Schedule,
  Cancel,
  Settings as SettingsIcon,
  Drafts,
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

    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app.appName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.appCategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.tags?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((app) => app.appCategory === categoryFilter)
    }

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

  const isIncomplete = (app) => {
    // Check if application is missing the source code file
    return !app?.sourceCodeFile || !app?.sourceCodeFile?.url
  }

  const getApplicationStatus = (app) => {
    if (isIncomplete(app)) {
      return {
        label: 'Incomplete',
        color: '#f59e0b',
        icon: <Schedule sx={{ fontSize: 16 }} />
      }
    }
    
    switch (app.verificationStatus) {
      case 'verified':
        return {
          label: 'Verified',
          color: '#10b981',
          icon: <CheckCircle sx={{ fontSize: 16 }} />
        }
      case 'pending':
        return {
          label: 'Pending Review',
          color: '#3b82f6',
          icon: <Schedule sx={{ fontSize: 16 }} />
        }
      case 'rejected':
        return {
          label: 'Rejected',
          color: '#ef4444',
          icon: <Cancel sx={{ fontSize: 16 }} />
        }
      default:
        return {
          label: 'Pending Review',
          color: '#3b82f6',
          icon: <Schedule sx={{ fontSize: 16 }} />
        }
    }
  }

  const handleCompleteApplication = (app) => {
    navigate(`/seller/applications/edit/${app._id}`)
    handleMenuClose()
  }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <CircularProgress sx={{ color: '#6366f1' }} />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
            My Applications
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Manage your application catalogue
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/seller/drafts')}
            sx={{
              borderColor: 'rgba(99, 102, 241, 0.5)',
              color: '#6366f1',
              textTransform: 'none',
              px: 3,
              py: 1.5,
              fontWeight: 600,
              '&:hover': {
                borderColor: '#6366f1',
                bgcolor: 'rgba(99, 102, 241, 0.1)',
              },
            }}
          >
            View Drafts
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/seller/applications/create')}
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              textTransform: 'none',
              px: 3,
              py: 1.5,
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(99, 102, 241, 0.5)',
              },
            }}
          >
            Create Application
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card
        sx={{
          mb: 3,
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
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
                      <Search sx={{ color: 'rgba(255,255,255,0.5)' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(99, 102, 241, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#6366f1',
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.6)' }}>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.1)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(99, 102, 241, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#6366f1',
                    },
                    '& .MuiSvgIcon-root': {
                      color: 'rgba(255,255,255,0.6)',
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: 'rgba(15, 23, 42, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        '& .MuiMenuItem-root': {
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'rgba(99, 102, 241, 0.15)',
                          },
                          '&.Mui-selected': {
                            bgcolor: 'rgba(99, 102, 241, 0.2)',
                          },
                        },
                      },
                    },
                  }}
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
                <InputLabel sx={{ color: 'rgba(255,255,255,0.6)' }}>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.1)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(99, 102, 241, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#6366f1',
                    },
                    '& .MuiSvgIcon-root': {
                      color: 'rgba(255,255,255,0.6)',
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: 'rgba(15, 23, 42, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        '& .MuiMenuItem-root': {
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'rgba(99, 102, 241, 0.15)',
                          },
                          '&.Mui-selected': {
                            bgcolor: 'rgba(99, 102, 241, 0.2)',
                          },
                        },
                      },
                    },
                  }}
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
                sx={{
                  '& .MuiToggleButton-root': {
                    color: 'rgba(255,255,255,0.6)',
                    borderColor: 'rgba(255,255,255,0.1)',
                    '&.Mui-selected': {
                      bgcolor: 'rgba(99, 102, 241, 0.2)',
                      color: '#6366f1',
                      borderColor: '#6366f1',
                    },
                  },
                }}
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
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
          Showing {filteredApps.length} of {applications.length} applications
        </Typography>
      </Box>

      {/* Applications Grid/List */}
      {filteredApps.length === 0 ? (
        <Card
          sx={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 2,
          }}
        >
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <AppsIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2 }}>
                {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                  ? 'No applications found'
                  : 'No applications yet'}
              </Typography>
              {!searchQuery && categoryFilter === 'all' && statusFilter === 'all' && (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => navigate('/seller/applications/create')}
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    textTransform: 'none',
                    px: 3,
                    py: 1.5,
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                  }}
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
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 2,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    boxShadow: '0 12px 40px rgba(99, 102, 241, 0.2)',
                  },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="div"
                    sx={{
                      height: 180,
                      bgcolor: 'rgba(255,255,255,0.05)',
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
                      <AppsIcon sx={{ fontSize: 48, color: 'rgba(255,255,255,0.2)' }} />
                    )}
                  </CardMedia>

                  <Chip
                    icon={getApplicationStatus(app).icon}
                    label={getApplicationStatus(app).label}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(15, 23, 42, 0.9)',
                      backdropFilter: 'blur(10px)',
                      color: getApplicationStatus(app).color,
                      fontWeight: 600,
                      textTransform: 'capitalize',
                      border: `1px solid ${alpha(getApplicationStatus(app).color, 0.3)}`,
                    }}
                  />

                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      bgcolor: 'rgba(15, 23, 42, 0.9)',
                      backdropFilter: 'blur(10px)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.9)' },
                    }}
                    onClick={(e) => handleMenuOpen(e, app)}
                  >
                    <MoreVert />
                  </IconButton>
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: 'white', mb: 0.5, cursor: 'pointer' }}
                    onClick={() => handleView(app)}
                    noWrap
                  >
                    {app.appName}
                  </Typography>

                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }} noWrap>
                    {app.appCategory}
                  </Typography>

                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#6366f1', mb: 1 }}>
                    {formatCurrency(app.price, app.currency)}
                  </Typography>

                  {isIncomplete(app) && (
                    <Button
                      fullWidth
                      size="small"
                      variant="outlined"
                      onClick={() => handleCompleteApplication(app)}
                      sx={{
                        mt: 1,
                        borderColor: '#f59e0b',
                        color: '#f59e0b',
                        '&:hover': {
                          borderColor: '#f59e0b',
                          bgcolor: 'rgba(245, 158, 11, 0.1)',
                        },
                      }}
                    >
                      Upload ZIP File
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card
          sx={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: 0 }}>
            {filteredApps.map((app, index) => (
              <Box
                key={app._id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  borderBottom: index < filteredApps.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 2,
                    bgcolor: 'rgba(255,255,255,0.05)',
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
                    <AppsIcon sx={{ fontSize: 32, color: 'rgba(255,255,255,0.2)' }} />
                  )}
                </Box>

                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: 'white', mb: 0.5, cursor: 'pointer' }}
                    onClick={() => handleView(app)}
                  >
                    {app.appName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 0.5 }}>
                    {app.appCategory}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Chip
                      icon={getApplicationStatus(app).icon}
                      label={getApplicationStatus(app).label}
                      size="small"
                      sx={{
                        color: getApplicationStatus(app).color,
                        fontWeight: 600,
                        textTransform: 'capitalize',
                        bgcolor: alpha(getApplicationStatus(app).color, 0.15),
                        border: `1px solid ${alpha(getApplicationStatus(app).color, 0.3)}`,
                      }}
                    />
                    {isIncomplete(app) && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleCompleteApplication(app)}
                        sx={{
                          borderColor: '#f59e0b',
                          color: '#f59e0b',
                          fontSize: '0.75rem',
                          py: 0.25,
                          px: 1,
                          '&:hover': {
                            borderColor: '#f59e0b',
                            bgcolor: 'rgba(245, 158, 11, 0.1)',
                          },
                        }}
                      >
                        Upload ZIP
                      </Button>
                    )}
                  </Box>
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 700, color: '#6366f1', mr: 2 }}>
                  {formatCurrency(app.price, app.currency)}
                </Typography>

                <IconButton
                  onClick={(e) => handleMenuOpen(e, app)}
                  sx={{
                    color: 'rgba(255,255,255,0.6)',
                    '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.05)' },
                  }}
                >
                  <MoreVert />
                </IconButton>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 2,
            minWidth: 180,
          },
        }}
      >
        <MenuItem
          onClick={() => handleView(selectedApp)}
          sx={{
            color: 'white',
            '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.15)' },
          }}
        >
          <Visibility sx={{ mr: 1.5, fontSize: 20 }} />
          View
        </MenuItem>
        <MenuItem
          onClick={() => handleEdit(selectedApp)}
          sx={{
            color: 'white',
            '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.15)' },
          }}
        >
          <Edit sx={{ mr: 1.5, fontSize: 20 }} />
          {isIncomplete(selectedApp) ? 'Complete Application' : 'Edit'}
        </MenuItem>
        <MenuItem
          onClick={() => handleDeleteClick(selectedApp)}
          sx={{
            color: '#ef4444',
            '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.15)' },
          }}
        >
          <Delete sx={{ mr: 1.5, fontSize: 20 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog}
        onClose={() => !deleting && setDeleteDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>Delete Application?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Are you sure you want to delete "{selectedApp?.appName}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteDialog(false)}
            disabled={deleting}
            sx={{
              color: 'rgba(255,255,255,0.6)',
              textTransform: 'none',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={deleting}
            sx={{
              bgcolor: '#ef4444',
              color: 'white',
              textTransform: 'none',
              '&:hover': { bgcolor: '#dc2626' },
              '&:disabled': { bgcolor: 'rgba(239, 68, 68, 0.5)' },
            }}
          >
            {deleting ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AllApplications
