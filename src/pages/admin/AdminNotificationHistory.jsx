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
  Breadcrumbs,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  NavigateNext,
  History,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { colors } from '../../theme/tokens'

const TARGET_META = {
  all: { label: 'Everyone', color: colors.info, bgColor: colors.infoBg, icon: Public },
  users: { label: 'Customers', color: colors.primary, bgColor: colors.primaryBg, icon: People },
  sellers: { label: 'Sellers', color: colors.success, bgColor: colors.successBg, icon: Store },
}

const StatCard = ({ title, value, subtitle, icon: Icon, color, bgColor }) => (
  <Card sx={{ bgcolor: colors.cardBackground, border: `1px solid ${colors.border}`, borderRadius: '8px', boxShadow: 'none', height: '100%' }}>
    <CardContent sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="body2" sx={{ color: colors.textSecondary, fontWeight: 500 }}>{title}</Typography>
        <Box sx={{ width: 32, height: 32, borderRadius: '6px', bgcolor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
          <Icon sx={{ fontSize: 18 }} />
        </Box>
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 700, color: colors.textPrimary, fontSize: '26px' }}>{value}</Typography>
      {subtitle && <Typography variant="caption" sx={{ color: colors.slate400, mt: 0.5, display: 'block' }}>{subtitle}</Typography>}
    </CardContent>
  </Card>
)

const AdminNotificationHistory = () => {
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    try {
      const raw = localStorage.getItem('pushNotificationHistory')
      if (raw) setHistory(JSON.parse(raw))
    } catch {
      setHistory([])
    }
  }

  const clearHistory = () => {
    localStorage.removeItem('pushNotificationHistory')
    setHistory([])
    setConfirmOpen(false)
    toast.success('History cleared')
  }

  const formatDate = (iso) =>
    new Date(iso).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const totalSent = history.reduce((sum, item) => sum + (item.sent || 0), 0)
  const successful = history.filter((h) => (h.sent || 0) > 0).length

  return (
    <Box sx={{ bgcolor: colors.pageBackground, minHeight: '100vh' }}>
      <Box sx={{ bgcolor: colors.cardBackground, borderBottom: `1px solid ${colors.border}`, px: 3, py: 2, mb: 3 }}>
        <Breadcrumbs separator={<NavigateNext fontSize="small" sx={{ color: colors.slate400 }} />} sx={{ mb: 1 }}>
          <Link underline="hover" onClick={() => navigate('/admin/dashboard')} sx={{ color: colors.textSecondary, fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
            Dashboard
          </Link>
          <Link underline="hover" onClick={() => navigate('/admin/notifications')} sx={{ color: colors.textSecondary, fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
            Push Notifications
          </Link>
          <Typography sx={{ color: colors.textPrimary, fontSize: '14px', fontWeight: 600 }}>History</Typography>
        </Breadcrumbs>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: colors.textPrimary }}>Notification History</Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary, mt: 0.5 }}>
              Notifications sent from this browser session
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" startIcon={<Send />} onClick={() => navigate('/admin/notifications')} sx={{ textTransform: 'none', borderColor: colors.border }}>
              New notification
            </Button>
            {history.length > 0 && (
              <Button variant="outlined" color="error" startIcon={<Delete />} onClick={() => setConfirmOpen(true)} sx={{ textTransform: 'none' }}>
                Clear history
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: 3, pb: 4 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <StatCard title="Total sends" value={history.length} subtitle="Recorded in this browser" icon={History} color={colors.primary} bgColor={colors.primaryBg} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard title="Devices reached" value={totalSent} subtitle="Sum of delivered devices" icon={CheckCircle} color={colors.success} bgColor={colors.successBg} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard title="Successful campaigns" value={successful} subtitle="At least one device received" icon={Send} color={colors.info} bgColor={colors.infoBg} />
          </Grid>
        </Grid>

        {history.length === 0 ? (
          <Card sx={{ bgcolor: colors.cardBackground, border: `1px solid ${colors.border}`, borderRadius: '8px', boxShadow: 'none' }}>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <NotificationsOff sx={{ fontSize: 64, color: colors.slate300, mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary }}>No history yet</Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary, mt: 1, mb: 3 }}>
                Notifications you send will appear here.
              </Typography>
              <Button variant="contained" startIcon={<Send />} onClick={() => navigate('/admin/notifications')} sx={{ textTransform: 'none', bgcolor: colors.primary }}>
                Send a notification
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card sx={{ bgcolor: colors.cardBackground, border: `1px solid ${colors.border}`, borderRadius: '8px', boxShadow: 'none' }}>
            <CardContent sx={{ p: 0 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: colors.pageBackground }}>
                      <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Audience</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Delivered</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Sent at</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {history.map((item) => {
                      const meta = TARGET_META[item.target] || TARGET_META.all
                      const ok = (item.sent || 0) > 0
                      return (
                        <TableRow key={item.id} hover sx={{ '&:hover': { bgcolor: colors.slate50 } }}>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.title}</Typography>
                            <Typography variant="caption" sx={{ color: colors.textSecondary }}>{item.body}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={meta.label} size="small" sx={{ bgcolor: meta.bgColor, color: meta.color, fontWeight: 600 }} />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {item.sent ?? 0} / {item.total ?? item.sent ?? 0}
                            </Typography>
                            {(item.failed || 0) > 0 && (
                              <Typography variant="caption" sx={{ color: colors.error }}>
                                {item.failed} failed
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                              {formatDate(item.sentAt)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {ok ? (
                              <CheckCircle sx={{ color: colors.success, fontSize: 20 }} />
                            ) : (
                              <Cancel sx={{ color: colors.error, fontSize: 20 }} />
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

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} PaperProps={{ sx: { borderRadius: '12px' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Clear history?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: colors.textSecondary }}>This removes all notification history stored in your browser.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button variant="contained" color="error" onClick={clearHistory} sx={{ textTransform: 'none' }}>
            Clear
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminNotificationHistory
