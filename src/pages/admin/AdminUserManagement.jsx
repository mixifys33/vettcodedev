import { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  Avatar,
  Grid,
  CircularProgress,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Breadcrumbs,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  Search,
  People,
  Phone,
  Email,
  CalendarToday,
  Shield,
  Block,
  Refresh,
  NavigateNext,
  Visibility,
  Person,
  AdminPanelSettings,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { colors } from '../../theme/tokens'

const SORT_OPTIONS = [
  { key: 'newest', label: 'Newest First' },
  { key: 'oldest', label: 'Oldest First' },
  { key: 'name_asc', label: 'Name A–Z' },
  { key: 'name_desc', label: 'Name Z–A' },
]

const ROLE_FILTERS = [
  { key: '', label: 'All Users', icon: People },
  { key: 'user', label: 'Customers', icon: Person },
  { key: 'admin', label: 'Admins', icon: AdminPanelSettings },
]

const LIMIT = 20

const StatCard = ({ title, value, subtitle, icon: Icon, color, bgColor }) => (
  <Card
    sx={{
      bgcolor: colors.cardBackground,
      border: `1px solid ${colors.border}`,
      borderRadius: '8px',
      boxShadow: 'none',
      height: '100%',
    }}
  >
    <CardContent sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="body2" sx={{ color: colors.textSecondary, fontWeight: 500 }}>
          {title}
        </Typography>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '6px',
            bgcolor: bgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
          }}
        >
          <Icon sx={{ fontSize: 18 }} />
        </Box>
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 700, color: colors.textPrimary, fontSize: '26px' }}>
        {value ?? '—'}
      </Typography>
      {subtitle && (
        <Typography variant="caption" sx={{ color: colors.slate400, mt: 0.5, display: 'block' }}>
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
)

const AdminUserManagement = () => {
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [roleFilter, setRoleFilter] = useState('')
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [summaryStats, setSummaryStats] = useState({
    total: 0,
    customers: 0,
    admins: 0,
  })

  const getToken = () => localStorage.getItem('adminToken')

  const fetchSummaryStats = useCallback(async () => {
    try {
      const token = getToken()
      const headers = { Authorization: `Bearer ${token}` }
      const [dashboard, customers, admins] = await Promise.all([
        api.get('/admin/dashboard', { headers }),
        api.get('/admin/users?limit=1&page=1&role=user', { headers }),
        api.get('/admin/users?limit=1&page=1&role=admin', { headers }),
      ])
      setSummaryStats({
        total: dashboard.data?.stats?.users?.total ?? 0,
        customers: customers.data?.total ?? 0,
        admins: admins.data?.total ?? 0,
      })
    } catch {
      // non-blocking
    }
  }, [])

  const fetchUsers = useCallback(
    async (pageNum = 1, reset = false) => {
      try {
        if (pageNum === 1) setLoading(true)
        else setLoadingMore(true)

        const token = getToken()
        const params = new URLSearchParams({
          page: pageNum,
          limit: LIMIT,
          sort,
          ...(search.trim() && { search: search.trim() }),
          ...(roleFilter && { role: roleFilter }),
        })

        const response = await api.get(`/admin/users?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.data.success) {
          const newUsers = response.data.users || []
          setTotal(response.data.total || 0)
          setHasMore(newUsers.length === LIMIT)
          setUsers((prev) => (reset || pageNum === 1 ? newUsers : [...prev, ...newUsers]))
        }
      } catch (error) {
        console.error('Failed to fetch users:', error)
        toast.error('Failed to load users')
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [search, sort, roleFilter]
  )

  useEffect(() => {
    fetchSummaryStats()
  }, [fetchSummaryStats])

  useEffect(() => {
    setPage(1)
    fetchUsers(1, true)
  }, [sort, roleFilter])

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      fetchUsers(1, true)
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  const handleRefresh = () => {
    setPage(1)
    fetchSummaryStats()
    fetchUsers(1, true)
  }

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return
    const next = page + 1
    setPage(next)
    fetchUsers(next)
  }

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?'

  const getAvatarColor = (name = '') => {
    const palette = ['#7c3aed', '#0284c7', '#059669', '#d97706', '#0891b2', '#be185d', '#0d9488']
    let h = 0
    for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
    return palette[Math.abs(h) % palette.length]
  }

  const bannedInView = users.filter((u) => u.isBanned).length

  if (loading && users.length === 0) {
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

  const statCards = [
    {
      title: 'Total Users',
      value: summaryStats.total.toLocaleString(),
      subtitle: 'Registered on platform',
      icon: People,
      color: '#7C3AED',
      bgColor: 'rgba(124,58,237,0.08)',
    },
    {
      title: 'Customers',
      value: summaryStats.customers.toLocaleString(),
      subtitle: 'Buyer accounts',
      icon: Person,
      color: colors.info,
      bgColor: colors.infoBg,
    },
    {
      title: 'Admins',
      value: summaryStats.admins.toLocaleString(),
      subtitle: 'Admin accounts',
      icon: Shield,
      color: colors.primary,
      bgColor: colors.primaryBg,
    },
    {
      title: 'Search Results',
      value: total.toLocaleString(),
      subtitle:
        bannedInView > 0
          ? `${bannedInView} banned in this list`
          : `Showing ${users.length} loaded`,
      icon: Search,
      color: colors.warning,
      bgColor: colors.warningBg,
    },
  ]

  return (
    <Box sx={{ bgcolor: colors.pageBackground, minHeight: '100vh' }}>
      {/* Page header */}
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
            onClick={() => navigate('/admin/dashboard')}
            sx={{ color: colors.textSecondary, fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}
          >
            Dashboard
          </Link>
          <Typography sx={{ color: colors.textPrimary, fontSize: '14px', fontWeight: 600 }}>
            User Management
          </Typography>
        </Breadcrumbs>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: colors.textPrimary }}>
              User Management
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary, mt: 0.5 }}>
              View customers and admins, manage bans, and open user profiles
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            sx={{
              textTransform: 'none',
              borderColor: colors.border,
              color: colors.textSecondary,
            }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <Box sx={{ px: 3, pb: 4 }}>
        {/* Stat cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {statCards.map((c, i) => (
            <Grid item xs={12} sm={6} lg={3} key={i}>
              <StatCard {...c} />
            </Grid>
          ))}
        </Grid>

        {/* Search, sort, filters */}
        <Card
          sx={{
            bgcolor: colors.cardBackground,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            boxShadow: 'none',
            mb: 3,
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  placeholder="Search by name, email, or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: colors.textSecondary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: colors.pageBackground,
                      '& fieldset': { borderColor: colors.border },
                      '&:hover fieldset': { borderColor: colors.primary },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Sort by</InputLabel>
                  <Select
                    value={sort}
                    label="Sort by"
                    onChange={(e) => setSort(e.target.value)}
                    sx={{
                      bgcolor: colors.pageBackground,
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.border },
                    }}
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <MenuItem key={opt.key} value={opt.key}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
              {ROLE_FILTERS.map((f) => {
                const Icon = f.icon
                const isActive = roleFilter === f.key
                const count =
                  f.key === ''
                    ? summaryStats.total
                    : f.key === 'user'
                    ? summaryStats.customers
                    : summaryStats.admins
                return (
                  <Chip
                    key={f.key || 'all'}
                    icon={<Icon sx={{ fontSize: 16 }} />}
                    label={`${f.label} (${count.toLocaleString()})`}
                    onClick={() => setRoleFilter(f.key)}
                    sx={{
                      bgcolor: isActive ? colors.primaryBg : colors.pageBackground,
                      color: isActive ? colors.primary : colors.textSecondary,
                      border: `1px solid ${isActive ? colors.primary : colors.border}`,
                      fontWeight: isActive ? 700 : 500,
                      '&:hover': { bgcolor: isActive ? colors.primaryBg : colors.slate100 },
                    }}
                  />
                )
              })}
            </Box>
          </CardContent>
        </Card>

        {/* Users table */}
        {users.length === 0 ? (
          <Card
            sx={{
              bgcolor: colors.cardBackground,
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              boxShadow: 'none',
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <People sx={{ fontSize: 64, color: colors.slate300, mb: 2 }} />
              <Typography variant="h6" sx={{ color: colors.textSecondary, fontWeight: 600 }}>
                No users found
              </Typography>
              <Typography variant="body2" sx={{ color: colors.slate400, mt: 1 }}>
                {search ? `No results for "${search}"` : 'No users match the selected filter'}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Card
            sx={{
              bgcolor: colors.cardBackground,
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              boxShadow: 'none',
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: colors.pageBackground }}>
                      <TableCell sx={{ fontWeight: 700, color: colors.textPrimary }}>User</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: colors.textPrimary }}>Contact</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: colors.textPrimary }}>Role</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: colors.textPrimary }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: colors.textPrimary }}>Joined</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: colors.textPrimary }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => {
                      const color = getAvatarColor(user.name)
                      const isAdmin = user.role === 'admin'
                      const isBanned = user.isBanned

                      return (
                        <TableRow
                          key={user._id}
                          hover
                          sx={{ '&:hover': { bgcolor: colors.slate50 }, cursor: 'pointer' }}
                          onClick={() => navigate(`/admin/users/${user._id}`)}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Box sx={{ position: 'relative' }}>
                                <Avatar
                                  src={user.avatar}
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    bgcolor: color + '20',
                                    color,
                                    fontWeight: 700,
                                  }}
                                >
                                  {getInitials(user.name)}
                                </Avatar>
                                {isAdmin && (
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      bottom: -2,
                                      right: -2,
                                      width: 18,
                                      height: 18,
                                      borderRadius: '50%',
                                      bgcolor: colors.primary,
                                      border: `2px solid ${colors.cardBackground}`,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <Shield sx={{ fontSize: 10, color: '#fff' }} />
                                  </Box>
                                )}
                              </Box>
                              <Box>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 600, color: colors.textPrimary }}
                                >
                                  {user.name || 'Unknown'}
                                </Typography>
                                <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                                  ID: {user._id.slice(-6).toUpperCase()}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                              <Email sx={{ fontSize: 12, color: colors.textSecondary }} />
                              <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                                {user.email || 'N/A'}
                              </Typography>
                            </Box>
                            {user.phone && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Phone sx={{ fontSize: 12, color: colors.textSecondary }} />
                                <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                                  {user.phone}
                                </Typography>
                              </Box>
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={isAdmin ? 'Admin' : 'Customer'}
                              size="small"
                              sx={{
                                fontWeight: 600,
                                bgcolor: isAdmin ? colors.primaryBg : colors.infoBg,
                                color: isAdmin ? colors.primary : colors.infoText,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {isBanned ? (
                              <Chip
                                icon={<Block sx={{ fontSize: 14 }} />}
                                label="Banned"
                                size="small"
                                color="error"
                                sx={{ fontWeight: 600 }}
                              />
                            ) : (
                              <Chip
                                label="Active"
                                size="small"
                                color="success"
                                variant="outlined"
                                sx={{ fontWeight: 600 }}
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <CalendarToday sx={{ fontSize: 12, color: colors.textSecondary }} />
                              <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                                {user.createdAt
                                  ? new Date(user.createdAt).toLocaleDateString()
                                  : '—'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                            <Tooltip title="View profile">
                              <IconButton
                                size="small"
                                onClick={() => navigate(`/admin/users/${user._id}`)}
                                sx={{
                                  color: colors.primary,
                                  '&:hover': { bgcolor: colors.primaryBg },
                                }}
                              >
                                <Visibility sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {hasMore && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    p: 2,
                    borderTop: `1px solid ${colors.border}`,
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    startIcon={loadingMore ? <CircularProgress size={18} /> : null}
                    sx={{
                      textTransform: 'none',
                      borderColor: colors.border,
                      color: colors.textSecondary,
                    }}
                  >
                    {loadingMore ? 'Loading...' : `Load more (${users.length} of ${total})`}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  )
}

export default AdminUserManagement
