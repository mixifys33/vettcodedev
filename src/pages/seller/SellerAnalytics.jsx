import { useState, useEffect, useMemo } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar,
  Breadcrumbs,
  Link,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  Visibility,
  Download,
  Star,
  Apps,
  TrendingUp,
  AttachMoney,
  Refresh,
  FileDownload,
  Search,
  NavigateNext,
  OpenInNew,
  Percent,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import api from '../../utils/api'
import useAuthStore from '../../store/authStore'
import { formatCurrency } from '../../utils/helpers'
import { colors } from '../../theme/tokens'

const CHART_COLORS = ['#4F46E5', '#7C3AED', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899']

const STATUS_COLORS = {
  verified: { bg: colors.successBg, color: colors.successText },
  pending: { bg: colors.warningBg, color: colors.warningText },
  rejected: { bg: colors.errorBg, color: colors.errorText },
}

const isPaidApplication = (app) => {
  if (app.isFree === true) return false
  if (app.isFree === false) return true
  return Number(app.price) > 0
}

const applicationRevenue = (app) => {
  if (!isPaidApplication(app)) return 0
  return (Number(app.price) || 0) * (app.downloads || 0)
}

const buildAnalyticsFromApplications = (applications) => {
  const totalViews = applications.reduce((s, a) => s + (a.views || 0), 0)
  const totalDownloads = applications.reduce((s, a) => s + (a.downloads || 0), 0)
  const paidApplications = applications.filter(isPaidApplication)
  const paidDownloads = paidApplications.reduce((s, a) => s + (a.downloads || 0), 0)
  const totalRevenue = paidApplications.reduce((s, a) => s + applicationRevenue(a), 0)
  const totalReviews = applications.reduce((s, a) => s + (a.reviewCount || 0), 0)
  const ratedApps = applications.filter((a) => (a.rating || 0) > 0)
  const averageRating =
    ratedApps.length > 0
      ? ratedApps.reduce((s, a) => s + a.rating, 0) / ratedApps.length
      : 0
  const conversionRate =
    totalViews > 0 ? Number(((totalDownloads / totalViews) * 100).toFixed(1)) : 0

  const categoryMap = {}
  applications.forEach((app) => {
    const cat = app.appCategory || 'Uncategorized'
    if (!categoryMap[cat]) {
      categoryMap[cat] = { category: cat, count: 0, views: 0, downloads: 0, revenue: 0 }
    }
    categoryMap[cat].count += 1
    categoryMap[cat].views += app.views || 0
    categoryMap[cat].downloads += app.downloads || 0
    categoryMap[cat].revenue += applicationRevenue(app)
  })

  const appAnalytics = applications.map((app) => {
    const views = app.views || 0
    const downloads = app.downloads || 0
    const paid = isPaidApplication(app)
    return {
      ...app,
      isPaid: paid,
      isFree: !paid,
      currency: app.currency || 'USD',
      views,
      downloads,
      rating: app.rating || 0,
      reviewCount: app.reviewCount || 0,
      conversionRate: views > 0 ? Number(((downloads / views) * 100).toFixed(1)) : 0,
      revenue: applicationRevenue(app),
    }
  })

  return {
    summary: {
      totalApplications: applications.length,
      paidApplications: paidApplications.length,
      freeApplications: applications.length - paidApplications.length,
      verifiedApplications: applications.filter((a) => a.verificationStatus === 'verified').length,
      totalViews,
      totalDownloads,
      paidDownloads,
      totalReviews,
      averageRating: Number(averageRating.toFixed(1)),
      conversionRate,
      totalRevenue: Number(totalRevenue.toFixed(2)),
    },
    applications: appAnalytics,
    categoryBreakdown: Object.values(categoryMap),
    topByDownloads: [...appAnalytics].sort((a, b) => b.downloads - a.downloads).slice(0, 5),
    topByViews: [...appAnalytics].sort((a, b) => b.views - a.views).slice(0, 5),
    topByRevenue: [...appAnalytics].sort((a, b) => b.revenue - a.revenue).slice(0, 5),
  }
}

const SellerAnalytics = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [pricingFilter, setPricingFilter] = useState('all')
  const [sortBy, setSortBy] = useState('downloads')
  const [sortOrder, setSortOrder] = useState('desc')

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const sellerId = user?.id || user?._id

      try {
        const res = await api.get(`/applications/seller/${sellerId}/analytics`, {
          silentError: true,
        })
        if (res.data?.success) {
          setData(res.data)
          return
        }
      } catch {
        // Fallback when analytics endpoint is not deployed yet
      }

      const appsRes = await api.get(`/applications/seller/${sellerId}`)
      const applications = appsRes.data.applications || []
      setData({ success: true, ...buildAnalyticsFromApplications(applications) })
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      setData({
        success: true,
        summary: {
          totalApplications: 0,
          paidApplications: 0,
          freeApplications: 0,
          verifiedApplications: 0,
          totalViews: 0,
          totalDownloads: 0,
          paidDownloads: 0,
          totalReviews: 0,
          averageRating: 0,
          conversionRate: 0,
          totalRevenue: 0,
        },
        applications: [],
        categoryBreakdown: [],
        topByDownloads: [],
        topByViews: [],
        topByRevenue: [],
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchAnalytics()
  }, [user])

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const filteredApps = useMemo(() => {
    if (!data?.applications) return []
    let apps = [...data.applications]
    if (search.trim()) {
      const q = search.toLowerCase()
      apps = apps.filter(
        (a) =>
          a.appName?.toLowerCase().includes(q) ||
          a.appCategory?.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== 'all') {
      apps = apps.filter((a) => a.verificationStatus === statusFilter)
    }
    if (pricingFilter === 'paid') {
      apps = apps.filter((a) => a.isPaid)
    } else if (pricingFilter === 'free') {
      apps = apps.filter((a) => !a.isPaid)
    }
    apps.sort((a, b) => {
      const av = a[sortBy] ?? 0
      const bv = b[sortBy] ?? 0
      if (typeof av === 'string') {
        return sortOrder === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      }
      return sortOrder === 'asc' ? av - bv : bv - av
    })
    return apps
  }, [data, search, statusFilter, pricingFilter, sortBy, sortOrder])

  const exportCsv = () => {
    if (!filteredApps.length) return
    const headers = [
      'Application',
      'Category',
      'Status',
      'Pricing',
      'Price (USD)',
      'Views',
      'Downloads',
      'Conversion %',
      'Rating',
      'Reviews',
      'Revenue (USD)',
    ]
    const rows = filteredApps.map((a) => [
      a.appName,
      a.appCategory || '',
      a.verificationStatus || '',
      a.isPaid ? 'Paid' : 'Free',
      a.isPaid ? a.price : 0,
      a.views,
      a.downloads,
      a.conversionRate,
      a.rating,
      a.reviewCount,
      a.revenue,
    ])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `vettcode-analytics-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const summary = data?.summary || {}
  const statCards = [
    {
      title: 'Total Views',
      value: (summary.totalViews || 0).toLocaleString(),
      icon: <Visibility sx={{ fontSize: 20 }} />,
      color: colors.info,
      bgColor: colors.infoBg,
    },
    {
      title: 'Total Downloads',
      value: (summary.totalDownloads || 0).toLocaleString(),
      subtitle: `${summary.paidDownloads || 0} on paid apps`,
      icon: <Download sx={{ fontSize: 20 }} />,
      color: colors.primary,
      bgColor: colors.primaryBg,
    },
    {
      title: 'Conversion Rate',
      value: `${summary.conversionRate || 0}%`,
      subtitle: 'downloads / views',
      icon: <Percent sx={{ fontSize: 20 }} />,
      color: '#7C3AED',
      bgColor: 'rgba(124, 58, 237, 0.08)',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(summary.totalRevenue || 0, 'USD'),
      subtitle: 'paid apps: downloads × price',
      icon: <AttachMoney sx={{ fontSize: 20 }} />,
      color: colors.success,
      bgColor: colors.successBg,
    },
    {
      title: 'Avg. Rating',
      value: summary.averageRating || '0.0',
      subtitle: `${summary.totalReviews || 0} reviews`,
      icon: <Star sx={{ fontSize: 20 }} />,
      color: colors.warning,
      bgColor: colors.warningBg,
    },
    {
      title: 'Live Applications',
      value: summary.totalApplications || 0,
      subtitle: `${summary.paidApplications || 0} paid · ${summary.freeApplications || 0} free`,
      icon: <Apps sx={{ fontSize: 20 }} />,
      color: colors.primary,
      bgColor: colors.primaryBg,
    },
  ]

  const downloadsChartData = (data?.topByDownloads || []).map((a) => ({
    name: a.appName?.length > 18 ? `${a.appName.slice(0, 18)}…` : a.appName,
    downloads: a.downloads,
  }))

  const revenueChartData = (data?.topByRevenue || [])
    .filter((a) => a.revenue > 0)
    .map((a) => ({
      name: a.appName?.length > 18 ? `${a.appName.slice(0, 18)}…` : a.appName,
      revenue: a.revenue,
    }))

  const categoryPieData = (data?.categoryBreakdown || []).map((c) => ({
    name: c.category,
    value: c.downloads || c.count,
  }))

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
            href="/seller/dashboard"
            sx={{ color: colors.textSecondary, fontSize: '14px', fontWeight: 500 }}
          >
            Dashboard
          </Link>
          <Typography sx={{ color: colors.textPrimary, fontSize: '14px', fontWeight: 600 }}>
            Analytics
          </Typography>
        </Breadcrumbs>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: colors.textPrimary, fontSize: '24px' }}>
              Seller Analytics
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary, mt: 0.5 }}>
              Views, downloads, and revenue from your paid applications (downloads × price in USD)
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchAnalytics}
              sx={{ textTransform: 'none', borderColor: colors.border, color: colors.textSecondary }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<FileDownload />}
              onClick={exportCsv}
              disabled={!filteredApps.length}
              sx={{
                textTransform: 'none',
                bgcolor: colors.primary,
                '&:hover': { bgcolor: colors.primaryDark },
              }}
            >
              Export CSV
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: 3, pb: 4 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {statCards.map((card, index) => (
            <Grid item xs={12} sm={6} lg={4} key={index}>
              <Card
                sx={{
                  bgcolor: colors.cardBackground,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  boxShadow: 'none',
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="body2" sx={{ color: colors.textSecondary, fontWeight: 500 }}>
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
                  <Typography variant="h4" sx={{ fontWeight: 600, color: colors.textPrimary, fontSize: '26px' }}>
                    {card.value}
                  </Typography>
                  {card.subtitle && (
                    <Typography variant="caption" sx={{ color: colors.slate400, mt: 0.5, display: 'block' }}>
                      {card.subtitle}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} lg={8}>
            <Card sx={{ bgcolor: colors.cardBackground, border: `1px solid ${colors.border}`, borderRadius: '8px', boxShadow: 'none' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Top Apps by Revenue
                </Typography>
                <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>
                  Paid applications only — downloads × price (USD)
                </Typography>
                {revenueChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={revenueChartData} layout="vertical" margin={{ left: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={colors.border} horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} />
                      <RechartsTooltip formatter={(value) => formatCurrency(value, 'USD')} />
                      <Bar dataKey="revenue" fill={colors.success} radius={[0, 4, 4, 0]} name="Revenue" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography variant="body2" sx={{ color: colors.textSecondary, py: 10, textAlign: 'center' }}>
                    No paid app revenue yet. Revenue appears when paid apps receive downloads.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card sx={{ bgcolor: colors.cardBackground, border: `1px solid ${colors.border}`, borderRadius: '8px', boxShadow: 'none', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  By Category
                </Typography>
                <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>
                  Downloads per category
                </Typography>
                {categoryPieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie data={categoryPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {categoryPieData.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography variant="body2" sx={{ color: colors.textSecondary, py: 8, textAlign: 'center' }}>
                    No category data yet
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: colors.cardBackground, border: `1px solid ${colors.border}`, borderRadius: '8px', boxShadow: 'none' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Top Apps by Downloads
                </Typography>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={downloadsChartData} layout="vertical" margin={{ left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.border} horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
                    <RechartsTooltip />
                    <Bar dataKey="downloads" fill={colors.primary} radius={[0, 4, 4, 0]} name="Downloads" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: colors.cardBackground, border: `1px solid ${colors.border}`, borderRadius: '8px', boxShadow: 'none' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Top Apps by Views
                </Typography>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart
                    data={(data?.topByViews || []).map((a) => ({
                      name: a.appName?.length > 18 ? `${a.appName.slice(0, 18)}…` : a.appName,
                      views: a.views,
                    }))}
                    layout="vertical"
                    margin={{ left: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.border} horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
                    <RechartsTooltip />
                    <Bar dataKey="views" fill="#7C3AED" radius={[0, 4, 4, 0]} name="Views" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ bgcolor: colors.cardBackground, border: `1px solid ${colors.border}`, borderRadius: '8px', boxShadow: 'none' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp sx={{ color: colors.primary }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Application Performance
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  size="small"
                  placeholder="Search applications..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ fontSize: 18, color: colors.slate400 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: 220 }}
                />
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Pricing</InputLabel>
                  <Select value={pricingFilter} label="Pricing" onChange={(e) => setPricingFilter(e.target.value)}>
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="paid">Paid</MenuItem>
                    <MenuItem value="free">Free</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel>Status</InputLabel>
                  <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="verified">Verified</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Application</TableCell>
                    <TableCell>
                      <TableSortLabel active={sortBy === 'verificationStatus'} direction={sortOrder} onClick={() => handleSort('verificationStatus')}>
                        Status
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">
                      <TableSortLabel active={sortBy === 'views'} direction={sortOrder} onClick={() => handleSort('views')}>
                        Views
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel active={sortBy === 'downloads'} direction={sortOrder} onClick={() => handleSort('downloads')}>
                        Downloads
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel active={sortBy === 'conversionRate'} direction={sortOrder} onClick={() => handleSort('conversionRate')}>
                        Conversion
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel active={sortBy === 'rating'} direction={sortOrder} onClick={() => handleSort('rating')}>
                        Rating
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel active={sortBy === 'revenue'} direction={sortOrder} onClick={() => handleSort('revenue')}>
                        Revenue
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredApps.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 6, color: colors.textSecondary }}>
                        No applications match your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApps.map((app) => {
                      const statusStyle = STATUS_COLORS[app.verificationStatus] || STATUS_COLORS.pending
                      const thumb =
                        app.appIcon?.url ||
                        app.screenshots?.[0]?.url ||
                        null
                      return (
                        <TableRow key={app._id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar src={thumb} variant="rounded" sx={{ width: 40, height: 40, bgcolor: colors.primaryBg }}>
                                {app.appName?.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {app.appName}
                                </Typography>
                                <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                                  {app.appCategory || 'Uncategorized'}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={app.verificationStatus || 'pending'}
                              size="small"
                              sx={{
                                bgcolor: statusStyle.bg,
                                color: statusStyle.color,
                                fontWeight: 600,
                                textTransform: 'capitalize',
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            {app.isPaid ? (
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {formatCurrency(app.price || 0, 'USD')}
                              </Typography>
                            ) : (
                              <Chip label="Free" size="small" sx={{ bgcolor: colors.infoBg, color: colors.infoText, fontWeight: 600 }} />
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                              <Visibility sx={{ fontSize: 14, color: colors.slate400 }} />
                              {(app.views || 0).toLocaleString()}
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                              <Download sx={{ fontSize: 14, color: colors.slate400 }} />
                              {(app.downloads || 0).toLocaleString()}
                            </Box>
                          </TableCell>
                          <TableCell align="right">{app.conversionRate}%</TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                              <Star sx={{ fontSize: 14, color: colors.warning }} />
                              {app.rating?.toFixed(1) || '0.0'}
                              <Typography component="span" variant="caption" sx={{ color: colors.slate400 }}>
                                ({app.reviewCount || 0})
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>
                            {app.isPaid ? (
                              <Tooltip title={`${app.downloads} downloads × ${formatCurrency(app.price || 0, 'USD')}`}>
                                <span>{formatCurrency(app.revenue || 0, 'USD')}</span>
                              </Tooltip>
                            ) : (
                              <Typography variant="body2" sx={{ color: colors.slate400 }}>
                                —
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="View application">
                              <IconButton
                                size="small"
                                onClick={() => navigate(`/seller/applications/preview/${app._id}`)}
                              >
                                <OpenInNew sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default SellerAnalytics
