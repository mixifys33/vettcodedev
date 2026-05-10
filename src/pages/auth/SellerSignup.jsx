import { useState } from 'react';
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
  Fade,
  Zoom,
  Chip,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  PersonAdd,
  Code,
  ArrowForward,
  ArrowBack,
  CheckCircle,
  Store,
  Business,
  Verified,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const BUSINESS_TYPES = [
  'SaaS Applications',
  'AI Tools',
  'APIs & Integrations',
  'Templates & Boilerplates',
  'Automation Systems',
  'Developer Tools',
  'Mobile Apps',
  'Web Applications',
  'Chrome Extensions',
  'WordPress Plugins',
  'Other Software',
];

const steps = ['Account Info', 'Business Details', 'Review'];

const SellerSignup = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

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
      });

      if (response.data.success) {
        toast.success('Account created successfully! Please login.');
        navigate('/login');
      } else {
        setError(response.data.error || 'Signup failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Fade in timeout={500}>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <PersonAdd sx={{ color: '#6366f1' }} />
                Personal Information
              </Typography>

              <TextField
                fullWidth
                label="Full Name"
                {...register('name', { required: 'Name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={{
                  mb: 2.5,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255,255,255,0.05)',
                    '& fieldset': { borderColor: 'rgba(99, 102, 241, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(99, 102, 241, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                  '& .MuiInputBase-input': { color: 'white' },
                }}
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
                sx={{
                  mb: 2.5,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255,255,255,0.05)',
                    '& fieldset': { borderColor: 'rgba(99, 102, 241, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(99, 102, 241, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                  '& .MuiInputBase-input': { color: 'white' },
                }}
              />

              <TextField
                fullWidth
                label="Phone Number"
                {...register('phone', { required: 'Phone number is required' })}
                error={!!errors.phone}
                helperText={errors.phone?.message}
                sx={{
                  mb: 2.5,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255,255,255,0.05)',
                    '& fieldset': { borderColor: 'rgba(99, 102, 241, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(99, 102, 241, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                  '& .MuiInputBase-input': { color: 'white' },
                }}
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
                        sx={{ color: 'rgba(255,255,255,0.6)' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2.5,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255,255,255,0.05)',
                    '& fieldset': { borderColor: 'rgba(99, 102, 241, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(99, 102, 241, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                  '& .MuiInputBase-input': { color: 'white' },
                }}
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255,255,255,0.05)',
                    '& fieldset': { borderColor: 'rgba(99, 102, 241, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(99, 102, 241, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                  '& .MuiInputBase-input': { color: 'white' },
                }}
              />
            </Box>
          </Fade>
        );

      case 1:
        return (
          <Fade in timeout={500}>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Store sx={{ color: '#6366f1' }} />
                Business Details
              </Typography>

              <TextField
                fullWidth
                label="Shop Name"
                {...register('shopName', { required: 'Shop name is required' })}
                error={!!errors.shopName}
                helperText={errors.shopName?.message}
                sx={{
                  mb: 2.5,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255,255,255,0.05)',
                    '& fieldset': { borderColor: 'rgba(99, 102, 241, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(99, 102, 241, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                  '& .MuiInputBase-input': { color: 'white' },
                }}
              />

              <TextField
                fullWidth
                select
                label="Business Type"
                {...register('businessType', { required: 'Business type is required' })}
                error={!!errors.businessType}
                helperText={errors.businessType?.message}
                defaultValue=""
                sx={{
                  mb: 2.5,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255,255,255,0.05)',
                    '& fieldset': { borderColor: 'rgba(99, 102, 241, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(99, 102, 241, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                  '& .MuiSelect-select': { color: 'white' },
                  '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.6)' },
                }}
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
                sx={{
                  mb: 2.5,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255,255,255,0.05)',
                    '& fieldset': { borderColor: 'rgba(99, 102, 241, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(99, 102, 241, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                  '& .MuiInputBase-input': { color: 'white' },
                }}
              />

              <TextField
                fullWidth
                label="City"
                {...register('city', { required: 'City is required' })}
                error={!!errors.city}
                helperText={errors.city?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255,255,255,0.05)',
                    '& fieldset': { borderColor: 'rgba(99, 102, 241, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(99, 102, 241, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                  '& .MuiInputBase-input': { color: 'white' },
                }}
              />
            </Box>
          </Fade>
        );

      case 2:
        return (
          <Fade in timeout={500}>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <Verified sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontWeight: 700,
                  color: 'white',
                }}
              >
                Ready to Launch Your Store
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  mb: 4,
                  lineHeight: 1.7,
                }}
              >
                Review your information and create your seller account. Your account will be reviewed by our team within 24-48 hours.
              </Typography>
              <Alert
                severity="info"
                sx={{
                  textAlign: 'left',
                  bgcolor: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  color: 'rgba(255,255,255,0.9)',
                  '& .MuiAlert-icon': {
                    color: '#6366f1',
                  },
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  What happens next?
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2.5, listStyle: 'none' }}>
                  {[
                    'Your account will be reviewed by our team',
                    'You will receive an email notification once approved',
                    'Start uploading your software products',
                    'Begin earning from your first sale',
                  ].map((item, idx) => (
                    <Box
                      component="li"
                      key={idx}
                      sx={{
                        fontSize: '0.875rem',
                        mb: 0.75,
                        position: 'relative',
                        pl: 2,
                        '&::before': {
                          content: '"→"',
                          position: 'absolute',
                          left: 0,
                          color: '#6366f1',
                          fontWeight: 900,
                        },
                      }}
                    >
                      {item}
                    </Box>
                  ))}
                </Box>
              </Alert>
            </Box>
          </Fade>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#0a0e27',
        py: 4,
      }}
    >
      {/* Animated Background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <Box
          className="animate-pulse-slow"
          sx={{
            position: 'absolute',
            top: '-10%',
            left: '-10%',
            width: 500,
            height: 500,
            bgcolor: 'rgba(99, 102, 241, 0.08)',
            borderRadius: '50%',
            filter: 'blur(80px)',
          }}
        />
        <Box
          className="animate-pulse-slower"
          sx={{
            position: 'absolute',
            bottom: '-10%',
            right: '-10%',
            width: 500,
            height: 500,
            bgcolor: 'rgba(139, 92, 246, 0.08)',
            borderRadius: '50%',
            filter: 'blur(80px)',
          }}
        />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 650,
          px: 2,
        }}
      >
        <Zoom in timeout={800}>
          <Card
            sx={{
              bgcolor: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: 3,
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
              {/* Logo */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    mb: 2,
                    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
                  }}
                >
                  <Code sx={{ fontSize: 36, color: 'white' }} />
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 900,
                    color: 'white',
                    mb: 1,
                  }}
                >
                  Join VettCode
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255,255,255,0.6)',
                  }}
                >
                  Start selling your software products today
                </Typography>
              </Box>

              {/* Stepper */}
              <Stepper
                activeStep={activeStep}
                sx={{
                  mb: 4,
                  '& .MuiStepLabel-label': {
                    color: 'rgba(255,255,255,0.5)',
                    '&.Mui-active': {
                      color: '#6366f1',
                      fontWeight: 600,
                    },
                    '&.Mui-completed': {
                      color: 'rgba(255,255,255,0.7)',
                    },
                  },
                  '& .MuiStepIcon-root': {
                    color: 'rgba(99, 102, 241, 0.3)',
                    '&.Mui-active': {
                      color: '#6366f1',
                    },
                    '&.Mui-completed': {
                      color: '#10b981',
                    },
                  },
                }}
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Error Alert */}
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    bgcolor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#fca5a5',
                    '& .MuiAlert-icon': {
                      color: '#ef4444',
                    },
                  }}
                >
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
                      startIcon={<ArrowBack />}
                      sx={{
                        flex: 1,
                        py: 1.5,
                        borderColor: 'rgba(99, 102, 241, 0.5)',
                        color: 'white',
                        fontWeight: 600,
                        '&:hover': {
                          borderColor: '#6366f1',
                          bgcolor: 'rgba(99, 102, 241, 0.1)',
                        },
                      }}
                    >
                      Back
                    </Button>
                  )}

                  {activeStep < steps.length - 1 ? (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      endIcon={<ArrowForward />}
                      sx={{
                        flex: 1,
                        py: 1.5,
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                          boxShadow: '0 12px 32px rgba(99, 102, 241, 0.4)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      endIcon={
                        loading ? (
                          <CircularProgress size={20} sx={{ color: 'white' }} />
                        ) : (
                          <CheckCircle />
                        )
                      }
                      sx={{
                        flex: 1,
                        py: 1.5,
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                          boxShadow: '0 12px 32px rgba(16, 185, 129, 0.4)',
                          transform: 'translateY(-2px)',
                        },
                        '&:disabled': {
                          background: 'rgba(16, 185, 129, 0.3)',
                          color: 'rgba(255,255,255,0.5)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  )}
                </Box>
              </form>

              {/* Login Link */}
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  Already have an account?{' '}
                  <Link
                    component="button"
                    type="button"
                    variant="body2"
                    onClick={() => navigate('/login')}
                    sx={{
                      color: '#6366f1',
                      fontWeight: 700,
                      textDecoration: 'none',
                      '&:hover': {
                        color: '#8b5cf6',
                      },
                    }}
                  >
                    Sign In
                  </Link>
                </Typography>
              </Box>

              {/* Back to Home */}
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Link
                  component="button"
                  type="button"
                  variant="body2"
                  onClick={() => navigate('/')}
                  sx={{
                    color: 'rgba(255,255,255,0.5)',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: 'rgba(255,255,255,0.8)',
                    },
                  }}
                >
                  ← Back to Home
                </Link>
              </Box>
            </CardContent>
          </Card>
        </Zoom>
      </Box>
    </Box>
  );
};

export default SellerSignup;
