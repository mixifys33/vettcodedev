import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  Chip,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import {
  NavigateNext,
  Person,
  Lock,
  Settings,
  Email,
  Phone,
  Visibility,
  VisibilityOff,
  OpenInNew,
  Send,
  Storefront,
  Logout,
  CheckCircle,
  ErrorOutline,
} from '@mui/icons-material'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { colors } from '../../theme/tokens'
import useAuthStore from '../../store/authStore'

const inputSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: colors.pageBackground,
    '& fieldset': { borderColor: colors.border },
    '&:hover fieldset': { borderColor: colors.slate400 },
    '&.Mui-focused fieldset': { borderColor: colors.primary },
  },
}

const TabPanel = ({ value, index, children }) => (
  <Box role="tabpanel" hidden={value !== index} sx={{ pt: 3 }}>
    {value === index && children}
  </Box>
)

const AdminSettings = () => {
  const navigate = useNavigate()
  const { user, updateUser, logout } = useAuthStore()
  const [tab, setTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [smtpStatus, setSmtpStatus] = useState(null)
  const [system, setSystem] = useState(null)

  const [profile, setProfile] = useState({ name: '', email: '', phone: '' })
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState({
    current: false,
    next: false,
    confirm: false,
  })

  const passwordRules = useMemo(
    () => ({
      length: passwords.newPassword.length >= 8,
      match:
        passwords.newPassword.length > 0 &&
        passwords.newPassword === passwords.confirmPassword,
    }),
    [passwords.newPassword, passwords.confirmPassword]
  )

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/settings')
      if (res.data.success) {
        const p = res.data.profile
        setProfile({
          name: p.name || '',
          email: p.email || '',
          phone: p.phone || '',
        })
        setSystem(res.data.system || null)
        if (p) updateUser(p)
      }
    } catch (err) {
      const fallback = user || {}
      setProfile({
        name: fallback.name || '',
        email: fallback.email || '',
        phone: fallback.phone || '',
      })
      if (err.response?.status !== 404) {
        toast.error('Could not load settings from server')
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchSmtpStatus = async () => {
    try {
      const res = await api.get('/admin/communications/smtp-status', { silentError: true })
      if (res.data.success) setSmtpStatus(res.data)
    } catch {
      setSmtpStatus(null)
    }
  }

  useEffect(() => {
    fetchSettings()
    fetchSmtpStatus()
  }, [])

  const handleSaveProfile = async () => {
    if (!profile.name.trim() || profile.name.trim().length < 2) {
      toast.error('Enter a valid display name')
      return
    }
    setSavingProfile(true)
    try {
      const res = await api.patch('/admin/settings/profile', {
        name: profile.name.trim(),
        phone: profile.phone.trim(),
      })
      if (res.data.success) {
        toast.success('Profile saved')
        if (res.data.profile) updateUser(res.data.profile)
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save profile')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async () => {
    if (!passwordRules.length || !passwordRules.match) {
      toast.error('Check password requirements')
      return
    }
    setSavingPassword(true)
    try {
      const res = await api.post('/admin/settings/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      })
      if (res.data.success) {
        toast.success('Password updated')
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setSystem((s) => (s ? { ...s, passwordCustomized: true } : s))
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password')
    } finally {
      setSavingPassword(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const platformLinks = [
    {
      label: 'Email sellers',
      description: 'Bulk email to approved sellers',
      icon: Email,
      path: '/admin/communications/sellers',
    },
    {
      label: 'Email customers',
      description: 'Bulk email to registered users',
      icon: Email,
      path: '/admin/communications/users',
    },
    {
      label: 'Push notifications',
      description: 'Send in-app push broadcasts',
      icon: Send,
      path: '/admin/notifications',
    },
    {
      label: 'View storefront',
      description: system?.storefrontUrl || 'https://vettcodedev.vercel.app',
      icon: Storefront,
      external: system?.storefrontUrl || 'https://vettcodedev.vercel.app',
    },
  ]

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
            Settings
          </Typography>
        </Breadcrumbs>
        <Typography variant="h5" sx={{ fontWeight: 700, color: colors.textPrimary }}>
          Account & platform
        </Typography>
        <Typography variant="body2" sx={{ color: colors.textSecondary, mt: 0.5 }}>
          Manage your admin profile, security, and quick links to communication tools.
        </Typography>
      </Box>

      <Box sx={{ px: 3, pb: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={36} sx={{ color: colors.primary }} />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Card
                sx={{
                  bgcolor: colors.cardBackground,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  boxShadow: 'none',
                }}
              >
                <Tabs
                  orientation="vertical"
                  value={tab}
                  onChange={(_, v) => setTab(v)}
                  sx={{
                    '& .MuiTab-root': {
                      alignItems: 'flex-start',
                      textAlign: 'left',
                      minHeight: 48,
                      textTransform: 'none',
                      fontWeight: 500,
                      color: colors.textSecondary,
                    },
                    '& .Mui-selected': { color: colors.primary, fontWeight: 600 },
                    '& .MuiTabs-indicator': { left: 0, width: 3, bgcolor: colors.primary },
                  }}
                >
                  <Tab icon={<Person sx={{ fontSize: 18 }} />} iconPosition="start" label="Profile" />
                  <Tab icon={<Lock sx={{ fontSize: 18 }} />} iconPosition="start" label="Security" />
                  <Tab icon={<Settings sx={{ fontSize: 18 }} />} iconPosition="start" label="Platform" />
                </Tabs>
              </Card>

              <Card
                sx={{
                  mt: 2,
                  bgcolor: colors.cardBackground,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  boxShadow: 'none',
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" sx={{ color: colors.textSecondary, fontWeight: 600 }}>
                    SIGNED IN AS
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: colors.textPrimary, mt: 0.5 }}>
                    {profile.name || user?.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.slate400, display: 'block' }}>
                    {profile.email || user?.email}
                  </Typography>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<Logout />}
                    onClick={handleLogout}
                    sx={{ mt: 2, textTransform: 'none', borderColor: colors.border }}
                  >
                    Sign out
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={9}>
              <Card
                sx={{
                  bgcolor: colors.cardBackground,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  boxShadow: 'none',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <TabPanel value={tab} index={0}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 0.5 }}>
                      Profile
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 3 }}>
                      Your display name and phone appear in the admin console. Email is tied to server configuration.
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" sx={{ color: colors.textSecondary, fontWeight: 600, mb: 0.5, display: 'block' }}>
                          Display name
                        </Typography>
                        <TextField
                          fullWidth
                          value={profile.name}
                          onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                          sx={inputSx}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" sx={{ color: colors.textSecondary, fontWeight: 600, mb: 0.5, display: 'block' }}>
                          Phone
                        </Typography>
                        <TextField
                          fullWidth
                          value={profile.phone}
                          onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Phone sx={{ fontSize: 18, color: colors.textSecondary }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={inputSx}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" sx={{ color: colors.textSecondary, fontWeight: 600, mb: 0.5, display: 'block' }}>
                          Email
                        </Typography>
                        <TextField
                          fullWidth
                          value={profile.email}
                          disabled
                          helperText="Contact your DevOps team to change the admin login email on the server."
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email sx={{ fontSize: 18, color: colors.textSecondary }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={inputSx}
                        />
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                      <Button
                        variant="contained"
                        onClick={handleSaveProfile}
                        disabled={savingProfile}
                        sx={{
                          bgcolor: colors.primary,
                          textTransform: 'none',
                          fontWeight: 600,
                          '&:hover': { bgcolor: colors.primaryDark },
                        }}
                      >
                        {savingProfile ? 'Saving…' : 'Save profile'}
                      </Button>
                    </Box>
                  </TabPanel>

                  <TabPanel value={tab} index={1}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 0.5 }}>
                      Security
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 3 }}>
                      Update your admin password. After the first change, the new password is stored securely on the server.
                    </Typography>

                    {system?.passwordCustomized && (
                      <Alert severity="info" sx={{ mb: 2 }}>
                        You have set a custom admin password. Use the form below to change it again.
                      </Alert>
                    )}

                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Current password"
                          type={showPassword.current ? 'text' : 'password'}
                          value={passwords.currentPassword}
                          onChange={(e) =>
                            setPasswords((p) => ({ ...p, currentPassword: e.target.value }))
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    setShowPassword((s) => ({ ...s, current: !s.current }))
                                  }
                                >
                                  {showPassword.current ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={inputSx}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="New password"
                          type={showPassword.next ? 'text' : 'password'}
                          value={passwords.newPassword}
                          onChange={(e) =>
                            setPasswords((p) => ({ ...p, newPassword: e.target.value }))
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  size="small"
                                  onClick={() => setShowPassword((s) => ({ ...s, next: !s.next }))}
                                >
                                  {showPassword.next ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={inputSx}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Confirm new password"
                          type={showPassword.confirm ? 'text' : 'password'}
                          value={passwords.confirmPassword}
                          onChange={(e) =>
                            setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    setShowPassword((s) => ({ ...s, confirm: !s.confirm }))
                                  }
                                >
                                  {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={inputSx}
                        />
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 2 }}>
                      <Typography
                        variant="caption"
                        sx={{ color: passwordRules.length ? colors.success : colors.textSecondary }}
                      >
                        • At least 8 characters
                      </Typography>
                      <br />
                      <Typography
                        variant="caption"
                        sx={{ color: passwordRules.match ? colors.success : colors.textSecondary }}
                      >
                        • Passwords match
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                      <Button
                        variant="contained"
                        onClick={handleChangePassword}
                        disabled={
                          savingPassword ||
                          !passwordRules.length ||
                          !passwordRules.match ||
                          !passwords.currentPassword
                        }
                        sx={{
                          bgcolor: colors.primary,
                          textTransform: 'none',
                          fontWeight: 600,
                          '&:hover': { bgcolor: colors.primaryDark },
                        }}
                      >
                        {savingPassword ? 'Updating…' : 'Update password'}
                      </Button>
                    </Box>
                  </TabPanel>

                  <TabPanel value={tab} index={2}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 0.5 }}>
                      Platform
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 3 }}>
                      System status and shortcuts to admin communication tools.
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: '8px',
                            border: `1px solid ${colors.border}`,
                            bgcolor: colors.pageBackground,
                          }}
                        >
                          <Typography variant="caption" sx={{ color: colors.textSecondary, fontWeight: 600 }}>
                            EMAIL (SMTP)
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            {smtpStatus?.configured ? (
                              <CheckCircle sx={{ color: colors.success, fontSize: 20 }} />
                            ) : (
                              <ErrorOutline sx={{ color: colors.warning, fontSize: 20 }} />
                            )}
                            <Chip
                              size="small"
                              label={smtpStatus?.configured ? 'Configured' : 'Not configured'}
                              sx={{
                                bgcolor: smtpStatus?.configured ? colors.successBg : colors.warningBg,
                                color: smtpStatus?.configured ? colors.successText : colors.warningText,
                                fontWeight: 600,
                              }}
                            />
                          </Box>
                          {smtpStatus?.fromEmail && (
                            <Typography variant="caption" sx={{ color: colors.slate400, mt: 1, display: 'block' }}>
                              From: {smtpStatus.fromEmail}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: '8px',
                            border: `1px solid ${colors.border}`,
                            bgcolor: colors.pageBackground,
                          }}
                        >
                          <Typography variant="caption" sx={{ color: colors.textSecondary, fontWeight: 600 }}>
                            STOREFRONT
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: colors.textPrimary, mt: 1 }}>
                            {system?.storefrontUrl || 'https://vettcodedev.vercel.app'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: colors.slate400, display: 'block', mt: 0.5 }}>
                            API: {system?.apiBase || 'Render production'}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Divider sx={{ mb: 2 }} />

                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.textPrimary, mb: 1 }}>
                      Quick links
                    </Typography>
                    <List disablePadding>
                      {platformLinks.map((item) => (
                        <ListItemButton
                          key={item.label}
                          onClick={() =>
                            item.external
                              ? window.open(item.external, '_blank', 'noopener,noreferrer')
                              : navigate(item.path)
                          }
                          sx={{
                            borderRadius: '8px',
                            mb: 0.5,
                            border: `1px solid ${colors.border}`,
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <item.icon sx={{ color: colors.primary }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={item.label}
                            secondary={item.description}
                            primaryTypographyProps={{ fontWeight: 600, fontSize: '14px' }}
                            secondaryTypographyProps={{ fontSize: '12px' }}
                          />
                          <OpenInNew sx={{ fontSize: 16, color: colors.slate400 }} />
                        </ListItemButton>
                      ))}
                    </List>
                  </TabPanel>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  )
}

export default AdminSettings
