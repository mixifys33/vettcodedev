import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material'
import { Save, ArrowBack } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import useAuthStore from '../../store/authStore'

const BUSINESS_TYPES = [
  'Electronics',
  'Fashion',
  'Food & Beverages',
  'Home & Garden',
  'Health & Beauty',
  'Sports & Outdoors',
  'Automotive',
  'Agriculture',
  'Office Supplies',
  'Industrial',
  'Software & Technology',
  'Other',
]

const ShopSettings = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    loadShopData()
  }, [])

  const loadShopData = async () => {
    try {
      setLoading(true)
      const sellerId = user?.id || user?._id
      const response = await api.get(`/sellers/profile/${sellerId}`)

      if (response.data.success) {
        const shop = response.data.profile.shop || {}
        setValue('shopName', shop.shopName || '')
        setValue('shopDescription', shop.shopDescription || '')
        setValue('businessType', shop.businessType || '')
        setValue('businessAddress', shop.businessAddress || '')
        setValue('city', shop.city || '')
        setValue('website', shop.website || '')
        setValue('businessLicense', shop.businessLicense || '')
        setValue('taxId', shop.taxId || '')
      }
    } catch (error) {
      toast.error('Failed to load shop settings')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setSaving(true)
      const sellerId = user?.id || user?._id

      const response = await api.post('/sellers/shop-setup', {
        sellerId,
        ...data,
      })

      if (response.data.success) {
        toast.success('Shop settings saved successfully!')
        
        // Update user in store
        const updatedUser = {
          ...user,
          shop: {
            ...user.shop,
            ...data,
            isSetup: true,
          },
        }
        updateUser(updatedUser)
      }
    } catch (error) {
      toast.error('Failed to save shop settings')
      console.error(error)
    } finally {
      setSaving(false)
    }
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
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/seller/settings')}
          sx={{ mb: 2 }}
        >
          Back to Settings
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          Shop Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your shop information and branding
        </Typography>
      </Box>

      {!user?.shop?.isSetup && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Complete your shop setup to start selling applications
        </Alert>
      )}

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                label="Shop Name"
                {...register('shopName', { required: 'Shop name is required' })}
                error={!!errors.shopName}
                helperText={errors.shopName?.message}
              />

              <TextField
                fullWidth
                label="Shop Description"
                multiline
                rows={4}
                {...register('shopDescription', {
                  required: 'Shop description is required',
                })}
                error={!!errors.shopDescription}
                helperText={errors.shopDescription?.message || 'Describe your shop and what you sell'}
              />

              <TextField
                fullWidth
                select
                label="Business Type"
                {...register('businessType', { required: 'Business type is required' })}
                error={!!errors.businessType}
                helperText={errors.businessType?.message}
                defaultValue=""
              >
                {BUSINESS_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Business Address"
                {...register('businessAddress', {
                  required: 'Business address is required',
                })}
                error={!!errors.businessAddress}
                helperText={errors.businessAddress?.message}
              />

              <TextField
                fullWidth
                label="City"
                {...register('city', { required: 'City is required' })}
                error={!!errors.city}
                helperText={errors.city?.message}
              />

              <TextField
                fullWidth
                label="Website (Optional)"
                {...register('website')}
                placeholder="https://yourwebsite.com"
              />

              <TextField
                fullWidth
                label="Business License Number (Optional)"
                {...register('businessLicense')}
              />

              <TextField
                fullWidth
                label="Tax ID (Optional)"
                {...register('taxId')}
              />

              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/seller/settings')}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                  startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default ShopSettings
