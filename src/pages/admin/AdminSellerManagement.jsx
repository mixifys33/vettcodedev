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
  LinearProgress,
  Breadcrumbs,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
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
  NavigateNext,
  TrendingUp,
  People,
  HourglassEmpty,
  Warning,
  MoreVert,
  Visibility,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { colors } from '../../theme/tokens'

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
  { key: 'all', label: 'All Sellers', icon: Store },
  { key: 'active', label: 'Active', icon: CheckCircle },
  { key: 'pending', label: 'Pending', icon: HourglassEmpty },
  { key: 'suspended', label: 'Suspended', icon: Block },
]

const StatCard = ({ title, value, subtitle, icon: Icon, color, bgColor, trend }) => (
  <Card sx={{ bgcolor: colors.cardBackground, border: `1px solid ${colors.border}`, borderRadius: '8px', boxShadow: 'none', height: '100%' }}>
    <CardContent sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="body2" sx={{ color: colors.textSecondary, fontWeight: 500 }}>{title}</Typography>
        <Box sx={{ width: 32, height: 32, borderRadius: '6px', bgcolor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
          <Icon sx={{ fontSize: 18 }} />
        </Box>
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 700, color: colors.textPrimary, fontSize: '26px' }}>{value ?? '—'}</Typography>
      {subtitle && <Typography variant="caption" sx={{ color: colors.slate400, mt: 0.5, display: 'block' }}>{subtitle}</Typography>}
      {trend && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
          <TrendingUp sx={{ fontSize: 14, color: colors.success }} />
          <Typography variant="caption" sx={{ color: colors.success, fontWeight: 600 }}>{trend}</Typography>
        </Box>
      )}
    </CardContent>
  </Card>
)

const AdminSellerManagement = () => {
  const navigate = useNavigate()
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

  // Calculate stats
  const stats = {
    total: sellers.length,
    active: sellers.filter(s => s.status === 'active').length,
    pending: sellers.filter(s => s.approvalStatus === 'pending_review').length,
    suspended: sellers.filter(s => s.status === 'suspended').length,
    approved: sellers.filter(s => s.approvalStatus === 'approved').length,
    rejected: sellers.filter(s => s.approvalStatus === 'rejected').length,
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
      <Box sx={{ bgcolor: colors.pageBackground, minHeight: '100vh', p: 3 }}>
        <LinearProgress sx={{ borderRadius: 0.5, bgcolor: colors.border, '& .MuiLinearProgress-bar': { bgcolor: colors.primary } }} />
      </Box>
    )
  }

  const statCards = [
    { title: 'Total Sellers', value: stats.total.toLocaleString(), subtitle: `${stats.approved} approved`, icon: Store, color: '#7C3AED', bgColor: 'rgba(124,58,237,0.08)' },
    { title: 'Active Sellers', value: stats.active.toLocaleString(), subtitle: 'Currently selling', icon: CheckCircle, color: colors.success, bgColor: colors.successBg },
    { title: 'Pending Review', value: stats.pending.toLocaleString(), subtitle: 'Awaiting approval', icon: HourglassEmpty, color: colors.warning, bgColor: colors.warningBg },
    { title: 'Suspended', value: stats.suspended.toLocaleString(), subtitle: `${stats.rejected} rejected`, icon: Block, color: colors.error, bgColor: colors.errorBg },
  ]

  return (
    <Box sx={{ bgcolor: colors.pageBackground, minHeight: '100vh' }}>
      {/* Page header */}
      <Box sx={{ bgcolor: colors.cardBackground, borderBottom: `1px solid ${colors.border}`, px: 3, py: 2, mb: 3 }}>
        <Breadcrumbs separator={<NavigateNext fontSize="small" sx={{ color: colors.slate400 }} />} sx={{ mb: 1 }}>
          <Link underline="hover" onClick={() => navigate('/admin/dashboard')} sx={{ color: colors.textSecondary, fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Dashboard</Link>
          <Typography sx={{ color: colors.textPrimary, fontSize: '14px', fontWeight: 600 }}>Seller Management</Typography>
        </Breadcrumbs>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: colors.textPrimary }}>Seller Management</Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary, mt: 0.5 }}>
              Manage seller accounts, approvals, and status
            </Typography>
          </Box>
          <Button variant="outlined" startIcon={<Refresh />} onClick={fetchSellers}
            sx={{ textTransform: 'none', borderColor: colors.border, color: colors.textSecondary }}>
            Refresh
          </Button>
        </Box>
      </Box>

      <Box sx={{ px: 3, pb: 4 }}>
        {/* Stat cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {statCards.map((c, i) => (
            <Grid item xs={12} sm={6} lg={3} key={i}>
              <StatCard {...c} />
            </Grid>
          ))}
        </Grid>

        {/* Search and filters */}
        <Card sx={{ bgcolor: colors.cardBackground, border: `1px solid ${colors.border}`, borderRadius: '8px', boxShadow: 'none', mb: 3 }}>
          <CardContent sx={{ p: 2.5 }}>
            <TextField
              fullWidth
              placeholder="Search by name, email, phone, or shop name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: colors.textSecondary }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: colors.pageBackground,
                  '& fieldset': { borderColor: colors.border },
                  '&:hover fieldset': { borderColor: colors.primary },
                },
              }}
            />
            <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
              {FILTERS.map((f) => {
                const Icon = f.icon
                const isActive = filter === f.key
                const count = f.key === 'all' ? stats.total : f.key === 'active' ? stats.active : f.key === 'pending' ? stats.pending : stats.suspended
                return (
                  <Chip
                    key={f.key}
                    icon={<Icon sx={{ fontSize: 16 }} />}
                    label={`${f.label} (${count})`}
                    onClick={() => setFilter(f.key)}
                    sx={{
                      bgcolor: isActive ? colors.primaryBg : colors.pageBackground,
                      color: isActive ? colors.primary : colors.textSecondary,
                      border: `1px solid ${isActive ? colors.primary : colors.border}`,
                      fontWeight: isActive ? 700 : 500,
                      '&:hover': { bgcolor: isActive ? colors.primaryBg : colors.slate100 },
                    }}
                  />
                )
              })}
            </Box>
          </CardContent>
        </Card>

        {/* Sellers table */}
        {filtered.length === 0 ? (
          <Card sx={{ bgcolor: colors.cardBackground, border: `1px solid ${colors.border}`, borderRadius: '8px', boxShadow: 'none' }}>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <Store sx={{ fontSize: 64, color: colors.slate300, mb: 2 }} />
              <Typography variant="h6" sx={{ color: colors.textSecondary, fontWeight: 600 }}>
                No sellers found
              </Typography>
              <Typography variant="body2" sx={{ color: colors.slate400, mt: 1 }}>
                {search ? 'Try adjusting your search' : 'No sellers match the selected filter'}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Card sx={{ bgcolor: colors.cardBackground, border: `1px solid ${colors.border}`, borderRadius: '8px', boxShadow: 'none' }}>
            <CardContent sx={{ p: 0 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: colors.pageBackground }}>
                      <TableCell sx={{ fontWeight: 700, color: colors.textPrimary }}>Seller</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: colors.textPrimary }}>Contact</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: colors.textPrimary }}>Shop</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: colors.textPrimary }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: colors.textPrimary }}>Approval</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: colors.textPrimary }}>Joined</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: colors.textPrimary }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtered.map((seller) => {
                      const statusConfig = STATUS_CONFIG[seller.status] || STATUS_CONFIG.pending
                      const approvalConfig = APPROVAL_CONFIG[seller.approvalStatus] || APPROVAL_CONFIG.pending_review
                      const isLoading = actionLoading === seller._id
                      const avatarUrl = seller.profileImage?.url || (typeof seller.profileImage === 'string' ? seller.profileImage : null)

                      return (
                        <TableRow key={seller._id} hover sx={{ '&:hover': { bgcolor: colors.slate50 } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar
                                src={avatarUrl}
                                sx={{
                                  width: 40,
                                  height: 40,
                                  bgcolor: colors.primaryBg,
                                  color: colors.primary,
                                  fontSize: '16px',
                                  fontWeight: 700,
                                }}
                              >
                                {seller.name?.[0]?.toUpperCase() || '?'}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: colors.textPrimary }}>
                                  {seller.name || 'Unknown'}
                                </Typography>
                                <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                                  ID: {seller._id.slice(-6).toUpperCase()}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                                <Email sx={{ fontSize: 12, color: colors.textSecondary }} />
                                <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                                  {seller.email || 'N/A'}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Phone sx={{ fontSize: 12, color: colors.textSecondary }} />
                                <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                                  {seller.phoneNumber || 'N/A'}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            {seller.shop?.shopName ? (
                              <Chip
                                icon={<Store sx={{ fontSize: 14 }} />}
                                label={seller.shop.shopName}
                                size="small"
                                sx={{ bgcolor: colors.infoBg, color: colors.infoText, fontWeight: 600 }}
                              />
                            ) : (
                              <Typography variant="caption" sx={{ color: colors.slate400 }}>No shop</Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={statusConfig.label}
                              color={statusConfig.color}
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={approvalConfig.label}
                              color={approvalConfig.color}
                              size="small"
                              variant="outlined"
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <CalendarToday sx={{ fontSize: 12, color: colors.textSecondary }} />
                              <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                                {new Date(seller.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            {isLoading ? (
                              <CircularProgress size={20} />
                            ) : (
                              <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                                {seller.approvalStatus === 'pending_review' && (
                                  <>
                                    <Tooltip title="Approve">
                                      <IconButton
                                        size="small"
                                        onClick={() => openConfirmDialog(seller, 'approve')}
                                        sx={{ color: colors.success, '&:hover': { bgcolor: colors.successBg } }}
                                      >
                                        <CheckCircle sx={{ fontSize: 18 }} />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Reject">
                                      <IconButton
                                        size="small"
                                        onClick={() => openConfirmDialog(seller, 'reject')}
                                        sx={{ color: colors.error, '&:hover': { bgcolor: colors.errorBg } }}
                                      >
                                        <Cancel sx={{ fontSize: 18 }} />
                                      </IconButton>
                                    </Tooltip>
                                  </>
                                )}
                                {seller.status === 'active' && seller.approvalStatus === 'approved' && (
                                  <Tooltip title="Suspend">
                                    <IconButton
                                      size="small"
                                      onClick={() => openConfirmDialog(seller, 'suspend')}
                                      sx={{ color: colors.warning, '&:hover': { bgcolor: colors.warningBg } }}
                                    >
                                      <Block sx={{ fontSize: 18 }} />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                {seller.status === 'suspended' && (
                                  <Tooltip title="Unsuspend">
                                    <IconButton
                                      size="small"
                                      onClick={() => openConfirmDialog(seller, 'unsuspend')}
                                      sx={{ color: colors.success, '&:hover': { bgcolor: colors.successBg } }}
                                    >
                                      <Refresh sx={{ fontSize: 18 }} />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </Box>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, seller: null, action: null })}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            border: `1px solid ${colors.border}`,
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: colors.textPrimary }}>
          {getDialogContent().title}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: colors.textSecondary }}>
            {getDialogContent().content}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setConfirmDialog({ open: false, seller: null, action: null })}
            sx={{ textTransform: 'none', color: colors.textSecondary }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAction}
            variant="contained"
            sx={{
              textTransform: 'none',
              bgcolor: colors.primary,
              '&:hover': { bgcolor: colors.primaryDark },
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminSellerManagement
