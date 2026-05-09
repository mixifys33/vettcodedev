import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material'
import {
  ShoppingCart,
  Visibility,
  LocalShipping,
  CheckCircle,
  Cancel,
  Refresh,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import useAuthStore from '../../store/authStore'
import { formatCurrency, formatDate, formatRelativeTime } from '../../utils/helpers'
import { ORDER_STATUS } from '../../utils/constants'

const TABS = ['all', 'pending', 'processing', 'shipped', 'delivered', 'refund_in_progress', 'refunded', 'cancelled']

const SellerOrders = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('all')
  const [detailDialog, setDetailDialog] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, selectedTab])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const sellerId = user?.id || user?._id
      const response = await api.get(`/orders?sellerId=${sellerId}`)

      if (response.data.success) {
        setOrders(response.data.orders || [])
      }
    } catch (error) {
      toast.error('Failed to fetch orders')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    if (selectedTab === 'all') {
      setFilteredOrders(orders)
    } else {
      setFilteredOrders(orders.filter((order) => order.status === selectedTab))
    }
  }

  const handleViewDetails = (order) => {
    setSelectedOrder(order)
    setDetailDialog(true)
  }

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdating(true)
      const response = await api.patch(`/orders/${orderId}/status`, { status: newStatus })

      if (response.data.success) {
        toast.success('Order status updated successfully')
        setOrders(orders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)))
        if (selectedOrder?._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus })
        }
      }
    } catch (error) {
      toast.error('Failed to update order status')
      console.error(error)
    } finally {
      setUpdating(false)
    }
  }

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      pending: 'processing',
      processing: 'shipped',
      shipped: 'delivered',
    }
    return statusFlow[currentStatus]
  }

  const getStatusMeta = (status) => {
    return ORDER_STATUS[status] || ORDER_STATUS.pending
  }

  const calculateRevenue = () => {
    return orders
      .filter((o) => o.status === 'delivered')
      .reduce((sum, o) => sum + (o.total || 0), 0)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          Orders
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your customer orders
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Total Orders
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {orders.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Pending
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {orders.filter((o) => o.status === 'pending').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Delivered
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {orders.filter((o) => o.status === 'delivered').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Revenue
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {formatCurrency(calculateRevenue(), 'UGX')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Orders Table */}
      <Card>
        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab}
              label={tab === 'all' ? 'All' : tab.replace('_', ' ')}
              value={tab}
              sx={{ textTransform: 'capitalize' }}
            />
          ))}
        </Tabs>

        <CardContent>
          {filteredOrders.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <ShoppingCart sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No orders found
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const statusMeta = getStatusMeta(order.status)
                    return (
                      <TableRow key={order._id} hover>
                        <TableCell>#{order._id.slice(-6).toUpperCase()}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {order.buyerInfo?.name || 'N/A'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.buyerInfo?.email}
                          </Typography>
                        </TableCell>
                        <TableCell>{order.items?.length || 0} item(s)</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {formatCurrency(order.total, order.currency)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={statusMeta.label}
                            size="small"
                            sx={{
                              bgcolor: `${statusMeta.color}15`,
                              color: statusMeta.color,
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell>{formatRelativeTime(order.createdAt)}</TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            startIcon={<Visibility />}
                            onClick={() => handleViewDetails(order)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog
        open={detailDialog}
        onClose={() => setDetailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Order Details - #{selectedOrder?._id.slice(-6).toUpperCase()}
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Grid container spacing={3}>
              {/* Customer Info */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Customer Information
                </Typography>
                <Typography variant="body2">
                  <strong>Name:</strong> {selectedOrder.buyerInfo?.name}
                </Typography>
                <Typography variant="body2">
                  <strong>Email:</strong> {selectedOrder.buyerInfo?.email}
                </Typography>
                <Typography variant="body2">
                  <strong>Phone:</strong> {selectedOrder.buyerInfo?.phone || 'N/A'}
                </Typography>
              </Grid>

              {/* Order Info */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Order Information
                </Typography>
                <Typography variant="body2">
                  <strong>Order ID:</strong> #{selectedOrder._id.slice(-6).toUpperCase()}
                </Typography>
                <Typography variant="body2">
                  <strong>Date:</strong> {formatDate(selectedOrder.createdAt)}
                </Typography>
                <Typography variant="body2">
                  <strong>Payment Method:</strong> {selectedOrder.paymentMethod || 'N/A'}
                </Typography>
              </Grid>

              {/* Items */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Order Items
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Application</TableCell>
                        <TableCell align="right">Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrder.items?.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.appName || item.name}</TableCell>
                          <TableCell align="right">
                            {formatCurrency(item.price, selectedOrder.currency)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                          {formatCurrency(selectedOrder.total, selectedOrder.currency)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              {/* Status Update */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Update Status
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Chip
                    label={getStatusMeta(selectedOrder.status).label}
                    sx={{
                      bgcolor: `${getStatusMeta(selectedOrder.status).color}15`,
                      color: getStatusMeta(selectedOrder.status).color,
                      fontWeight: 600,
                    }}
                  />
                  {getNextStatus(selectedOrder.status) && (
                    <Button
                      variant="contained"
                      size="small"
                      disabled={updating}
                      startIcon={updating ? <CircularProgress size={16} /> : <LocalShipping />}
                      onClick={() =>
                        handleUpdateStatus(selectedOrder._id, getNextStatus(selectedOrder.status))
                      }
                    >
                      Mark as {getNextStatus(selectedOrder.status)}
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default SellerOrders
