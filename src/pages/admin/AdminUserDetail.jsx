import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  CircularProgress,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import {
  ArrowBack,
  Email,
  Phone,
  CalendarToday,
  Shield,
  Block,
  CheckCircle,
  ShoppingBag,
} from '@mui/icons-material'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const AdminUserDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: null })

  useEffect(() => {
    fetchUserDetail()
  }, [id])

  const getToken = () => localStorage.getItem('adminToken')

  const fetchUserDetail = async () => {
    try {
      const token = getToken()
      const response = await api.get(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.data.success) {
        setUser(response.data.user)
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
      toast.error('Failed to load user details')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async () => {
    const { action } = confirmDialog
    setActionLoading(true)
    setConfirmDialog({ open: false, action: null })

    try {
      const token = getToken()
      const response = await api.patch(
        `/admin/users/${id}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.data.success) {
        toast.success(`User ${action}d successfully`)
        fetchUserDetail()
      }
    } catch (error) {
      toast.error('Action failed')
    } finally {
      setActionLoading(false)
    }
  }

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?'

  const getAvatarColor = (name = '') => {
    const colors = ['#7c3aed', '#0284c7', '#059669', '#d97706']
    let h = 0
    for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
    return colors[Math.abs(h) % colors.length]
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!user) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          User not found
        </Typography>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/admin/users')} sx={{ mt: 2 }}>
          Back to Users
        </Button>
      </Box>
    )
  }

  const color = getAvatarColor(user.name)
  const isAdmin = user.role === 'admin'
  const isBanned = user.isBanned

  return (
    <Box>
      {/* Back Button */}
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/admin/users')} sx={{ mb: 3 }}>
        Back to Users
      </Button>

      <Grid container spacing={3}>
        {/* User Info Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar
                  src={user.avatar}
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: color + '20',
                    color: color,
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    mx: 'auto',
                  }}
                >
                  {getInitials(user.name)}
                </Avatar>
                {isAdmin && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      bgcolor: 'secondary.main',
                      border: 3,
                      borderColor: 'background.paper',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Shield sx={{ color: 'white' }} />
                  </Box>
                )}
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                {user.name}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                <Chip
                  label={isAdmin ? 'Admin' : 'Customer'}
                  size="small"
                  color={isAdmin ? 'secondary' : 'info'}
                />
                {isBanned && <Chip label="BANNED" size="small" color="error" />}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ textAlign: 'left' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Email sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="body2">{user.email}</Typography>
                </Box>
                {user.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Phone sx={{ fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="body2">{user.phone}</Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Actions */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {!isBanned ? (
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<Block />}
                    onClick={() => setConfirmDialog({ open: true, action: 'ban' })}
                    disabled={actionLoading}
                  >
                    Ban User
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={() => setConfirmDialog({ open: true, action: 'unban' })}
                    disabled={actionLoading}
                  >
                    Unban User
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Activity & Stats */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Account Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                      {user.ordersCount || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Orders
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'success.main' }}>
                      ${user.totalSpent || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Spent
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'info.main' }}>
                      {user.reviewsCount || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Reviews
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'warning.main' }}>
                      {user.wishlistCount || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Wishlist
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Recent Activity
              </Typography>
              {user.recentOrders && user.recentOrders.length > 0 ? (
                <List>
                  {user.recentOrders.map((order, index) => (
                    <Box key={order._id}>
                      <ListItem>
                        <ShoppingBag sx={{ mr: 2, color: 'primary.main' }} />
                        <ListItemText
                          primary={`Order #${order.orderNumber || order._id.slice(-6)}`}
                          secondary={`${new Date(order.createdAt).toLocaleDateString()} - $${order.total}`}
                        />
                        <Chip
                          label={order.status}
                          size="small"
                          color={order.status === 'completed' ? 'success' : 'default'}
                        />
                      </ListItem>
                      {index < user.recentOrders.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No recent activity
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, action: null })}>
        <DialogTitle>
          {confirmDialog.action === 'ban' ? 'Ban User' : 'Unban User'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {confirmDialog.action === 'ban'
              ? `Ban ${user.name}? They will lose access to their account.`
              : `Restore ${user.name}'s account access?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, action: null })}>Cancel</Button>
          <Button onClick={handleAction} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminUserDetail
