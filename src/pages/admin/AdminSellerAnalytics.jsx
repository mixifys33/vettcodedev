import { useState, useEffect, useMemo } from 'react'
import {
  Box, Grid, Card, CardContent, Typography, Button, LinearProgress,
  Chip, Tabs, Tab, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Avatar, Breadcrumbs, Link,
} from '@mui/material'
import {
  Store, Download, Code, AttachMoney, Refresh, NavigateNext,
  CheckCircle, Schedule, Block, Visibility, TrendingUp,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import api from '../../utils/api'
import { formatCurrency } from '../../utils/helpers'
import { colors } from '../../theme/tokens'

const CHART_COLORS = ['#4F46E5', '#7C3AED', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899']

const StatCard = ({ title, value, subtitle, icon: Icon, color, bgColor }) => (
  <Card sx={{ bgcolor: colors.cardBackground, border: `1px solid ${colors.border}`, borderRadius: '8px', boxShadow: 'none', height: '100%' }}>
    <CardContent sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="body2" sx={{ color: colors.textSecondary, fontWeight: 500 }}>{title}</Typography>
        <Box sx={{ width: 32, height: 32, borderRadius: '6px', bgcolor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
          <Icon sx={{ fontSize: 18 }} />
        </Box>
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 700, color: colors.textPrimary, fontSize: '26px' }}>{value ?? '—'}</Typography>
      {subtitle && <Typography variant="caption" sx={{ color: colors.slate400, mt: 0.5, display: 'block' }}>{subtitle}</Typography>}
    </CardContent>
  </Card>
)

const LeaderboardRow = ({ rank, name, primary, secondary, barValue, barMax, barColor }) => {
  const pct = barMax > 0 ? Math.min((barValue / barMax) * 100, 100) : 0
  return (
    <Box sx={{ py: 1.5, borderBottom: `1px solid ${colors.border}`, '&:last-child': { borderBottom: 'none' } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.75 }}>
        <Box sx={{ width: 28, height: 28, borderRadius: '6px', bgcolor: rank <= 3 ? 'rgba(240,165,0,0.15)' : colors.slate100, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: rank <= 3 ? '#f0a500' : colors.slate400 }}>#{rank}</Typography>
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: colors.textPrimary }} noWrap>{name}</Typography>
          <Typography variant="caption" sx={{ color: colors.textSecondary }}>{secondary}</Typography>
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 700, color: barColor, flexShrink: 0 }}>{primary}</Typography>
      </Box>
      <LinearProgress variant="determinate" value={pct}
        sx={{ height: 6, borderRadius: '3px', bgcolor: colors.border, '& .MuiLinearProgress-bar': { borderRadius: '3px', bgcolor: barColor } }} />
    </Box>
  )
}

const AdminSellerAnalytics = () => {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(0)

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/analytics/sellers')
      if (res.data.success) setData(res.data)
    } catch (e) {
      console.error('Seller analytics error:', e)
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
  const growth = data?.sellerGrowth || []
  const topRevenue   = data?.topByRevenue   || []
  const topDownloads = data?.topByDownloads || []
  const topApps      = data?.topByApps      || []
  const categories   = data?.categoryBreakdown || []

  const statCards = [
    { title: 'Total Sellers',     value: (s.totalSellers || 0).toLocaleString(),         subtitle: `+${(s.newSellersLast30 || 0)} this month`,              icon: Store,       color: '#0d9488', bgColor: 'rgba(13,148,136,0.08)' },
    { title: 'Active Sellers',    value: (s.activeSellers || 0).toLocaleString(),         subtitle: `${(s.suspendedSellers || 0)} suspended`,                icon: CheckCircle, color: colors.success, bgColor: colors.successBg },
    { title: 'Pending Approval',  value: (s.pendingSellers || 0).toLocaleString(),        subtitle: 'awaiting review',                                       icon: Schedule,    color: colors.warning, bgColor: colors.warningBg },
    { title: 'Total Applications',value: (s.totalApplications || 0).toLocaleString(),    subtitle: `${(s.verifiedApplications || 0)} verified`,             icon: Code,        color: '#4F46E5', bgColor: '#EEF2FF' },
    { title: 'Total Downloads',   value: (s.totalDownloads || 0).toLocaleString(),        subtitle: `${(s.totalViews || 0).toLocaleString()} total views`,   icon: Download,    color: colors.info, bgColor: colors.infoBg },
    { title: 'Platform Revenue',  value: formatCurrency(s.totalPlatformRevenue || 0, 'USD'), subtitle: 'price × downloads (all sellers)',                   icon: AttachMoney, color: colors.success, bgColor: colors.successBg },
  ]

  const growthChartData = growth.map(d => ({ date: d._id?.slice(5), sellers: d.count }))
  const catPieData = categories.slice(0, 7).map(c => ({ name: c.category, value: c.downloads || c.count }))

  const maxRevenue   = topRevenue.length   ? Math.max(...topRevenue.map(x => x.revenue || 0), 1)          : 1
  const maxDownloads = topDownloads.length ? Math.max(...topDownloads.map(x => x.totalDownloads || 0), 1) : 1
  const maxApps      = topApps.length      ? Math.max(...topApps.map(x => x.appCount || 0), 1)            : 1
  const maxCatDl     = categories.length   ? Math.max(...categories.map(x => x.downloads || 0), 1)        : 1

  return (
    <Box sx={{ bgcolor: colors.pageBackground, minHeight: '100vh' }}>
      <Box sx={{ bgcolor: colors.cardBackground, borderBottom: `1px solid ${colors.border}`, px: 3, py: 2, mb: 3 }}>
        <Breadcrumbs separator={<NavigateNext fontSize="small" sx={{ color: colors.slate400 }} />} sx={{ mb: 1 }}>
          <Link underline="hover" href="/admin/dashboard" sx={{ color: colors.textSecondary, fontSize: '14px', fontWeight: 500 }}>Dashboard</Link>
          <Link underline="hover" href="/admin/analytics" sx={{ color: colors.textSecondary, fontSize: '14px', fontWeight: 500 }}>Analytics</Link>
          <Typography sx={{ color: colors.textPrimary, fontSize: '14px', fontWeight: 600 }}>Seller Analytics</Typography>
        </Breadcrumbs>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: colors.textPrimary }}>Seller Analytics</Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary, mt: 0.5 }}>
              Seller growth, earnings, downloads and application performance
            </Typography>
          </Box>
          <Button variant="outlined" startIcon={<Refresh />} onClick={fetchData}
            sx={{ textTransform: 'none', borderColor: colors.border, color: colors.textSecondary }}>
            Refresh
          </Button>
        </Box>
      </Box>

      <Box sx={{ px: 3, pb: 4 }}>
        {/* Stat cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {statCards.map((c, i) => (
            <Grid item xs={12} sm={6} lg={4} key={i}><StatCard {...c} /></Grid>
          ))}
        </Grid>

        {/* Growth chart + category pie */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={7}>
            <Card sx={{ bgcolor: colors.cardBackground, border: `1px solid ${colors.border}`, borderRadius: '8px', boxShadow: 'none' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>Seller Growth — Last 30 Days</Typography>
                <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>New seller registrations per day</Typography>
                {growthChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={growthChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={colors.border} vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                      <RechartsTooltip />
                      <Bar dataKey="sellers" fill="#0d9488" radius={[4, 4, 0, 0]} name="New Sellers" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography variant="body2" sx={{ color: colors.textSecondary, py: 8, textAlign: 'center' }}>No growth data yet</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={5}>
            <Card sx={{ bgcolor: colors.cardBackground, border: `1px solid ${colors.border}`, borderRadius: '8px', boxShadow: 'none', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>Downloads by Category</Typography>
                <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>Top categories across all sellers</Typography>
                {catPieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={catPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                        label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}>
                        {catPieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography variant="body2" sx={{ color: colors.textSecondary, py: 8, textAlign: 'center' }}>No category data yet</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Leaderboard tabs */}
        <Card sx={{ bgcolor: colors.cardBackground, border: `1px solid ${colors.border}`, borderRadius: '8px', boxShadow: 'none' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Seller Leaderboards</Typography>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
              <Tab label="By Revenue" />
              <Tab label="By Downloads" />
              <Tab label="By App Count" />
              <Tab label="By Category" />
            </Tabs>

            {tab === 0 && (
              <Box>
                {topRevenue.slice(0, 10).map((s, i) => (
                  <LeaderboardRow key={i} rank={i + 1} name={s.name || 'Unknown Seller'}
                    primary={formatCurrency(s.revenue || 0, 'USD')}
                    secondary={`${(s.totalDownloads || 0).toLocaleString()} downloads · ${s.appCount || 0} apps`}
                    barValue={s.revenue || 0} barMax={maxRevenue} barColor="#f0a500" />
                ))}
                {topRevenue.length === 0 && <Typography variant="body2" sx={{ color: colors.textSecondary, py: 4, textAlign: 'center' }}>No revenue data yet</Typography>}
              </Box>
            )}

            {tab === 1 && (
              <Box>
                {topDownloads.slice(0, 10).map((s, i) => (
                  <LeaderboardRow key={i} rank={i + 1} name={s.name || 'Unknown Seller'}
                    primary={`${(s.totalDownloads || 0).toLocaleString()} dl`}
                    secondary={`${s.appCount || 0} apps · ${formatCurrency(s.revenue || 0, 'USD')} revenue`}
                    barValue={s.totalDownloads || 0} barMax={maxDownloads} barColor={colors.info} />
                ))}
                {topDownloads.length === 0 && <Typography variant="body2" sx={{ color: colors.textSecondary, py: 4, textAlign: 'center' }}>No download data yet</Typography>}
              </Box>
            )}

            {tab === 2 && (
              <Box>
                {topApps.slice(0, 10).map((s, i) => (
                  <LeaderboardRow key={i} rank={i + 1} name={s.name || 'Unknown Seller'}
                    primary={`${s.appCount || 0} apps`}
                    secondary={`${s.verifiedApps || 0} verified · ${(s.totalDownloads || 0).toLocaleString()} downloads`}
                    barValue={s.appCount || 0} barMax={maxApps} barColor="#0d9488" />
                ))}
                {topApps.length === 0 && <Typography variant="body2" sx={{ color: colors.textSecondary, py: 4, textAlign: 'center' }}>No app data yet</Typography>}
              </Box>
            )}

            {tab === 3 && (
              <Box>
                {categories.slice(0, 10).map((c, i) => (
                  <LeaderboardRow key={i} rank={i + 1} name={c.category}
                    primary={`${(c.downloads || 0).toLocaleString()} dl`}
                    secondary={`${c.count || 0} apps · ${formatCurrency(c.revenue || 0, 'USD')} revenue`}
                    barValue={c.downloads || 0} barMax={maxCatDl} barColor="#7C3AED" />
                ))}
                {categories.length === 0 && <Typography variant="body2" sx={{ color: colors.textSecondary, py: 4, textAlign: 'center' }}>No category data yet</Typography>}
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default AdminSellerAnalytics
