import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material'
import { Visibility, VisibilityOff, Apps, Login as LoginIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import useAuthStore from '../../store/authStore'

const ADMIN_EMAIL = 'admin@eshop.ug'

const SellerLogin = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const email = watch('email', '')
  const isAdminEmail = email.toLowerCase().trim() === ADMIN_EMAIL

  const onSubmit = async (data) => {
    setLoading(true)
    setError('')

    try {
      const endpoint = isAdminEmail ? '/admin/login' : '/sellers/login'
      const response = await api.post(endpoint, {
        email: data.email,
        password: data.password,
      })

      if (response.data.success) {
        const userData = isAdminEmail ? response.data.admin : response.data.seller
        const token = response.data.token

        login(userData, token, isAdminEmail)
        toast.success(`Welcome back, ${userData.name || userData.email}!`)

        if (isAdminEmail) {
          navigate('/admin/dashboard')
        } else {
          navigate('/seller/dashboard')
        }
      } else {
        setError(response.data.error || 'Login failed')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a1628 0%, #1a3a5c 50%, #0a1628 100%)',
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 480,
          width: '100%',
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f0a500 0%, #fbbf24 100%)',
                mb: 2,
              }}
            >
              <Apps sx={{ fontSize: 40, color: '#0a1628' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
              VettCode
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isAdminEmail ? 'Admin Portal' : 'Seller Dashboard'}
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email address',
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ mb: 2.5 }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 1.5 }}
            />

            <Box sx={{ textAlign: 'right', mb: 3 }}>
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() => navigate('/forgot-password')}
                sx={{ textDecoration: 'none' }}
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                background: isAdminEmail
                  ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                  : 'linear-gradient(135deg, #0a1628 0%, #1a3a5c 100%)',
                '&:hover': {
                  background: isAdminEmail
                    ? 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)'
                    : 'linear-gradient(135deg, #1a3a5c 0%, #0a1628 100%)',
                },
              }}
            >
              {loading ? 'Signing in...' : isAdminEmail ? 'Admin Login' : 'Sign In'}
            </Button>
          </form>

          {/* Sign Up Link */}
          {!isAdminEmail && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link
                  component="button"
                  type="button"
                  variant="body2"
                  onClick={() => navigate('/signup')}
                  sx={{ fontWeight: 600, textDecoration: 'none' }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default SellerLogin
