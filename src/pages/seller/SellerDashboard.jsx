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
  ArrowUpward,
  ArrowDownward,
  ArrowForward,
  CheckCircle,
  Code,
  AttachMoney,
  Add,
  Drafts,
  NavigateNext,
  Download,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import api from '../../utils/api'
import useAuthStore from '../../store/authStore'
import { formatCurrency, formatRelativeTime } from '../../utils/helpers'
import { colors } from '../../theme/tokens'

const isPaidApplication = (app) => {
  if (app.isFree === true) return false
  if (app.isFree === false) return true
  return Number(app.price) > 0
}

const applicationRevenue = (app) => {
  if (!isPaidApplication(app)) return 0
  return (Number(app.price) || 0) * (app.downloads || 0)
}

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

  const generateDownloadsChartData = (apps) =>
    [...apps]
      .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
      .slice(0, 7)
      .map((app) => ({
        date: app.appName?.length > 12 ? `${app.appName.slice(0, 12)}…` : app.appName,
        downloads: app.downloads || 0,
      }))

  const generateActivityFeed = (apps) =>
    [...apps]
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
      .slice(0, 5)
      .map((app) => ({
        type: 'app',
        title:
          app.verificationStatus === 'verified'
            ? 'App Verified'
            : app.verificationStatus === 'rejected'
              ? 'App Rejected'
              : 'Application Updated',
        description: app.appName,
        time: app.updatedAt || app.createdAt,
        icon: <CheckCircle />,
        color: '#8b5cf6',
      }))

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const sellerId = user?.id || user?._id

      const appsRes = await api
        .get(`/applications/seller/${sellerId}`)
        .catch(() => ({ data: { success: false, applications: [] } }))

      const apps = appsRes.data.applications || []
      const totalDownloads = apps.reduce((sum, a) => sum + (a.downloads || 0), 0)
      const totalRevenue = apps.reduce((sum, a) => sum + applicationRevenue(a), 0)
      const verifiedApps = apps.filter((a) => a.verificationStatus === 'verified').length
      const successRate = apps.length > 0 ? ((verifiedApps / apps.length) * 100).toFixed(1) : 0

      setStats({
        totalApplications: apps.length,
        totalDownloads,
        totalRevenue,
        successRate: parseFloat(successRate),
        verifiedApps,
      })
      setTopApplications([...apps].sort((a, b) => (b.downloads || 0) - (a.downloads || 0)).slice(0, 5))
      setRevenueData(generateDownloadsChartData(apps))
      setRecentActivity(generateActivityFeed(apps))
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setStats({
        totalApplications: 0,
        totalDownloads: 0,
        totalRevenue: 0,
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
      <Box sx={{ bgcolor: colors.pageBackground, minHeight: '100vh', p: 3 }}>
        <LinearProgress sx={{ borderRadius: 0.5, bgcolor: colors.border, '& .MuiLinearProgress-bar': { bgcolor: colors.primary } }} />
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
      color: colors.primary,
      bgColor: colors.primaryBg,
    },
    {
      title: 'Total Downloads',
      value: (stats?.totalDownloads || 0).toLocaleString(),
      growth: `${stats?.verifiedApps || 0} verified`,
      growthPositive: true,
      icon: <Download sx={{ fontSize: 20 }} />,
      color: '#7C3AED',
      bgColor: 'rgba(124, 58, 237, 0.08)',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.totalRevenue || 0, 'USD'),
      growth: 'paid downloads × price',
      growthPositive: true,
      icon: <AttachMoney sx={{ fontSize: 20 }} />,
      color: colors.success,
      bgColor: colors.successBg,
      isRevenue: true,
    },
    {
      title: 'Success Rate',
      value: `${stats?.successRate || 0}%`,
      growth: '+2.1%',
      growthPositive: true,
      icon: <CheckCircle sx={{ fontSize: 20 }} />,
      color: colors.info,
      bgColor: colors.infoBg,
    },
  ]

  return (
    <Box sx={{ bgcolor: colors.pageBackground, minHeight: '100vh' }}>
      {/* Top Navigation Bar */}
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
            color="inherit" 
            href="/seller"
            sx={{ 
              color: colors.textSecondary,
              fontSize: '14px',
              fontWeight: 500,
              '&:hover': { color: colors.primary },
            }}
          >
            Dashboard
          </Link>
          <Typography sx={{ color: colors.textPrimary, fontSize: '14px', fontWeight: 600 }}>
            Overview
          </Typography>
        </Breadcrumbs>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600, 
            color: colors.textPrimary,
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
                bgcolor: colors.cardBackground,
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                boxShadow: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                  borderColor: colors.slate300,
                },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: colors.textSecondary, 
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
                      color: colors.textPrimary, 
                      fontSize: card.isRevenue ? '20px' : '28px',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {card.value}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: card.growthPositive ? colors.success : colors.error,
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
                    color: colors.slate400, 
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
            color: colors.primary,
            borderColor: colors.border,
            bgcolor: colors.cardBackground,
            fontSize: '14px',
            fontWeight: 500,
            px: 2,
            py: 1,
            '&:hover': {
              borderColor: colors.primary,
              bgcolor: colors.primaryBg,
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
                    Downloads by Application
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#64748B',
                      fontSize: '14px',
                    }}
                  >
                    Top apps by download count
                  </Typography>
                </Box>
                <Button
                  size="small"
                  endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
                  onClick={() => navigate('/seller/analytics')}
                  sx={{
                    color: '#4F46E5',
                    textTransform: 'none',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  Analytics
                </Button>
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
                    dataKey="downloads" 
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
