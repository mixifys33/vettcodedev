import { useState, useEffect, useMemo, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
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
  Collapse,
} from '@mui/material'
import {
  CheckCircle,
  Cancel,
  Store,
  Phone,
  Email,
  CalendarToday,
  Refresh,
  NavigateNext,
  HourglassEmpty,
  Search,
  People,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { colors } from '../../theme/tokens'

const StatCard = ({ title, value, subtitle, icon: Icon, color, bgColor }) => (
  <Card
    sx={{
      bgcolor: colors.cardBackground,
      border: `1px solid ${colors.border}`,
      borderRadius: '8px',
      boxShadow: 'none',
      height: '100%',
    }}
  >
    <CardContent sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="body2" sx={{ color: colors.textSecondary, fontWeight: 500 }}>
          {title}
        </Typography>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '6px',
            bgcolor: bgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
          }}
        >
          <Icon sx={{ fontSize: 18 }} />
        </Box>
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 700, color: colors.textPrimary, fontSize: '26px' }}>
        {value ?? '—'}
      </Typography>
      {subtitle && (
        <Typography variant="caption" sx={{ color: colors.slate400, mt: 0.5, display: 'block' }}>
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
)

const AdminPendingSellers = () => {
  const navigate = useNavigate()
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [actionLoading, setActionLoading] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [confirmDialog, setConfirmDialog] = useState({ open: false, seller: null, action: null })

  useEffect(() => {
    fetchPendingSellers()
  }, [])

  const getToken = () => localStorage.getItem('adminToken')

  const fetchPendingSellers = async () => {
    setLoading(true)
    try {
      const token = getToken()
      const response = await api.get('/admin/sellers/pending', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.data.success) {
        setSellers(response.data.sellers || [])
      }
    } catch (error) {
      console.error('Failed to fetch pending sellers:', error)
      toast.error('Failed to load pending sellers')
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
      const body =
        action === 'reject' ? { reason: 'Application does not meet our current requirements.' } : undefined
      const response = await api.patch(`/admin/sellers/${seller._id}/${action}`, body, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setSellers((prev) => prev.filter((s) => s._id !== seller._id))
        toast.success(`${seller.name} has been ${action === 'approve' ? 'approved' : 'rejected'}`)
      } else {
        toast.error(response.data.error || 'Action failed')
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Network error. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const openConfirmDialog = (seller, action) => {
    setConfirmDialog({ open: true, seller, action })
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return sellers
    const q = search.toLowerCase()
    return sellers.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.phoneNumber?.includes(q) ||
        s.shop?.shopName?.toLowerCase().includes(q) ||
        s.applicationNote?.toLowerCase().includes(q)
    )
  }, [sellers, search])

  const stats = useMemo(() => {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return {
      total: sellers.length,
      withShop: sellers.filter((s) => s.shop?.shopName).length,
      thisWeek: sellers.filter((s) => s.createdAt && new Date(s.createdAt) >= weekAgo).length,
      withNote: sellers.filter((s) => s.applicationNote?.trim()).length,
    }
  }, [sellers])

  const getDialogContent = () => {
    const { seller, action } = confirmDialog
    if (!seller) return {}
    return action === 'approve'
      ? {
          title: 'Approve seller',
          content: `Approve ${seller.name}? They will be notified and can access the seller dashboard immediately.`,
          confirmColor: colors.success,
        }
      : {
          title: 'Reject application',
          content: `Reject ${seller.name}'s application? They will be notified by email/push.`,
          confirmColor: colors.error,
        }
  }

  const dialog = getDialogContent()

  if (loading) {
    return (
      <Box sx={{ bgcolor: colors.pageBackground, minHeight: '100vh' }}>
        <LinearProgress
          sx={{
            bgcolor: colors.border,
            '& .MuiLinearProgress-bar': { bgcolor: colors.primary },
          }}
        />
      </Box>
    )
  }

  const statCards = [
    {
      title: 'Awaiting review',
      value: stats.total.toLocaleString(),
      subtitle: 'Pending seller applications',
      icon: HourglassEmpty,
      color: colors.warning,
      bgColor: colors.warningBg,
    },
    {
      title: 'With shop profile',
      value: stats.withShop.toLocaleString(),
      subtitle: 'Submitted shop details',
      icon: Store,
      color: colors.primary,
      bgColor: colors.primaryBg,
    },
    {
      title: 'Applied this week',
      value: stats.thisWeek.toLocaleString(),
      subtitle: 'Last 7 days',
      icon: CalendarToday,
      color: colors.info,
      bgColor: colors.infoBg,
    },
    {
      title: 'With notes',
      value: stats.withNote.toLocaleString(),
      subtitle: 'Left an application message',
      icon: People,
      color: colors.slate600,
      bgColor: colors.slate100,
    },
  ]

  return (
    <Box sx={{ bgcolor: colors.pageBackground, minHeight: '100vh' }}>
      {/* Page header */}
      <Box
        sx={{
          bgcolor: colors.cardBackground,
          borderBottom: `1px solid ${colors.border}`,
          px: 3,
          py: 2,
          mb: 3,
        }}
      >
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" sx={{ color: colors.slate400 }} />}
          sx={{ mb: 1 }}
        >
          <Link
            underline="hover"
            onClick={() => navigate('/admin/dashboard')}
            sx={{ color: colors.textSecondary, fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}
          >
            Dashboard
          </Link>
          <Link
            underline="hover"
            onClick={() => navigate('/admin/sellers')}
            sx={{ color: colors.textSecondary, fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}
          >
            Seller Management
          </Link>
          <Typography sx={{ color: colors.textPrimary, fontSize: '14px', fontWeight: 600 }}>
            Pending Sellers
          </Typography>
        </Breadcrumbs>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: colors.textPrimary }}>
              Pending Sellers
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary, mt: 0.5 }}>
              Review and approve new seller applications
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/admin/sellers')}
              sx={{ textTransform: 'none', borderColor: colors.border, color: colors.textSecondary }}
            >
              All sellers
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchPendingSellers}
              sx={{ textTransform: 'none', borderColor: colors.border, color: colors.textSecondary }}
            >
              Refresh
            </Button>
          </Box>
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

        {/* Search */}
        <Card
          sx={{
            bgcolor: colors.cardBackground,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            boxShadow: 'none',
            mb: 3,
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <TextField
              fullWidth
              placeholder="Search by name, email, phone, shop, or application note..."
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
              <Chip
                icon={<HourglassEmpty sx={{ fontSize: 16 }} />}
                label={`Pending (${sellers.length})`}
                sx={{
                  bgcolor: colors.warningBg,
                  color: colors.warningText,
                  border: `1px solid ${colors.warning}`,
                  fontWeight: 700,
                }}
              />
              {search.trim() && (
                <Chip
                  label={`${filtered.length} match${filtered.length !== 1 ? 'es' : ''}`}
                  size="small"
                  sx={{ bgcolor: colors.pageBackground, border: `1px solid ${colors.border}` }}
                />
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Table / empty */}
        {filtered.length === 0 ? (
          <Card
            sx={{
              bgcolor: colors.cardBackground,
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              boxShadow: 'none',
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              {sellers.length === 0 ? (
                <>
                  <CheckCircle sx={{ fontSize: 64, color: colors.success, mb: 2 }} />
                  <Typography variant="h6" sx={{ color: colors.textPrimary, fontWeight: 700 }}>
                    All clear
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.textSecondary, mt: 1 }}>
                    No pending seller applications right now.
                  </Typography>
                </>
              ) : (
                <>
                  <Search sx={{ fontSize: 64, color: colors.slate300, mb: 2 }} />
                  <Typography variant="h6" sx={{ color: colors.textSecondary, fontWeight: 600 }}>
                    No matches
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.slate400, mt: 1 }}>
                    Try a different search term
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card
            sx={{
              bgcolor: colors.cardBackground,
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              boxShadow: 'none',
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: colors.pageBackground }}>
                      <TableCell sx={{ fontWeight: 700, color: colors.textPrimary, width: 48 }} />
                      <TableCell sx={{ fontWeight: 700, color: colors.textPrimary }}>Seller</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: colors.textPrimary }}>Contact</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: colors.textPrimary }}>Shop</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: colors.textPrimary }}>Applied</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: colors.textPrimary }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtered.map((seller) => {
                      const isLoading = actionLoading === seller._id
                      const isExpanded = expandedId === seller._id
                      const avatarUrl =
                        seller.profileImage?.url ||
                        (typeof seller.profileImage === 'string' ? seller.profileImage : null)

                      return (
                        <Fragment key={seller._id}>
                          <TableRow
                            hover
                            sx={{ '&:hover': { bgcolor: colors.slate50 } }}
                          >
                            <TableCell sx={{ py: 1 }}>
                              {seller.applicationNote ? (
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    setExpandedId(isExpanded ? null : seller._id)
                                  }
                                  sx={{ color: colors.textSecondary }}
                                >
                                  {isExpanded ? (
                                    <ExpandLess fontSize="small" />
                                  ) : (
                                    <ExpandMore fontSize="small" />
                                  )}
                                </IconButton>
                              ) : null}
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Avatar
                                  src={avatarUrl}
                                  sx={{
                                    width: 44,
                                    height: 44,
                                    bgcolor: colors.primaryBg,
                                    color: colors.primary,
                                    fontWeight: 700,
                                    borderRadius: '8px',
                                  }}
                                >
                                  {seller.name?.[0]?.toUpperCase() || '?'}
                                </Avatar>
                                <Box>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 600, color: colors.textPrimary }}
                                  >
                                    {seller.name || 'Unknown'}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                                    ID: {String(seller._id).slice(-6).toUpperCase()}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                                <Email sx={{ fontSize: 12, color: colors.textSecondary }} />
                                <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                                  {seller.email || '—'}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Phone sx={{ fontSize: 12, color: colors.textSecondary }} />
                                <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                                  {seller.phoneNumber || '—'}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              {seller.shop?.shopName ? (
                                <Box>
                                  <Chip
                                    icon={<Store sx={{ fontSize: 14 }} />}
                                    label={seller.shop.shopName}
                                    size="small"
                                    sx={{
                                      bgcolor: colors.infoBg,
                                      color: colors.infoText,
                                      fontWeight: 600,
                                      mb: 0.5,
                                    }}
                                  />
                                  {seller.shop.businessType && (
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: colors.textSecondary,
                                        textTransform: 'capitalize',
                                        display: 'block',
                                      }}
                                    >
                                      {seller.shop.businessType}
                                    </Typography>
                                  )}
                                </Box>
                              ) : (
                                <Typography variant="caption" sx={{ color: colors.slate400 }}>
                                  No shop yet
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label="Pending review"
                                size="small"
                                sx={{
                                  bgcolor: colors.warningBg,
                                  color: colors.warningText,
                                  fontWeight: 600,
                                }}
                              />
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.75 }}>
                                <CalendarToday sx={{ fontSize: 12, color: colors.textSecondary }} />
                                <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                                  {seller.createdAt
                                    ? new Date(seller.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                      })
                                    : '—'}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              {isLoading ? (
                                <CircularProgress size={22} sx={{ color: colors.primary }} />
                              ) : (
                                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                                  <Tooltip title="Approve">
                                    <IconButton
                                      size="small"
                                      onClick={() => openConfirmDialog(seller, 'approve')}
                                      sx={{
                                        color: colors.success,
                                        '&:hover': { bgcolor: colors.successBg },
                                      }}
                                    >
                                      <CheckCircle sx={{ fontSize: 18 }} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Reject">
                                    <IconButton
                                      size="small"
                                      onClick={() => openConfirmDialog(seller, 'reject')}
                                      sx={{
                                        color: colors.error,
                                        '&:hover': { bgcolor: colors.errorBg },
                                      }}
                                    >
                                      <Cancel sx={{ fontSize: 18 }} />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              )}
                            </TableCell>
                          </TableRow>
                          {seller.applicationNote && (
                            <TableRow>
                              <TableCell colSpan={6} sx={{ py: 0, borderBottom: `1px solid ${colors.border}` }}>
                                <Collapse in={isExpanded}>
                                  <Box
                                    sx={{
                                      py: 2,
                                      px: 2,
                                      mb: 1,
                                      bgcolor: colors.pageBackground,
                                      borderRadius: '8px',
                                      border: `1px solid ${colors.border}`,
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        fontWeight: 700,
                                        color: colors.textSecondary,
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.5,
                                      }}
                                    >
                                      Application note
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{ color: colors.textPrimary, mt: 0.5, lineHeight: 1.6 }}
                                    >
                                      {seller.applicationNote}
                                    </Typography>
                                  </Box>
                                </Collapse>
                              </TableCell>
                            </TableRow>
                          )}
                        </Fragment>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </Box>

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, seller: null, action: null })}
        PaperProps={{
          sx: { borderRadius: '12px', border: `1px solid ${colors.border}`, minWidth: 360 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: colors.textPrimary }}>{dialog.title}</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: colors.textSecondary }}>{dialog.content}</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setConfirmDialog({ open: false, seller: null, action: null })}
            sx={{ textTransform: 'none', color: colors.textSecondary }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAction}
            sx={{
              textTransform: 'none',
              bgcolor: dialog.confirmColor || colors.primary,
              '&:hover': { bgcolor: dialog.confirmColor || colors.primaryDark },
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminPendingSellers
