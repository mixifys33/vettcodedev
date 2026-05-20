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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  InputAdornment,
  LinearProgress,
  Breadcrumbs,
  Link,
} from '@mui/material'
import {
  Send,
  People,
  Store,
  Public,
  Notifications,
  History,
  FlashOn,
  Refresh,
  NavigateNext,
  Smartphone,
} from '@mui/icons-material'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { colors } from '../../theme/tokens'

const TARGETS = [
  { key: 'all', label: 'Everyone', icon: Public, color: colors.info, bgColor: colors.infoBg },
  { key: 'users', label: 'Customers', icon: People, color: colors.primary, bgColor: colors.primaryBg },
  { key: 'sellers', label: 'Sellers', icon: Store, color: colors.success, bgColor: colors.successBg },
]

const TEMPLATES = [
  { title: 'Flash sale is live', body: 'Huge discounts are live on VettCode. Shop before they are gone!', target: 'users' },
  { title: 'New apps on VettCode', body: 'Fresh listings just landed. Discover new tools and solutions today.', target: 'users' },
  { title: 'Welcome to VettCode', body: 'Thanks for joining VettCode — explore verified apps and trusted sellers.', target: 'users' },
  { title: 'Seller dashboard update', body: 'Important update for sellers. Please check your dashboard.', target: 'sellers' },
  { title: 'New seller features', body: 'We added new tools to your seller dashboard. Log in to explore.', target: 'sellers' },
  { title: 'Platform announcement', body: 'Important announcement from the VettCode team. Open the app for details.', target: 'all' },
]

const StatCard = ({ title, value, subtitle, icon: Icon, color, bgColor }) => (
  <Card
    sx={{
      bgcolor: colors.cardBackground,
      border: `1px solid ${colors.border}`,
      borderRadius: '8px',
      boxShadow: 'none',
      height: '100%',
      cursor: 'pointer',
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

const AdminPushNotifications = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [target, setTarget] = useState('all')
  const [sending, setSending] = useState(false)
  const [tokenStats, setTokenStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [lastResult, setLastResult] = useState(null)

  const getToken = () => localStorage.getItem('adminToken')
  const headers = () => ({ Authorization: `Bearer ${getToken()}` })

  const fetchTokenStats = async () => {
    setStatsLoading(true)
    setStatsError(null)
    try {
      const res = await api.get('/admin/notifications/stats', { headers: headers() })
      if (res.data.success) {
        setTokenStats(res.data.stats)
      }
    } catch (err) {
      setStatsError(err.response?.data?.error || 'Could not load device stats')
    } finally {
      setStatsLoading(false)
    }
  }

  useEffect(() => {
    fetchTokenStats()
  }, [])

  const getReach = () => {
    if (!tokenStats) return 0
    if (target === 'all') return tokenStats.total ?? 0
    if (target === 'users') return tokenStats.byUserType?.users ?? 0
    if (target === 'sellers') return tokenStats.byUserType?.sellers ?? 0
    return 0
  }

  const applyTemplate = (tpl) => {
    setTitle(tpl.title)
    setBody(tpl.body)
    setTarget(tpl.target)
    toast.success('Template applied')
  }

  const saveToHistory = (entry) => {
    try {
      const raw = localStorage.getItem('pushNotificationHistory')
      const history = raw ? JSON.parse(raw) : []
      history.unshift(entry)
      localStorage.setItem('pushNotificationHistory', JSON.stringify(history.slice(0, 50)))
    } catch {
      /* ignore */
    }
  }

  const handleSend = async () => {
    if (!title.trim()) {
      toast.error('Enter a notification title')
      return
    }
    if (!body.trim()) {
      toast.error('Enter a notification message')
      return
    }

    setSending(true)
    setConfirmOpen(false)

    try {
      const res = await api.post(
        '/admin/notifications/send',
        {
          title: title.trim(),
          body: body.trim(),
          target,
          data: { type: 'admin_broadcast' },
        },
        { headers: headers() }
      )

      setLastResult(res.data)

      if (res.data.success || res.data.sent > 0) {
        saveToHistory({
          id: Date.now().toString(),
          title: title.trim(),
          body: body.trim(),
          target,
          sent: res.data.sent,
          failed: res.data.failed,
          total: res.data.total,
          sentAt: new Date().toISOString(),
        })
        toast.success(`Delivered to ${res.data.sent} device${res.data.sent !== 1 ? 's' : ''}`)
        setTitle('')
        setBody('')
        fetchTokenStats()
      } else {
        toast.error(res.data.error || 'No devices received the notification')
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to send notification'
      toast.error(msg)
      setLastResult(err.response?.data || { error: msg })
    } finally {
      setSending(false)
    }
  }

  const selectedTarget = TARGETS.find((t) => t.key === target)

  const statCards = TARGETS.map((opt) => ({
    ...opt,
    value:
      opt.key === 'all'
        ? tokenStats?.total ?? 0
        : opt.key === 'users'
        ? tokenStats?.byUserType?.users ?? 0
        : tokenStats?.byUserType?.sellers ?? 0,
    subtitle: opt.key === 'all' ? 'All registered devices' : `Tap to target ${opt.label.toLowerCase()}`,
    onClick: () => setTarget(opt.key),
    active: target === opt.key,
  }))

  return (
    <Box sx={{ bgcolor: colors.pageBackground, minHeight: '100vh' }}>
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
            Push Notifications
          </Typography>
        </Breadcrumbs>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: colors.textPrimary }}>
              Push Notifications
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary, mt: 0.5 }}>
              Send mobile push alerts to customers and sellers
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<History />}
              onClick={() => navigate('/admin/notifications/history')}
              sx={{ textTransform: 'none', borderColor: colors.border, color: colors.textSecondary }}
            >
              History
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchTokenStats}
              sx={{ textTransform: 'none', borderColor: colors.border, color: colors.textSecondary }}
            >
              Refresh
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: 3, pb: 4 }}>
        {statsError && (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: '8px' }}>
            {statsError}. Redeploy the latest backend if this persists.
          </Alert>
        )}

        {statsLoading ? (
          <LinearProgress
            sx={{ mb: 3, bgcolor: colors.border, '& .MuiLinearProgress-bar': { bgcolor: colors.primary } }}
          />
        ) : (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {statCards.map((c) => (
              <Grid item xs={12} sm={4} key={c.key}>
                <Box onClick={c.onClick}>
                  <StatCard
                    title={c.label}
                    value={c.value}
                    subtitle={c.subtitle}
                    icon={c.icon}
                    color={c.color}
                    bgColor={c.bgColor}
                  />
                  {c.active && (
                    <Chip
                      label="Selected audience"
                      size="small"
                      sx={{
                        mt: 1,
                        bgcolor: colors.primaryBg,
                        color: colors.primary,
                        fontWeight: 700,
                      }}
                    />
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} lg={7}>
            <Card
              sx={{
                bgcolor: colors.cardBackground,
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                boxShadow: 'none',
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: colors.textPrimary }}>
                  Compose notification
                </Typography>

                <TextField
                  fullWidth
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Flash sale is live"
                  inputProps={{ maxLength: 100 }}
                  helperText={`${title.length}/100`}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Message"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write your notification message..."
                  multiline
                  minRows={4}
                  inputProps={{ maxLength: 300 }}
                  helperText={`${body.length}/300`}
                  sx={{ mb: 2, '& .MuiOutlinedInput-root': { bgcolor: colors.pageBackground } }}
                />

                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: colors.textPrimary }}>
                  Send to
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {TARGETS.map((opt) => {
                    const Icon = opt.icon
                    const isActive = target === opt.key
                    return (
                      <Chip
                        key={opt.key}
                        icon={<Icon sx={{ fontSize: 16 }} />}
                        label={opt.label}
                        onClick={() => setTarget(opt.key)}
                        sx={{
                          fontWeight: isActive ? 700 : 500,
                          bgcolor: isActive ? colors.primaryBg : colors.pageBackground,
                          color: isActive ? colors.primary : colors.textSecondary,
                          border: `1px solid ${isActive ? colors.primary : colors.border}`,
                        }}
                      />
                    )
                  })}
                </Box>

                <Alert severity="info" icon={<Smartphone />} sx={{ mb: 2, borderRadius: '8px' }}>
                  Estimated reach: <strong>{getReach()} devices</strong>
                  {tokenStats?.byUserType?.guests > 0 && target === 'all' && (
                    <> ({tokenStats.byUserType.guests} guest devices)</>
                  )}
                </Alert>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={sending ? <CircularProgress size={18} color="inherit" /> : <Send />}
                  disabled={sending || !title.trim() || !body.trim()}
                  onClick={() => setConfirmOpen(true)}
                  sx={{
                    textTransform: 'none',
                    bgcolor: colors.primary,
                    '&:hover': { bgcolor: colors.primaryDark },
                  }}
                >
                  {sending ? 'Sending…' : `Send to ${selectedTarget?.label || 'audience'}`}
                </Button>
              </CardContent>
            </Card>

            {lastResult && (
              <Card
                sx={{
                  mt: 2,
                  bgcolor: colors.cardBackground,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  boxShadow: 'none',
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                    Last send result
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                    Sent: {lastResult.sent ?? 0} · Failed: {lastResult.failed ?? 0} · Total:{' '}
                    {lastResult.total ?? '—'}
                  </Typography>
                  {lastResult.error && (
                    <Alert severity="error" sx={{ mt: 1.5, borderRadius: '8px' }}>
                      {lastResult.error}
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}
          </Grid>

          <Grid item xs={12} lg={5}>
            <Card
              sx={{
                bgcolor: colors.cardBackground,
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                boxShadow: 'none',
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <FlashOn sx={{ color: colors.warning }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.textPrimary }}>
                    Quick templates
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {TEMPLATES.map((tpl, i) => (
                    <Box
                      key={i}
                      onClick={() => applyTemplate(tpl)}
                      sx={{
                        p: 1.5,
                        border: `1px solid ${colors.border}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        bgcolor: colors.pageBackground,
                        '&:hover': { borderColor: colors.primary, bgcolor: colors.primaryBg },
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 700, color: colors.textPrimary }}>
                        {tpl.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: colors.textSecondary,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {tpl.body}
                      </Typography>
                      <Chip label={tpl.target} size="small" sx={{ mt: 1, height: 22, fontSize: 11 }} />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        PaperProps={{ sx: { borderRadius: '12px', border: `1px solid ${colors.border}` } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm send</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: colors.textSecondary, mb: 1 }}>
            Send &quot;{title}&quot; to <strong>{selectedTarget?.label}</strong>?
          </Typography>
          <Typography variant="body2" sx={{ color: colors.textSecondary }}>
            Estimated reach: {getReach()} devices
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSend}
            sx={{ textTransform: 'none', bgcolor: colors.primary }}
          >
            Send now
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminPushNotifications
