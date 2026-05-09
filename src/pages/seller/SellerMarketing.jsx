import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Campaign as CampaignIcon,
  LocalOffer,
  FlashOn,
  Layers,
  CardGiftcard,
  Rocket,
  Timer,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import useAuthStore from '../../store/authStore'
import { formatDate } from '../../utils/helpers'
import { CAMPAIGN_TYPES, CAMPAIGN_STATUS } from '../../utils/constants'

const SellerMarketing = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('all')
  const [createDialog, setCreateDialog] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState(null)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      type: 'discount',
      discountType: 'percentage',
      discountValue: '',
      minOrderAmount: '',
      maxUsage: '',
      couponCode: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      status: 'draft',
    },
  })

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      const sellerId = user?.id || user?._id
      const response = await api.get(`/campaigns/seller/${sellerId}`)

      if (response.data.success) {
        setCampaigns(response.data.campaigns || [])
      }
    } catch (error) {
      toast.error('Failed to fetch campaigns')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    reset()
    setEditingCampaign(null)
    setCreateDialog(true)
  }

  const handleEdit = (campaign) => {
    setEditingCampaign(campaign)
    setValue('title', campaign.title)
    setValue('description', campaign.description)
    setValue('type', campaign.type)
    setValue('discountType', campaign.discountType)
    setValue('discountValue', campaign.discountValue)
    setValue('minOrderAmount', campaign.minOrderAmount)
    setValue('maxUsage', campaign.maxUsage)
    setValue('couponCode', campaign.couponCode)
    setValue('startDate', campaign.startDate?.split('T')[0])
    setValue('endDate', campaign.endDate?.split('T')[0])
    setValue('status', campaign.status)
    setCreateDialog(true)
  }

  const onSubmit = async (data) => {
    try {
      setSaving(true)
      const sellerId = user?.id || user?._id

      const payload = {
        ...data,
        sellerId,
      }

      let response
      if (editingCampaign) {
        response = await api.put(`/campaigns/${editingCampaign._id}`, payload)
      } else {
        response = await api.post('/campaigns', payload)
      }

      if (response.data.success) {
        toast.success(editingCampaign ? 'Campaign updated!' : 'Campaign created!')
        fetchCampaigns()
        setCreateDialog(false)
        reset()
      }
    } catch (error) {
      toast.error('Failed to save campaign')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (campaignId) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return

    try {
      const response = await api.delete(`/campaigns/${campaignId}`)

      if (response.data.success) {
        toast.success('Campaign deleted')
        setCampaigns(campaigns.filter((c) => c._id !== campaignId))
      }
    } catch (error) {
      toast.error('Failed to delete campaign')
      console.error(error)
    }
  }

  const getCampaignIcon = (type) => {
    const icons = {
      discount: LocalOffer,
      flash_sale: FlashOn,
      bundle: Layers,
      free_access: CardGiftcard,
      launch_promo: Rocket,
      limited_offer: Timer,
    }
    const Icon = icons[type] || LocalOffer
    return <Icon />
  }

  const filteredCampaigns = selectedTab === 'all'
    ? campaigns
    : campaigns.filter((c) => c.status === selectedTab)

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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Marketing Campaigns
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create and manage promotional campaigns
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          Create Campaign
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Total Campaigns
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {campaigns.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Active
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {campaigns.filter((c) => c.status === 'active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Draft
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {campaigns.filter((c) => c.status === 'draft').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Ended
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
                {campaigns.filter((c) => c.status === 'ended').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All" value="all" />
          <Tab label="Active" value="active" />
          <Tab label="Draft" value="draft" />
          <Tab label="Paused" value="paused" />
          <Tab label="Ended" value="ended" />
        </Tabs>
      </Card>

      {/* Campaigns List */}
      {filteredCampaigns.length === 0 ? (
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <CampaignIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                No campaigns found
              </Typography>
              <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
                Create Your First Campaign
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredCampaigns.map((campaign) => {
            const statusMeta = CAMPAIGN_STATUS[campaign.status] || CAMPAIGN_STATUS.draft
            const typeMeta = CAMPAIGN_TYPES.find((t) => t.key === campaign.type) || CAMPAIGN_TYPES[0]

            return (
              <Grid item xs={12} md={6} key={campaign._id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          bgcolor: `${typeMeta.color}15`,
                          color: typeMeta.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {getCampaignIcon(campaign.type)}
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {campaign.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {campaign.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Chip
                            label={statusMeta.label}
                            size="small"
                            sx={{
                              bgcolor: statusMeta.bg,
                              color: statusMeta.color,
                              fontWeight: 600,
                            }}
                          />
                          <Chip label={typeMeta.label} size="small" variant="outlined" />
                          {campaign.discountValue && (
                            <Chip
                              label={`${campaign.discountValue}${campaign.discountType === 'percentage' ? '%' : ''} OFF`}
                              size="small"
                              color="secondary"
                            />
                          )}
                        </Box>
                      </Box>

                      <Box>
                        <IconButton size="small" onClick={() => handleEdit(campaign)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(campaign._id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Start Date
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatDate(campaign.startDate)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          End Date
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatDate(campaign.endDate)}
                        </Typography>
                      </Box>
                      {campaign.couponCode && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Coupon Code
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                            {campaign.couponCode}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={createDialog}
        onClose={() => !saving && setCreateDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingCampaign ? 'Edit Campaign' : 'Create Campaign'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Campaign Title"
                  {...register('title', { required: 'Title is required' })}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  {...register('description')}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Campaign Type"
                  {...register('type')}
                >
                  {CAMPAIGN_TYPES.map((type) => (
                    <MenuItem key={type.key} value={type.key}>
                      {type.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  {...register('status')}
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="paused">Paused</MenuItem>
                  <MenuItem value="ended">Ended</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  select
                  label="Discount Type"
                  {...register('discountType')}
                >
                  <MenuItem value="percentage">Percentage</MenuItem>
                  <MenuItem value="fixed_amount">Fixed Amount</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Discount Value"
                  type="number"
                  {...register('discountValue')}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Coupon Code"
                  {...register('couponCode')}
                  placeholder="SAVE20"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Min Order Amount"
                  type="number"
                  {...register('minOrderAmount')}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Max Usage"
                  type="number"
                  {...register('maxUsage')}
                  helperText="Leave empty for unlimited"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  {...register('startDate', { required: 'Start date is required' })}
                  error={!!errors.startDate}
                  helperText={errors.startDate?.message}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  {...register('endDate', { required: 'End date is required' })}
                  error={!!errors.endDate}
                  helperText={errors.endDate?.message}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialog(false)} disabled={saving}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={saving}
              startIcon={saving && <CircularProgress size={16} />}
            >
              {saving ? 'Saving...' : editingCampaign ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}

export default SellerMarketing
