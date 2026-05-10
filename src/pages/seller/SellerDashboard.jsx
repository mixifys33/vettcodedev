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
  Drafts,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../../utils/api'
import useAuthStore from '../../store/authStore'
import { formatCurrency, formatRelativeTime } from '../../utils/helpers'

const SellerDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [topApplications, setTopApplications] = useState([])
  const [revenueData, setRevenueData] = useState([])
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

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

  const generateActivityFeed = (orders, apps) => {
    const activities = []
    
    orders.slice(0, 3).forEach(order => {
      activities.push({
        type: 'order',
        title: 'New Order',
        description: `Order #${order._id.slice(-6)} - ${formatCurrency(order.total, order.currency)}`,
        time: order.createdAt,
        icon: <ShoppingCart />,
        color: '#6366f1',
      })
    })
    
    apps.slice(0, 2).forEach(app => {
      activities.push({
        type: 'app',
        title: app.verificationStatus === 'verified' ? 'App Verified' : 'App Submitted',
        description: app.appName,
        time: app.createdAt,
        icon: <CheckCircle />,
        color: '#8b5cf6',
      })
    })
    
    return activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5)
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const sellerId = user?.id || user?._id

      const [ordersRes, appsRes] = await Promise.all([
        api.get(`/orders?sellerId=${sellerId}`).catch(() => ({ data: { success: false, orders: [] } })),
        api.get(`/applications/seller/${sellerId}`).catch(() => ({ data: { success: false, applications: [] } })),
      ])

      const orders = ordersRes.data.orders || []
      const apps = appsRes.data.applications || []

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
      <Box sx={{ p: 3 }}>
        <LinearProgress sx={{ borderRadius: 1, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: '#6366f1' } }} />
      </Box>
    )
  }

  const statCards = [
    {
      title: 'Total Applications',
      value: stats?.totalApplications || 0,
      growth: '+2%',
      growthPositive: true,
      icon: <Apps sx={{ fontSize: 24 }} />,
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      growth: `${stats?.ordersGrowth > 0 ? '+' : ''}${stats?.ordersGrowth}%`,
      growthPositive: stats?.ordersGrowth >= 0,
      icon: <ShoppingCart sx={{ fontSize: 24 }} />,
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.totalRevenue || 0, 'UGX'),
      growth: `${stats?.revenueGrowth > 0 ? '+' : ''}${stats?.revenueGrowth}%`,
      growthPositive: stats?.revenueGrowth >= 0,
      icon: <AttachMoney sx={{ fontSize: 24 }} />,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      isRevenue: true,
    },
    {
      title: 'Success Rate',
      value: `${stats?.successRate || 0}%`,
      growth: '+2.1%',
      growthPositive: true,
      icon: <CheckCircle sx={{ fontSize: 24 }} />,
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    },
  ]

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            color: 'white',
            mb: 0.5,
          }}
        >
          Welcome back, {user?.name || 'Founder'}! 👋
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
          Here's what's happening with your applications today
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card
              sx={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 2,
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  boxShadow: '0 12px 40px rgba(99, 102, 241, 0.2)',
                },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', fontWeight: 500 }}>
                    {card.title}
                  </Typography>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1.5,
                      background: card.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      boxShadow: `0 4px 12px ${alpha(card.gradient.match(/#[0-9a-f]{6}/i)?.[0] || '#6366f1', 0.4)}`,
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700, 
                    color: 'white', 
                    mb: 1,
                    fontSize: card.isRevenue ? '1.5rem' : '2rem',
                  }}
                >
                  {card.value}
                </Typography>
                <Chip
                  label={card.growth}
                  size="small"
                  icon={card.growthPositive ? <ArrowUpward sx={{ fontSize: 14 }} /> : <ArrowDownward sx={{ fontSize: 14 }} />}
                  sx={{
                    bgcolor: card.growthPositive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: card.growthPositive ? '#10b981' : '#ef4444',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    height: 24,
                    border: `1px solid ${card.growthPositive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                    '& .MuiChip-icon': {
                      color: card.growthPositive ? '#10b981' : '#ef4444',
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.2)',
                },
              }}
              onClick={() => navigate('/seller/drafts')}
            >
              <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 1.5,
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
                  }}
                >
                  <Drafts sx={{ fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>
                    View
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'white' }}>
                    Drafts
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {/* Revenue Chart */}
        <Grid item xs={12} lg={8}>
          <Card
            sx={{
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', mb: 0.5 }}>
                    Revenue Overview
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    Last 30 days performance
                  </Typography>
                </Box>
                <Chip
                  label={`${stats?.revenueGrowth > 0 ? '+' : ''}${stats?.revenueGrowth}%`}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981',
                    fontWeight: 600,
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                  }}
                />
              </Box>

              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    stroke="rgba(255,255,255,0.2)"
                    style={{ fontSize: '0.75rem' }}
                    tick={{ fill: 'rgba(255,255,255,0.5)' }}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.2)"
                    style={{ fontSize: '0.75rem' }}
                    tick={{ fill: 'rgba(255,255,255,0.5)' }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8,
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#6366f1" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Applications */}
        <Grid item xs={12} lg={4}>
          <Card
            sx={{
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 2,
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                  Top Applications
                </Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/seller/applications')}
                  sx={{ 
                    color: '#6366f1',
                    textTransform: 'none',
                    '&:hover': {
                      background: 'rgba(99, 102, 241, 0.1)',
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
                      No applications yet
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => navigate('/seller/applications/create')}
                      sx={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        textTransform: 'none',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                      }}
                    >
                      Create Application
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
                        borderRadius: 1,
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.05)',
                          px: 1.5,
                        },
                      }}
                      onClick={() => navigate(`/seller/applications/preview/${app._id}`)}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: 'rgba(99, 102, 241, 0.2)',
                            color: '#6366f1',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
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
                      <Typography variant="body2" sx={{ color: '#6366f1', fontWeight: 600 }}>
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
        <Grid item xs={12}>
          <Card
            sx={{
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', mb: 3 }}>
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
                            border: `1px solid ${alpha(activity.color, 0.3)}`,
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
      </Grid>
    </Box>
  )
}

export default SellerDashboard
