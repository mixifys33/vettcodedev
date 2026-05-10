import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  Avatar,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Tabs,
  Tab,
} from '@mui/material'
import {
  Search,
  Store,
  CheckCircle,
  Cancel,
  Block,
  Refresh,
  Phone,
  Email,
  CalendarToday,
} from '@mui/icons-material'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const STATUS_CONFIG = {
  active: { color: 'success', label: 'Active' },
  pending: { color: 'warning', label: 'Pending' },
  suspended: { color: 'error', label: 'Suspended' },
  banned: { color: 'default', label: 'Banned' },
}

const APPROVAL_CONFIG = {
  pending_review: { color: 'warning', label: 'Pending Review' },
  approved: { color: 'success', label: 'Approved' },
  rejected: { color: 'error', label: 'Rejected' },
}

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'pending', label: 'Pending' },
  { key: 'suspended', label: 'Suspended' },
]

const AdminSellerManagement = () => {
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [actionLoading, setActionLoading] = useState(null)
  const [confirmDialog, setConfirmDialog] = useState({ open: false, seller: null, action: null })

  useEffect(() => {
    fetchSellers()
  }, [filter])

  const getToken = () => localStorage.getItem('adminToken')

  const fetchSellers = async () => {
    try {
      const token = getToken()
      const params = filter !== 'all' ? `?status=${filter}` : ''
      const response = await api.get(`/admin/sellers${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.data.success) {
        setSellers(response.data.sellers)
      }
    } catch (error) {
      console.error('Failed to fetch sellers:', error)
      toast.error('Failed to load sellers')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async () => {
    const { seller, action } = confirmDialog
    setActionLoading(seller._id)
    setConfirmDialog({ open: false, seller: null, action: null })

    try {
      const token = getToken()
      const body = action === 'reject' ? { reason: 'Does not meet requirements.' } : undefined
      const response = await api.patch(
        `/admin/sellers/${seller._id}/${action}`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        setSellers((prev) =>
          prev.map((s) =>
            s._id === seller._id
              ? {
                  ...s,
                  status:
                    action === 'approve'
                      ? 'active'
                      : action === 'suspend'
                      ? 'suspended'
                      : action === 'unsuspend'
                      ? 'active'
                      : s.status,
                  approvalStatus:
                    action === 'approve'
                      ? 'approved'
                      : action === 'reject'
                      ? 'rejected'
                      : s.approvalStatus,
                }
              : s
          )
        )
        toast.success(`${seller.name} has been ${action}d successfully`)
      } else {
        toast.error(response.data.error || 'Action failed')
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const openConfirmDialog = (seller, action) => {
    setConfirmDialog({ open: true, seller, action })
  }

  const filtered = sellers.filter((s) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.phoneNumber?.includes(q) ||
      s.shop?.shopName?.toLowerCase().includes(q)
    )
  })

  const SellerCard = ({ seller }) => {
    const statusConfig = STATUS_CONFIG[seller.status] || STATUS_CONFIG.pending
    const approvalConfig = APPROVAL_CONFIG[seller.approvalStatus] || APPROVAL_CONFIG.pending_review
    const isLoading = actionLoading === seller._id
    const avatarUrl = seller.profileImage?.url || (typeof seller.profileImage === 'string' ? seller.profileImage : null)

    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
            <Avatar
              src={avatarUrl}
              sx={{
                width: 56,
                height: 56,
                bgcolor: `${statusConfig.color}.light`,
                fontSize: '1.5rem',
                fontWeight: 800,
              }}
            >
              {seller.name?.[0]?.toUpperCase() || '?'}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {seller.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {seller.email}
              </Typography>
              {seller.shop?.shopName && (
                <Chip
                  icon={<Store sx={{ fontSize: 14 }} />}
                  label={seller.shop.shopName}
                  size="small"
                  color="info"
                  variant="outlined"
                  sx={{ height: 24 }}
                />
              )}
            </Box>
            <Chip label={statusConfig.label} color={statusConfig.color} size="small" />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Phone sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {seller.phoneNumber || 'N/A'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {new Date(seller.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
            <Chip
              label={approvalConfig.label}
              color={approvalConfig.color}
              size="small"
              variant="outlined"
              sx={{ ml: 'auto' }}
            />
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {seller.approvalStatus === 'pending_review' && (
                <>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={() => openConfirmDialog(seller, 'approve')}
                  >
                    Approve
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    startIcon={<Cancel />}
                    onClick={() => openConfirmDialog(seller, 'reject')}
                  >
                    Reject
                  </Button>
                </>
              )}
              {seller.status === 'active' && seller.approvalStatus === 'approved' && (
                <Button
                  size="small"
                  variant="contained"
                  color="warning"
                  startIcon={<Block />}
                  onClick={() => openConfirmDialog(seller, 'suspend')}
                >
                  Suspend
                </Button>
              )}
              {seller.status === 'suspended' && (
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  startIcon={<Refresh />}
                  onClick={() => openConfirmDialog(seller, 'unsuspend')}
                >
                  Unsuspend
                </Button>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    )
  }

  const getDialogContent = () => {
    const { seller, action } = confirmDialog
    if (!seller) return {}

    const messages = {
      approve: {
        title: 'Approve Seller',
        content: `Approve ${seller.name}? They will be notified and gain access to the dashboard.`,
      },
      reject: {
        title: 'Reject Seller',
        content: `Reject ${seller.name}'s application? They will be notified.`,
      },
      suspend: {
        title: 'Suspend Seller',
        content: `Suspend ${seller.name}? They will lose dashboard access immediately.`,
      },
      unsuspend: {
        title: 'Restore Seller',
        content: `Restore ${seller.name}'s account? They will regain dashboard access.`,
      },
    }

    return messages[action] || {}
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
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Seller Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {sellers.length} sellers total
        </Typography>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search sellers..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />

      {/* Filters */}
      <Tabs value={filter} onChange={(e, newValue) => setFilter(newValue)} sx={{ mb: 3 }}>
        {FILTERS.map((f) => (
          <Tab key={f.key} label={f.label} value={f.key} />
        ))}
      </Tabs>

      {/* Sellers List */}
      {filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Store sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No sellers found
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filtered.map((seller) => (
            <Grid item xs={12} key={seller._id}>
              <SellerCard seller={seller} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, seller: null, action: null })}>
        <DialogTitle>{getDialogContent().title}</DialogTitle>
        <DialogContent>
          <Typography>{getDialogContent().content}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, seller: null, action: null })}>Cancel</Button>
          <Button onClick={handleAction} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminSellerManagement
