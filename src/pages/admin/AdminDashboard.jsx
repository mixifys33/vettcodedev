import { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Breadcrumbs,
} from '@mui/material'
import {
  Store,
  People,
  Code,
  Notifications,
  TrendingUp,
  CheckCircle,
  Schedule,
  Block,
  Send,
  History,
  ManageAccounts,
  BarChart,
  PersonSearch,
  Storefront,
  Refresh,
  NavigateNext,
  Dashboard as DashboardIcon,
  HourglassEmpty,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'
import { colors } from '../../theme/tokens'

const SECTION_TABS = [
  { key: 'overview', label: 'Overview', icon: DashboardIcon },
  { key: 'sellers', label: 'Sellers', icon: Store },
  { key: 'notifications', label: 'Notifications', icon: Notifications },
  { key: 'users', label: 'Users & Apps', icon: People },
]

const StatCard = ({ title, value, subtitle, icon: Icon, color, bgColor, onClick }) => (
  <Card
    onClick={onClick}
    sx={{
      bgcolor: colors.cardBackground,
      border: `1px solid ${colors.border}`,
      borderRadius: '8px',
      boxShadow: 'none',
      height: '100%',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'border-color 0.2s',
      '&:hover': onClick ? { borderColor: colors.primary } : {},
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

const QuickActionCard = ({ title, description, icon: Icon, color, bgColor, onClick, badge }) => (
  <Card
    onClick={onClick}
    sx={{
      bgcolor: colors.cardBackground,
      border: `1px solid ${colors.border}`,
      borderRadius: '8px',
      boxShadow: 'none',
      cursor: 'pointer',
      height: '100%',
      transition: 'border-color 0.2s',
      '&:hover': { borderColor: colors.primary },
    }}
  >
    <CardContent sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '6px',
            bgcolor: bgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
            flexShrink: 0,
          }}
        >
          <Icon sx={{ fontSize: 20 }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.textPrimary }}>
              {title}
            </Typography>
            {badge > 0 && (
              <Chip
                label={badge}
                size="small"
                sx={{
                  height: 20,
                  fontSize: 11,
                  fontWeight: 700,
                  bgcolor: colors.warningBg,
                  color: colors.warningText,
                }}
              />
            )}
          </Box>
          <Typography variant="caption" sx={{ color: colors.textSecondary, mt: 0.5, display: 'block' }}>
            {description}
          </Typography>
        </Box>
        <NavigateNext sx={{ color: colors.slate400, fontSize: 20, flexShrink: 0 }} />
      </Box>
    </CardContent>
  </Card>
)

const SectionTitle = ({ children }) => (
  <Typography
    variant="subtitle1"
    sx={{ fontWeight: 700, color: colors.textPrimary, mb: 2, mt: 0.5 }}
  >
    {children}
  </Typography>
)

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [activeSection, setActiveSection] = useState('overview')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await api.get('/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.data.success) {
        setStats(response.data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      toast.error('Failed to load dashboard statistics')
    } finally {
      setLoading(false)
    }
  }

  const fmt = (n) => (n != null ? Number(n).toLocaleString() : '—')

  const overviewStatRows = [
    {
      title: 'Sellers',
      cards: [
        {
          title: 'Total Sellers',
          value: fmt(stats?.sellers?.total),
          subtitle: `${fmt(stats?.sellers?.active)} active`,
          icon: Store,
          color: '#7C3AED',
          bgColor: 'rgba(124,58,237,0.08)',
          onClick: () => navigate('/admin/sellers'),
        },
        {
          title: 'Pending Approval',
          value: fmt(stats?.sellers?.pending),
          subtitle: 'Awaiting review',
          icon: HourglassEmpty,
          color: colors.warning,
          bgColor: colors.warningBg,
          onClick: () => navigate('/admin/sellers/pending'),
        },
        {
          title: 'Active Sellers',
          value: fmt(stats?.sellers?.active),
          subtitle: 'Currently selling',
          icon: CheckCircle,
          color: colors.success,
          bgColor: colors.successBg,
        },
        {
          title: 'Suspended',
          value: fmt(stats?.sellers?.suspended),
          subtitle: 'Restricted accounts',
          icon: Block,
          color: colors.error,
          bgColor: colors.errorBg,
          onClick: () => navigate('/admin/sellers'),
        },
      ],
    },
    {
      title: 'Platform',
      cards: [
        {
          title: 'Total Customers',
          value: fmt(stats?.users?.total),
          subtitle: 'Registered users',
          icon: People,
          color: colors.info,
          bgColor: colors.infoBg,
          onClick: () => navigate('/admin/users'),
        },
        {
          title: 'Total Orders',
          value: fmt(stats?.orders?.total),
          subtitle: 'All-time orders',
          icon: TrendingUp,
          color: colors.primary,
          bgColor: colors.primaryBg,
        },
        {
          title: 'Applications',
          value: fmt(stats?.applications?.total),
          subtitle: `${fmt(stats?.applications?.verified)} verified`,
          icon: Code,
          color: colors.info,
          bgColor: colors.infoBg,
          onClick: () => navigate('/admin/applications'),
        },
        {
          title: 'Pending Apps',
          value: fmt(stats?.applications?.pending),
          subtitle: 'Needs review',
          icon: Schedule,
          color: colors.warning,
          bgColor: colors.warningBg,
          onClick: () => navigate('/admin/applications'),
        },
      ],
    },
    {
      title: 'Notification Reach',
      cards: [
        {
          title: 'Customer Tokens',
          value: fmt(stats?.pushTokens?.users),
          subtitle: 'Push subscribers',
          icon: People,
          color: colors.info,
          bgColor: colors.infoBg,
        },
        {
          title: 'Seller Tokens',
          value: fmt(stats?.pushTokens?.sellers),
          subtitle: 'Seller devices',
          icon: Store,
          color: '#7C3AED',
          bgColor: 'rgba(124,58,237,0.08)',
        },
        {
          title: 'Total Reach',
          value: fmt(stats?.pushTokens?.total),
          subtitle: 'Combined audience',
          icon: Notifications,
          color: colors.primary,
          bgColor: colors.primaryBg,
        },
      ],
    },
  ]

  const quickActions = [
    {
      title: 'Pending Sellers',
      description: `${fmt(stats?.sellers?.pending)} sellers awaiting approval`,
      icon: HourglassEmpty,
      color: colors.warning,
      bgColor: colors.warningBg,
      badge: stats?.sellers?.pending,
      onClick: () => navigate('/admin/sellers/pending'),
    },
    {
      title: 'Manage Sellers',
      description: 'View, approve, suspend, ban, or delete sellers',
      icon: ManageAccounts,
      color: '#7C3AED',
      bgColor: 'rgba(124,58,237,0.08)',
      onClick: () => navigate('/admin/sellers'),
    },
    {
      title: 'Send Notification',
      description: 'Broadcast to users, sellers, or everyone',
      icon: Send,
      color: colors.primary,
      bgColor: colors.primaryBg,
      onClick: () => navigate('/admin/notifications'),
    },
    {
      title: 'Notification History',
      description: 'View all previously sent notifications',
      icon: History,
      color: colors.success,
      bgColor: colors.successBg,
      onClick: () => navigate('/admin/notifications/history'),
    },
  ]

  const analyticsActions = [
    {
      title: 'User Analytics',
      description: 'Registrations, buy rates, conversion & top buyers',
      icon: PersonSearch,
      color: colors.info,
      bgColor: colors.infoBg,
      onClick: () => navigate('/admin/analytics/users'),
    },
    {
      title: 'Seller Analytics',
      description: 'Revenue, downloads, app counts & leaderboards',
      icon: Storefront,
      color: '#7C3AED',
      bgColor: 'rgba(124,58,237,0.08)',
      onClick: () => navigate('/admin/analytics/sellers'),
    },
    {
      title: 'Platform Overview',
      description: 'Overall finances, revenue trends & health indicators',
      icon: BarChart,
      color: colors.warning,
      bgColor: colors.warningBg,
      onClick: () => navigate('/admin/analytics/overview'),
    },
  ]

  const sellerActions = [
    {
      title: 'All Sellers',
      description: `${fmt(stats?.sellers?.total)} total seller accounts`,
      icon: Store,
      color: '#7C3AED',
      bgColor: 'rgba(124,58,237,0.08)',
      onClick: () => navigate('/admin/sellers'),
    },
    {
      title: 'Pending Approval',
      description: `${fmt(stats?.sellers?.pending)} awaiting review`,
      icon: HourglassEmpty,
      color: colors.warning,
      bgColor: colors.warningBg,
      badge: stats?.sellers?.pending,
      onClick: () => navigate('/admin/sellers/pending'),
    },
    {
      title: 'Active Sellers',
      description: `${fmt(stats?.sellers?.active)} currently active`,
      icon: CheckCircle,
      color: colors.success,
      bgColor: colors.successBg,
      onClick: () => navigate('/admin/sellers'),
    },
  ]

  const notificationActions = [
    {
      title: 'Send Notification',
      description: 'Broadcast to users, sellers, or everyone',
      icon: Send,
      color: colors.primary,
      bgColor: colors.primaryBg,
      onClick: () => navigate('/admin/notifications'),
    },
    {
      title: 'Notification History',
      description: 'View all previously sent notifications',
      icon: History,
      color: colors.info,
      bgColor: colors.infoBg,
      onClick: () => navigate('/admin/notifications/history'),
    },
  ]

  const usersActions = [
    {
      title: 'All Customers',
      description: `${fmt(stats?.users?.total)} registered users`,
      icon: People,
      color: colors.info,
      bgColor: colors.infoBg,
      onClick: () => navigate('/admin/users'),
    },
    {
      title: 'All Applications',
      description: `${fmt(stats?.applications?.total)} total applications`,
      icon: Code,
      color: colors.primary,
      bgColor: colors.primaryBg,
      onClick: () => navigate('/admin/applications'),
    },
    {
      title: 'Pending Review',
      description: `${fmt(stats?.applications?.pending)} awaiting review`,
      icon: Schedule,
      color: colors.warning,
      bgColor: colors.warningBg,
      badge: stats?.applications?.pending,
      onClick: () => navigate('/admin/applications'),
    },
    {
      title: 'Verified Apps',
      description: `${fmt(stats?.applications?.verified)} verified and live`,
      icon: CheckCircle,
      color: colors.success,
      bgColor: colors.successBg,
      onClick: () => navigate('/admin/applications'),
    },
  ]

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
          <Typography sx={{ color: colors.textPrimary, fontSize: '14px', fontWeight: 600 }}>
            Dashboard
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
              Welcome back, {user?.name?.split(' ')[0] || 'Admin'}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary, mt: 0.5 }}>
              Admin control center — manage sellers, users, applications, and notifications
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchStats}
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
        {/* Section navigation */}
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
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {SECTION_TABS.map((tab) => {
                const Icon = tab.icon
                const isActive = activeSection === tab.key
                return (
                  <Chip
                    key={tab.key}
                    icon={<Icon sx={{ fontSize: 16 }} />}
                    label={tab.label}
                    onClick={() => setActiveSection(tab.key)}
                    sx={{
                      bgcolor: isActive ? colors.primaryBg : colors.pageBackground,
                      color: isActive ? colors.primary : colors.textSecondary,
                      border: `1px solid ${isActive ? colors.primary : colors.border}`,
                      fontWeight: isActive ? 700 : 500,
                      '&:hover': {
                        bgcolor: isActive ? colors.primaryBg : colors.slate100,
                      },
                    }}
                  />
                )
              })}
            </Box>
          </CardContent>
        </Card>

        {/* Overview */}
        {activeSection === 'overview' && (
          <>
            {overviewStatRows.map((row) => (
              <Box key={row.title} sx={{ mb: 3 }}>
                <SectionTitle>{row.title}</SectionTitle>
                <Grid container spacing={2}>
                  {row.cards.map((card, i) => (
                    <Grid item xs={12} sm={6} lg={row.cards.length === 3 ? 4 : 3} key={i}>
                      <StatCard {...card} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}

            <SectionTitle>Quick Actions</SectionTitle>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {quickActions.map((action, i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <QuickActionCard {...action} />
                </Grid>
              ))}
            </Grid>

            <SectionTitle>Analytics</SectionTitle>
            <Grid container spacing={2}>
              {analyticsActions.map((action, i) => (
                <Grid item xs={12} md={4} key={i}>
                  <QuickActionCard {...action} />
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* Sellers */}
        {activeSection === 'sellers' && (
          <>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Sellers"
                  value={fmt(stats?.sellers?.total)}
                  subtitle={`${fmt(stats?.sellers?.active)} active`}
                  icon={Store}
                  color="#7C3AED"
                  bgColor="rgba(124,58,237,0.08)"
                  onClick={() => navigate('/admin/sellers')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Pending"
                  value={fmt(stats?.sellers?.pending)}
                  subtitle="Awaiting approval"
                  icon={HourglassEmpty}
                  color={colors.warning}
                  bgColor={colors.warningBg}
                  onClick={() => navigate('/admin/sellers/pending')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Active"
                  value={fmt(stats?.sellers?.active)}
                  subtitle="Currently selling"
                  icon={CheckCircle}
                  color={colors.success}
                  bgColor={colors.successBg}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Suspended"
                  value={fmt(stats?.sellers?.suspended)}
                  subtitle="Restricted"
                  icon={Block}
                  color={colors.error}
                  bgColor={colors.errorBg}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              {sellerActions.map((action, i) => (
                <Grid item xs={12} md={4} key={i}>
                  <QuickActionCard {...action} />
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* Notifications */}
        {activeSection === 'notifications' && (
          <>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <StatCard
                  title="Customer Tokens"
                  value={fmt(stats?.pushTokens?.users)}
                  subtitle="Push subscribers"
                  icon={People}
                  color={colors.info}
                  bgColor={colors.infoBg}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatCard
                  title="Seller Tokens"
                  value={fmt(stats?.pushTokens?.sellers)}
                  subtitle="Seller devices"
                  icon={Store}
                  color="#7C3AED"
                  bgColor="rgba(124,58,237,0.08)"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatCard
                  title="Total Reach"
                  value={fmt(stats?.pushTokens?.total)}
                  subtitle="Combined audience"
                  icon={Notifications}
                  color={colors.primary}
                  bgColor={colors.primaryBg}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              {notificationActions.map((action, i) => (
                <Grid item xs={12} md={6} key={i}>
                  <QuickActionCard {...action} />
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* Users & Apps */}
        {activeSection === 'users' && (
          <>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Customers"
                  value={fmt(stats?.users?.total)}
                  subtitle="Registered users"
                  icon={People}
                  color={colors.info}
                  bgColor={colors.infoBg}
                  onClick={() => navigate('/admin/users')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Applications"
                  value={fmt(stats?.applications?.total)}
                  subtitle="Total listings"
                  icon={Code}
                  color={colors.primary}
                  bgColor={colors.primaryBg}
                  onClick={() => navigate('/admin/applications')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Pending Apps"
                  value={fmt(stats?.applications?.pending)}
                  subtitle="Needs review"
                  icon={Schedule}
                  color={colors.warning}
                  bgColor={colors.warningBg}
                  onClick={() => navigate('/admin/applications')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Verified"
                  value={fmt(stats?.applications?.verified)}
                  subtitle="Live on marketplace"
                  icon={CheckCircle}
                  color={colors.success}
                  bgColor={colors.successBg}
                  onClick={() => navigate('/admin/applications')}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              {usersActions.map((action, i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <QuickActionCard {...action} />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>
    </Box>
  )
}

export default AdminDashboard
