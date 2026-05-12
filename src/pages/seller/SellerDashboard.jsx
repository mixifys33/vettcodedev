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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Breadcrumbs,
  Link,
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
  NavigateNext,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
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
      <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', p: 3 }}>
        <LinearProgress sx={{ borderRadius: 0.5, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: '#4F46E5' } }} />
      </Box>
    )
  }

  const statCards = [
    {
      title: 'Total Applications',
      value: stats?.totalApplications || 0,
      growth: '+2%',
      growthPositive: true,
      icon: <Apps sx={{ fontSize: 20 }} />,
      color: '#4F46E5',
      bgColor: 'rgba(79, 70, 229, 0.08)',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      growth: `${stats?.ordersGrowth > 0 ? '+' : ''}${stats?.ordersGrowth}%`,
      growthPositive: stats?.ordersGrowth >= 0,
      icon: <ShoppingCart sx={{ fontSize: 20 }} />,
      color: '#7C3AED',
      bgColor: 'rgba(124, 58, 237, 0.08)',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.totalRevenue || 0, 'UGX'),
      growth: `${stats?.revenueGrowth > 0 ? '+' : ''}${stats?.revenueGrowth}%`,
      growthPositive: stats?.revenueGrowth >= 0,
      icon: <AttachMoney sx={{ fontSize: 20 }} />,
      color: '#059669',
      bgColor: 'rgba(5, 150, 105, 0.08)',
      isRevenue: true,
    },
    {
      title: 'Success Rate',
      value: `${stats?.successRate || 0}%`,
      growth: '+2.1%',
      growthPositive: true,
      icon: <CheckCircle sx={{ fontSize: 20 }} />,
      color: '#2563EB',
      bgColor: 'rgba(37, 99, 235, 0.08)',
    },
  ]

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh' }}>
      {/* Top Navigation Bar */}
      <Box 
        sx={{ 
          bgcolor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          px: 3,
          py: 2,
          mb: 3,
        }}
      >
        <Breadcrumbs 
          separator={<NavigateNext fontSize="small" sx={{ color: '#94A3B8' }} />}
          sx={{ mb: 1 }}
        >
          <Link 
            underline="hover" 
            color="inherit" 
            href="/seller"
            sx={{ 
              color: '#64748B',
              fontSize: '14px',
              fontWeight: 500,
              '&:hover': { color: '#4F46E5' },
            }}
          >
            Dashboard
          </Link>
          <Typography sx={{ color: '#0F172A', fontSize: '14px', fontWeight: 600 }}>
            Overview
          </Typography>
        </Breadcrumbs>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600, 
            color: '#0F172A',
            fontSize: '24px',
            letterSpacing: '-0.01em',
          }}
        >
          Welcome back, {user?.name || 'Founder'}
        </Typography>
      </Box>

      <Box sx={{ px: 3, pb: 3 }}>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card
              sx={{
                bgcolor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                boxShadow: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                  borderColor: '#CBD5E1',
                },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#64748B', 
                      fontSize: '14px', 
                      fontWeight: 500,
                      letterSpacing: '0.01em',
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '6px',
                      bgcolor: card.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: card.color,
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#0F172A', 
                      fontSize: card.isRevenue ? '20px' : '28px',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {card.value}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: card.growthPositive ? '#059669' : '#DC2626',
                      fontSize: '12px',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.25,
                    }}
                  >
                    {card.growthPositive ? <ArrowUpward sx={{ fontSize: 12 }} /> : <ArrowDownward sx={{ fontSize: 12 }} />}
                    {card.growth}
                  </Typography>
                </Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#94A3B8', 
                    fontSize: '12px',
                    mt: 0.5,
                    display: 'block',
                  }}
                >
                  vs last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<Drafts sx={{ fontSize: 18 }} />}
          onClick={() => navigate('/seller/drafts')}
          sx={{
            textTransform: 'none',
            color: '#4F46E5',
            borderColor: '#E2E8F0',
            bgcolor: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 500,
            px: 2,
            py: 1,
            '&:hover': {
              borderColor: '#4F46E5',
              bgcolor: 'rgba(79, 70, 229, 0.04)',
            },
          }}
        >
          View Drafts
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Revenue Chart */}
        <Grid item xs={12} lg={8}>
          <Card
            sx={{
              bgcolor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              boxShadow: 'none',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#0F172A', 
                      mb: 0.5,
                      fontSize: '18px',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    Revenue Overview
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#64748B',
                      fontSize: '14px',
                    }}
                  >
                    Last 30 days performance
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: stats?.revenueGrowth >= 0 ? '#059669' : '#DC2626',
                    fontSize: '14px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  {stats?.revenueGrowth >= 0 ? <ArrowUpward sx={{ fontSize: 16 }} /> : <ArrowDownward sx={{ fontSize: 16 }} />}
                  {`${stats?.revenueGrowth > 0 ? '+' : ''}${stats?.revenueGrowth}%`}
                </Typography>
              </Box>

              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={revenueData}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#E2E8F0" 
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94A3B8"
                    style={{ fontSize: '12px' }}
                    tick={{ fill: '#64748B' }}
                    axisLine={{ stroke: '#E2E8F0' }}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#94A3B8"
                    style={{ fontSize: '12px' }}
                    tick={{ fill: '#64748B' }}
                    axisLine={{ stroke: '#E2E8F0' }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: 8,
                      color: '#0F172A',
                      fontSize: '14px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#4F46E5" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: '#4F46E5' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} lg={4}>
          <Card
            sx={{
              bgcolor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              boxShadow: 'none',
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#0F172A',
                    fontSize: '18px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Recent Activity
                </Typography>
              </Box>

              <List sx={{ p: 0 }}>
                {recentActivity.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '14px' }}>
                      No recent activity
                    </Typography>
                  </Box>
                ) : (
                  recentActivity.map((activity, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        px: 0,
                        py: 2,
                        borderBottom: index < recentActivity.length - 1 ? '1px solid #F1F5F9' : 'none',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '6px',
                          bgcolor: `${activity.color}14`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: activity.color,
                          mr: 2,
                          flexShrink: 0,
                          '& svg': { fontSize: 18 },
                        }}
                      >
                        {activity.icon}
                      </Box>
                      <ListItemText
                        primary={
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#0F172A', 
                              fontWeight: 600,
                              fontSize: '14px',
                              mb: 0.25,
                            }}
                          >
                            {activity.title}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: '#64748B',
                                fontSize: '13px',
                                display: 'block',
                                mb: 0.5,
                              }}
                            >
                              {activity.description}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: '#94A3B8',
                                fontSize: '12px',
                              }}
                            >
                              {formatRelativeTime(activity.time)}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Applications Table */}
        <Grid item xs={12}>
          <Card
            sx={{
              bgcolor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              boxShadow: 'none',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#0F172A',
                    fontSize: '18px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Top Applications
                </Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
                  onClick={() => navigate('/seller/applications')}
                  sx={{ 
                    color: '#4F46E5',
                    textTransform: 'none',
                    fontSize: '14px',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: 'rgba(79, 70, 229, 0.04)',
                    },
                  }}
                >
                  View all
                </Button>
              </Box>

              {topApplications.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Apps sx={{ fontSize: 48, color: '#CBD5E1', mb: 2 }} />
                  <Typography variant="body2" sx={{ color: '#64748B', mb: 3, fontSize: '14px' }}>
                    No applications yet
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/seller/applications/create')}
                    sx={{
                      bgcolor: '#4F46E5',
                      textTransform: 'none',
                      fontSize: '14px',
                      fontWeight: 500,
                      px: 3,
                      py: 1,
                      boxShadow: 'none',
                      '&:hover': {
                        bgcolor: '#4338CA',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    Create Application
                  </Button>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell 
                          sx={{ 
                            color: '#64748B', 
                            fontWeight: 600, 
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            borderBottom: '1px solid #E2E8F0',
                            py: 1.5,
                          }}
                        >
                          Application
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            color: '#64748B', 
                            fontWeight: 600, 
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            borderBottom: '1px solid #E2E8F0',
                            py: 1.5,
                          }}
                        >
                          Category
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            color: '#64748B', 
                            fontWeight: 600, 
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            borderBottom: '1px solid #E2E8F0',
                            py: 1.5,
                          }}
                        >
                          Status
                        </TableCell>
                        <TableCell 
                          align="right"
                          sx={{ 
                            color: '#64748B', 
                            fontWeight: 600, 
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            borderBottom: '1px solid #E2E8F0',
                            py: 1.5,
                          }}
                        >
                          Price
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topApplications.map((app) => (
                        <TableRow
                          key={app._id}
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: '#F8FAFC',
                            },
                            '&:last-child td': {
                              borderBottom: 0,
                            },
                          }}
                          onClick={() => navigate(`/seller/applications/preview/${app._id}`)}
                        >
                          <TableCell 
                            sx={{ 
                              borderBottom: '1px solid #F1F5F9',
                              py: 2,
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Box
                                sx={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: '6px',
                                  bgcolor: 'rgba(79, 70, 229, 0.08)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#4F46E5',
                                }}
                              >
                                <Code sx={{ fontSize: 16 }} />
                              </Box>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: '#0F172A', 
                                  fontWeight: 500,
                                  fontSize: '14px',
                                }}
                              >
                                {app.appName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell 
                            sx={{ 
                              color: '#64748B',
                              fontSize: '14px',
                              borderBottom: '1px solid #F1F5F9',
                              py: 2,
                            }}
                          >
                            {app.appCategory}
                          </TableCell>
                          <TableCell 
                            sx={{ 
                              borderBottom: '1px solid #F1F5F9',
                              py: 2,
                            }}
                          >
                            <Chip
                              label={app.verificationStatus === 'verified' ? 'Verified' : 'Pending'}
                              size="small"
                              sx={{
                                bgcolor: app.verificationStatus === 'verified' ? 'rgba(5, 150, 105, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                color: app.verificationStatus === 'verified' ? '#059669' : '#D97706',
                                fontSize: '12px',
                                fontWeight: 500,
                                height: 24,
                                border: `1px solid ${app.verificationStatus === 'verified' ? 'rgba(5, 150, 105, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
                              }}
                            />
                          </TableCell>
                          <TableCell 
                            align="right"
                            sx={{ 
                              color: '#0F172A',
                              fontWeight: 600,
                              fontSize: '14px',
                              borderBottom: '1px solid #F1F5F9',
                              py: 2,
                            }}
                          >
                            {formatCurrency(app.price, app.currency)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      </Box>
    </Box>
  )
}

export default SellerDashboard
