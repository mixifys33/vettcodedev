import { useState, useEffect } from 'react'
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
  ToggleButtonGroup,
  ToggleButton,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material'
import {
  Send,
  People,
  Store,
  Public,
  Notifications,
  History,
  FlashOn,
} from '@mui/icons-material'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const TARGETS = [
  { key: 'all', label: 'Everyone', icon: Public, color: 'info' },
  { key: 'users', label: 'Customers', icon: People, color: 'secondary' },
  { key: 'sellers', label: 'Sellers', icon: Store, color: 'success' },
]

const TEMPLATES = [
  { title: '🛍️ Flash Sale Alert!', body: "Huge discounts are live right now on vettcode. Shop before they're gone!", target: 'users' },
  { title: '📦 New Products Available', body: 'Fresh arrivals just landed on vettcode. Check out the latest products!', target: 'users' },
  { title: '🎉 Welcome to vettcode!', body: 'Thank you for joining vettcode. Discover thousands of products at great prices.', target: 'users' },
  { title: '📊 Seller Dashboard Update', body: 'Important update for all vettcode sellers. Please check your dashboard.', target: 'sellers' },
  { title: '✅ New Feature Available', body: "We've added exciting new features to your seller dashboard. Check it out!", target: 'sellers' },
  { title: '🔔 Platform Announcement', body: 'Important announcement from vettcode. Please read the latest update.', target: 'all' },
]

const AdminPushNotifications = () => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [target, setTarget] = useState('all')
  const [sending, setSending] = useState(false)
  const [tokenStats, setTokenStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [sentHistory, setSentHistory] = useState([])
  const [showTemplates, setShowTemplates] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState(false)

  useEffect(() => {
    fetchTokenStats()
    loadHistory()
  }, [])

  const fetchTokenStats = async () => {
    try {
      const secret = localStorage.getItem('adminSecret')
      const response = await api.get('/push-tokens/stats', {
        headers: { 'x-admin-key': secret || '' },
      })
      if (response.data.success) {
        setTokenStats(response.data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch token stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  const loadHistory = () => {
    try {
      const raw = localStorage.getItem('pushNotificationHistory')
      if (raw) setSentHistory(JSON.parse(raw))
    } catch (error) {
      console.error('Failed to load history:', error)
    }
  }

  const applyTemplate = (tpl) => {
    setTitle(tpl.title)
    setBody(tpl.body)
    setTarget(tpl.target)
    setShowTemplates(false)
  }

  const handleSend = async () => {
    if (!title.trim()) {
      toast.error('Please enter a notification title')
      return
    }
    if (!body.trim()) {
      toast.error('Please enter a notification message')
      return
    }

    setSending(true)
    setConfirmDialog(false)

    try {
      const secret = localStorage.getItem('adminSecret')
      const endpoint =
        target === 'sellers'
          ? '/push-tokens/send-to-sellers'
          : target === 'users'
          ? '/push-tokens/send-to-users'
          : '/push-tokens/broadcast'

      const response = await api.post(
        endpoint,
        {
          title,
          body,
          data: { type: 'admin_broadcast' },
          adminKey: secret,
        },
        {
          headers: { 'x-admin-key': secret || '' },
        }
      )

      if (response.data.success) {
        const entry = {
          id: Date.now().toString(),
          title,
          body,
          target,
          sent: response.data.sent,
          failed: response.data.failed,
          sentAt: new Date().toISOString(),
        }
        const updated = [entry, ...sentHistory].slice(0, 20)
        setSentHistory(updated)
        localStorage.setItem('pushNotificationHistory', JSON.stringify(updated))

        toast.success(`Delivered to ${response.data.sent} device${response.data.sent !== 1 ? 's' : ''}!`)
        setTitle('')
        setBody('')
      } else {
        toast.error(response.data.error || 'Could not send. Please try again.')
      }
    } catch (error) {
      toast.error('Network error. Check your connection.')
    } finally {
      setSending(false)
    }
  }

  const getReach = () => {
    if (!tokenStats) return '—'
    if (target === 'all') return tokenStats.total
    if (target === 'users') return tokenStats.byUserType?.users ?? 0
    if (target === 'sellers') return tokenStats.byUserType?.sellers ?? 0
    return 0
  }

  const selectedTarget = TARGETS.find((t) => t.key === target)

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Push Notifications
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Broadcast to your audience
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statsLoading ? (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          </Grid>
        ) : (
          TARGETS.map((opt) => {
            const Icon = opt.icon
            const value =
              opt.key === 'all'
                ? tokenStats?.total ?? 0
                : opt.key === 'users'
                ? tokenStats?.byUserType?.users ?? 0
                : tokenStats?.byUserType?.sellers ?? 0

            return (
              <Grid item xs={12} sm={4} key={opt.key}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: `${opt.color}.light`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 1,
                      }}
                    >
                      <Icon sx={{ color: `${opt.color}.main` }} />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: `${opt.color}.main` }}>
                      {value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {opt.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )
          })
        )}
      </Grid>

      {/* Compose */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Notifications color="secondary" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Compose Notification
              </Typography>
            </Box>
            <Button
              size="small"
              startIcon={<FlashOn />}
              onClick={() => setShowTemplates(!showTemplates)}
              variant="outlined"
              color="secondary"
            >
              Templates
            </Button>
          </Box>

          {showTemplates && (
            <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'text.secondary', mb: 1, display: 'block' }}>
                Quick Templates
              </Typography>
              <List dense>
                {TEMPLATES.map((tpl, i) => (
                  <Box key={i}>
                    <ListItem
                      button
                      onClick={() => applyTemplate(tpl)}
                      sx={{ borderRadius: 1 }}
                    >
                      <ListItemText
                        primary={tpl.title}
                        secondary={tpl.body}
                        primaryTypographyProps={{ fontWeight: 600 }}
                        secondaryTypographyProps={{ noWrap: true }}
                      />
                      <Chip label={tpl.target} size="small" color={tpl.target === 'users' ? 'secondary' : tpl.target === 'sellers' ? 'success' : 'info'} />
                    </ListItem>
                    {i < TEMPLATES.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </Box>
          )}

          <TextField
            fullWidth
            label="Notification Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Flash Sale Alert! 🛍️"
            inputProps={{ maxLength: 100 }}
            helperText={`${title.length}/100`}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Message *"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your notification message here..."
            multiline
            rows={4}
            inputProps={{ maxLength: 300 }}
            helperText={`${body.length}/300`}
            sx={{ mb: 3 }}
          />

          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Send To
          </Typography>
          <ToggleButtonGroup
            value={target}
            exclusive
            onChange={(e, newValue) => newValue && setTarget(newValue)}
            fullWidth
            sx={{ mb: 3 }}
          >
            {TARGETS.map((opt) => {
              const Icon = opt.icon
              return (
                <ToggleButton key={opt.key} value={opt.key}>
                  <Icon sx={{ mr: 1, fontSize: 20 }} />
                  {opt.label}
                </ToggleButton>
              )
            })}
          </ToggleButtonGroup>

          <Alert severity="info" icon={<Notifications />} sx={{ mb: 3 }}>
            Estimated reach: <strong>{getReach()} devices</strong>
          </Alert>

          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={sending ? <CircularProgress size={20} color="inherit" /> : <Send />}
            onClick={() => setConfirmDialog(true)}
            disabled={sending || !title.trim() || !body.trim()}
            sx={{ py: 1.5 }}
          >
            {sending ? 'Sending...' : 'Send Notification'}
          </Button>
        </CardContent>
      </Card>

      {/* History */}
      {sentHistory.length > 0 && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <History color="info" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Recent Sent
              </Typography>
            </Box>
            <List>
              {sentHistory.slice(0, 5).map((item, index) => {
                const targetConfig = TARGETS.find((t) => t.key === item.target)
                return (
                  <Box key={item.id}>
                    <ListItem>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: `${targetConfig?.color}.main`,
                          mr: 2,
                        }}
                      />
                      <ListItemText
                        primary={item.title}
                        secondary={`${new Date(item.sentAt).toLocaleString()} · ${item.sent} sent`}
                        primaryTypographyProps={{ fontWeight: 600, noWrap: true }}
                      />
                      <Chip
                        label={item.sent > 0 ? '✓' : '✗'}
                        size="small"
                        color={item.sent > 0 ? 'success' : 'error'}
                      />
                    </ListItem>
                    {index < Math.min(sentHistory.length, 5) - 1 && <Divider />}
                  </Box>
                )
              })}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Confirm Send</DialogTitle>
        <DialogContent>
          <Typography>
            Send "{title}" to {selectedTarget?.label}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
          <Button onClick={handleSend} variant="contained" color="primary">
            Send Now
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminPushNotifications
