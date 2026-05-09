import { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  LinearProgress,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  AlertTitle,
} from '@mui/material'
import {
  Apps,
  ShoppingCart,
  TrendingUp,
  PendingActions,
  Add,
  Visibility,
  Edit,
  CheckCircle,
  Schedule,
  Cancel,
  ArrowForward,
  Campaign,
  CloudUpload,
  Settings as SettingsIcon,
  Store,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import api from '../../utils/api'
import useAuthStore from '../../store/authStore'
import { formatCurrency, formatDate, formatRelativeTime } from '../../utils/helpers'
import { ORDER_STATUS } from '../../utils/constants'

const COLORS = ['#0a1628', '#f0a500', '#059669', '#dc2626', '#3b82f6']

const SellerDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [topApplications, setTopApplications] = useState([])
  const [incompleteSetup, setIncompleteSetup] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const sellerId = user?.id || user?._id

      // Fetch stats
      const [statsRes, ordersRes, appsRes] = await Promise.all([
        api.get(`/sellers/stats/${sellerId}`),
        api.get(`/orders?sellerId=${sellerId}&limit=5`),
        api.get(`/applications/seller/${sellerId}?limit=10`),
      ])

      if (statsRes.data.success) {
        setStats(statsRes.data.stats)
      }

      if (ordersRes.data.success) {
        setRecentOrders(ordersRes.data.orders || [])
      }

      if (appsRes.data.success) {
        const apps = appsRes.data.applications || []
        setTopApplications(apps.slice(0, 10))

        // Check for incomplete setups
        const incomplete = apps.filter(
          (app) => !app.deliverySettings || Object.keys(app.deliverySettings).length === 0
        )
        setIncompleteSetup(incomplete)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Applications',
      value: stats?.totalApplications || 0,
      icon: <Apps />,
      color: '#0a1628',
      bgColor: '#0a162815',
      action: () => navigate('/seller/applications'),
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: <ShoppingCart />,
      color: '#f0a500',
      bgColor: '#f0a50015',
      action: () => navigate('/seller/orders'),
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.totalRevenue || 0, 'UGX'),
      icon: <TrendingUp />,
      color: '#059669',
      bgColor: '#05966915',
      action: null,
    },
    {
      title: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: <PendingActions />,
      color: '#dc2626',
      bgColor: '#dc262615',
      action: () => navigate('/seller/orders'),
    },
  ]

  const onboardingChecklist = [
    {
      title: 'Complete Shop Setup',
      completed: user?.shop?.isSetup,
      action: () => navigate('/seller/settings/shop'),
    },
    {
      title: 'Add Payment Method',
      completed: user?.paymentSettings?.isSetup,
      action: () => navigate('/seller/settings/payment'),
    },
    {
      title: 'Create First Application',
      completed: (stats?.totalApplications || 0) > 0,
      action: () => navigate('/seller/applications/create'),
    },
    {
      title: 'Setup Delivery Methods',
      completed: incompleteSetup.length === 0 && (stats?.totalApplications || 0) > 0,
      action: () => navigate('/seller/applications'),
    },
  ]

  const completedTasks = onboardingChecklist.filter((task) => task.completed).length
  const progress = (completedTasks / onboardingChecklist.length) * 100

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
      </Box>
    )
  }

  return (
    <Box>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Welcome back, {user?.name || 'Seller'}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your store today
        </Typography>
      </Box>

      {/* Incomplete Setup Warning */}
      {incompleteSetup.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <AlertTitle>Incomplete Application Setup</AlertTitle>
          You have {incompleteSetup.length} application(s) without delivery settings configured.{' '}
          <Button
            size="small"
            onClick={() => navigate('/seller/applications')}
            sx={{ ml: 1 }}
          >
            Configure Now
          </Button>
        </Alert>
      )}

      {/* Onboarding Progress */}
      {progress < 100 && (
        <Card sx={{ mb: 3, borderLeft: 4, borderColor: 'secondary.main' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Complete Your Setup
              </Typography>
              <Chip
                label={`${completedTasks}/${onboardingChecklist.length} Complete`}
                color="secondary"
                size="small"
              />
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ mb: 2, height: 8, borderRadius: 4 }}
            />
            <Grid container spacing={2}>
              {onboardingChecklist.map((task, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: task.completed ? 'success.light' : 'background.default',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: task.completed ? 'success.light' : 'action.hover' },
                    }}
                    onClick={task.action}
                  >
                    {task.completed ? (
                      <CheckCircle sx={{ color: 'success.main' }} />
                    ) : (
                      <Schedule sx={{ color: 'warning.main' }} />
                    )}
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {task.title}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                cursor: stat.action ? 'pointer' : 'default',
                transition: 'all 0.3s',
                '&:hover': stat.action
                  ? {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    }
                  : {},
              }}
              onClick={stat.action}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: stat.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  {stat.action && <ArrowForward sx={{ color: 'text.secondary' }} />}
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          {/* Recent Orders */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Orders
                </Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/seller/orders')}
                >
                  View All
                </Button>
              </Box>

              {recentOrders.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <ShoppingCart sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                  <Typography color="text.secondary">No orders yet</Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentOrders.map((order) => {
                        const statusMeta = ORDER_STATUS[order.status] || {}
                        return (
                          <TableRow key={order._id} hover>
                            <TableCell>#{order._id.slice(-6).toUpperCase()}</TableCell>
                            <TableCell>{order.buyerInfo?.name || 'N/A'}</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                              {formatCurrency(order.total, order.currency)}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={statusMeta.label || order.status}
                                size="small"
                                sx={{
                                  bgcolor: `${statusMeta.color}15`,
                                  color: statusMeta.color,
                                  fontWeight: 600,
                                }}
                              />
                            </TableCell>
                            <TableCell>{formatRelativeTime(order.createdAt)}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Quick Actions */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => navigate('/seller/applications/create')}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Create Application
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  onClick={() => navigate('/seller/bulk-upload')}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Bulk Upload
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Campaign />}
                  onClick={() => navigate('/seller/marketing')}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Marketing
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<SettingsIcon />}
                  onClick={() => navigate('/seller/settings')}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Settings
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Applications */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Your Applications
            </Typography>
            <Button
              size="small"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/seller/applications')}
            >
              View All
            </Button>
          </Box>

          {topApplications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Apps sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                No applications yet
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/seller/applications/create')}
              >
                Create Your First Application
              </Button>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {topApplications.map((app) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={app._id}>
                  <Card
                    variant="outlined"
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      },
                    }}
                    onClick={() => navigate(`/seller/applications/preview/${app._id}`)}
                  >
                    <Box
                      sx={{
                        height: 140,
                        bgcolor: 'background.default',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      {app.screenshots?.[0] ? (
                        <img
                          src={app.screenshots[0].url || app.screenshots[0]}
                          alt={app.appName}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <Apps sx={{ fontSize: 48, color: 'text.disabled' }} />
                      )}
                      <Chip
                        label={app.verificationStatus || 'pending'}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }} noWrap>
                        {app.appName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} noWrap>
                        {app.appCategory}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {formatCurrency(app.price, app.currency)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default SellerDashboard
