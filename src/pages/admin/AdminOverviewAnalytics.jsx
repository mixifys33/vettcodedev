import { useState, useEffect } from 'react'
import {
  Box, Grid, Card, CardContent, Typography, Button, LinearProgress,
  Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Avatar, Breadcrumbs, Link,
} from '@mui/material'
import {
  AttachMoney, People, Store, Code, Download, Visibility,
  TrendingUp, CheckCircle, Cancel, Schedule, Refresh, NavigateNext,
  BarChart as BarChartIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts'
import api from '../../utils/api'
import { formatCurrency } from '../../utils/helpers'
import { colors } from '../../theme/tokens'

const StatCard = ({ title, value, subtitle, icon: Icon, color, bgColor, highlight }) => (
  <Card sx={{
    bgcolor: highlight ? color : colors.cardBackground,
    border: `1px solid ${highlight ? color : colors.border}`,
    borderRadius: '8px', boxShadow: 'none', height: '100%',
  }}>
    <CardContent sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="body2" sx={{ color: highlight ? 'rgba(255,255,255,0.8)' : colors.textSecondary, fontWeight: 500 }}>{title}</Typography>
        <Box sx={{ width: 32, height: 32, borderRadius: '6px', bgcolor: highlight ? 'rgba(255,255,255,0.2)' : bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: highlight ? '#fff' : color }}>
          <Icon sx={{ fontSize: 18 }} />
        </Box>
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 700, color: highlight ? '#fff' : colors.textPrimary, fontSize: '26px' }}>{value ?? '—'}</Typography>
      {subtitle && <Typography variant="caption" sx={{ color: highlight ? 'rgba(255,255,255,0.7)' : colors.slate400, mt: 0.5, display: 'block' }}>{subtitle}</Typography>}
    </CardContent>
  </Card>
)

const HealthCard = ({ label, value, sub, color }) => (
  <Card sx={{ bgcolor: colors.cardBackground, border: `1px solid ${colors.border}`, borderLeft: `4px solid ${color}`, borderRadius: '8px', boxShadow: 'none' }}>
    <CardContent sx={{ p: 2.5 }}>
      <Typography variant="h3" sx={{ fontWeight: 800, color, fontSize: '32px' }}>{value}</Typography>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.textPrimary, mt: 0.5 }}>{label}</Typography>
      <Typography variant="caption" sx={{ color: colors.textSecondary }}>{sub}</Typography>
    </CardContent>
  </Card>
)

const AdminOverviewAnalytics = () => {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/analytics/overview')
      if (res.data.success) setData(res.data)
    } catch (e) {
      console.error('Overview analytics error:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  if (loading) {
    return (
      <Box sx={{ bgcolor: colors.pageBackground, minHeight: '100vh', p: 3 }}>
        <LinearProgress sx={{ borderRadius: 0.5, bgcolor: colors.border, '& .MuiLinearProgress-bar': { bgcolor: colors.primary } }} />
      </Box>
    )
  }

  const s = data?.summary || {}
  const revenueByDay = data?.revenueByDay || []
  const ordersByDay  = data?.ordersByDay  || []
  const topApps      = data?.topApps      || []
  const maxAppRev    = topApps.length ? Math.max(...topApps.map(a => a.revenue || 0), 1) : 1

  // Merge revenue + orders by day for combined chart
  const combinedChart = (() => {
    const map = {}
    revenueByDay.forEach(d => { map[d._id] = { date: d._id?.slice(5), revenue: d.revenue || 0, orders: 0 } })
    ordersByDay.forEach(d => {
      if (!map[d._id]) map[d._id] = { date: d._id?.slice(5), revenue: 0, orders: 0 }
      map[d._id].orders = d.count || 0
    })
    return Object.values(map).sort((a, b) => a.date?.localeCompare(b.date))
  })()

  const financeCards = [
    { title: 'Total Revenue',    value: formatCurrency(s.totalRevenue || 0, 'USD'),      subtitle: 'all paid orders (all time)',       icon: AttachMoney, color: '#f0a500', bgColor: 'rgba(240,165,0,0.1)', highlight: true },
    { title: 'This Month',       value: formatCurrency(s.revenueThisMonth || 0, 'USD'),  subtitle: 'last 30 days',                     icon: TrendingUp,  color: colors.success, bgColor: colors.successBg },
    { title: 'This Week',        value: formatCurrency(s.revenueThisWeek || 0, 'USD'),   subtitle: 'last 7 days',                      icon: TrendingUp,  color: colors.info, bgColor: colors.infoBg },
    { title: 'Avg Order Value',  value: formatCurrency(s.avgOrderValue || 0, 'USD'),     subtitle: 'per paid order',                   icon: BarChartIcon,color: '#7C3AED', bgColor: 'rgba(124,58,237,0.08)' },
    { title: 'App Revenue',      value: formatCurrency(s.appRevenue || 0, 'USD'),        subtitle: 'price × downloads (all apps)',     icon: Code,        color: '#0d9488', bgColor: 'rgba(13,148,136,0.08)' },
    { title: 'Paid Orders',      value: (s.paidOrders || 0).toLocaleString(),            subtitle: `of ${(s.totalOrders || 0).toLocaleString()} total orders`, icon: CheckCircle, color: colors.success, bgColor: colors.successBg },
  ]

  const platformCards = [
    { title: 'Total Users',        value: (s.totalUsers || 0).toLocaleString(),          subtitle: 'registered buyers',                icon: People,      color: '#7C3AED', bgColor: 'rgba(124,58,237,0.08)' },
    { title: 'Total Sellers',      value: (s.totalSellers || 0).toLocaleString(),        subtitle: `${(s.activeSellers || 0)} active`, icon: Store,       color: '#0d9488', bgColor: 'rgba(13,148,136,0.08)' },
    { title: 'Applications',       value: (s.totalApplications || 0).toLocaleString(),  subtitle: `${(s.verifiedApplications || 0)} verified`, icon: Code, color: '#4F46E5', bgColor: '#EEF2FF' },
    { title: 'Total Downloads',    value: (s.totalDownloads || 0).toLocaleString(),      subtitle: `${(s.totalViews || 0).toLocaleString()} views`, icon: Download, color: colors.info, bgColor: colors.infoBg },
  ]

  const orderStatusRows = [
    { label: 'Total Orders',     value: s.totalOrders,     color: '#0a1628', icon: Schedule },
    { label: 'Paid Orders',      value: s.paidOrders,      color: colors.success, icon: CheckCircle },
    { label: 'Pending Orders',   value: s.pendingOrders,   color: colors.warning, icon: Schedule },
    { label: 'Cancelled Orders', value: s.cancelledOrders, color: colors.error, icon: Cancel },
  ]

  return (
    <Box sx={{ bgcolor: colors.pageBackground, minHeight: '100vh' }}>
      <Box sx={{ bgcolor: colors.cardBackground, borderBottom: `1px solid ${colors.border}`, px: 3, py: 2, mb: 3 }}>
        <Breadcrumbs separator={<NavigateNext fontSize="small" sx={{ color: colors.slate400 }} />} sx={{ mb: 1 }}>
          <Link underline="hover" href="/admin/dashboard" sx={{ color: colors.textSecondary, fontSize: '14px', fontWeight: 500 }}>Dashboard</Link>
          <Link underline="hover" href="/admin/analytics" sx={{ color: colors.textSecondary, fontSize: '14px', fontWeight: 500 }}>Analytics</Link>
          <Typography sx={{ color: colors.textPrimary, fontSize: '14px', fontWeight: 600 }}>Platform Overview</Typography>
        </Breadcrumbs>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: colors.textPrimary }}>Platform Overview & Finances</Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary, mt: 0.5 }}>
              Overall platform health, revenue trends and top performing applications
            </Typography>
          </Box>
          <Button variant="outlined" startIcon={<Refresh />} onClick={fetchData}
            sx={{ textTransform: 'none', borderColor: colors.border, color: colors.textSecondary }}>
            Refresh
          </Button>
        </Box>
      </Box>

      <Box sx={{ px: 3, pb: 4 }}>
        {/* Finance cards */}
        <Typography variant="overline" sx={{ color: colors.textSecondary, fontWeight: 700, letterSpacing: 1.2, mb: 1.5, display: 'block' }}>FINANCIAL SUMMARY</Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {financeCards.map((c, i) => (
            <Grid item xs={12} sm={6} lg={4} key={i}><StatCard {...c} /></Grid>
          ))}
        </Grid>

        {/* Platform stats */}
        <Typography variant="overline" sx={{ color: colors.textSecondary, fontWeight: 700, letterSpacing: 1.2, mb: 1.5, display: 'block' }}>PLATFORM STATS</Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {platformCards.map((c, i) => (
            <Grid item xs={12} sm={6} lg={3} key={i}><StatCard {...c} /></Grid>
          ))}
        </Grid>

        {/* Revenue + Orders combined chart */}
        <Card sx={{ bgcolor: colors.cardBackground, border: `1px solid ${colors.border}`, borderRadius: '8px', boxShadow: 'none', mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>Revenue & Orders — Last 30 Days</Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>Daily revenue (USD) and order volume</Typography>
            {combinedChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={combinedChart} margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border} vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                  <RechartsTooltip formatter={(val, name) => name === 'Revenue' ? formatCurrency(val, 'USD') : val} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" fill="#f0a500" radius={[4, 4, 0, 0]} name="Revenue" />
                  <Bar yAxisId="right" dataKey="orders" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Typography variant="body2" sx={{ color: colors.textSecondary, py: 8, textAlign: 'center' }}>No transaction data yet</Typography>
            )}
          </CardContent>
        </Card>

        {/* Order status + top apps */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={5}>
            <Card sx={{ bgcolor: colors.cardBackground, border: `1px solid ${colors.border}`, borderRadius: '8px', boxShadow: 'none', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>Order Status Breakdown</Typography>
                <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 3 }}>All-time order distribution</Typography>
                {orderStatusRows.map((row, i) => {
                  const pct = s.totalOrders > 0 ? ((row.value || 0) / s.totalOrders * 100).toFixed(1) : 0
                  return (
                    <Box key={i} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <row.icon sx={{ fontSize: 16, color: row.color }} />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.label}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: row.color }}>{(row.value || 0).toLocaleString()}</Typography>
                          <Typography variant="caption" sx={{ color: colors.slate400 }}>{pct}%</Typography>
                        </Box>
                      </Box>
                      <LinearProgress variant="determinate" value={Number(pct)}
                        sx={{ height: 8, borderRadius: '4px', bgcolor: colors.border, '& .MuiLinearProgress-bar': { borderRadius: '4px', bgcolor: row.color } }} />
                    </Box>
                  )
                })}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={7}>
            <Card sx={{ bgcolor: colors.cardBackground, border: `1px solid ${colors.border}`, borderRadius: '8px', boxShadow: 'none', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>Top Revenue Applications</Typography>
                <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>Highest earning apps — price × downloads</Typography>
                {topApps.length > 0 ? (
                  <Box>
                    {topApps.slice(0, 8).map((app, i) => {
                      const pct = ((app.revenue || 0) / maxAppRev) * 100
                      return (
                        <Box key={i} sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.75 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, flex: 1 }}>
                              <Box sx={{ width: 24, height: 24, borderRadius: '6px', bgcolor: i < 3 ? 'rgba(240,165,0,0.15)' : colors.slate100, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: i < 3 ? '#f0a500' : colors.slate400, fontSize: '10px' }}>#{i + 1}</Typography>
                              </Box>
                              <Box sx={{ minWidth: 0 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>{app.appName}</Typography>
                                <Typography variant="caption" sx={{ color: colors.textSecondary }}>{(app.downloads || 0).toLocaleString()} dl × {formatCurrency(app.price || 0, 'USD')}</Typography>
                              </Box>
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: colors.success, flexShrink: 0, ml: 1 }}>{formatCurrency(app.revenue || 0, 'USD')}</Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={pct}
                            sx={{ height: 6, borderRadius: '3px', bgcolor: colors.border, '& .MuiLinearProgress-bar': { borderRadius: '3px', background: `linear-gradient(90deg, #4F46E5, #10B981)` } }} />
                        </Box>
                      )
                    })}
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ color: colors.textSecondary, py: 8, textAlign: 'center' }}>No paid app revenue yet</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Platform health */}
        <Typography variant="overline" sx={{ color: colors.textSecondary, fontWeight: 700, letterSpacing: 1.2, mb: 1.5, display: 'block' }}>PLATFORM HEALTH INDICATORS</Typography>
        <Grid container spacing={2}>
          {[
            {
              label: 'Seller Approval Rate',
              value: s.totalSellers > 0 ? `${((s.activeSellers || 0) / s.totalSellers * 100).toFixed(1)}%` : '—',
              sub: `${(s.activeSellers || 0).toLocaleString()} of ${(s.totalSellers || 0).toLocaleString()} sellers active`,
              color: colors.success,
            },
            {
              label: 'App Verification Rate',
              value: s.totalApplications > 0 ? `${((s.verifiedApplications || 0) / s.totalApplications * 100).toFixed(1)}%` : '—',
              sub: `${(s.verifiedApplications || 0).toLocaleString()} of ${(s.totalApplications || 0).toLocaleString()} apps verified`,
              color: '#f0a500',
            },
            {
              label: 'Download Conversion',
              value: `${(s.conversionRate || 0).toFixed(1)}%`,
              sub: `${(s.totalDownloads || 0).toLocaleString()} downloads from ${(s.totalViews || 0).toLocaleString()} views`,
              color: colors.info,
            },
            {
              label: 'Order Success Rate',
              value: s.totalOrders > 0 ? `${((s.paidOrders || 0) / s.totalOrders * 100).toFixed(1)}%` : '—',
              sub: `${(s.paidOrders || 0).toLocaleString()} paid of ${(s.totalOrders || 0).toLocaleString()} total`,
              color: '#7C3AED',
            },
          ].map((h, i) => (
            <Grid item xs={12} sm={6} lg={3} key={i}>
              <HealthCard {...h} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}

export default AdminOverviewAnalytics
