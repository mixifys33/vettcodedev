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
  Fade,
  Zoom,
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Login as LoginIcon, 
  Code,
  ArrowForward,
  CheckCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import useAuthStore from '../../store/authStore';

const ADMIN_EMAIL = 'admin@eshop.ug';

const SellerLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const email = watch('email', '');
  const isAdminEmail = email.toLowerCase().trim() === ADMIN_EMAIL;

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const endpoint = isAdminEmail ? '/admin/login' : '/sellers/login';
      const response = await api.post(endpoint, {
        email: data.email,
        password: data.password,
      });

      if (response.data.success) {
        const userData = isAdminEmail ? response.data.admin : response.data.seller;
        const token = response.data.token;

        login(userData, token, isAdminEmail);
        toast.success(`Welcome back, ${userData.name || userData.email}!`);

        if (isAdminEmail) {
          navigate('/admin/dashboard');
        } else {
          navigate('/seller/dashboard');
        }
      } else {
        setError(response.data.error || 'Login failed');
      }
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Invalid credentials. Please try again.'
      setError(message)
      if (err.response?.status === 403) {
        toast.error(message)
      }
    } finally {
      setLoading(false);
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
        {/* Grid Pattern */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        {/* Floating Code Snippets */}
        <Box
          className="animate-float"
          sx={{
            position: 'absolute',
            top: '15%',
            left: '10%',
            color: 'rgba(99, 102, 241, 0.15)',
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            display: { xs: 'none', md: 'block' },
          }}
        >
          <pre>{`const login = () => {\n  return <Success />;\n}`}</pre>
        </Box>
        <Box
          className="animate-float-delayed"
          sx={{
            position: 'absolute',
            top: '60%',
            right: '15%',
            color: 'rgba(99, 102, 241, 0.15)',
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            display: { xs: 'none', md: 'block' },
          }}
        >
          <pre>{`function authenticate() {\n  return verified;\n}`}</pre>
        </Box>
        <Box
          className="animate-float-slow"
          sx={{
            position: 'absolute',
            bottom: '20%',
            left: '20%',
            color: 'rgba(99, 102, 241, 0.15)',
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            display: { xs: 'none', lg: 'block' },
          }}
        >
          <pre>{`import { seller } from 'vettcode'`}</pre>
        </Box>

        {/* Gradient Orbs */}
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
          maxWidth: 1200,
          px: 2,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 4,
            alignItems: 'center',
          }}
        >
          {/* Left Side - Branding */}
          <Fade in timeout={800}>
            <Box
              sx={{
                display: { xs: 'none', md: 'block' },
                pr: 4,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
                  }}
                >
                  <Code sx={{ fontSize: 32, color: 'white' }} />
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 900,
                    color: 'white',
                    letterSpacing: '-0.5px',
                  }}
                >
                  VettCode
                </Typography>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: 'white',
                  mb: 3,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  lineHeight: 1.2,
                }}
              >
                Welcome Back to Your{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Seller Dashboard
                </Box>
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  mb: 4,
                  lineHeight: 1.6,
                  fontWeight: 400,
                }}
              >
                Manage your products, track sales, and grow your software business.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  'Access your seller dashboard',
                  'Manage products and pricing',
                  'Track earnings and analytics',
                  'Connect with global buyers',
                ].map((feature, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <CheckCircle sx={{ fontSize: 16, color: 'white' }} />
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'rgba(255,255,255,0.8)',
                        fontWeight: 500,
                      }}
                    >
                      {feature}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Fade>

          {/* Right Side - Login Form */}
          <Zoom in timeout={1000}>
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
                {/* Mobile Logo */}
                <Box
                  sx={{
                    display: { xs: 'flex', md: 'none' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    mb: 4,
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Code sx={{ fontSize: 28, color: 'white' }} />
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 900,
                      color: 'white',
                    }}
                  >
                    VettCode
                  </Typography>
                </Box>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: 'white',
                    mb: 1,
                    textAlign: { xs: 'center', md: 'left' },
                  }}
                >
                  {isAdminEmail ? 'Admin Login' : 'Sign In'}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.6)',
                    mb: 4,
                    textAlign: { xs: 'center', md: 'left' },
                  }}
                >
                  {isAdminEmail
                    ? 'Access the admin portal'
                    : 'Continue to your seller dashboard'}
                </Typography>

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
                    sx={{
                      mb: 2.5,
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(255,255,255,0.05)',
                        '& fieldset': {
                          borderColor: 'rgba(99, 102, 241, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(99, 102, 241, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#6366f1',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255,255,255,0.6)',
                      },
                      '& .MuiInputBase-input': {
                        color: 'white',
                      },
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
                      mb: 1.5,
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(255,255,255,0.05)',
                        '& fieldset': {
                          borderColor: 'rgba(99, 102, 241, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(99, 102, 241, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#6366f1',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255,255,255,0.6)',
                      },
                      '& .MuiInputBase-input': {
                        color: 'white',
                      },
                    }}
                  />

                  <Box sx={{ textAlign: 'right', mb: 3 }}>
                    <Link
                      component="button"
                      type="button"
                      variant="body2"
                      onClick={() => navigate('/forgot-password')}
                      sx={{
                        color: '#6366f1',
                        textDecoration: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          color: '#8b5cf6',
                        },
                      }}
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
                    endIcon={
                      loading ? (
                        <CircularProgress size={20} sx={{ color: 'white' }} />
                      ) : (
                        <ArrowForward />
                      )
                    }
                    sx={{
                      py: 1.8,
                      fontSize: '1rem',
                      fontWeight: 700,
                      textTransform: 'none',
                      background: isAdminEmail
                        ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                        : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      boxShadow: isAdminEmail
                        ? '0 8px 24px rgba(220, 38, 38, 0.3)'
                        : '0 8px 24px rgba(99, 102, 241, 0.3)',
                      '&:hover': {
                        background: isAdminEmail
                          ? 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)'
                          : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        boxShadow: isAdminEmail
                          ? '0 12px 32px rgba(220, 38, 38, 0.4)'
                          : '0 12px 32px rgba(99, 102, 241, 0.4)',
                        transform: 'translateY(-2px)',
                      },
                      '&:disabled': {
                        background: 'rgba(99, 102, 241, 0.3)',
                        color: 'rgba(255,255,255,0.5)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {loading
                      ? 'Signing in...'
                      : isAdminEmail
                      ? 'Access Admin Portal'
                      : 'Sign In to Dashboard'}
                  </Button>
                </form>

                {/* Sign Up Link */}
                {!isAdminEmail && (
                  <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                      Don't have an account?{' '}
                      <Link
                        component="button"
                        type="button"
                        variant="body2"
                        onClick={() => navigate('/signup')}
                        sx={{
                          color: '#6366f1',
                          fontWeight: 700,
                          textDecoration: 'none',
                          '&:hover': {
                            color: '#8b5cf6',
                          },
                        }}
                      >
                        Create Account
                      </Link>
                    </Typography>
                  </Box>
                )}

                {/* Back to Home */}
                <Box sx={{ mt: 3, textAlign: 'center' }}>
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
    </Box>
  );
};

export default SellerLogin;
