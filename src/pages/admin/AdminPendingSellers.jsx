import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material'
import {
  CheckCircle,
  Cancel,
  Store,
  Phone,
  Email,
  CalendarToday,
  Refresh,
} from '@mui/icons-material'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const AdminPendingSellers = () => {
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [confirmDialog, setConfirmDialog] = useState({ open: false, seller: null, action: null })

  useEffect(() => {
    fetchPendingSellers()
  }, [])

  const getToken = () => localStorage.getItem('adminToken')

  const fetchPendingSellers = async () => {
    try {
      const token = getToken()
      const response = await api.get('/admin/sellers/pending', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.data.success) {
        setSellers(response.data.sellers)
      }
    } catch (error) {
      console.error('Failed to fetch pending sellers:', error)
      toast.error('Failed to load pending sellers')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async () => {
    const { seller, action } = confirmDialog
    setActionLoading(seller._id)
    setConfirmDialog({ open: false, seller: null, action: null })

    try {
      const token = getToken()
      const body = action === 'reject' ? { reason: 'Application does not meet our current requirements.' } : undefined
      const response = await api.patch(
        `/admin/sellers/${seller._id}/${action}`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        setSellers((prev) => prev.filter((s) => s._id !== seller._id))
        toast.success(`${seller.name} has been ${action}d successfully`)
      } else {
        toast.error(response.data.error || 'Action failed')
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const openConfirmDialog = (seller, action) => {
    setConfirmDialog({ open: true, seller, action })
  }

  const SellerCard = ({ seller }) => {
    const isLoading = actionLoading === seller._id
    const avatarUrl = seller.profileImage?.url || (typeof seller.profileImage === 'string' ? seller.profileImage : null)

    return (
      <Card
        sx={{
          mb: 2,
          borderLeft: 4,
          borderColor: 'secondary.main',
          position: 'relative',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
            <Avatar
              src={avatarUrl}
              sx={{
                width: 56,
                height: 56,
                bgcolor: 'primary.main',
                fontSize: '1.5rem',
                fontWeight: 800,
              }}
            >
              {seller.name?.[0]?.toUpperCase() || '?'}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {seller.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {seller.email}
              </Typography>
              <Typography variant="body2" color="info.main" sx={{ fontWeight: 600 }}>
                {seller.phoneNumber}
              </Typography>
            </Box>
            <Chip label="PENDING" color="warning" size="small" sx={{ fontWeight: 700 }} />
          </Box>

          {seller.shop?.shopName && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Store sx={{ fontSize: 16, color: 'secondary.main' }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {seller.shop.shopName}
              </Typography>
              {seller.shop.businessType && (
                <Chip
                  label={seller.shop.businessType}
                  size="small"
                  variant="outlined"
                  sx={{ ml: 1, textTransform: 'capitalize' }}
                />
              )}
            </Box>
          )}

          {seller.applicationNote && (
            <Box
              sx={{
                bgcolor: 'background.default',
                borderRadius: 2,
                p: 1.5,
                mb: 2,
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                Application Note
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {seller.applicationNote}
              </Typography>
            </Box>
          )}

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            Applied {new Date(seller.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={() => openConfirmDialog(seller, 'approve')}
              >
                Approve
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={<Cancel />}
                onClick={() => openConfirmDialog(seller, 'reject')}
              >
                Reject
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    )
  }

  const getDialogContent = () => {
    const { seller, action } = confirmDialog
    if (!seller) return {}

    const messages = {
      approve: {
        title: 'Approve Seller',
        content: `Approve ${seller.name}? They will be notified and can start selling immediately.`,
      },
      reject: {
        title: 'Reject Application',
        content: `Reject ${seller.name}'s application? They will be notified.`,
      },
    }

    return messages[action] || {}
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 400, gap: 2 }}>
        <CircularProgress />
        <Typography color="text.secondary">Loading applications...</Typography>
      </Box>
    )
  }

  if (sellers.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: 3,
            bgcolor: 'success.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          <CheckCircle sx={{ fontSize: 48, color: 'success.main' }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
          All Clear!
        </Typography>
        <Typography color="text.secondary">
          No pending seller applications right now.
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Pending Sellers
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {sellers.length} seller{sellers.length !== 1 ? 's' : ''} awaiting review
        </Typography>
      </Box>

      {/* Count Banner */}
      <Alert
        severity="warning"
        icon={<Refresh />}
        sx={{ mb: 3 }}
      >
        {sellers.length} seller{sellers.length !== 1 ? 's' : ''} waiting for approval
      </Alert>

      {/* Sellers List */}
      <Grid container spacing={2}>
        {sellers.map((seller) => (
          <Grid item xs={12} key={seller._id}>
            <SellerCard seller={seller} />
          </Grid>
        ))}
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, seller: null, action: null })}>
        <DialogTitle>{getDialogContent().title}</DialogTitle>
        <DialogContent>
          <Typography>{getDialogContent().content}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, seller: null, action: null })}>Cancel</Button>
          <Button onClick={handleAction} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminPendingSellers
