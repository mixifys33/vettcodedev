import { useState, useEffect } from 'react'
import { Box, TextField, Avatar, Typography, Grid, LinearProgress } from '@mui/material'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import useAuthStore from '../../store/authStore'
import { getInitials } from '../../utils/helpers'
import { st, inputSx } from '../../components/settings/settingsTheme'
import { PageHeader, Panel, FieldLabel, FormFooter } from '../../components/settings/SettingsPage'

const ProfileSettings = () => {
  const { user, updateUser } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm()

  const name = watch('name')

  useEffect(() => {
    const load = async () => {
      try {
        const sellerId = user?.id || user?._id
        const res = await api.get(`/sellers/profile/${sellerId}`)
        if (res.data.success) {
          const p = res.data.profile
          setValue('name', p.name || '')
          setValue('email', p.email || '')
          setValue('phoneNumber', p.phoneNumber || user?.phoneNumber || '')
        }
      } catch {
        setValue('name', user?.name || '')
        setValue('email', user?.email || '')
        setValue('phoneNumber', user?.phoneNumber || '')
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
      const res = await api.put(`/sellers/profile/${sellerId}`, {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
      })
      if (res.data.success) {
        toast.success('Profile updated')
        updateUser({ ...user, ...data })
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed')
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
        title="Profile"
        description="Contact details tied to your seller account. Used for login recovery and platform notices."
      />

      <Panel noPadding sx={{ mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2.5,
            bgcolor: st.ink,
            color: '#fff',
          }}
        >
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: st.accent,
              fontWeight: 700,
              fontSize: '1.1rem',
            }}
          >
            {getInitials(name || user?.email)}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: '16px' }}>{name || 'Your name'}</Typography>
            <Typography sx={{ fontSize: '13px', opacity: 0.75, fontFamily: st.fontMono }}>
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </Panel>

      <Panel>
        <Box component="form" id="profile-form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <FieldLabel required>Full name</FieldLabel>
              <TextField
                fullWidth
                {...register('name', { required: 'Required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={inputSx}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FieldLabel required>Email</FieldLabel>
              <TextField
                fullWidth
                type="email"
                {...register('email', {
                  required: 'Required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email',
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={inputSx}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FieldLabel required>Phone</FieldLabel>
              <TextField
                fullWidth
                placeholder="+1234567890"
                {...register('phoneNumber', {
                  required: 'Required',
                  pattern: {
                    value: /^\+\d{10,15}$/,
                    message: 'Use international format, e.g. +256700000000',
                  },
                })}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message || 'Include country code'}
                sx={inputSx}
              />
            </Grid>
          </Grid>
          <FormFooter saving={saving} saveLabel="Save profile" formId="profile-form" />
        </Box>
      </Panel>
    </>
  )
}

export default ProfileSettings
