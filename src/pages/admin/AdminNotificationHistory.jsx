import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
} from '@mui/material'
import {
  NotificationsOff,
  Public,
  People,
  Store,
  Delete,
  Send,
  CheckCircle,
  Cancel,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const TARGET_META = {
  all: { label: 'Everyone', color: 'info', icon: Public },
  users: { label: 'Customers', color: 'secondary', icon: People },
  sellers: { label: 'Sellers', color: 'success', icon: Store },
}

const AdminNotificationHistory = () => {
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [confirmDialog, setConfirmDialog] = useState(false)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    try {
      const raw = localStorage.getItem('pushNotificationHistory')
      if (raw) setHistory(JSON.parse(raw))
    } catch (error) {
      console.error('Failed to load history:', error)
    }
  }

  const clearHistory = () => {
    localStorage.removeItem('pushNotificationHistory')
    setHistory([])
    setConfirmDialog(false)
    toast.success('History cleared')
  }

  const formatDate = (iso) =>
    new Date(iso).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const totalSent = history.reduce((sum, item) => sum + (item.sent || 0), 0)
  const successful = history.filter((h) => h.sent > 0).length

  if (history.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: 3,
            bgcolor: 'background.default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          <NotificationsOff sx={{ fontSize: 44, color: 'text.disabled' }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
          No History Yet
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Notifications you send will appear here.
        </Typography>
        <Button
          variant="contained"
          startIcon={<Send />}
          onClick={() => navigate('/admin/notifications')}
        >
          Send a Notification
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Notification History
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {history.length} notifications sent
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Delete />}
          onClick={() => setConfirmDialog(true)}
        >
          Clear All
        </Button>
      </Box>

      {/* Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main' }}>
                {history.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Campaigns
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 800, color: 'success.main' }}>
                {totalSent}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Delivered
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 800, color: 'secondary.main' }}>
                {successful}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Successful
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* History List */}
      <Grid container spacing={2}>
        {history.map((item) => {
          const meta = TARGET_META[item.target] || TARGET_META.all
          const Icon = meta.icon
          const success = item.sent > 0

          return (
            <Grid item xs={12} key={item.id}>
              <Card
                sx={{
                  borderLeft: 4,
                  borderColor: `${meta.color}.main`,
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: `${meta.color}.light`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon sx={{ color: `${meta.color}.main` }} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap>
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {item.body}
                      </Typography>
                    </Box>
                    <Chip
                      icon={success ? <CheckCircle /> : <Cancel />}
                      label={`${item.sent} sent`}
                      size="small"
                      color={success ? 'success' : 'error'}
                    />
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                    <Chip
                      label={meta.label}
                      size="small"
                      color={meta.color}
                      variant="outlined"
                    />
                    {item.failed > 0 && (
                      <Chip
                        label={`${item.failed} failed`}
                        size="small"
                        color="error"
                        variant="outlined"
                      />
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                      {formatDate(item.sentAt)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Clear History</DialogTitle>
        <DialogContent>
          <Typography>Remove all notification history? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
          <Button onClick={clearHistory} variant="contained" color="error">
            Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminNotificationHistory
