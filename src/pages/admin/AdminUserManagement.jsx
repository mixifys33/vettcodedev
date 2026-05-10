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
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  Search,
  People,
  Phone,
  Email,
  CalendarToday,
  Shield,
  Block,
  ChevronRight,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const SORT_OPTIONS = [
  { key: 'newest', label: 'Newest First' },
  { key: 'oldest', label: 'Oldest First' },
  { key: 'name_asc', label: 'Name A–Z' },
  { key: 'name_desc', label: 'Name Z–A' },
]

const ROLE_FILTERS = [
  { key: '', label: 'All Users' },
  { key: 'user', label: 'Customers' },
  { key: 'admin', label: 'Admins' },
]

const LIMIT = 20

const AdminUserManagement = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [roleFilter, setRoleFilter] = useState('')
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const getToken = () => localStorage.getItem('adminToken')

  const fetchUsers = useCallback(async (pageNum = 1, reset = false) => {
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
  }, [search, sort, roleFilter])

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
    const colors = ['#7c3aed', '#0284c7', '#059669', '#d97706', '#0891b2', '#be185d', '#0d9488']
    let h = 0
    for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
    return colors[Math.abs(h) % colors.length]
  }

  const UserCard = ({ user }) => {
    const color = getAvatarColor(user.name)
    const isAdmin = user.role === 'admin'
    const isBanned = user.isBanned
    const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

    return (
      <Card
        sx={{
          mb: 2,
          cursor: 'pointer',
          transition: 'all 0.3s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 3,
          },
        }}
        onClick={() => navigate(`/admin/users/${user._id}`)}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={user.avatar}
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: color + '20',
                  color: color,
                  fontSize: '1.2rem',
                  fontWeight: 800,
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
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: 'secondary.main',
                    border: 2,
                    borderColor: 'background.paper',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Shield sx={{ fontSize: 10, color: 'white' }} />
                </Box>
              )}
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap>
                  {user.name}
                </Typography>
                {isBanned && (
                  <Chip label="BANNED" size="small" color="error" sx={{ height: 20, fontSize: '0.65rem' }} />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 0.5 }}>
                {user.email}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                {user.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Phone sx={{ fontSize: 12, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {user.phone}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarToday sx={{ fontSize: 12, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {joinDate}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
              <Chip
                label={isAdmin ? 'Admin' : 'Customer'}
                size="small"
                color={isAdmin ? 'secondary' : 'info'}
                sx={{ fontWeight: 600 }}
              />
              <ChevronRight sx={{ color: 'text.disabled' }} />
            </Box>
          </Box>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 400, gap: 2 }}>
        <CircularProgress />
        <Typography color="text.secondary">Loading users...</Typography>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          User Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {total.toLocaleString()} registered users
        </Typography>
      </Box>

      {/* Search and Sort */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select value={sort} label="Sort By" onChange={(e) => setSort(e.target.value)}>
              {SORT_OPTIONS.map((opt) => (
                <MenuItem key={opt.key} value={opt.key}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Role Filter */}
      <Tabs value={roleFilter} onChange={(e, newValue) => setRoleFilter(newValue)} sx={{ mb: 3 }}>
        {ROLE_FILTERS.map((f) => (
          <Tab key={f.key} label={f.label} value={f.key} />
        ))}
      </Tabs>

      {/* Users List */}
      {users.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <People sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No users found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {search ? `No results for "${search}"` : 'No users in the database yet'}
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={2}>
            {users.map((user) => (
              <Grid item xs={12} key={user._id}>
                <UserCard user={user} />
              </Grid>
            ))}
          </Grid>

          {/* Load More */}
          {hasMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={handleLoadMore}
                disabled={loadingMore}
                startIcon={loadingMore ? <CircularProgress size={20} /> : null}
              >
                {loadingMore ? 'Loading...' : 'Load More'}
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

export default AdminUserManagement
