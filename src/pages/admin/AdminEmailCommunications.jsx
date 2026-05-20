import { useState, useEffect, useMemo } from 'react'
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
  LinearProgress,
  Breadcrumbs,
  Link,
  Alert,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'
import {
  Search,
  Refresh,
  NavigateNext,
  Send,
  Email,
  Store,
  People,
  CheckCircle,
  ErrorOutline,
  MarkEmailRead,
} from '@mui/icons-material'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { colors } from '../../theme/tokens'

const SELLER_TEMPLATES = [
  {
    subject: 'Important update for VettCode sellers',
    message:
      'We have an important platform update for all sellers. Please log in to your seller dashboard to review the latest changes and ensure your shop profile is up to date.',
  },
  {
    subject: 'Complete your shop setup',
    message:
      'Your seller account is almost ready. Please complete your shop setup, payment details, and upload your first application to start selling on VettCode.',
  },
  {
    subject: 'Application review reminder',
    message:
      'Our team is reviewing seller applications. If you have a pending submission, please check your dashboard for any required updates.',
  },
]

const USER_TEMPLATES = [
  {
    subject: 'Welcome to VettCode',
    message:
      'Thank you for joining VettCode! Explore verified applications, secure downloads, and great deals from trusted sellers.',
  },
  {
    subject: 'New apps available on VettCode',
    message:
      'Fresh applications have been added to the marketplace. Visit VettCode today to discover new tools and solutions.',
  },
  {
    subject: 'Your VettCode account',
    message:
      'This is a message from the VettCode team regarding your customer account. If you have questions, reply to this email or contact support.',
  },
]

const SELLER_STATUS_FILTERS = [
  { key: 'all', label: 'All statuses' },
  { key: 'active', label: 'Active' },
  { key: 'pending', label: 'Pending' },
  { key: 'suspended', label: 'Suspended' },
]

const AdminEmailCommunications = ({ audience = 'sellers' }) => {
  const navigate = useNavigate()
  const isSellers = audience === 'sellers'

  const [smtpStatus, setSmtpStatus] = useState(null)
  const [recipients, setRecipients] = useState([])
  const [loadingRecipients, setLoadingRecipients] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [includeBanned, setIncludeBanned] = useState(false)
  const [recipientMode, setRecipientMode] = useState('all')
  const [selectedIds, setSelectedIds] = useState([])
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [lastResult, setLastResult] = useState(null)

  const basePath = isSellers ? '/admin/communications/sellers' : '/admin/communications/users'
  const recipientsPath = isSellers
    ? '/admin/communications/sellers/recipients'
    : '/admin/communications/users/recipients'
  const sendPath = isSellers
    ? '/admin/communications/sellers/send'
    : '/admin/communications/users/send'
  const templates = isSellers ? SELLER_TEMPLATES : USER_TEMPLATES
  const historyKey = isSellers ? 'adminSellerEmailHistory' : 'adminUserEmailHistory'

  const getToken = () => localStorage.getItem('adminToken')
  const headers = () => ({ Authorization: `Bearer ${getToken()}` })

  const fetchSmtpStatus = async () => {
    try {
      const res = await api.get('/admin/communications/smtp-status', { headers: headers() })
      if (res.data.success) setSmtpStatus(res.data)
    } catch {
      setSmtpStatus({ configured: false, ready: false, error: 'Could not verify SMTP' })
    }
  }

  const fetchRecipients = async () => {
    setLoadingRecipients(true)
    try {
      const params = new URLSearchParams()
      if (search.trim()) params.set('search', search.trim())
      if (isSellers && statusFilter !== 'all') params.set('status', statusFilter)
      if (!isSellers && includeBanned) params.set('includeBanned', 'true')

      const res = await api.get(`${recipientsPath}?${params}`, { headers: headers() })
      if (res.data.success) {
        setRecipients(res.data.recipients || [])
        if (recipientMode === 'selected') {
          const ids = new Set((res.data.recipients || []).map((r) => r.id))
          setSelectedIds((prev) => prev.filter((id) => ids.has(id)))
        }
      }
    } catch {
      toast.error('Failed to load recipients')
    } finally {
      setLoadingRecipients(false)
    }
  }

  useEffect(() => {
    fetchSmtpStatus()
  }, [])

  useEffect(() => {
    const t = setTimeout(() => fetchRecipients(), 350)
    return () => clearTimeout(t)
  }, [search, statusFilter, includeBanned, isSellers])

  const selectedRecipients = useMemo(() => {
    if (recipientMode === 'all') return recipients
    return recipients.filter((r) => selectedIds.includes(r.id))
  }, [recipientMode, recipients, selectedIds])

  const recipientCount =
    recipientMode === 'all' ? recipients.length : selectedIds.length

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === recipients.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(recipients.map((r) => r.id))
    }
  }

  const applyTemplate = (tpl) => {
    setSubject(tpl.subject)
    setMessage(tpl.message)
  }

  const handleSend = async () => {
    if (!subject.trim()) {
      toast.error('Enter an email subject')
      return
    }
    if (!message.trim()) {
      toast.error('Enter an email message')
      return
    }
    if (recipientCount === 0) {
      toast.error('Select at least one recipient')
      return
    }

    setSending(true)
    setConfirmOpen(false)

    try {
      const payload = {
        subject: subject.trim(),
        message: message.trim(),
        recipientMode,
        recipientIds: recipientMode === 'selected' ? selectedIds : [],
      }
      if (isSellers) payload.statusFilter = statusFilter
      else payload.includeBanned = includeBanned

      const res = await api.post(sendPath, payload, { headers: headers() })

      if (res.data.success || res.data.sent > 0) {
        setLastResult(res.data)
        toast.success(`Sent ${res.data.sent} of ${res.data.total} emails`)
        try {
          const raw = localStorage.getItem(historyKey)
          const history = raw ? JSON.parse(raw) : []
          history.unshift({
            subject: subject.trim(),
            message: message.trim(),
            sent: res.data.sent,
            failed: res.data.failed,
            total: res.data.total,
            recipientMode,
            at: new Date().toISOString(),
          })
          localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 20)))
        } catch {
          /* ignore */
        }
      } else {
        toast.error(res.data.error || 'No emails were sent')
        setLastResult(res.data)
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send emails')
    } finally {
      setSending(false)
    }
  }

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
            {isSellers ? 'Seller Email Communications' : 'User Email Communications'}
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
              {isSellers ? 'Seller Email Communications' : 'User Email Communications'}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary, mt: 0.5 }}>
              Send emails via Gmail SMTP configured in your server environment
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => {
              fetchSmtpStatus()
              fetchRecipients()
            }}
            sx={{ textTransform: 'none', borderColor: colors.border, color: colors.textSecondary }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <Box sx={{ px: 3, pb: 4 }}>
        {smtpStatus && (
          <Alert
            severity={smtpStatus.ready ? 'success' : smtpStatus.configured ? 'warning' : 'error'}
            icon={smtpStatus.ready ? <MarkEmailRead /> : <ErrorOutline />}
            sx={{ mb: 3, borderRadius: '8px' }}
          >
            {smtpStatus.ready ? (
              <>
                SMTP is ready. Emails will be sent from{' '}
                <strong>{smtpStatus.fromEmail || 'your configured Gmail account'}</strong>
                {smtpStatus.service ? ` (${smtpStatus.service})` : ''}.
              </>
            ) : smtpStatus.configured ? (
              <>SMTP credentials are set but the connection failed: {smtpStatus.error}</>
            ) : (
              <>
                SMTP is not configured. Add <strong>SMTP_USER</strong>, <strong>SMTP_PASS</strong>,{' '}
                <strong>SMTP_HOST</strong>, and <strong>SMTP_PORT</strong> to your backend .env file.
              </>
            )}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} lg={5}>
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
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: colors.textPrimary }}>
                  Recipients
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={`All (${recipients.length})`}
                    onClick={() => setRecipientMode('all')}
                    sx={{
                      fontWeight: recipientMode === 'all' ? 700 : 500,
                      bgcolor: recipientMode === 'all' ? colors.primaryBg : colors.pageBackground,
                      color: recipientMode === 'all' ? colors.primary : colors.textSecondary,
                      border: `1px solid ${recipientMode === 'all' ? colors.primary : colors.border}`,
                    }}
                  />
                  <Chip
                    label={`Selected (${selectedIds.length})`}
                    onClick={() => setRecipientMode('selected')}
                    sx={{
                      fontWeight: recipientMode === 'selected' ? 700 : 500,
                      bgcolor: recipientMode === 'selected' ? colors.primaryBg : colors.pageBackground,
                      color: recipientMode === 'selected' ? colors.primary : colors.textSecondary,
                      border: `1px solid ${recipientMode === 'selected' ? colors.primary : colors.border}`,
                    }}
                  />
                </Box>

                <TextField
                  fullWidth
                  size="small"
                  placeholder={isSellers ? 'Search sellers...' : 'Search users...'}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ fontSize: 18, color: colors.textSecondary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: colors.pageBackground,
                      '& fieldset': { borderColor: colors.border },
                    },
                  }}
                />

                {isSellers ? (
                  <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
                    {SELLER_STATUS_FILTERS.map((f) => (
                      <Chip
                        key={f.key}
                        size="small"
                        label={f.label}
                        onClick={() => setStatusFilter(f.key)}
                        sx={{
                          bgcolor: statusFilter === f.key ? colors.primaryBg : colors.pageBackground,
                          color: statusFilter === f.key ? colors.primary : colors.textSecondary,
                          border: `1px solid ${statusFilter === f.key ? colors.primary : colors.border}`,
                        }}
                      />
                    ))}
                  </Box>
                ) : (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={includeBanned}
                        onChange={(e) => setIncludeBanned(e.target.checked)}
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                        Include banned users
                      </Typography>
                    }
                    sx={{ mb: 1 }}
                  />
                )}

                {recipientMode === 'selected' && recipients.length > 0 && (
                  <Button size="small" onClick={toggleSelectAll} sx={{ textTransform: 'none', mb: 1 }}>
                    {selectedIds.length === recipients.length ? 'Deselect all' : 'Select all'}
                  </Button>
                )}

                {loadingRecipients ? (
                  <LinearProgress
                    sx={{
                      my: 2,
                      bgcolor: colors.border,
                      '& .MuiLinearProgress-bar': { bgcolor: colors.primary },
                    }}
                  />
                ) : (
                  <List
                    dense
                    sx={{
                      maxHeight: 360,
                      overflow: 'auto',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      bgcolor: colors.pageBackground,
                    }}
                  >
                    {recipients.length === 0 ? (
                      <ListItem>
                        <ListItemText
                          primary="No recipients found"
                          secondary="Adjust search or filters"
                        />
                      </ListItem>
                    ) : (
                      recipients.map((r) => (
                        <ListItem key={r.id} disablePadding divider>
                          <ListItemButton
                            onClick={() => recipientMode === 'selected' && toggleSelect(r.id)}
                            dense
                          >
                            {recipientMode === 'selected' && (
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                <Checkbox
                                  edge="start"
                                  checked={selectedIds.includes(r.id)}
                                  tabIndex={-1}
                                  size="small"
                                />
                              </ListItemIcon>
                            )}
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              {isSellers ? (
                                <Store sx={{ fontSize: 18, color: colors.primary }} />
                              ) : (
                                <People sx={{ fontSize: 18, color: colors.info }} />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={r.name || r.email}
                              secondary={
                                isSellers
                                  ? `${r.email} · ${r.status || '—'}`
                                  : `${r.email}${r.isBanned ? ' · banned' : ''}`
                              }
                              primaryTypographyProps={{ fontSize: 13, fontWeight: 600 }}
                              secondaryTypographyProps={{ fontSize: 11 }}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))
                    )}
                  </List>
                )}

                <Typography variant="caption" sx={{ color: colors.slate400, mt: 1.5, display: 'block' }}>
                  {recipientMode === 'all'
                    ? `${recipients.length} recipient(s) will receive this email`
                    : `${selectedIds.length} selected recipient(s)`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={7}>
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
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: colors.textPrimary }}>
                  Compose email
                </Typography>

                <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 1 }}>
                  Quick templates
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {templates.map((tpl, i) => (
                    <Chip
                      key={i}
                      label={tpl.subject}
                      size="small"
                      onClick={() => applyTemplate(tpl)}
                      sx={{
                        cursor: 'pointer',
                        bgcolor: colors.pageBackground,
                        border: `1px solid ${colors.border}`,
                        maxWidth: '100%',
                      }}
                    />
                  ))}
                </Box>

                <TextField
                  fullWidth
                  label="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  multiline
                  minRows={10}
                  placeholder="Write your message to recipients..."
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': { bgcolor: colors.pageBackground },
                  }}
                />

                <Button
                  variant="contained"
                  size="large"
                  startIcon={sending ? <CircularProgress size={18} color="inherit" /> : <Send />}
                  disabled={sending || !smtpStatus?.ready || recipientCount === 0}
                  onClick={() => setConfirmOpen(true)}
                  sx={{
                    textTransform: 'none',
                    bgcolor: colors.primary,
                    '&:hover': { bgcolor: colors.primaryDark },
                  }}
                >
                  {sending ? 'Sending...' : `Send to ${recipientCount} recipient(s)`}
                </Button>
              </CardContent>
            </Card>

            {lastResult && (
              <Card
                sx={{
                  bgcolor: colors.cardBackground,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  boxShadow: 'none',
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                    Last send result
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                    Sent: {lastResult.sent} · Failed: {lastResult.failed} · Total: {lastResult.total}
                  </Typography>
                  {lastResult.results?.some((r) => !r.success) && (
                    <>
                      <Divider sx={{ my: 1.5 }} />
                      <Typography variant="caption" sx={{ color: colors.error, fontWeight: 600 }}>
                        Failed deliveries:
                      </Typography>
                      {lastResult.results
                        .filter((r) => !r.success)
                        .slice(0, 5)
                        .map((r) => (
                          <Typography key={r.email} variant="caption" display="block" sx={{ color: colors.textSecondary }}>
                            {r.email}: {r.error}
                          </Typography>
                        ))}
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Box>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm send</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: colors.textSecondary }}>
            Send &quot;{subject}&quot; to <strong>{recipientCount}</strong>{' '}
            {isSellers ? 'seller(s)' : 'user(s)'} via Gmail SMTP?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSend}
            startIcon={<Email />}
            sx={{ textTransform: 'none', bgcolor: colors.primary }}
          >
            Send emails
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminEmailCommunications
