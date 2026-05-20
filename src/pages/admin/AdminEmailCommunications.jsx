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
  Avatar,
} from '@mui/material'
import {
  Search,
  Refresh,
  NavigateNext,
  Send,
  Email,
  Store,
  People,
  ErrorOutline,
  MarkEmailRead,
  SelectAll,
  Deselect,
  ShoppingBag,
  InfoOutlined,
} from '@mui/icons-material'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { colors } from '../../theme/tokens'

const STOREFRONT_DEFAULT = 'https://vettcodedev.vercel.app'
const MAX_FEATURED = 6

const SELLER_TEMPLATES = [
  {
    id: 'seller-welcome',
    category: 'Onboarding',
    subject: 'Welcome to VettCode — your seller journey starts here',
    message: `We're thrilled to have you on VettCode, the marketplace built for developers and digital creators.

Here's what to do next:
• Complete your shop profile (logo, bio, and contact details)
• Connect your payout method so you can get paid
• Upload your first application and submit it for review

Our team reviews every listing to keep quality high. Most reviews are completed within 48 hours.

If you need help, reply to this email — we're here for you.`,
    ctaLabel: 'Open seller dashboard',
    ctaUrl: `${STOREFRONT_DEFAULT}/seller/dashboard`,
  },
  {
    id: 'seller-pending',
    category: 'Action required',
    subject: 'Action needed: finish your shop setup',
    message: `Your seller account is almost ready to go live.

We noticed a few items still need your attention:
• Shop branding (name, logo, banner)
• Payment / payout details
• At least one published application

Completing these steps helps buyers trust your store and improves your visibility in search.

Take a few minutes today to finish setup — your future customers are waiting.`,
    ctaLabel: 'Complete setup',
    ctaUrl: `${STOREFRONT_DEFAULT}/seller/dashboard`,
  },
  {
    id: 'seller-update',
    category: 'Announcement',
    subject: 'Important platform update for VettCode sellers',
    message: `We've rolled out updates to improve your selling experience on VettCode.

What's new:
• Faster application review workflow
• Improved analytics on your dashboard
• Better buyer messaging tools

Please log in and review any notifications on your dashboard. If any of your listings need updates, now is a great time to refresh screenshots and descriptions.

Thank you for being part of our seller community.`,
    ctaLabel: 'View dashboard',
    ctaUrl: `${STOREFRONT_DEFAULT}/seller/dashboard`,
  },
  {
    id: 'seller-promo',
    category: 'Promotion',
    subject: 'Boost your sales — tips from the VettCode team',
    message: `Want more eyes on your apps? Here are proven tips from top sellers on VettCode:

1. Use clear, high-quality screenshots and a strong app icon
2. Write a benefit-focused short description (what problem does it solve?)
3. Offer a limited-time launch discount for new listings
4. Respond quickly to buyer messages — it improves your ranking

We're featuring standout apps in our marketplace emails this month. Make sure your listings are up to date to be considered.`,
    ctaLabel: 'Manage my apps',
    ctaUrl: `${STOREFRONT_DEFAULT}/seller/applications`,
    suggestFeatured: true,
  },
]

const USER_TEMPLATES = [
  {
    id: 'user-welcome',
    category: 'Welcome',
    subject: 'Welcome to VettCode — discover apps you will love',
    message: `Thanks for joining VettCode!

You now have access to a curated marketplace of verified applications, secure downloads, and trusted sellers.

Here's what you can do:
• Browse apps by category or search
• Save favorites and get notified about deals
• Purchase with confidence — every listing is reviewed

Start exploring — we've highlighted some picks below that we think you'll enjoy.`,
    ctaLabel: 'Browse marketplace',
    ctaUrl: STOREFRONT_DEFAULT,
    suggestFeatured: true,
  },
  {
    id: 'user-new-apps',
    category: 'Promotion',
    subject: 'New on VettCode — fresh apps just dropped',
    message: `We've added exciting new applications to the marketplace this week.

From productivity tools to creative software, there's something for everyone. Featured listings are hand-picked by our team for quality and value.

Don't miss out — popular apps often sell out of launch discounts quickly.`,
    ctaLabel: 'Shop new arrivals',
    ctaUrl: STOREFRONT_DEFAULT,
    suggestFeatured: true,
  },
  {
    id: 'user-deal',
    category: 'Promotion',
    subject: 'Exclusive deals for VettCode members',
    message: `As a valued VettCode member, you get early access to deals on top-rated apps.

For a limited time, check out the featured products below — each one is verified and ready for instant download.

Happy shopping!`,
    ctaLabel: 'View deals',
    ctaUrl: STOREFRONT_DEFAULT,
    suggestFeatured: true,
  },
  {
    id: 'user-announce',
    category: 'Announcement',
    subject: 'An update from the VettCode team',
    message: `We wanted to share an important update with you about VettCode.

Our mission is to connect you with high-quality digital products from creators you can trust. If you have feedback or questions about your account, simply reply to this email.

Thank you for being part of our community.`,
  },
]

const SELLER_STATUS_FILTERS = [
  { key: 'all', label: 'All statuses' },
  { key: 'active', label: 'Active' },
  { key: 'pending', label: 'Pending' },
  { key: 'suspended', label: 'Suspended' },
]

const itemKey = (item) => `${item.type}:${item.id}`

const AdminEmailCommunications = ({ audience = 'sellers' }) => {
  const navigate = useNavigate()
  const isSellers = audience === 'sellers'

  const [smtpStatus, setSmtpStatus] = useState(null)
  const [recipients, setRecipients] = useState([])
  const [loadingRecipients, setLoadingRecipients] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [includeBanned, setIncludeBanned] = useState(false)
  const [sendToEveryone, setSendToEveryone] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [ctaLabel, setCtaLabel] = useState('')
  const [ctaUrl, setCtaUrl] = useState('')
  const [sending, setSending] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [lastResult, setLastResult] = useState(null)

  const [catalogItems, setCatalogItems] = useState([])
  const [catalogSearch, setCatalogSearch] = useState('')
  const [loadingCatalog, setLoadingCatalog] = useState(false)
  const [featuredItems, setFeaturedItems] = useState([])
  const [storefrontUrl, setStorefrontUrl] = useState(STOREFRONT_DEFAULT)

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
      const res = await api.get('/admin/communications/smtp-status', {
        headers: headers(),
        silentError: true,
        timeout: 12000,
      })
      if (res.data?.success) {
        setSmtpStatus(res.data)
      } else {
        setSmtpStatus({
          configured: false,
          ready: false,
          error: res.data?.error || 'Could not read SMTP status',
        })
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setSmtpStatus({
          configured: true,
          ready: true,
          verifyOk: false,
          error: 'Deploy latest backend — SMTP is read from server .env when you send',
        })
      } else if (err.code === 'ECONNABORTED') {
        setSmtpStatus({
          configured: true,
          ready: true,
          verifyOk: false,
          error: 'Status check timed out — you can still send if SMTP is set on the server',
        })
      } else {
        setSmtpStatus({
          configured: false,
          ready: false,
          error:
            err.response?.data?.error ||
            'Could not reach the API. Redeploy backend with communications routes.',
        })
      }
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
        const ids = new Set((res.data.recipients || []).map((r) => r.id))
        setSelectedIds((prev) => prev.filter((id) => ids.has(id)))
      }
    } catch {
      toast.error('Failed to load recipients')
    } finally {
      setLoadingRecipients(false)
    }
  }

  const fetchCatalog = async () => {
    setLoadingCatalog(true)
    try {
      const params = new URLSearchParams()
      if (catalogSearch.trim()) params.set('search', catalogSearch.trim())
      params.set('limit', '40')
      const res = await api.get(`/admin/communications/email-catalog?${params}`, {
        headers: headers(),
      })
      if (res.data.success) {
        setCatalogItems(res.data.items || [])
        if (res.data.storefrontUrl) setStorefrontUrl(res.data.storefrontUrl)
      }
    } catch {
      toast.error('Failed to load apps & products')
    } finally {
      setLoadingCatalog(false)
    }
  }

  useEffect(() => {
    fetchSmtpStatus()
    fetchCatalog()
  }, [])

  useEffect(() => {
    const t = setTimeout(() => fetchRecipients(), 350)
    return () => clearTimeout(t)
  }, [search, statusFilter, includeBanned, isSellers])

  useEffect(() => {
    const t = setTimeout(() => fetchCatalog(), 400)
    return () => clearTimeout(t)
  }, [catalogSearch])

  const recipientCount = useMemo(() => {
    if (sendToEveryone) return recipients.length
    return selectedIds.length
  }, [sendToEveryone, recipients.length, selectedIds.length])

  const sendBlockReason = useMemo(() => {
    if (sending) return null
    if (recipientCount === 0) {
      return 'Select recipients: check boxes in the list on the left, or enable “Email everyone in this list”.'
    }
    if (smtpStatus && !smtpStatus.configured && !smtpStatus.ready) {
      return (
        smtpStatus.error ||
        'SMTP not detected on the live server — add SMTP_USER and SMTP_PASS in Render (not just local .env).'
      )
    }
    return null
  }, [sending, smtpStatus, recipientCount])

  const canSend = recipientCount > 0 && !sending && sendBlockReason === null

  const toggleSelect = (id) => {
    setSendToEveryone(false)
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const selectAllVisible = () => {
    setSendToEveryone(false)
    setSelectedIds(recipients.map((r) => r.id))
  }

  const clearSelection = () => {
    setSendToEveryone(false)
    setSelectedIds([])
  }

  const toggleFeatured = (item) => {
    const key = itemKey(item)
    const exists = featuredItems.some((f) => itemKey(f) === key)
    if (exists) {
      setFeaturedItems((prev) => prev.filter((f) => itemKey(f) !== key))
      return
    }
    if (featuredItems.length >= MAX_FEATURED) {
      toast.error(`Maximum ${MAX_FEATURED} products/apps per email`)
      return
    }
    setFeaturedItems((prev) => [...prev, item])
  }

  const applyTemplate = (tpl) => {
    setSubject(tpl.subject)
    setMessage(tpl.message)
    setCtaLabel(tpl.ctaLabel || '')
    setCtaUrl(tpl.ctaUrl || '')
    if (tpl.suggestFeatured && featuredItems.length === 0 && catalogItems.length > 0) {
      setFeaturedItems(catalogItems.slice(0, 3))
      toast.success('Added top catalog items — adjust in "Include products" below')
    }
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
      toast.error('Select at least one recipient (check boxes or use "Email everyone")')
      return
    }

    setSending(true)
    setConfirmOpen(false)

    const uiLog = (step, detail) => {
      console.log(`[AdminEmail UI] ${step}`, detail ?? '')
    }

    try {
      uiLog('1/5 validate OK', { recipientCount, isSellers, sendToEveryone })
      const payload = {
        subject: subject.trim(),
        message: message.trim(),
        recipientMode: sendToEveryone ? 'all' : 'selected',
        recipientIds: sendToEveryone ? [] : selectedIds,
        featuredItems,
        ctaLabel: ctaLabel.trim() || undefined,
        ctaUrl: ctaUrl.trim() || undefined,
      }
      if (isSellers) payload.statusFilter = statusFilter
      else payload.includeBanned = includeBanned

      uiLog('2/5 POST start', { sendPath, recipients: recipientCount, featured: featuredItems.length })
      const postStarted = Date.now()

      const res = await api.post(sendPath, payload, {
        headers: headers(),
        timeout: 600000,
        silentError: true,
      })

      uiLog('3/5 POST response', {
        ms: Date.now() - postStarted,
        success: res.data?.success,
        sent: res.data?.sent,
        failed: res.data?.failed,
        error: res.data?.error,
      })

      if (res.data.results?.length) {
        res.data.results.forEach((r, i) => {
          uiLog(`4/5 result[${i}]`, {
            email: r.email,
            success: r.success,
            error: r.error,
          })
        })
      }

      if (res.data.success || res.data.sent > 0) {
        setLastResult(res.data)
        if (res.data.failed > 0) {
          toast.error(`Sent ${res.data.sent} of ${res.data.total}. ${res.data.failed} failed — see details below.`)
        } else {
          toast.success(`Sent ${res.data.sent} of ${res.data.total} emails`)
        }
        try {
          const raw = localStorage.getItem(historyKey)
          const history = raw ? JSON.parse(raw) : []
          history.unshift({
            subject: subject.trim(),
            sent: res.data.sent,
            failed: res.data.failed,
            total: res.data.total,
            featuredCount: featuredItems.length,
            at: new Date().toISOString(),
          })
          localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 20)))
        } catch {
          /* ignore */
        }
      } else {
        const failMsg = res.data.error || 'No emails were sent'
        toast.error(failMsg)
        setLastResult(res.data)
      }
    } catch (err) {
      console.error('[AdminEmail UI] 5/5 POST failed', {
        message: err.message,
        code: err.code,
        status: err.response?.status,
        data: err.response?.data,
      })
      const failMsg =
        err.response?.data?.error ||
        err.response?.data?.results?.find((r) => r.error)?.error ||
        (err.code === 'ECONNABORTED'
          ? 'Send timed out. Try 1 recipient first. Check Render logs for [AdminEmail] and [email][admin].'
          : null) ||
        err.message ||
        'Failed to send emails'
      toast.error(failMsg)
      if (err.response?.data) setLastResult(err.response.data)
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: colors.textPrimary }}>
              {isSellers ? 'Email Sellers' : 'Email Users'}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary, mt: 0.5 }}>
              Pick recipients with checkboxes, choose a template, optionally attach products
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => {
              fetchSmtpStatus()
              fetchRecipients()
              fetchCatalog()
            }}
            sx={{ textTransform: 'none', borderColor: colors.border, color: colors.textSecondary }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <Box sx={{ px: 3, pb: 4 }}>
        {smtpStatus === null ? (
          <Alert severity="info" sx={{ mb: 3, borderRadius: '8px' }}>
            Checking server email config… (credentials live in backend .env / Render, not in this app)
          </Alert>
        ) : (
          <Alert
            severity={smtpStatus.configured || smtpStatus.ready ? 'success' : 'warning'}
            icon={smtpStatus.configured || smtpStatus.ready ? <MarkEmailRead /> : <ErrorOutline />}
            sx={{ mb: 3, borderRadius: '8px' }}
          >
            {smtpStatus.configured || smtpStatus.ready ? (
              <>
                Server SMTP is configured
                {smtpStatus.fromEmail ? (
                  <>
                    {' '}
                    (from <strong>{smtpStatus.fromEmail}</strong>)
                  </>
                ) : null}
                . Emails are sent by the backend using <strong>SMTP_USER</strong> / <strong>SMTP_PASS</strong> — nothing
                is stored in the browser.
              </>
            ) : (
              <>
                {smtpStatus.error ||
                  'SMTP not found on the API server. Local backend/.env only applies when you run the API locally; on Render, add the same keys in the Render Environment tab.'}
              </>
            )}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Recipients */}
          <Grid item xs={12} lg={5}>
            <Card sx={{ bgcolor: colors.cardBackground, border: `1px solid ${colors.border}`, borderRadius: '8px', boxShadow: 'none', mb: 3 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: colors.textPrimary }}>
                  Step 1 — Who receives this email?
                </Typography>

                <Alert severity="info" icon={<InfoOutlined />} sx={{ mb: 2, borderRadius: '8px', py: 0.5 }}>
                  <Typography variant="body2">
                    <strong>Check the boxes</strong> next to each person, or turn on{' '}
                    <strong>Email everyone</strong> below to send to the full filtered list.
                  </Typography>
                </Alert>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sendToEveryone}
                      onChange={(e) => {
                        setSendToEveryone(e.target.checked)
                        if (e.target.checked) setSelectedIds([])
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Email everyone in this list ({recipients.length})
                    </Typography>
                  }
                  sx={{ mb: 1.5, ml: 0 }}
                />

                {!sendToEveryone && (
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<SelectAll />}
                      onClick={selectAllVisible}
                      disabled={!recipients.length}
                      sx={{ textTransform: 'none' }}
                    >
                      Select all visible
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Deselect />}
                      onClick={clearSelection}
                      disabled={!selectedIds.length}
                      sx={{ textTransform: 'none' }}
                    >
                      Clear selection
                    </Button>
                    <Chip
                      label={`${selectedIds.length} selected`}
                      size="small"
                      sx={{
                        bgcolor: selectedIds.length ? colors.primaryBg : colors.pageBackground,
                        color: selectedIds.length ? colors.primary : colors.textSecondary,
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                )}

                <TextField
                  fullWidth
                  size="small"
                  placeholder={isSellers ? 'Search sellers by name or email...' : 'Search users...'}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ fontSize: 18, color: colors.textSecondary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2, '& .MuiOutlinedInput-root': { bgcolor: colors.pageBackground } }}
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
                    label={<Typography variant="body2">Include banned users</Typography>}
                    sx={{ mb: 1 }}
                  />
                )}

                {loadingRecipients ? (
                  <LinearProgress sx={{ my: 2 }} />
                ) : (
                  <List
                    dense
                    sx={{
                      maxHeight: 340,
                      overflow: 'auto',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      bgcolor: colors.pageBackground,
                    }}
                  >
                    {recipients.length === 0 ? (
                      <ListItem>
                        <ListItemText primary="No recipients found" secondary="Try a different search or filter" />
                      </ListItem>
                    ) : (
                      recipients.map((r) => {
                        const checked = sendToEveryone || selectedIds.includes(r.id)
                        return (
                          <ListItem key={r.id} disablePadding divider>
                            <ListItemButton
                              onClick={() => !sendToEveryone && toggleSelect(r.id)}
                              dense
                              disabled={sendToEveryone}
                            >
                              <ListItemIcon sx={{ minWidth: 40 }}>
                                <Checkbox
                                  edge="start"
                                  checked={checked}
                                  disabled={sendToEveryone}
                                  tabIndex={-1}
                                  size="small"
                                />
                              </ListItemIcon>
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
                        )
                      })
                    )}
                  </List>
                )}

                <Typography variant="caption" sx={{ color: colors.slate400, mt: 1.5, display: 'block' }}>
                  {sendToEveryone
                    ? `Will email all ${recipients.length} people matching your filters`
                    : `${selectedIds.length} person(s) selected — check boxes above to add more`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Compose */}
          <Grid item xs={12} lg={7}>
            <Card sx={{ bgcolor: colors.cardBackground, border: `1px solid ${colors.border}`, borderRadius: '8px', boxShadow: 'none', mb: 3 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: colors.textPrimary }}>
                  Step 2 — Compose your email
                </Typography>

                <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 1.5 }}>
                  Choose a template (click to fill subject & message)
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                  {templates.map((tpl) => (
                    <Box
                      key={tpl.id}
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Chip label={tpl.category} size="small" sx={{ height: 22, fontSize: 11 }} />
                        {tpl.suggestFeatured && (
                          <Chip label="Includes products" size="small" color="secondary" sx={{ height: 22, fontSize: 11 }} />
                        )}
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: colors.textPrimary }}>
                        {tpl.subject}
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
                        {tpl.message.slice(0, 120)}…
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <TextField fullWidth label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} sx={{ mb: 2 }} />
                <TextField
                  fullWidth
                  label="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  multiline
                  minRows={8}
                  sx={{ mb: 2, '& .MuiOutlinedInput-root': { bgcolor: colors.pageBackground } }}
                />

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Button text (optional)"
                      value={ctaLabel}
                      onChange={(e) => setCtaLabel(e.target.value)}
                      placeholder="e.g. Browse marketplace"
                    />
                  </Grid>
                  <Grid item xs={12} sm={7}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Button link (optional)"
                      value={ctaUrl}
                      onChange={(e) => setCtaUrl(e.target.value)}
                      placeholder={storefrontUrl}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShoppingBag fontSize="small" />
                  Step 3 — Include products & apps (optional)
                </Typography>
                <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 1.5 }}>
                  Up to {MAX_FEATURED} items appear as cards in the email. <strong>Apps</strong> are digital seller
                  listings; <strong>Products</strong> are shop items (e.g. shoe racks) — both can be included.
                </Typography>

                {featuredItems.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {featuredItems.map((item) => (
                      <Chip
                        key={itemKey(item)}
                        avatar={item.image ? <Avatar src={item.image} /> : undefined}
                        label={item.name}
                        onDelete={() => toggleFeatured(item)}
                        sx={{ maxWidth: 220 }}
                      />
                    ))}
                  </Box>
                )}

                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search apps and products..."
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 1.5 }}
                />

                {loadingCatalog ? (
                  <LinearProgress sx={{ mb: 2 }} />
                ) : (
                  <List
                    dense
                    sx={{
                      maxHeight: 220,
                      overflow: 'auto',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      bgcolor: colors.pageBackground,
                    }}
                  >
                    {catalogItems.length === 0 ? (
                      <ListItem>
                        <ListItemText primary="No apps/products found" />
                      </ListItem>
                    ) : (
                      catalogItems.map((item) => {
                        const selected = featuredItems.some((f) => itemKey(f) === itemKey(item))
                        return (
                          <ListItem key={itemKey(item)} disablePadding divider>
                            <ListItemButton onClick={() => toggleFeatured(item)} dense>
                              <ListItemIcon sx={{ minWidth: 40 }}>
                                <Checkbox edge="start" checked={selected} tabIndex={-1} size="small" />
                              </ListItemIcon>
                              {item.image ? (
                                <Avatar src={item.image} variant="rounded" sx={{ width: 40, height: 40, mr: 1.5 }} />
                              ) : (
                                <Avatar variant="rounded" sx={{ width: 40, height: 40, mr: 1.5, bgcolor: colors.border }}>
                                  <ShoppingBag fontSize="small" />
                                </Avatar>
                              )}
                              <ListItemText
                                primary={item.name}
                                secondary={`${item.type === 'product' ? 'Product' : 'App'} · ${item.isFree ? 'Free' : `${item.currency || 'USD'} ${item.price}`}`}
                                primaryTypographyProps={{ fontSize: 13, fontWeight: 600 }}
                              />
                            </ListItemButton>
                          </ListItem>
                        )
                      })
                    )}
                  </List>
                )}

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ mt: 3, textTransform: 'none', bgcolor: colors.primary, '&:hover': { bgcolor: colors.primaryDark } }}
                  startIcon={sending ? <CircularProgress size={18} color="inherit" /> : <Send />}
                  disabled={!canSend}
                  onClick={() => setConfirmOpen(true)}
                >
                  {sending
                    ? 'Sending…'
                    : `Send to ${recipientCount} recipient(s)${featuredItems.length ? ` · ${featuredItems.length} product(s)` : ''}`}
                </Button>
                {sendBlockReason && (
                  <Alert severity="warning" sx={{ mt: 2, borderRadius: '8px' }}>
                    {sendBlockReason}
                  </Alert>
                )}
              </CardContent>
            </Card>

            {lastResult && (
              <Card sx={{ bgcolor: colors.cardBackground, border: `1px solid ${colors.border}`, borderRadius: '8px', boxShadow: 'none' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
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
                  {lastResult.results?.filter((r) => !r.success).length > 0 && (
                    <>
                      <Divider sx={{ my: 1.5 }} />
                      <Typography variant="caption" sx={{ color: colors.error, fontWeight: 700, display: 'block', mb: 0.5 }}>
                        Failed deliveries:
                      </Typography>
                      {lastResult.results
                        .filter((r) => !r.success)
                        .slice(0, 8)
                        .map((r) => (
                          <Typography key={r.email || r.id} variant="caption" display="block" sx={{ color: colors.textSecondary }}>
                            {r.email || r.name || r.id}: {r.error}
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

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm send</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: colors.textSecondary, mb: 1 }}>
            Send <strong>&quot;{subject}&quot;</strong> to{' '}
            <strong>{recipientCount}</strong> {isSellers ? 'seller(s)' : 'user(s)'}?
          </Typography>
          {featuredItems.length > 0 && (
            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
              Includes {featuredItems.length} featured product/app card(s) in each email.
            </Typography>
          )}
          {(ctaLabel || ctaUrl) && (
            <Typography variant="body2" sx={{ color: colors.textSecondary, mt: 1 }}>
              CTA button: {ctaLabel || '(no label)'} → {ctaUrl || storefrontUrl}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSend} startIcon={<Email />} sx={{ textTransform: 'none', bgcolor: colors.primary }}>
            Send emails
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminEmailCommunications
