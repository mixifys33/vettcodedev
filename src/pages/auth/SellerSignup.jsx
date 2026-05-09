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
  Stepper,
  Step,
  StepLabel,
  MenuItem,
} from '@mui/material'
import { Visibility, VisibilityOff, Apps, PersonAdd } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import api from '../../utils/api'

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
  'Other',
]

const steps = ['Account Info', 'Business Details', 'Verification']

const SellerSignup = () => {
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch('password')

  const onSubmit = async (data) => {
    setLoading(true)
    setError('')

    try {
      const response = await api.post('/sellers/signup', {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        shop: {
          shopName: data.shopName,
          businessType: data.businessType,
          businessAddress: data.businessAddress,
          city: data.city,
        },
      })

      if (response.data.success) {
        toast.success('Account created successfully! Please login.')
        navigate('/login')
      } else {
        setError(response.data.error || 'Signup failed')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    setActiveStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <TextField
              fullWidth
              label="Full Name"
              {...register('name', { required: 'Name is required' })}
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={{ mb: 2.5 }}
            />

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
              label="Phone Number"
              {...register('phone', { required: 'Phone number is required' })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
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
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2.5 }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
          </>
        )

      case 1:
        return (
          <>
            <TextField
              fullWidth
              label="Shop Name"
              {...register('shopName', { required: 'Shop name is required' })}
              error={!!errors.shopName}
              helperText={errors.shopName?.message}
              sx={{ mb: 2.5 }}
            />

            <TextField
              fullWidth
              select
              label="Business Type"
              {...register('businessType', { required: 'Business type is required' })}
              error={!!errors.businessType}
              helperText={errors.businessType?.message}
              defaultValue=""
              sx={{ mb: 2.5 }}
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
              {...register('businessAddress', { required: 'Business address is required' })}
              error={!!errors.businessAddress}
              helperText={errors.businessAddress?.message}
              sx={{ mb: 2.5 }}
            />

            <TextField
              fullWidth
              label="City"
              {...register('city', { required: 'City is required' })}
              error={!!errors.city}
              helperText={errors.city?.message}
            />
          </>
        )

      case 2:
        return (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Review Your Information
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Please review your details before submitting. Your account will be reviewed by our
              team and you'll be notified once approved.
            </Typography>
            <Alert severity="info" sx={{ textAlign: 'left' }}>
              After registration, your account will be in pending status until approved by an
              administrator. This usually takes 24-48 hours.
            </Alert>
          </Box>
        )

      default:
        return null
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
          maxWidth: 600,
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
                width: 70,
                height: 70,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f0a500 0%, #fbbf24 100%)',
                mb: 2,
              }}
            >
              <Apps sx={{ fontSize: 36, color: '#0a1628' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
              Join VettCode
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start selling your applications today
            </Typography>
          </Box>

          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStepContent()}

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              {activeStep > 0 && (
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={loading}
                  sx={{ flex: 1 }}
                >
                  Back
                </Button>
              )}

              {activeStep < steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ flex: 1 }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <PersonAdd />}
                  sx={{ flex: 1 }}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              )}
            </Box>
          </form>

          {/* Login Link */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() => navigate('/login')}
                sx={{ fontWeight: 600, textDecoration: 'none' }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default SellerSignup
