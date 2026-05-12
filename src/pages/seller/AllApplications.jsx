import { useState, useEffect, useMemo } from 'react'
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
  Checkbox,
  Fab,
  Drawer,
  Divider,
  Skeleton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
  useTheme,
  Slide,
  Fade,
  Badge,
  LinearProgress,
  Stack,
  Avatar,
  ListItemIcon,
  ListItemText,
  TableSortLabel,
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
  FilterList,
  Close,
  TrendingUp,
  AttachMoney,
  CloudUpload,
  Archive,
  Refresh,
  GetApp,
  Share,
  ContentCopy,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank,
  TableChart,
  Build,
  ArrowUpward,
  ArrowDownward,
  Sync,
  PriceChange,
  ArchiveOutlined,
  UnarchiveOutlined,
  PublishOutlined,
  BarChart,
  CalendarToday,
  Code,
  Category,
  MonetizationOn,
  Update,
  ShowChart,
  Menu as MenuIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import useAuthStore from '../../store/authStore'
import { colors } from '../../theme/tokens'
import { formatCurrency } from '../../utils/helpers'
import { APP_CATEGORIES, VERIFICATION_STATUS } from '../../utils/constants'

const AllApplications = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const { user } = useAuthStore()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'))
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  
  // State Management
  const [applications, setApplications] = useState([])
  const [filteredApps, setFilteredApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState(isMobile ? 'card' : isDesktop ? 'table' : 'grid')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedApps, setSelectedApps] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedApp, setSelectedApp] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [slideOverOpen, setSlideOverOpen] = useState(false)
  const [slideOverApp, setSlideOverApp] = useState(null)
  const [batchMenuAnchor, setBatchMenuAnchor] = useState(null)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [hoveredApp, setHoveredApp] = useState(null)
  const [batchActionDialog, setBatchActionDialog] = useState({ open: false, action: null })
  const [processingBatch, setProcessingBatch] = useState(false)
  const [editingCell, setEditingCell] = useState({ appId: null, field: null })
  const [editValue, setEditValue] = useState('')
  
  // User role (for demo - replace with actual role from auth)
  const userRole = user?.role || 'Owner' // Owner, Manager, Analyst
  
  // Role-based permissions - Sellers can delete their own applications
  const permissions = useMemo(() => ({
    canEdit: true, // Sellers can edit their own applications
    canDelete: true, // Sellers can delete their own applications
    canViewFinancials: userRole === 'Owner' || userRole === 'Manager',
    canBatchEdit: userRole === 'Owner' || userRole === 'Manager',
    canArchive: userRole === 'Owner' || userRole === 'Manager',
  }), [userRole])

  useEffect(() => {
    fetchApplications()
  }, [])

  useEffect(() => {
    filterAndSortApplications()
  }, [applications, searchQuery, categoryFilter, statusFilter, sortBy, sortOrder])

  // Update view mode based on screen size
  useEffect(() => {
    if (isMobile && viewMode === 'table') {
      setViewMode('card')
    } else if (isDesktop && viewMode === 'card') {
      setViewMode('table')
    }
  }, [isMobile, isDesktop])

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

  const filterAndSortApplications = () => {
    let filtered = [...applications]

    // Apply filters
    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app.appName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal, bVal
      
      switch (sortBy) {
        case 'name':
          aVal = a.appName?.toLowerCase() || ''
          bVal = b.appName?.toLowerCase() || ''
          break
        case 'price':
          aVal = a.price || 0
          bVal = b.price || 0
          break
        case 'status':
          aVal = a.verificationStatus || ''
          bVal = b.verificationStatus || ''
          break
        case 'createdAt':
        default:
          aVal = new Date(a.createdAt || 0).getTime()
          bVal = new Date(b.createdAt || 0).getTime()
          break
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    setFilteredApps(filtered)
  }

  // Batch Actions
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedApps(filteredApps.map(app => app._id))
    } else {
      setSelectedApps([])
    }
  }

  const handleSelectApp = (appId) => {
    setSelectedApps(prev => 
      prev.includes(appId) 
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    )
  }

  const handleBatchAction = (action) => {
    if (selectedApps.length === 0) {
      toast.error('Please select at least one application')
      return
    }
    setBatchActionDialog({ open: true, action })
    setBatchMenuAnchor(null)
  }

  const executeBatchAction = async () => {
    const { action } = batchActionDialog
    
    try {
      setProcessingBatch(true)
      
      switch (action) {
        case 'archive':
          toast.success(`${selectedApps.length} applications archived`)
          break
        case 'sync':
          toast.success(`${selectedApps.length} applications synced to marketplace`)
          break
        case 'updatePricing':
          toast.info('Bulk pricing update - feature coming soon')
          break
        case 'delete':
          if (!permissions.canDelete) {
            toast.error('You do not have permission to delete applications')
            break
          }
          await Promise.all(
            selectedApps.map(id => api.delete(`/applications/${id}`))
          )
          setApplications(prev => prev.filter(app => !selectedApps.includes(app._id)))
          toast.success(`${selectedApps.length} applications deleted`)
          break
        default:
          break
      }
      
      setSelectedApps([])
      setBatchActionDialog({ open: false, action: null })
    } catch (error) {
      toast.error('Batch action failed')
      console.error(error)
    } finally {
      setProcessingBatch(false)
    }
  }

  // Quick Stats for hover (simulated - replace with real data from analytics API)
  const getQuickStats = (app) => {
    return {
      revenue7d: Math.floor(Math.random() * 500000),
      downloads7d: Math.floor(Math.random() * 100),
      trend: Math.random() > 0.5 ? 'up' : 'down',
      trendPercent: Math.floor(Math.random() * 30)
    }
  }

  // Inline editing
  const startInlineEdit = (appId, field, currentValue) => {
    if (!permissions.canEdit) {
      toast.error('You do not have permission to edit applications')
      return
    }
    setEditingCell({ appId, field })
    setEditValue(currentValue)
  }

  const cancelInlineEdit = () => {
    setEditingCell({ appId: null, field: null })
    setEditValue('')
  }

  const saveInlineEdit = async (appId, field) => {
    try {
      const response = await api.patch(`/applications/${appId}`, {
        [field]: field === 'price' ? parseFloat(editValue) : editValue
      })
      
      if (response.data.success) {
        setApplications(prev => 
          prev.map(app => 
            app._id === appId ? { ...app, [field]: field === 'price' ? parseFloat(editValue) : editValue } : app
          )
        )
        toast.success('Updated successfully')
      }
    } catch (error) {
      toast.error('Update failed')
      console.error(error)
    } finally {
      cancelInlineEdit()
    }
  }

  // Slide-over panel
  const openSlideOver = (app) => {
    if (!permissions.canEdit) {
      toast.error('You do not have permission to edit applications')
      return
    }
    setSlideOverApp(app)
    setSlideOverOpen(true)
  }

  const closeSlideOver = () => {
    setSlideOverOpen(false)
    setTimeout(() => setSlideOverApp(null), 300)
  }

  // Sorting
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
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

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <Box sx={{ p: 3 }}>
      <Stack spacing={2} sx={{ mb: 4 }}>
        <Skeleton variant="rectangular" height={60} sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }} />
        <Skeleton variant="rectangular" height={80} sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }} />
      </Stack>
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
            <Card sx={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Skeleton variant="rectangular" height={180} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
              <CardContent>
                <Skeleton variant="text" sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
                <Skeleton variant="text" width="60%" sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 0.5, fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
            My Applications
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Manage your application catalogue • Role: {userRole}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {!isMobile && (
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchApplications}
              sx={{
                borderColor: 'rgba(99, 102, 241, 0.5)',
                color: '#6366f1',
                textTransform: 'none',
                px: 2,
                py: 1,
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#6366f1',
                  bgcolor: 'rgba(99, 102, 241, 0.1)',
                },
              }}
            >
              Refresh
            </Button>
          )}
          {permissions.canEdit && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/seller/applications/create')}
              sx={{
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                textTransform: 'none',
                px: 3,
                py: 1.5,
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(79, 70, 229, 0.5)',
                  background: 'linear-gradient(135deg, #4338CA 0%, #6D28D9 100%)',
                },
              }}
            >
              {isMobile ? 'Create' : 'Create Application'}
            </Button>
          )}
        </Box>
      </Box>

      {/* Batch Actions Toolbar */}
      {selectedApps.length > 0 && permissions.canBatchEdit && (
        <Fade in={selectedApps.length > 0}>
          <Card
            sx={{
              mb: 3,
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(124, 58, 237, 0.15) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(79, 70, 229, 0.3)',
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckBoxIcon sx={{ color: '#4F46E5', fontSize: 24 }} />
                  <Typography sx={{ color: 'white', fontWeight: 600 }}>
                    {selectedApps.length} application{selectedApps.length > 1 ? 's' : ''} selected
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {permissions.canArchive && (
                    <Button
                      size="small"
                      startIcon={<ArchiveOutlined />}
                      onClick={() => handleBatchAction('archive')}
                      sx={{
                        color: 'white',
                        borderColor: 'rgba(255,255,255,0.3)',
                        textTransform: 'none',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                      }}
                    >
                      Archive
                    </Button>
                  )}
                  <Button
                    size="small"
                    startIcon={<Sync />}
                    onClick={() => handleBatchAction('sync')}
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.3)',
                      textTransform: 'none',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                    }}
                  >
                    Sync
                  </Button>
                  <Button
                    size="small"
                    startIcon={<PriceChange />}
                    onClick={() => handleBatchAction('updatePricing')}
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.3)',
                      textTransform: 'none',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                    }}
                  >
                    Update Pricing
                  </Button>
                  {permissions.canDelete && (
                    <Button
                      size="small"
                      startIcon={<Delete />}
                      onClick={() => handleBatchAction('delete')}
                      sx={{
                        color: '#ef4444',
                        borderColor: 'rgba(239, 68, 68, 0.3)',
                        textTransform: 'none',
                        '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' },
                      }}
                    >
                      Delete
                    </Button>
                  )}
                  <IconButton
                    size="small"
                    onClick={() => setSelectedApps([])}
                    sx={{ color: 'rgba(255,255,255,0.6)' }}
                  >
                    <Close />
                  </IconButton>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Fade>
      )}

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
                      borderColor: 'rgba(79, 70, 229, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4F46E5',
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2.5}>
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
                      borderColor: 'rgba(79, 70, 229, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#4F46E5',
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
                            bgcolor: 'rgba(79, 70, 229, 0.15)',
                          },
                          '&.Mui-selected': {
                            bgcolor: 'rgba(79, 70, 229, 0.2)',
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

            <Grid item xs={12} sm={6} md={2.5}>
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
                      borderColor: 'rgba(79, 70, 229, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#4F46E5',
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
                            bgcolor: 'rgba(79, 70, 229, 0.15)',
                          },
                          '&.Mui-selected': {
                            bgcolor: 'rgba(79, 70, 229, 0.2)',
                          },
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="verified">Live</MenuItem>
                  <MenuItem value="pending">Under Review</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, newMode) => newMode && setViewMode(newMode)}
                fullWidth
                sx={{
                  '& .MuiToggleButton-root': {
                    color: 'rgba(255,255,255,0.6)',
                    borderColor: 'rgba(255,255,255,0.1)',
                    textTransform: 'none',
                    '&.Mui-selected': {
                      bgcolor: 'rgba(79, 70, 229, 0.2)',
                      color: '#4F46E5',
                      borderColor: '#4F46E5',
                    },
                  },
                }}
              >
                {isDesktop && (
                  <ToggleButton value="table">
                    <TableChart sx={{ mr: 0.5 }} fontSize="small" />
                    {!isTablet && 'Table'}
                  </ToggleButton>
                )}
                <ToggleButton value="grid">
                  <GridView sx={{ mr: 0.5 }} fontSize="small" />
                  {!isTablet && 'Grid'}
                </ToggleButton>
                <ToggleButton value="card">
                  <ViewList sx={{ mr: 0.5 }} fontSize="small" />
                  {!isTablet && 'List'}
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Results Count & Sort */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
          Showing {filteredApps.length} of {applications.length} applications
        </Typography>
        {viewMode !== 'table' && (
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-')
                setSortBy(field)
                setSortOrder(order)
              }}
              sx={{
                bgcolor: 'rgba(255,255,255,0.05)',
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.1)',
                },
                '& .MuiSvgIcon-root': {
                  color: 'rgba(255,255,255,0.6)',
                },
              }}
            >
              <MenuItem value="createdAt-desc">Newest First</MenuItem>
              <MenuItem value="createdAt-asc">Oldest First</MenuItem>
              <MenuItem value="name-asc">Name A-Z</MenuItem>
              <MenuItem value="name-desc">Name Z-A</MenuItem>
              <MenuItem value="price-desc">Price High-Low</MenuItem>
              <MenuItem value="price-asc">Price Low-High</MenuItem>
            </Select>
          </FormControl>
        )}
      </Box>

      {/* Applications Grid/List/Table */}
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
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <AppsIcon sx={{ fontSize: 80, color: 'rgba(255,255,255,0.15)', mb: 3 }} />
              <Typography variant="h5" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>
                {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                  ? 'No applications found'
                  : 'Welcome to VettCode'}
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mb: 4, maxWidth: 400, mx: 'auto' }}>
                {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your filters or search query'
                  : 'Start building your application marketplace. Create your first app to begin earning.'}
              </Typography>
              {!searchQuery && categoryFilter === 'all' && statusFilter === 'all' && permissions.canEdit && (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Add />}
                  onClick={() => navigate('/seller/applications/create')}
                  sx={{
                    background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                    textTransform: 'none',
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: '1rem',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(79, 70, 229, 0.5)',
                    },
                  }}
                >
                  Launch Your First App
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      ) : viewMode === 'table' ? (
        // TABLE VIEW (Desktop)
        <TableContainer
          component={Paper}
          sx={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                {permissions.canBatchEdit && (
                  <TableCell padding="checkbox" sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <Checkbox
                      checked={selectedApps.length === filteredApps.length && filteredApps.length > 0}
                      indeterminate={selectedApps.length > 0 && selectedApps.length < filteredApps.length}
                      onChange={handleSelectAll}
                      sx={{
                        color: 'rgba(255,255,255,0.3)',
                        '&.Mui-checked': { color: '#4F46E5' },
                        '&.MuiCheckbox-indeterminate': { color: '#4F46E5' },
                      }}
                    />
                  </TableCell>
                )}
                <TableCell sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <TableSortLabel
                    active={sortBy === 'name'}
                    direction={sortBy === 'name' ? sortOrder : 'asc'}
                    onClick={() => handleSort('name')}
                    sx={{
                      color: 'rgba(255,255,255,0.8) !important',
                      '&.Mui-active': { color: '#4F46E5 !important' },
                      '& .MuiTableSortLabel-icon': { color: '#4F46E5 !important' },
                    }}
                  >
                    Application
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <TableSortLabel
                    active={sortBy === 'status'}
                    direction={sortBy === 'status' ? sortOrder : 'asc'}
                    onClick={() => handleSort('status')}
                    sx={{
                      color: 'rgba(255,255,255,0.8) !important',
                      '&.Mui-active': { color: '#4F46E5 !important' },
                      '& .MuiTableSortLabel-icon': { color: '#4F46E5 !important' },
                    }}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                {permissions.canViewFinancials && (
                  <TableCell sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <TableSortLabel
                      active={sortBy === 'price'}
                      direction={sortBy === 'price' ? sortOrder : 'asc'}
                      onClick={() => handleSort('price')}
                      sx={{
                        color: 'rgba(255,255,255,0.8) !important',
                        '&.Mui-active': { color: '#4F46E5 !important' },
                        '& .MuiTableSortLabel-icon': { color: '#4F46E5 !important' },
                      }}
                    >
                      Revenue
                    </TableSortLabel>
                  </TableCell>
                )}
                <TableCell sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  Version
                </TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <TableSortLabel
                    active={sortBy === 'createdAt'}
                    direction={sortBy === 'createdAt' ? sortOrder : 'asc'}
                    onClick={() => handleSort('createdAt')}
                    sx={{
                      color: 'rgba(255,255,255,0.8) !important',
                      '&.Mui-active': { color: '#4F46E5 !important' },
                      '& .MuiTableSortLabel-icon': { color: '#4F46E5 !important' },
                    }}
                  >
                    Last Updated
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredApps.map((app) => {
                const stats = getQuickStats(app)
                const status = getApplicationStatus(app)
                
                return (
                  <TableRow
                    key={app._id}
                    onMouseEnter={() => setHoveredApp(app._id)}
                    onMouseLeave={() => setHoveredApp(null)}
                    sx={{
                      '&:hover': { bgcolor: 'rgba(79, 70, 229, 0.05)' },
                      transition: 'background-color 0.2s',
                      borderBottom: '1px solid rgba(255,255,255,0.03)',
                    }}
                  >
                    {permissions.canBatchEdit && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedApps.includes(app._id)}
                          onChange={() => handleSelectApp(app._id)}
                          sx={{
                            color: 'rgba(255,255,255,0.3)',
                            '&.Mui-checked': { color: '#4F46E5' },
                          }}
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={app.screenshots?.[0]?.url || app.screenshots?.[0]}
                          variant="rounded"
                          sx={{ width: 48, height: 48, bgcolor: 'rgba(255,255,255,0.05)' }}
                        >
                          <AppsIcon />
                        </Avatar>
                        <Box>
                          <Typography
                            sx={{
                              color: 'white',
                              fontWeight: 600,
                              cursor: 'pointer',
                              '&:hover': { color: '#4F46E5' },
                            }}
                            onClick={() => handleView(app)}
                          >
                            {app.appName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                            {app.appCategory}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        title={
                          hoveredApp === app._id && permissions.canViewFinancials ? (
                            <Box sx={{ p: 1 }}>
                              <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                                7-Day Performance
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ShowChart sx={{ fontSize: 16, color: stats.trend === 'up' ? '#10b981' : '#ef4444' }} />
                                <Typography variant="body2">
                                  {formatCurrency(stats.revenue7d, 'UGX')}
                                </Typography>
                                <Chip
                                  label={`${stats.trend === 'up' ? '+' : '-'}${stats.trendPercent}%`}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: '0.7rem',
                                    bgcolor: stats.trend === 'up' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                    color: stats.trend === 'up' ? '#10b981' : '#ef4444',
                                  }}
                                />
                              </Box>
                            </Box>
                          ) : ''
                        }
                        arrow
                        placement="top"
                      >
                        <Chip
                          icon={status.icon}
                          label={status.label}
                          size="small"
                          sx={{
                            color: status.color,
                            fontWeight: 600,
                            bgcolor: alpha(status.color, 0.15),
                            border: `1px solid ${alpha(status.color, 0.3)}`,
                          }}
                        />
                      </Tooltip>
                    </TableCell>
                    {permissions.canViewFinancials && (
                      <TableCell>
                        {editingCell.appId === app._id && editingCell.field === 'price' ? (
                          <TextField
                            size="small"
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => saveInlineEdit(app._id, 'price')}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') saveInlineEdit(app._id, 'price')
                              if (e.key === 'Escape') cancelInlineEdit()
                            }}
                            autoFocus
                            sx={{
                              width: 120,
                              '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': { borderColor: '#4F46E5' },
                              },
                            }}
                          />
                        ) : (
                          <Typography
                            sx={{
                              color: '#4F46E5',
                              fontWeight: 700,
                              cursor: permissions.canEdit ? 'pointer' : 'default',
                              '&:hover': permissions.canEdit ? { textDecoration: 'underline' } : {},
                            }}
                            onClick={() => permissions.canEdit && startInlineEdit(app._id, 'price', app.price)}
                          >
                            {formatCurrency(app.price, app.currency)}
                          </Typography>
                        )}
                      </TableCell>
                    )}
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {app.version || 'v1.0.0'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        {new Date(app.updatedAt || app.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="View">
                          <IconButton
                            size="small"
                            onClick={() => handleView(app)}
                            sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#4F46E5' } }}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {permissions.canEdit && (
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => openSlideOver(app)}
                              sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#4F46E5' } }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {permissions.canDelete && (
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(app)}
                              sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#ef4444' } }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, app)}
                          sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: 'white' } }}
                        >
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
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
                  border: selectedApps.includes(app._id) 
                    ? '2px solid #4F46E5' 
                    : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 2,
                  transition: 'all 0.3s',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    border: '1px solid rgba(79, 70, 229, 0.3)',
                    boxShadow: '0 12px 40px rgba(79, 70, 229, 0.2)',
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

                  {permissions.canBatchEdit && (
                    <Checkbox
                      checked={selectedApps.includes(app._id)}
                      onChange={() => handleSelectApp(app._id)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        bgcolor: 'rgba(15, 23, 42, 0.9)',
                        backdropFilter: 'blur(10px)',
                        color: 'rgba(255,255,255,0.6)',
                        '&.Mui-checked': { color: '#4F46E5' },
                        '&:hover': { bgcolor: 'rgba(79, 70, 229, 0.2)' },
                      }}
                    />
                  )}

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
                      bottom: 8,
                      right: 8,
                      bgcolor: 'rgba(15, 23, 42, 0.9)',
                      backdropFilter: 'blur(10px)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(79, 70, 229, 0.9)' },
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

                  {permissions.canViewFinancials && (
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#4F46E5', mb: 1 }}>
                      {formatCurrency(app.price, app.currency)}
                    </Typography>
                  )}

                  {isIncomplete(app) && (
                    <Button
                      fullWidth
                      size="small"
                      variant="outlined"
                      startIcon={<CloudUpload />}
                      onClick={() => handleCompleteApplication(app)}
                      sx={{
                        mt: 1,
                        borderColor: '#f59e0b',
                        color: '#f59e0b',
                        textTransform: 'none',
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
        // CARD/LIST VIEW (Mobile/Tablet)
        <Stack spacing={2}>
          {filteredApps.map((app) => (
            <Card
              key={app._id}
              sx={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(20px)',
                border: selectedApps.includes(app._id)
                  ? '2px solid #4F46E5'
                  : '1px solid rgba(255,255,255,0.08)',
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': { 
                  bgcolor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(79, 70, 229, 0.3)',
                },
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {permissions.canBatchEdit && (
                    <Checkbox
                      checked={selectedApps.includes(app._id)}
                      onChange={() => handleSelectApp(app._id)}
                      sx={{
                        color: 'rgba(255,255,255,0.3)',
                        '&.Mui-checked': { color: '#4F46E5' },
                        alignSelf: 'flex-start',
                      }}
                    />
                  )}
                  
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
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>
                      {app.appCategory}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', mb: 1 }}>
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
                      {permissions.canViewFinancials && (
                        <Chip
                          icon={<MonetizationOn sx={{ fontSize: 16 }} />}
                          label={formatCurrency(app.price, app.currency)}
                          size="small"
                          sx={{
                            color: '#4F46E5',
                            fontWeight: 600,
                            bgcolor: 'rgba(79, 70, 229, 0.15)',
                            border: '1px solid rgba(79, 70, 229, 0.3)',
                          }}
                        />
                      )}
                    </Box>
                    {isIncomplete(app) && (
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<CloudUpload />}
                        onClick={() => handleCompleteApplication(app)}
                        sx={{
                          borderColor: '#f59e0b',
                          color: '#f59e0b',
                          fontSize: '0.75rem',
                          py: 0.5,
                          px: 1.5,
                          textTransform: 'none',
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

                  <IconButton
                    onClick={(e) => handleMenuOpen(e, app)}
                    sx={{
                      color: 'rgba(255,255,255,0.6)',
                      alignSelf: 'flex-start',
                      '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.05)' },
                    }}
                  >
                    <MoreVert />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Floating Action Button (Mobile) */}
      {isMobile && permissions.canEdit && (
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => navigate('/seller/applications/create')}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4338CA 0%, #6D28D9 100%)',
              boxShadow: '0 12px 32px rgba(79, 70, 229, 0.5)',
            },
          }}
        >
          <Add />
        </Fab>
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
            minWidth: 200,
          },
        }}
      >
        <MenuItem
          onClick={() => handleView(selectedApp)}
          sx={{
            color: 'white',
            '&:hover': { bgcolor: 'rgba(79, 70, 229, 0.15)' },
          }}
        >
          <ListItemIcon>
            <Visibility sx={{ color: 'white', fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        {permissions.canEdit && (
          <>
            <MenuItem
              onClick={() => {
                openSlideOver(selectedApp)
                handleMenuClose()
              }}
              sx={{
                color: 'white',
                '&:hover': { bgcolor: 'rgba(79, 70, 229, 0.15)' },
              }}
            >
              <ListItemIcon>
                <Edit sx={{ color: 'white', fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText>
                {isIncomplete(selectedApp) ? 'Complete Application' : 'Edit'}
              </ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigator.clipboard.writeText(selectedApp?._id)
                toast.success('Application ID copied')
                handleMenuClose()
              }}
              sx={{
                color: 'white',
                '&:hover': { bgcolor: 'rgba(79, 70, 229, 0.15)' },
              }}
            >
              <ListItemIcon>
                <ContentCopy sx={{ color: 'white', fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText>Copy ID</ListItemText>
            </MenuItem>
          </>
        )}
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1 }} />
        {permissions.canDelete && (
          <MenuItem
            onClick={() => handleDeleteClick(selectedApp)}
            sx={{
              color: '#ef4444',
              '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.15)' },
            }}
          >
            <ListItemIcon>
              <Delete sx={{ color: '#ef4444', fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
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
            minWidth: { xs: '90%', sm: 400 },
          },
        }}
      >
        <DialogTitle sx={{ color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Delete sx={{ color: '#ef4444' }} />
          Delete Application?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Are you sure you want to delete <strong style={{ color: '#fff' }}>"{selectedApp?.appName || 'this application'}"</strong>? This action cannot be undone and all associated data will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setDeleteDialog(false)}
            disabled={deleting}
            variant="outlined"
            sx={{
              color: 'rgba(255,255,255,0.8)',
              borderColor: 'rgba(255,255,255,0.2)',
              textTransform: 'none',
              '&:hover': { 
                bgcolor: 'rgba(255,255,255,0.05)',
                borderColor: 'rgba(255,255,255,0.3)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={deleting}
            variant="contained"
            sx={{
              bgcolor: colors.error,
              color: 'white',
              textTransform: 'none',
              '&:hover': { bgcolor: colors.errorText },
              '&:disabled': { bgcolor: alpha(colors.error, 0.5) },
            }}
          >
            {deleting ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Delete Application'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Batch Action Confirmation Dialog */}
      <Dialog
        open={batchActionDialog.open}
        onClose={() => !processingBatch && setBatchActionDialog({ open: false, action: null })}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 2,
            minWidth: { xs: '90%', sm: 400 },
          },
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>
          Confirm Batch Action
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
            {batchActionDialog.action === 'delete' && (
              <>Are you sure you want to delete <strong>{selectedApps.length} application(s)</strong>? This action cannot be undone.</>
            )}
            {batchActionDialog.action === 'archive' && (
              <>Archive <strong>{selectedApps.length} application(s)</strong>? They will be moved to the archive.</>
            )}
            {batchActionDialog.action === 'sync' && (
              <>Sync <strong>{selectedApps.length} application(s)</strong> to the marketplace?</>
            )}
            {batchActionDialog.action === 'updatePricing' && (
              <>Update pricing for <strong>{selectedApps.length} application(s)</strong>?</>
            )}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setBatchActionDialog({ open: false, action: null })}
            disabled={processingBatch}
            variant="outlined"
            sx={{
              color: 'rgba(255,255,255,0.8)',
              borderColor: 'rgba(255,255,255,0.2)',
              textTransform: 'none',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={executeBatchAction}
            disabled={processingBatch}
            variant="contained"
            sx={{
              bgcolor: batchActionDialog.action === 'delete' ? colors.error : colors.primary,
              color: 'white',
              textTransform: 'none',
              '&:hover': { 
                bgcolor: batchActionDialog.action === 'delete' ? colors.errorText : colors.primaryDark 
              },
              '&:disabled': { bgcolor: alpha(colors.primary, 0.5) },
            }}
          >
            {processingBatch ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Slide-Over Panel for Quick Edit */}
      <Drawer
        anchor="right"
        open={slideOverOpen}
        onClose={closeSlideOver}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 400 },
            bgcolor: 'rgba(15, 23, 42, 0.98)',
            backdropFilter: 'blur(20px)',
            borderLeft: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
              Quick Edit
            </Typography>
            <IconButton onClick={closeSlideOver} sx={{ color: 'rgba(255,255,255,0.6)' }}>
              <Close />
            </IconButton>
          </Box>

          {slideOverApp && (
            <Stack spacing={3}>
              <Box>
                <Avatar
                  src={slideOverApp.screenshots?.[0]?.url || slideOverApp.screenshots?.[0]}
                  variant="rounded"
                  sx={{ width: '100%', height: 200, mb: 2 }}
                >
                  <AppsIcon sx={{ fontSize: 64 }} />
                </Avatar>
                <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                  {slideOverApp.appName}
                </Typography>
                <Chip
                  icon={getApplicationStatus(slideOverApp).icon}
                  label={getApplicationStatus(slideOverApp).label}
                  size="small"
                  sx={{
                    color: getApplicationStatus(slideOverApp).color,
                    bgcolor: alpha(getApplicationStatus(slideOverApp).color, 0.15),
                    border: `1px solid ${alpha(getApplicationStatus(slideOverApp).color, 0.3)}`,
                  }}
                />
              </Box>

              <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

              <Stack spacing={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => {
                    navigate(`/seller/applications/edit/${slideOverApp._id}`)
                    closeSlideOver()
                  }}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.2)',
                    textTransform: 'none',
                    justifyContent: 'flex-start',
                    '&:hover': { bgcolor: colors.primaryBg, borderColor: colors.primary },
                  }}
                >
                  Full Edit
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Visibility />}
                  onClick={() => {
                    navigate(`/seller/applications/preview/${slideOverApp._id}`)
                    closeSlideOver()
                  }}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.2)',
                    textTransform: 'none',
                    justifyContent: 'flex-start',
                    '&:hover': { bgcolor: colors.primaryBg, borderColor: colors.primary },
                  }}
                >
                  View Details
                </Button>
                {isIncomplete(slideOverApp) && (
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<CloudUpload />}
                    onClick={() => {
                      navigate(`/seller/applications/edit/${slideOverApp._id}`)
                      closeSlideOver()
                    }}
                    sx={{
                      bgcolor: colors.warning,
                      color: 'white',
                      textTransform: 'none',
                      justifyContent: 'flex-start',
                      '&:hover': { bgcolor: colors.warningText },
                    }}
                  >
                    Upload Source Code
                  </Button>
                )}
              </Stack>

              <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mb: 1 }}>
                  Quick Info
                </Typography>
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                      Category
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                      {slideOverApp.appCategory}
                    </Typography>
                  </Box>
                  {permissions.canViewFinancials && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        Price
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#4F46E5', fontWeight: 600 }}>
                        {formatCurrency(slideOverApp.price, slideOverApp.currency)}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                      Version
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                      {slideOverApp.version || 'v1.0.0'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                      Last Updated
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                      {new Date(slideOverApp.updatedAt || slideOverApp.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          )}
        </Box>
      </Drawer>
    </Box>
  )
}

export default AllApplications
