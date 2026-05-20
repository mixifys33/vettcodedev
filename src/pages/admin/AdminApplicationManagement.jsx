import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  Grid,
  CircularProgress,
  InputAdornment,
  Avatar,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Alert,
} from '@mui/material'
import {
  Search,
  Code,
  CheckCircle,
  Cancel,
  Schedule,
  Star,
  Refresh,
  NavigateNext,
  Visibility,
  Download,
  AttachMoney,
  HourglassEmpty,
  Apps,
  ShoppingBag,
  Inventory2,
} from '@mui/icons-material'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { colors } from '../../theme/tokens'

const STATUS_CONFIG = {
  pending: { color: 'warning', label: 'Pending' },
  verified: { color: 'success', label: 'Verified' },
  rejected: { color: 'error', label: 'Rejected' },
}

const FILTERS = [
  { key: 'all', label: 'All Applications', icon: Apps },
  { key: 'pending', label: 'Pending', icon: HourglassEmpty },
  { key: 'verified', label: 'Verified', icon: CheckCircle },
  { key: 'rejected', label: 'Rejected', icon: Cancel },
]

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

const AdminApplicationManagement = () => {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState('apps')
  const [applications, setApplications] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [actionLoading, setActionLoading] = useState(null)
  const [confirmDialog, setConfirmDialog] = useState({ open: false, app: null, action: null })

  useEffect(() => {
    setLoading(true)
    if (viewMode === 'apps') fetchApplications()
    else fetchProducts()
  }, [filter, viewMode])

  useEffect(() => {
    const token = getToken()
    api
      .get('/admin/products?limit=500', { headers: { Authorization: `Bearer ${token}` }, silentError: true })
      .then((res) => {
        if (res.data?.success) setProducts(res.data.products || [])
      })
      .catch(() => {})
  }, [])

  const getToken = () => localStorage.getItem('adminToken')

  const fetchApplications = async () => {
    try {
      const token = getToken()
      const params = filter !== 'all' ? `?status=${filter}` : ''
      const response = await api.get(`/admin/applications${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.data.success) {
        setApplications(response.data.applications || [])
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error)
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const token = getToken()
      const params = new URLSearchParams({ limit: '500' })
      if (search.trim()) params.set('search', search.trim())
      const response = await api.get(`/admin/products?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.data.success) {
        setProducts(response.data.products || [])
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
      toast.error('Failed to load shop products')
    } finally {
      setLoading(false)
    }
  }

  const handleReviewAction = async () => {
    const { app, action } = confirmDialog
    setActionLoading(app._id)
    setConfirmDialog({ open: false, app: null, action: null })

    try {
      const token = getToken()
      const response = await api.patch(
        `/admin/applications/${app._id}/review`,
        { status: action },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.data.success) {
        setApplications((prev) =>
          prev.map((a) =>
            a._id === app._id ? { ...a, verificationStatus: action } : a
          )
        )
        toast.success(`Application ${action === 'verified' ? 'verified' : 'rejected'} successfully`)
      } else {
        toast.error(response.data.error || 'Action failed')
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Action failed')
    } finally {
      setActionLoading(null)
    }
  }

  const openConfirmDialog = (app, action) => {
    setConfirmDialog({ open: true, app, action })
  }

  const filteredApps = applications.filter((a) => {
    if (!search.trim() || viewMode === 'products') return true
    const q = search.toLowerCase()
    return (
      a.appName?.toLowerCase().includes(q) ||
      a.appCategory?.toLowerCase().includes(q) ||
      a.sellerId?.name?.toLowerCase().includes(q) ||
      a.sellerId?.email?.toLowerCase().includes(q)
    )
  })

  const filteredProducts = products.filter((p) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      p.title?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.sellerId?.name?.toLowerCase().includes(q)
    )
  })

  const formatProductPrice = (p) => {
    const amount = p.salePrice ?? p.regularPrice ?? 0
    const currency = p.currency || 'USD'
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
    } catch {
      return `${currency} ${amount}`
    }
  }

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.verificationStatus === 'pending').length,
    verified: applications.filter((a) => a.verificationStatus === 'verified').length,
    rejected: applications.filter((a) => a.verificationStatus === 'rejected').length,
    totalViews: applications.reduce((s, a) => s + (a.views || 0), 0),
    totalDownloads: applications.reduce((s, a) => s + (a.downloads || 0), 0),
  }

  const formatPrice = (app) => {
    if (app.isFree) return 'Free'
    const amount = app.price ?? 0
    const currency = app.currency || 'USD'
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
    } catch {
      return `$${amount}`
    }
  }

  const getDialogContent = () => {
    const { app, action } = confirmDialog
    if (!app) return {}
    if (action === 'verified') {
      return {
        title: 'Verify Application',
        content: `Approve "${app.appName}" for the marketplace? It will be visible to buyers.`,
      }
    }
    return {
      title: 'Reject Application',
      content: `Reject "${app.appName}"? The seller will need to resubmit or fix issues.`,
    }
  }

  if (loading) {
    return (
      <Box sx={{ bgcolor: colors.pageBackground, minHeight: '100vh', p: 3 }}>
        <LinearProgress
          sx={{
            borderRadius: 0.5,
            bgcolor: colors.border,
            '& .MuiLinearProgress-bar': { bgcolor: colors.primary },
          }}
        />
      </Box>
    )
  }

  const statCards = [
    {
      title: 'Total Applications',
      value: stats.total.toLocaleString(),
      subtitle: `${stats.verified} live on marketplace`,
      icon: Apps,
      color: '#7C3AED',
      bgColor: 'rgba(124,58,237,0.08)',
    },
    {
      title: 'Pending Review',
      value: stats.pending.toLocaleString(),
      subtitle: 'Awaiting your decision',
      icon: HourglassEmpty,
      color: colors.warning,
      bgColor: colors.warningBg,
    },
    {
      title: 'Verified',
      value: stats.verified.toLocaleString(),
      subtitle: 'Approved listings',
      icon: CheckCircle,
      color: colors.success,
      bgColor: colors.successBg,
    },
    {
      title: 'Rejected',
      value: stats.rejected.toLocaleString(),
      subtitle: `${stats.totalViews.toLocaleString()} total views`,
      icon: Cancel,
      color: colors.error,
      bgColor: colors.errorBg,
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
          <Typography sx={{ color: colors.textPrimary, fontSize: '14px', fontWeight: 600 }}>
            Applications &amp; Products
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
              Applications &amp; Products
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary, mt: 0.5 }}>
              Seller apps (digital) and shop products (physical) — email picker shows both types
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => {
              setLoading(true)
              if (viewMode === 'apps') fetchApplications()
              else fetchProducts()
            }}
            sx={{
              textTransform: 'none',
              borderColor: colors.border,
              color: colors.textSecondary,
            }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <Box sx={{ px: 3, pb: 4 }}>
        <Tabs
          value={viewMode}
          onChange={(_, v) => {
            setViewMode(v)
            setSearch('')
          }}
          sx={{ mb: 2, borderBottom: `1px solid ${colors.border}` }}
        >
          <Tab value="apps" label={`Seller apps (${applications.length})`} icon={<Apps />} iconPosition="start" sx={{ textTransform: 'none' }} />
          <Tab value="products" label={`Shop products (${products.length})`} icon={<ShoppingBag />} iconPosition="start" sx={{ textTransform: 'none' }} />
        </Tabs>

        {viewMode === 'products' && (
          <Alert severity="info" sx={{ mb: 2, borderRadius: '8px' }}>
            Items like <strong>LuxeStep</strong> are <strong>shop products</strong> (physical goods), not seller applications.
            They appear here and in email “Include products”, but not under seller apps.
          </Alert>
        )}

        {/* Stat cards — apps only */}
        {viewMode === 'apps' && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {statCards.map((c, i) => (
              <Grid item xs={12} sm={6} lg={3} key={i}>
                <StatCard {...c} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Search and filters */}
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
              placeholder={
                viewMode === 'apps'
                  ? 'Search by app name, category, or seller...'
                  : 'Search shop products by title, category, or seller...'
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && viewMode === 'products') {
                  setLoading(true)
                  fetchProducts()
                }
              }}
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
            {viewMode === 'apps' && (
            <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
              {FILTERS.map((f) => {
                const Icon = f.icon
                const isActive = filter === f.key
                const count =
                  f.key === 'all'
                    ? stats.total
                    : f.key === 'pending'
                    ? stats.pending
                    : f.key === 'verified'
                    ? stats.verified
                    : stats.rejected
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
            )}
          </CardContent>
        </Card>

        {loading ? (
          <LinearProgress sx={{ mb: 2 }} />
        ) : null}

        {/* Products table */}
        {viewMode === 'products' ? (
          filteredProducts.length === 0 ? (
            <Card sx={{ bgcolor: colors.cardBackground, border: `1px solid ${colors.border}`, borderRadius: '8px', boxShadow: 'none' }}>
              <CardContent sx={{ textAlign: 'center', py: 8 }}>
                <ShoppingBag sx={{ fontSize: 64, color: colors.slate300, mb: 2 }} />
                <Typography variant="h6" sx={{ color: colors.textSecondary, fontWeight: 600 }}>
                  No shop products found
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
                        <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Seller</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Stock</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredProducts.map((p) => (
                        <TableRow key={p._id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar
                                src={p.images?.[0]?.url}
                                variant="rounded"
                                sx={{ width: 44, height: 44, borderRadius: '8px' }}
                              >
                                <Inventory2 />
                              </Avatar>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {p.title}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {p.sellerId?.name || p.sellerId?.shop?.shopName || '—'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={p.category || '—'} size="small" />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                              {formatProductPrice(p)}
                            </Typography>
                          </TableCell>
                          <TableCell>{p.stock ?? '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )
        ) : filteredApps.length === 0 ? (
          <Card
            sx={{
              bgcolor: colors.cardBackground,
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              boxShadow: 'none',
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <Code sx={{ fontSize: 64, color: colors.slate300, mb: 2 }} />
              <Typography variant="h6" sx={{ color: colors.textSecondary, fontWeight: 600 }}>
                No applications found
              </Typography>
              <Typography variant="body2" sx={{ color: colors.slate400, mt: 1 }}>
                {search ? 'Try adjusting your search' : 'No applications match the selected filter'}
              </Typography>
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
                      <TableCell sx={{ fontWeight: 700, color: colors.textPrimary }}>Application</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: colors.textPrimary }}>Seller</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: colors.textPrimary }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: colors.textPrimary }}>Price</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: colors.textPrimary }}>Engagement</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: colors.textPrimary }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: colors.textPrimary }}>Submitted</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: colors.textPrimary }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredApps.map((app) => {
                      const statusConfig =
                        STATUS_CONFIG[app.verificationStatus] || STATUS_CONFIG.pending
                      const img =
                        app.appIcon?.url ||
                        app.screenshots?.[0]?.url ||
                        app.screenshots?.[0]?.uri
                      const isLoading = actionLoading === app._id

                      return (
                        <TableRow
                          key={app._id}
                          hover
                          sx={{ '&:hover': { bgcolor: colors.slate50 }, cursor: 'pointer' }}
                          onClick={() => navigate(`/admin/applications/${app._id}`)}
                        >
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar
                                src={img}
                                variant="rounded"
                                sx={{
                                  width: 44,
                                  height: 44,
                                  bgcolor: colors.primaryBg,
                                  color: colors.primary,
                                  borderRadius: '8px',
                                }}
                              >
                                <Code sx={{ fontSize: 22 }} />
                              </Avatar>
                              <Box sx={{ minWidth: 0 }}>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 600, color: colors.textPrimary }}
                                  noWrap
                                >
                                  {app.appName || 'Untitled'}
                                </Typography>
                                <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                                  ID: {app._id.slice(-6).toUpperCase()}
                                </Typography>
                                {app.badges?.length > 0 && (
                                  <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                                    {app.badges.slice(0, 2).map((badge) => (
                                      <Chip
                                        key={badge}
                                        label={badge}
                                        size="small"
                                        sx={{
                                          height: 18,
                                          fontSize: 10,
                                          bgcolor: colors.slate100,
                                          color: colors.slate600,
                                        }}
                                      />
                                    ))}
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: colors.textPrimary }}>
                              {app.sellerId?.name || 'Unknown'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                              {app.sellerId?.email || '—'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={app.appCategory || 'Other'}
                              size="small"
                              sx={{
                                bgcolor: colors.infoBg,
                                color: colors.infoText,
                                fontWeight: 600,
                                maxWidth: 160,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AttachMoney sx={{ fontSize: 14, color: colors.textSecondary }} />
                              <Typography variant="body2" sx={{ fontWeight: 700, color: colors.textPrimary }}>
                                {formatPrice(app)}
                              </Typography>
                            </Box>
                            {app.completionScore > 0 && (
                              <Typography variant="caption" sx={{ color: colors.info, fontWeight: 600 }}>
                                {app.completionScore}% complete
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
                              <Visibility sx={{ fontSize: 12, color: colors.textSecondary }} />
                              <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                                {(app.views || 0).toLocaleString()} views
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Download sx={{ fontSize: 12, color: colors.textSecondary }} />
                              <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                                {(app.downloads || 0).toLocaleString()} downloads
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={statusConfig.label}
                              color={statusConfig.color}
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                            {app.adminRating > 0 && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, mt: 0.5 }}>
                                <Star sx={{ fontSize: 14, color: colors.warning }} />
                                <Typography variant="caption" sx={{ fontWeight: 600, color: colors.textSecondary }}>
                                  {app.adminRating}/5
                                </Typography>
                              </Box>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                              {app.createdAt
                                ? new Date(app.createdAt).toLocaleDateString()
                                : '—'}
                            </Typography>
                          </TableCell>
                          <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                            {isLoading ? (
                              <CircularProgress size={20} />
                            ) : (
                              <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                                {app.verificationStatus === 'pending' && (
                                  <>
                                    <Tooltip title="Verify">
                                      <IconButton
                                        size="small"
                                        onClick={() => openConfirmDialog(app, 'verified')}
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
                                        onClick={() => openConfirmDialog(app, 'rejected')}
                                        sx={{
                                          color: colors.error,
                                          '&:hover': { bgcolor: colors.errorBg },
                                        }}
                                      >
                                        <Cancel sx={{ fontSize: 18 }} />
                                      </IconButton>
                                    </Tooltip>
                                  </>
                                )}
                                <Tooltip title="Full review">
                                  <IconButton
                                    size="small"
                                    onClick={() => navigate(`/admin/applications/${app._id}`)}
                                    sx={{
                                      color: colors.primary,
                                      '&:hover': { bgcolor: colors.primaryBg },
                                    }}
                                  >
                                    <Visibility sx={{ fontSize: 18 }} />
                                  </IconButton>
                                </Tooltip>
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

      {/* Confirmation dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, app: null, action: null })}
        PaperProps={{
          sx: { borderRadius: '12px', border: `1px solid ${colors.border}` },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: colors.textPrimary }}>
          {getDialogContent().title}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: colors.textSecondary }}>{getDialogContent().content}</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setConfirmDialog({ open: false, app: null, action: null })}
            sx={{ textTransform: 'none', color: colors.textSecondary }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReviewAction}
            variant="contained"
            color={confirmDialog.action === 'rejected' ? 'error' : 'primary'}
            sx={{
              textTransform: 'none',
              ...(confirmDialog.action !== 'rejected' && {
                bgcolor: colors.primary,
                '&:hover': { bgcolor: colors.primaryDark },
              }),
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminApplicationManagement
