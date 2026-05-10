import { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Alert,
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
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
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

  const StatCard = ({ title, value, icon: Icon, color, onClick, badge }) => (
    <Card
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        } : {},
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: `${color}.50`,
              color: `${color}.main`,
            }}
          >
            <Icon />
          </Box>
          {badge > 0 && (
            <Chip
              label={badge}
              size="small"
              color={color}
              sx={{ fontWeight: 700 }}
            />
          )}
        </Box>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5 }}>
          {value ?? '—'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  )

  const QuickAction = ({ title, description, icon: Icon, color, onClick }) => (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'translateX(4px)',
          boxShadow: 2,
        },
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: `${color}.50`,
              color: `${color}.main`,
            }}
          >
            <Icon fontSize="small" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Welcome back, {user?.name?.split(' ')[0] || 'Admin'} 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Admin Control Center - Manage your platform
        </Typography>
      </Box>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Overview" />
        <Tab label="Sellers" />
        <Tab label="Notifications" />
        <Tab label="Users" />
      </Tabs>

      {/* Overview Tab */}
      {activeTab === 0 && (
        <>
          {/* Seller Stats */}
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Sellers
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Sellers"
                value={stats?.sellers?.total}
                icon={Store}
                color="info"
                onClick={() => navigate('/admin/sellers')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Pending Approval"
                value={stats?.sellers?.pending}
                icon={Schedule}
                color="warning"
                onClick={() => navigate('/admin/sellers/pending')}
                badge={stats?.sellers?.pending}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Active Sellers"
                value={stats?.sellers?.active}
                icon={CheckCircle}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Suspended"
                value={stats?.sellers?.suspended}
                icon={Block}
                color="error"
              />
            </Grid>
          </Grid>

          {/* Platform Stats */}
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Platform
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Customers"
                value={stats?.users?.total}
                icon={People}
                color="secondary"
                onClick={() => navigate('/admin/users')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Orders"
                value={stats?.orders?.total}
                icon={TrendingUp}
                color="warning"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Applications"
                value={stats?.applications?.total}
                icon={Code}
                color="info"
                onClick={() => navigate('/admin/applications')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Pending Apps"
                value={stats?.applications?.pending}
                icon={Schedule}
                color="warning"
                onClick={() => navigate('/admin/applications')}
                badge={stats?.applications?.pending}
              />
            </Grid>
          </Grid>

          {/* Notification Reach */}
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Notification Reach
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="Customer Tokens"
                value={stats?.pushTokens?.users}
                icon={People}
                color="secondary"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="Seller Tokens"
                value={stats?.pushTokens?.sellers}
                icon={Store}
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="Total Tokens"
                value={stats?.pushTokens?.total}
                icon={Notifications}
                color="primary"
              />
            </Grid>
          </Grid>

          {/* Quick Actions */}
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <QuickAction
                title="Pending Sellers"
                description={`${stats?.sellers?.pending || 0} sellers awaiting approval`}
                icon={Schedule}
                color="warning"
                onClick={() => navigate('/admin/sellers/pending')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <QuickAction
                title="Send Notification"
                description="Broadcast to users, sellers, or everyone"
                icon={Send}
                color="secondary"
                onClick={() => navigate('/admin/notifications')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <QuickAction
                title="Manage Sellers"
                description="View and manage all seller accounts"
                icon={ManageAccounts}
                color="info"
                onClick={() => navigate('/admin/sellers')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <QuickAction
                title="Notification History"
                description="View all previously sent notifications"
                icon={History}
                color="success"
                onClick={() => navigate('/admin/notifications/history')}
              />
            </Grid>
          </Grid>
        </>
      )}

      {/* Sellers Tab */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <QuickAction
              title="All Sellers"
              description={`${stats?.sellers?.total || 0} total sellers`}
              icon={Store}
              color="info"
              onClick={() => navigate('/admin/sellers')}
            />
          </Grid>
          <Grid item xs={12}>
            <QuickAction
              title="Pending Approval"
              description={`${stats?.sellers?.pending || 0} awaiting review`}
              icon={Schedule}
              color="warning"
              onClick={() => navigate('/admin/sellers/pending')}
            />
          </Grid>
          <Grid item xs={12}>
            <QuickAction
              title="Active Sellers"
              description={`${stats?.sellers?.active || 0} currently active`}
              icon={CheckCircle}
              color="success"
              onClick={() => navigate('/admin/sellers')}
            />
          </Grid>
        </Grid>
      )}

      {/* Notifications Tab */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <QuickAction
              title="Send Notification"
              description="Broadcast to users, sellers, or everyone"
              icon={Send}
              color="secondary"
              onClick={() => navigate('/admin/notifications')}
            />
          </Grid>
          <Grid item xs={12}>
            <QuickAction
              title="Notification History"
              description="View all previously sent notifications"
              icon={History}
              color="info"
              onClick={() => navigate('/admin/notifications/history')}
            />
          </Grid>
          <Grid container spacing={3} sx={{ mt: 2, px: 3 }}>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="Customer Tokens"
                value={stats?.pushTokens?.users}
                icon={People}
                color="secondary"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="Seller Tokens"
                value={stats?.pushTokens?.sellers}
                icon={Store}
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="Total Reach"
                value={stats?.pushTokens?.total}
                icon={Notifications}
                color="primary"
              />
            </Grid>
          </Grid>
        </Grid>
      )}

      {/* Users Tab */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <QuickAction
              title="All Customers"
              description={`${stats?.users?.total || 0} registered users`}
              icon={People}
              color="secondary"
              onClick={() => navigate('/admin/users')}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 2 }}>
              Application Management
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <QuickAction
              title="All Applications"
              description={`${stats?.applications?.total || 0} total applications`}
              icon={Code}
              color="info"
              onClick={() => navigate('/admin/applications')}
            />
          </Grid>
          <Grid item xs={12}>
            <QuickAction
              title="Pending Review"
              description={`${stats?.applications?.pending || 0} awaiting review`}
              icon={Schedule}
              color="warning"
              onClick={() => navigate('/admin/applications')}
            />
          </Grid>
          <Grid item xs={12}>
            <QuickAction
              title="Verified Apps"
              description={`${stats?.applications?.verified || 0} verified and live`}
              icon={CheckCircle}
              color="success"
              onClick={() => navigate('/admin/applications')}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  )
}

export default AdminDashboard
