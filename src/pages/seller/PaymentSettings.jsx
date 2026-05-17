import { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  Grid,
  MenuItem,
  LinearProgress,
  Typography,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import useAuthStore from '../../store/authStore'
import { st, inputSx } from '../../components/settings/settingsTheme'
import { PageHeader, Panel, FieldLabel, FormFooter } from '../../components/settings/SettingsPage'

const MOBILE_PROVIDERS = ['MTN Mobile Money', 'Airtel Money', 'M-Pesa', 'Other']

const MethodCard = ({ selected, title, sub, onClick }) => (
  <Box
    component="button"
    type="button"
    onClick={onClick}
    sx={{
      flex: 1,
      textAlign: 'left',
      p: 2,
      borderRadius: st.radius,
      cursor: 'pointer',
      fontFamily: st.fontSans,
      border: `2px solid ${selected ? st.accent : st.line}`,
      bgcolor: selected ? st.accentSoft : st.panel,
      transition: 'border-color 0.15s, background 0.15s',
      '&:hover': { borderColor: selected ? st.accent : st.lineStrong },
    }}
  >
    <Typography sx={{ fontSize: '15px', fontWeight: 600, color: st.ink }}>{title}</Typography>
    <Typography sx={{ fontSize: '12px', color: st.inkSecondary, mt: 0.5 }}>{sub}</Typography>
  </Box>
)

const PaymentSettings = () => {
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
      bankName: '',
      accountName: '',
      accountNumber: '',
      swiftCode: '',
      branchName: '',
      mobileMoneyProvider: '',
      mobileMoneyNumber: '',
      mobileMoneyName: '',
    },
  })

  const method = watch('paymentMethod')

  useEffect(() => {
    const load = async () => {
      try {
        const sellerId = user?.id || user?._id
        const res = await api.get(`/sellers/payment-settings/${sellerId}`)
        if (res.data.success) {
          const s = res.data.settings || {}
          setValue('paymentMethod', s.paymentMethod || 'bank')
          if (s.bankDetails) {
            setValue('bankName', s.bankDetails.bankName || '')
            setValue('accountName', s.bankDetails.accountName || '')
            setValue('accountNumber', s.bankDetails.accountNumber || '')
            setValue('swiftCode', s.bankDetails.swiftCode || '')
            setValue('branchName', s.bankDetails.branchName || '')
          }
          if (s.mobileMoneyDetails) {
            setValue('mobileMoneyProvider', s.mobileMoneyDetails.provider || '')
            setValue('mobileMoneyNumber', s.mobileMoneyDetails.number || '')
            setValue('mobileMoneyName', s.mobileMoneyDetails.name || '')
          }
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    if (user) load()
  }, [user, setValue])

  const onSubmit = async (data) => {
    try {
      setSaving(true)
      const sellerId = user?.id || user?._id
      const payload = {
        sellerId,
        paymentMethod: data.paymentMethod,
        bankDetails:
          data.paymentMethod === 'bank'
            ? {
                bankName: data.bankName,
                accountName: data.accountName,
                accountNumber: data.accountNumber,
                swiftCode: data.swiftCode,
                branchName: data.branchName,
              }
            : undefined,
        mobileMoneyDetails:
          data.paymentMethod === 'mobile_money'
            ? {
                provider: data.mobileMoneyProvider,
                number: data.mobileMoneyNumber,
                name: data.mobileMoneyName,
              }
            : undefined,
      }
      const res = await api.post('/sellers/payment-settings', payload)
      if (res.data.success) {
        toast.success('Payout details saved')
        updateUser({
          ...user,
          paymentSettings: { ...user.paymentSettings, isSetup: true },
        })
      }
    } catch {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LinearProgress sx={{ bgcolor: st.line, '& .MuiLinearProgress-bar': { bgcolor: st.accent } }} />
  }

  return (
    <>
      <PageHeader
        title="Payouts"
        description="Bank or mobile money account for earnings from paid application downloads. Double-check account numbers before saving."
      />

      <Panel>
        <Box component="form" id="payment-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldLabel required>Payout method</FieldLabel>
          <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
            <MethodCard
              selected={method === 'bank'}
              title="Bank transfer"
              sub="USD / local currency"
              onClick={() => setValue('paymentMethod', 'bank', { shouldDirty: true })}
            />
            <MethodCard
              selected={method === 'mobile_money'}
              title="Mobile money"
              sub="MTN, Airtel, etc."
              onClick={() => setValue('paymentMethod', 'mobile_money', { shouldDirty: true })}
            />
          </Box>
          <input type="hidden" {...register('paymentMethod')} />

          {method === 'bank' ? (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FieldLabel required>Bank name</FieldLabel>
                <TextField
                  fullWidth
                  {...register('bankName', { required: method === 'bank' && 'Required' })}
                  error={!!errors.bankName}
                  helperText={errors.bankName?.message}
                  sx={inputSx}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FieldLabel required>Account name</FieldLabel>
                <TextField
                  fullWidth
                  {...register('accountName', { required: method === 'bank' && 'Required' })}
                  error={!!errors.accountName}
                  helperText={errors.accountName?.message}
                  sx={inputSx}
                />
              </Grid>
              <Grid item xs={12}>
                <FieldLabel required>Account number</FieldLabel>
                <TextField
                  fullWidth
                  {...register('accountNumber', { required: method === 'bank' && 'Required' })}
                  error={!!errors.accountNumber}
                  helperText={errors.accountNumber?.message}
                  sx={inputSx}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FieldLabel>SWIFT / BIC</FieldLabel>
                <TextField fullWidth {...register('swiftCode')} sx={inputSx} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FieldLabel>Branch</FieldLabel>
                <TextField fullWidth {...register('branchName')} sx={inputSx} />
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FieldLabel required>Provider</FieldLabel>
                <TextField
                  fullWidth
                  select
                  {...register('mobileMoneyProvider', {
                    required: method === 'mobile_money' && 'Required',
                  })}
                  error={!!errors.mobileMoneyProvider}
                  helperText={errors.mobileMoneyProvider?.message}
                  sx={inputSx}
                >
                  {MOBILE_PROVIDERS.map((p) => (
                    <MenuItem key={p} value={p}>
                      {p}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FieldLabel required>Registered name</FieldLabel>
                <TextField
                  fullWidth
                  {...register('mobileMoneyName', {
                    required: method === 'mobile_money' && 'Required',
                  })}
                  error={!!errors.mobileMoneyName}
                  helperText={errors.mobileMoneyName?.message}
                  sx={inputSx}
                />
              </Grid>
              <Grid item xs={12}>
                <FieldLabel required>Mobile number</FieldLabel>
                <TextField
                  fullWidth
                  placeholder="+256700000000"
                  {...register('mobileMoneyNumber', {
                    required: method === 'mobile_money' && 'Required',
                  })}
                  error={!!errors.mobileMoneyNumber}
                  helperText={errors.mobileMoneyNumber?.message}
                  sx={inputSx}
                />
              </Grid>
            </Grid>
          )}

          <Typography sx={{ fontSize: '12px', color: st.inkMuted, mt: 2, lineHeight: 1.5 }}>
            Payouts are processed manually after verification. Incorrect details delay transfers.
          </Typography>

          <FormFooter saving={saving} saveLabel="Save payout details" formId="payment-form" />
        </Box>
      </Panel>
    </>
  )
}

export default PaymentSettings
