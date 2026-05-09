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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  alpha,
  useTheme,
} from '@mui/material'
import {
  Apps,
  ShoppingCart,
  TrendingUp,
  ArrowUpward,
  ArrowDownward,
  ArrowForward,
  CheckCircle,
  Code,
  AttachMoney,
  Person,
  Add,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../../utils/api'
import useAuthStore from '../../store/authStore'
import { formatCurrency, formatRelativeTime } from '../../utils/helpers'
import AnimatedCodeBackground from '../../components/AnimatedCodeBackground'

const SellerDashboard = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [topApplications, setTopApplications] = useState([])
  const [revenueData, setRevenueData] = useState([])
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Generate revenue chart data from orders
  const generateRevenueData = (orders) => {
    const last30Days = []
    const today = new Date()
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt).toISOString().split('T')[0]
        return orderDate === dateStr && o.status === 'delivered'
      })
      
      const revenue = dayOrders.reduce((sum, o) => sum + (o.total || 0), 0)
      
      last30Days.push({
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        revenue: revenue,
      })
    }
    
    return last30Days
  }

  // Generate activity feed
  const generateActivityFeed = (orders, apps) => {
    const activities = []
    
    // Recent orders
    orders.slice(0, 3).forEach(order => {
      activities.push({
        type: 'order',
        title: 'New Order',
        description: `Order #${order._id.slice(-6)} - ${formatCurrency(order.total, order.currency)}`,
        time: order.createdAt,
        icon: <ShoppingCart />,
        color: '#667eea',
      })
    })
    
    // Recent apps
    apps.slice(0, 2).forEach(app => {
      activities.push({
        type: 'app',
        title: app.verificationStatus === 'verified' ? 'App Verified' : 'App Submitted',
        description: app.appName,
        time: app.createdAt,
        icon: <CheckCircle />,
        color: '#4facfe',
      })
    })
    
    return activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5)
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const sellerId = user?.id || user?._id

      // Fetch all orders and applications for accurate stats
      const [ordersRes, appsRes] = await Promise.all([
        api.get(`/orders?sellerId=${sellerId}`).catch(() => ({ data: { success: false, orders: [] } })),
        api.get(`/applications/seller/${sellerId}`).catch(() => ({ data: { success: false, applications: [] } })),
      ])

      // Calculate stats from fetched data
      const orders = ordersRes.data.orders || []
      const apps = appsRes.data.applications || []

      // Calculate previous month stats for comparison
      const now = new Date()
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      
      const thisMonthOrders = orders.filter(o => new Date(o.createdAt) >= thisMonth)
      const lastMonthOrders = orders.filter(o => new Date(o.createdAt) >= lastMonth && new Date(o.createdAt) < thisMonth)
      
      const thisMonthRevenue = thisMonthOrders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + (o.total || 0), 0)
      const lastMonthRevenue = lastMonthOrders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + (o.total || 0), 0)
      
      const revenueGrowth = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1) : 0
      const ordersGrowth = lastMonthOrders.length > 0 ? ((thisMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length * 100).toFixed(1) : 0

      const totalRevenue = orders.filter((o) => o.status === 'delivered').reduce((sum, o) => sum + (o.total || 0), 0)
      const verifiedApps = apps.filter(a => a.verificationStatus === 'verified').length
      const successRate = apps.length > 0 ? ((verifiedApps / apps.length) * 100).toFixed(1) : 0

      const calculatedStats = {
        totalApplications: apps.length,
        totalOrders: orders.length,
        totalRevenue: totalRevenue,
        pendingOrders: orders.filter((o) => o.status === 'pending').length,
        revenueGrowth: parseFloat(revenueGrowth),
        ordersGrowth: parseFloat(ordersGrowth),
        successRate: parseFloat(successRate),
        verifiedApps: verifiedApps,
      }

      setStats(calculatedStats)
      setTopApplications(apps.slice(0, 5))
      setRevenueData(generateRevenueData(orders))
      setRecentActivity(generateActivityFeed(orders, apps))
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      // Set default stats on error
      setStats({
        totalApplications: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        revenueGrowth: 0,
        ordersGrowth: 0,
        successRate: 0,
        verifiedApps: 0,
      })
      setRevenueData([])
      setRecentActivity([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
      </Box>
    )
  }

  const statCards = [
    {
      title: 'Total Projects',
      value: stats?.totalApplications || 0,
      growth: '+2%',
      growthPositive: true,
      subtitle: 'from last month',
      icon: <Apps sx={{ fontSize: 28 }} />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      title: 'Active Users',
      value: stats?.totalOrders || 0,
      growth: `${stats?.ordersGrowth > 0 ? '+' : ''}${stats?.ordersGrowth}%`,
      growthPositive: stats?.ordersGrowth >= 0,
      subtitle: 'from last month',
      icon: <Person sx={{ fontSize: 28 }} />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      title: 'Revenue',
      value: formatCurrency(stats?.totalRevenue || 0, 'UGX'),
      growth: `${stats?.revenueGrowth > 0 ? '+' : ''}${stats?.revenueGrowth}%`,
      growthPositive: stats?.revenueGrowth >= 0,
      subtitle: 'from last month',
      icon: <AttachMoney sx={{ fontSize: 28 }} />,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      isRevenue: true,
    },
    {
      title: 'Success Rate',
      value: `${stats?.successRate || 0}%`,
      growth: `${stats?.successRate > 0 ? '+' : ''}2.1%`,
      growthPositive: true,
      subtitle: 'from last month',
      icon: <CheckCircle sx={{ fontSize: 28 }} />,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
  ]

  return (
    <Box sx={{ 
      position: 'relative',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0a0e27 100%)',
      overflow: 'hidden',
    }}>
      {/* Animated Code Background */}
      <AnimatedCodeBackground />

      {/* Main Content */}
      <Box sx={{ position: 'relative', zIndex: 1, p: 3 }}>
        {/* Welcome Header */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800, 
              mb: 0.5,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(102, 126, 234, 0.3)',
            }}
          >
            Overview
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Welcome back, {user?.name || 'Founder'} 👋
          </Typography>
        </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 3,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: card.gradient,
                  opacity: 0,
                  transition: 'opacity 0.4s',
                },
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 20px 60px ${alpha(card.gradient.match(/#[0-9a-f]{6}/i)?.[0] || '#667eea', 0.4)}`,
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.05)',
                  '&::before': {
                    opacity: 1,
                  },
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontWeight: 500 }}>
                    {card.title}
                  </Typography>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2.5,
                      background: card.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      boxShadow: `0 8px 24px ${alpha(card.gradient.match(/#[0-9a-f]{6}/i)?.[0] || '#667eea', 0.4)}`,
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'scale(1.1) rotate(5deg)',
                      },
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 800, 
                    color: 'white', 
                    mb: 1.5,
                    fontSize: card.isRevenue ? '1.8rem' : '2.5rem',
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  }}
                >
                  {card.value}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={card.growth}
                    size="small"
                    icon={card.growthPositive ? <ArrowUpward sx={{ fontSize: 14 }} /> : <ArrowDownward sx={{ fontSize: 14 }} />}
                    sx={{
                      bgcolor: card.growthPositive ? 'rgba(67, 233, 123, 0.15)' : 'rgba(245, 87, 108, 0.15)',
                      color: card.growthPositive ? '#43e97b' : '#f5576c',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      height: 26,
                      border: `1px solid ${card.growthPositive ? 'rgba(67, 233, 123, 0.3)' : 'rgba(245, 87, 108, 0.3)'}`,
                      '& .MuiChip-icon': {
                        color: card.growthPositive ? '#43e97b' : '#f5576c',
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                    {card.subtitle}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Revenue Chart */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 3,
              height: '100%',
              transition: 'all 0.3s',
              '&:hover': {
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
                    Revenue Overview
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                    {formatCurrency(stats?.totalRevenue || 0, 'UGX')}
                  </Typography>
                  <Chip
                    label={`${stats?.revenueGrowth > 0 ? '+' : ''}${stats?.revenueGrowth}% from last month`}
                    size="small"
                    sx={{
                      mt: 1,
                      bgcolor: 'rgba(67, 233, 123, 0.15)',
                      color: '#43e97b',
                      fontWeight: 700,
                      border: '1px solid rgba(67, 233, 123, 0.3)',
                    }}
                  />
                </Box>
              </Box>

              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#667eea" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    stroke="rgba(255,255,255,0.3)"
                    style={{ fontSize: '0.75rem' }}
                    tick={{ fill: 'rgba(255,255,255,0.6)' }}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.3)"
                    style={{ fontSize: '0.75rem' }}
                    tick={{ fill: 'rgba(255,255,255,0.6)' }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(10, 14, 39, 0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 12,
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#667eea" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)"
                    dot={{ fill: '#667eea', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Projects */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 3,
              height: '100%',
              transition: 'all 0.3s',
              '&:hover': {
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
                  Top Projects
                </Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/seller/applications')}
                  sx={{ 
                    color: '#667eea',
                    '&:hover': {
                      background: 'rgba(102, 126, 234, 0.1)',
                    },
                  }}
                >
                  View all
                </Button>
              </Box>

              <List sx={{ p: 0 }}>
                {topApplications.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Apps sx={{ fontSize: 48, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 2 }}>
                      No projects yet
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => navigate('/seller/applications/create')}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                        '&:hover': {
                          boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
                        },
                      }}
                    >
                      Create Project
                    </Button>
                  </Box>
                ) : (
                  topApplications.map((app, index) => (
                    <ListItem
                      key={app._id}
                      sx={{
                        px: 0,
                        py: 1.5,
                        borderBottom: index < topApplications.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                        cursor: 'pointer',
                        borderRadius: 2,
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.05)',
                          px: 2,
                        },
                      }}
                      onClick={() => navigate(`/seller/applications/preview/${app._id}`)}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: 'rgba(102, 126, 234, 0.2)',
                            color: '#667eea',
                            border: '2px solid rgba(102, 126, 234, 0.3)',
                          }}
                        >
                          <Code />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                            {app.appName}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                            {app.appCategory}
                          </Typography>
                        }
                      />
                      <Typography variant="body2" sx={{ color: '#667eea', fontWeight: 700 }}>
                        {formatCurrency(app.price, app.currency)}
                      </Typography>
                    </ListItem>
                  ))
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 3,
              transition: 'all 0.3s',
              '&:hover': {
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 3 }}>
                Recent Activity
              </Typography>

              <List sx={{ p: 0 }}>
                {recentActivity.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      No recent activity
                    </Typography>
                  </Box>
                ) : (
                  recentActivity.map((activity, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        px: 0,
                        py: 1.5,
                        borderBottom: index < recentActivity.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: alpha(activity.color, 0.2),
                            color: activity.color,
                            border: `2px solid ${alpha(activity.color, 0.3)}`,
                          }}
                        >
                          {activity.icon}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                            {activity.title}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                            {activity.description}
                          </Typography>
                        }
                      />
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                        {formatRelativeTime(activity.time)}
                      </Typography>
                    </ListItem>
                  ))
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 3,
              transition: 'all 0.3s',
              '&:hover': {
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 3 }}>
                Quick Actions
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/seller/applications/create')}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      py: 2,
                      justifyContent: 'flex-start',
                      boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
                      },
                    }}
                  >
                    New Project
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ShoppingCart />}
                    onClick={() => navigate('/seller/orders')}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      py: 2,
                      justifyContent: 'flex-start',
                      transition: 'all 0.3s',
                      '&:hover': {
                        borderColor: '#667eea',
                        bgcolor: 'rgba(102, 126, 234, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Orders
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<TrendingUp />}
                    onClick={() => navigate('/seller/marketing')}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      py: 2,
                      justifyContent: 'flex-start',
                      transition: 'all 0.3s',
                      '&:hover': {
                        borderColor: '#667eea',
                        bgcolor: 'rgba(102, 126, 234, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Marketing
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Apps />}
                    onClick={() => navigate('/seller/applications')}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      py: 2,
                      justifyContent: 'flex-start',
                      transition: 'all 0.3s',
                      '&:hover': {
                        borderColor: '#667eea',
                        bgcolor: 'rgba(102, 126, 234, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    All Projects
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      </Box>
    </Box>
  )
}

export default SellerDashboard
