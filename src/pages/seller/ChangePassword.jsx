import { useState, useMemo } from 'react'
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Grid,
} from '@mui/material'
import { Visibility, VisibilityOff, Check } from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import useAuthStore from '../../store/authStore'
import { st, inputSx } from '../../components/settings/settingsTheme'
import { PageHeader, Panel, FieldLabel, FormFooter } from '../../components/settings/SettingsPage'

const Req = ({ met, text }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
    <Check sx={{ fontSize: 16, color: met ? st.ok : st.lineStrong }} />
    <Typography sx={{ fontSize: '13px', color: met ? st.ink : st.inkMuted }}>{text}</Typography>
  </Box>
)

const ChangePassword = () => {
  const { user } = useAuthStore()
  const [saving, setSaving] = useState(false)
  const [show, setShow] = useState({ cur: false, next: false, confirm: false })

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm()
  const newPassword = watch('newPassword', '')
  const confirmPassword = watch('confirmPassword', '')

  const rules = useMemo(
    () => ({
      length: newPassword.length >= 8,
      match: newPassword.length > 0 && newPassword === confirmPassword,
    }),
    [newPassword, confirmPassword]
  )

  const onSubmit = async (data) => {
    try {
      setSaving(true)
      const sellerId = user?.id || user?._id
      const res = await api.post('/sellers/change-password', {
        sellerId,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      if (res.data.success) {
        toast.success('Password updated')
        reset()
      }
    } catch (error) {
      toast.error(error.response?.data?.error || error.response?.data?.message || 'Failed')
    } finally {
      setSaving(false)
    }
  }

  const eye = (field) => ({
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={() => setShow((s) => ({ ...s, [field]: !s[field] }))} edge="end" size="small">
          {show[field] ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
        </IconButton>
      </InputAdornment>
    ),
  })

  return (
    <>
      <PageHeader
        title="Password"
        description="Choose a strong password you do not use on other sites."
      />

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Panel>
            <Box component="form" id="password-form" onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ mb: 2.5 }}>
                <FieldLabel required>Current password</FieldLabel>
                <TextField
                  fullWidth
                  type={show.cur ? 'text' : 'password'}
                  {...register('currentPassword', { required: 'Required' })}
                  error={!!errors.currentPassword}
                  helperText={errors.currentPassword?.message}
                  InputProps={eye('cur')}
                  sx={inputSx}
                />
              </Box>
              <Box sx={{ mb: 2.5 }}>
                <FieldLabel required>New password</FieldLabel>
                <TextField
                  fullWidth
                  type={show.next ? 'text' : 'password'}
                  {...register('newPassword', {
                    required: 'Required',
                    minLength: { value: 8, message: 'At least 8 characters' },
                  })}
                  error={!!errors.newPassword}
                  helperText={errors.newPassword?.message}
                  InputProps={eye('next')}
                  sx={inputSx}
                />
              </Box>
              <Box sx={{ mb: 1 }}>
                <FieldLabel required>Confirm new password</FieldLabel>
                <TextField
                  fullWidth
                  type={show.confirm ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Required',
                    validate: (v) => v === newPassword || 'Passwords must match',
                  })}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  InputProps={eye('confirm')}
                  sx={inputSx}
                />
              </Box>
              <FormFooter saving={saving} saveLabel="Update password" formId="password-form" />
            </Box>
          </Panel>
        </Grid>
        <Grid item xs={12} md={5}>
          <Panel>
            <Typography sx={{ fontSize: '13px', fontWeight: 600, color: st.ink, mb: 1.5 }}>
              Requirements
            </Typography>
            <Req met={rules.length} text="At least 8 characters" />
            <Req met={rules.match} text="Confirmation matches" />
            <Box
              sx={{
                mt: 2,
                p: 1.5,
                bgcolor: st.panelMuted,
                borderRadius: st.radius,
                border: `1px solid ${st.line}`,
              }}
            >
              <Typography sx={{ fontSize: '12px', color: st.inkSecondary, lineHeight: 1.55 }}>
                You will stay signed in on this device. Sign out of shared computers after changing
                your password.
              </Typography>
            </Box>
          </Panel>
        </Grid>
      </Grid>
    </>
  )
}

export default ChangePassword
