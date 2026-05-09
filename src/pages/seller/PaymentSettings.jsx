import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material'
import { Save, ArrowBack, AccountBalance, Phone } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import useAuthStore from '../../store/authStore'

const PAYMENT_METHODS = [
  { value: 'bank', label: 'Bank Account', icon: <AccountBalance /> },
  { value: 'mobile_money', label: 'Mobile Money', icon: <Phone /> },
]

const MOBILE_MONEY_PROVIDERS = ['MTN Mobile Money', 'Airtel Money', 'Other']

const PaymentSettings = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      paymentMethod: 'bank',
      // Bank details
      bankName: '',
      accountName: '',
      accountNumber: '',
      swiftCode: '',
      branchName: '',
      // Mobile money details
      mobileMoneyProvider: '',
      mobileMoneyNumber: '',
      mobileMoneyName: '',
    },
  })

  const paymentMethod = watch('paymentMethod')

  useEffect(() => {
    loadPaymentSettings()
  }, [])

  const loadPaymentSettings = async () => {
    try {
      setLoading(true)
      const sellerId = user?.id || user?._id
      const response = await api.get(`/sellers/payment-settings/${sellerId}`)

      if (response.data.success) {
        const settings = response.data.settings || {}
        
        setValue('paymentMethod', settings.paymentMethod || 'bank')
        
        // Bank details
        if (settings.bankDetails) {
          setValue('bankName', settings.bankDetails.bankName || '')
          setValue('accountName', settings.bankDetails.accountName || '')
          setValue('accountNumber', settings.bankDetails.accountNumber || '')
          setValue('swiftCode', settings.bankDetails.swiftCode || '')
          setValue('branchName', settings.bankDetails.branchName || '')
        }
        
        // Mobile money details
        if (settings.mobileMoneyDetails) {
          setValue('mobileMoneyProvider', settings.mobileMoneyDetails.provider || '')
          setValue('mobileMoneyNumber', settings.mobileMoneyDetails.number || '')
          setValue('mobileMoneyName', settings.mobileMoneyDetails.name || '')
        }
      }
    } catch (error) {
      console.error('Failed to load payment settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setSaving(true)
      const sellerId = user?.id || user?._id

      const payload = {
        sellerId,
        paymentMethod: data.paymentMethod,
        bankDetails: data.paymentMethod === 'bank' ? {
          bankName: data.bankName,
          accountName: data.accountName,
          accountNumber: data.accountNumber,
          swiftCode: data.swiftCode,
          branchName: data.branchName,
        } : undefined,
        mobileMoneyDetails: data.paymentMethod === 'mobile_money' ? {
          provider: data.mobileMoneyProvider,
          number: data.mobileMoneyNumber,
          name: data.mobileMoneyName,
        } : undefined,
      }

      const response = await api.post('/sellers/payment-settings', payload)

      if (response.data.success) {
        toast.success('Payment settings saved successfully!')
        
        // Update user in store
        const updatedUser = {
          ...user,
          paymentSettings: {
            ...user.paymentSettings,
            isSetup: true,
          },
        }
        updateUser(updatedUser)
      }
    } catch (error) {
      toast.error('Failed to save payment settings')
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
          Payment Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure how you receive payments
        </Typography>
      </Box>

      {!user?.paymentSettings?.isSetup && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Complete your payment settings to receive payments from sales
        </Alert>
      )}

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Payment Method Selection */}
              <TextField
                fullWidth
                select
                label="Payment Method"
                {...register('paymentMethod')}
              >
                {PAYMENT_METHODS.map((method) => (
                  <MenuItem key={method.value} value={method.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {method.icon}
                      {method.label}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>

              <Divider />

              {/* Bank Account Details */}
              {paymentMethod === 'bank' && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Bank Account Details
                  </Typography>

                  <TextField
                    fullWidth
                    label="Bank Name"
                    {...register('bankName', {
                      required: paymentMethod === 'bank' && 'Bank name is required',
                    })}
                    error={!!errors.bankName}
                    helperText={errors.bankName?.message}
                  />

                  <TextField
                    fullWidth
                    label="Account Name"
                    {...register('accountName', {
                      required: paymentMethod === 'bank' && 'Account name is required',
                    })}
                    error={!!errors.accountName}
                    helperText={errors.accountName?.message}
                  />

                  <TextField
                    fullWidth
                    label="Account Number"
                    {...register('accountNumber', {
                      required: paymentMethod === 'bank' && 'Account number is required',
                    })}
                    error={!!errors.accountNumber}
                    helperText={errors.accountNumber?.message}
                  />

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="SWIFT/BIC Code (Optional)"
                        {...register('swiftCode')}
                        helperText="For international transfers"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Branch Name (Optional)"
                        {...register('branchName')}
                      />
                    </Grid>
                  </Grid>
                </>
              )}

              {/* Mobile Money Details */}
              {paymentMethod === 'mobile_money' && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Mobile Money Details
                  </Typography>

                  <TextField
                    fullWidth
                    select
                    label="Mobile Money Provider"
                    {...register('mobileMoneyProvider', {
                      required: paymentMethod === 'mobile_money' && 'Provider is required',
                    })}
                    error={!!errors.mobileMoneyProvider}
                    helperText={errors.mobileMoneyProvider?.message}
                  >
                    {MOBILE_MONEY_PROVIDERS.map((provider) => (
                      <MenuItem key={provider} value={provider}>
                        {provider}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    fullWidth
                    label="Mobile Money Number"
                    {...register('mobileMoneyNumber', {
                      required: paymentMethod === 'mobile_money' && 'Mobile number is required',
                    })}
                    error={!!errors.mobileMoneyNumber}
                    helperText={errors.mobileMoneyNumber?.message}
                    placeholder="+256 700 000000"
                  />

                  <TextField
                    fullWidth
                    label="Account Name"
                    {...register('mobileMoneyName', {
                      required: paymentMethod === 'mobile_money' && 'Account name is required',
                    })}
                    error={!!errors.mobileMoneyName}
                    helperText={errors.mobileMoneyName?.message || 'Name registered on the mobile money account'}
                  />
                </>
              )}

              <Alert severity="info">
                <Typography variant="body2">
                  <strong>Important:</strong> Ensure your payment details are accurate. Payments will be
                  processed to this account after order completion.
                </Typography>
              </Alert>

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
                  {saving ? 'Saving...' : 'Save Payment Settings'}
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default PaymentSettings
