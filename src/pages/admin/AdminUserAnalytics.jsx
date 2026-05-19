import { useState, useEffect } from 'react'
import {
  Box, Grid, Card, CardContent, Typography, Button, LinearProgress,
  CircularProgress, Chip, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Avatar, Breadcrumbs, Link,
} from '@mui/material'
import {
  People, TrendingUp, ShoppingCart, AttachMoney, Refresh,
  NavigateNext, PersonAdd, Block, CheckCircle, Cancel,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip,
  ResponsiveContainer, CartesianGrid, LineChart, Line,
} from 'recharts'
import api from '../../utils/api'
import { formatCurrency } from '../../utils/helpers'
import { colors } from '../../theme/tokens'

const CHART_COLORS = ['#4F46E5', '#7C3AED', '#06B6D4', '#10B981', '#F59E0B', '#EF4444']

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

const FunnelBar = ({ label, value, max, color, icon: Icon }) => {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Icon sx={{ fontSize: 16, color }} />
          <Typography variant="body2" sx={{ fontWeight: 600, color: colors.textPrimary }}>{label}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color }}>{(value ?? 0).toLocaleString()}</Typography>
          <Typography variant="caption" sx={{ color: colors.slate400 }}>{pct.toFixed(1)}%</Typography>
        </Box>
      </Box>
      <LinearProgress variant="determinate" value={pct}
        sx={{ height: 8, borderRadius: '4px', bgcolor: colors.border, '& .MuiLinearProgress-bar': { borderRadius: '4px', bgcolor: color } }} />
    </Box>
  )
}

const AdminUserAnalytics = () => {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/analytics/users')
      if (res.data.success) setData(res.data)
    } catch (e) {
      console.error('User analytics error:', e)
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
  const growth = data?.userGrowth || []
  const buyers = data?.topBuyers || []

  const statCards = [
    { title: 'Total Users',      value: (s.totalUsers || 0).toLocaleString(),      subtitle: `+${(s.newUsersLast30 || 0).toLocaleString()} this month`,  icon: People,       color: '#7C3AED', bgColor: 'rgba(124,58,237,0.08)' },
    { title: 'New (7 days)',      value: (s.newUsersLast7 || 0).toLocaleString(),   subtitle: `+${(s.newUsersLast30 || 0).toLocaleString()} last 30 days`, icon: PersonAdd,    color: colors.info, bgColor: colors.infoBg },
    { title: 'Total Orders',      value: (s.totalOrders || 0).toLocaleString(),     subtitle: `${(s.paidOrders || 0).toLocaleString()} paid`,              icon: ShoppingCart, color: colors.warning, bgColor: colors.warningBg },
    { title: 'Buy Rate',          value: `${(s.buyRate || 0).toFixed(1)}%`,         subtitle: 'paid orders / total orders',                                icon: TrendingUp,   color: colors.success, bgColor: colors.successBg },
    { title: 'Conversion Rate',   value: `${(s.conversionRate || 0).toFixed(1)}%`,  subtitle: 'buyers / total users',                                      icon: CheckCircle,  color: '#4F46E5', bgColor: '#EEF2FF' },
    { title: 'Total Revenue',     value: formatCurrency(s.totalRevenue || 0, 'USD'),subtitle: `${(s.cancelRate || 0).toFixed(1)}% cancel rate`,            icon: AttachMoney,  color: colors.success, bgColor: colors.successBg },
  ]

  const growthChartData = growth.map(d => ({ date: d._id?.slice(5), users: d.count }))

  return (
    <Box sx={{ bgcolor: colors.pageBackground, minHeight: '100vh' }}>
      {/* Page header */}
      <Box sx={{ bgcolor: colors.cardBackground, borderBottom: `1px solid ${colors.border}`, px: 3, py: 2, mb: 3 }}>
        <Breadcrumbs separator={<NavigateNext fontSize="small" sx={{ color: colors.slate400 }} />} sx={{ mb: 1 }}>
          <Link underline="hover" href="/admin/dashboard" sx={{ color: colors.textSecondary, fontSize: '14px', fontWeight: 500 }}>Dashboard</Link>
          <Link underline="hover" href="/admin/analytics" sx={{ color: colors.textSecondary, fontSize: '14px', fontWeight: 500 }}>Analytics</Link>
          <Typography sx={{ color: colors.textPrimary, fontSize: '14px', fontWeight: 600 }}>User Analytics</Typography>
        </Breadcrumbs>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: colors.textPrimary }}>User Analytics</Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary, mt: 0.5 }}>
              Registrations, conversion rates, buy rates and top buyers
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
            <Grid item xs={12} sm={6} lg={4} key={i}>
              <StatCard {...c} />
            </Grid>
          ))}
        </Grid>

        {/* User funnel + growth chart */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={5}>
            <Card sx={{ bgcolor: colors.cardBackground, border: `1px solid ${colors.border}`, borderRadius: '8px', boxShadow: 'none', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>User Funnel</Typography>
                <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 3 }}>From registration to purchase</Typography>
                <FunnelBar label="Registered Users"  value={s.totalUsers}      max={s.totalUsers}  color="#7C3AED" icon={People} />
                <FunnelBar label="Users Who Ordered"  value={s.totalOrders}     max={s.totalUsers}  color={colors.info} icon={ShoppingCart} />
                <FunnelBar label="Paid Orders"        value={s.paidOrders}      max={s.totalUsers}  color={colors.success} icon={CheckCircle} />
                <FunnelBar label="Cancelled Orders"   value={s.cancelledOrders} max={s.totalUsers}  color={colors.error} icon={Cancel} />
                <FunnelBar label="Banned Users"       value={s.bannedUsers}     max={s.totalUsers}  color={colors.slate400} icon={Block} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={7}>
            <Card sx={{ bgcolor: colors.cardBackground, border: `1px solid ${colors.border}`, borderRadius: '8px', boxShadow: 'none', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>User Growth — Last 30 Days</Typography>
                <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>Daily new registrations</Typography>
                {growthChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={growthChartData} margin={{ left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={colors.border} vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                      <RechartsTooltip />
                      <Bar dataKey="users" fill="#7C3AED" radius={[4, 4, 0, 0]} name="New Users" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography variant="body2" sx={{ color: colors.textSecondary, py: 8, textAlign: 'center' }}>No growth data yet</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Rate summary cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: 'Buy Rate',        value: `${(s.buyRate || 0).toFixed(1)}%`,        sub: 'paid orders / total orders',  color: colors.success, bg: colors.successBg },
            { label: 'Cancel Rate',     value: `${(s.cancelRate || 0).toFixed(1)}%`,     sub: 'cancelled / total orders',    color: colors.error,   bg: colors.errorBg },
            { label: 'Conversion Rate', value: `${(s.conversionRate || 0).toFixed(1)}%`, sub: 'buyers / total users',        color: '#4F46E5',      bg: '#EEF2FF' },
          ].map((r, i) => (
            <Grid item xs={12} sm={4} key={i}>
              <Card sx={{ bgcolor: r.bg, border: `1px solid ${colors.border}`, borderRadius: '8px', boxShadow: 'none', borderTop: `3px solid ${r.color}` }}>
                <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: r.color, fontSize: '32px' }}>{r.value}</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.textPrimary, mt: 0.5 }}>{r.label}</Typography>
                  <Typography variant="caption" sx={{ color: colors.textSecondary }}>{r.sub}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Top buyers table */}
        {buyers.length > 0 && (
          <Card sx={{ bgcolor: colors.cardBackground, border: `1px solid ${colors.border}`, borderRadius: '8px', boxShadow: 'none' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>Top Buyers by Spend</Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>Highest spending users on the platform</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell align="right">Orders</TableCell>
                      <TableCell align="right">Total Spent</TableCell>
                      <TableCell align="right">Spend Bar</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {buyers.slice(0, 10).map((b, i) => {
                      const maxSpent = Math.max(...buyers.map(x => x.totalSpent || 0), 1)
                      const pct = ((b.totalSpent || 0) / maxSpent) * 100
                      return (
                        <TableRow key={i} hover>
                          <TableCell>
                            <Box sx={{ width: 28, height: 28, borderRadius: '6px', bgcolor: i < 3 ? 'rgba(240,165,0,0.15)' : colors.slate100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Typography variant="caption" sx={{ fontWeight: 800, color: i < 3 ? '#f0a500' : colors.slate400 }}>#{i + 1}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{ width: 32, height: 32, bgcolor: colors.primaryBg, color: colors.primary, fontSize: '13px', fontWeight: 700 }}>
                                {b.name?.charAt(0) || '?'}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{b.name || 'Unknown'}</Typography>
                                <Typography variant="caption" sx={{ color: colors.textSecondary }}>{b.email}</Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Chip label={b.orderCount} size="small" sx={{ bgcolor: colors.infoBg, color: colors.infoText, fontWeight: 700 }} />
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" sx={{ fontWeight: 700, color: colors.success }}>{formatCurrency(b.totalSpent || 0, 'USD')}</Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ minWidth: 120 }}>
                            <LinearProgress variant="determinate" value={pct}
                              sx={{ height: 6, borderRadius: '3px', bgcolor: colors.border, '& .MuiLinearProgress-bar': { borderRadius: '3px', bgcolor: '#f0a500' } }} />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  )
}

export default AdminUserAnalytics
