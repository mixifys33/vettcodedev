import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  CircularProgress,
  Alert,
  Fade,
  Zoom,
} from '@mui/material';
import { Email, ArrowBack, Code, Lock, CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await api.post('/sellers/forgot-password', {
        email: data.email,
      });

      if (response.data.success) {
        setSuccess(true);
        toast.success('Password reset link sent to your email!');
      } else {
        setError(response.data.error || 'Failed to send reset link');
      }
    } catch (err) {
      // Handle 404 - endpoint not implemented yet
      if (err.response?.status === 404) {
        setError(
          'Password reset feature is currently being set up. Please contact support at support@vettcode.com for assistance with your account.'
        );
      } else {
        setError(err.response?.data?.error || 'Failed to send reset link. Please try again.');
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
          maxWidth: 500,
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
                  <Lock sx={{ fontSize: 32, color: 'white' }} />
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: 'white',
                    mb: 1,
                  }}
                >
                  Reset Your Password
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.6)',
                  }}
                >
                  Enter your email to receive a password reset link
                </Typography>
              </Box>

              {/* Success Alert */}
              {success && (
                <Fade in>
                  <Alert
                    severity="success"
                    icon={<CheckCircle />}
                    sx={{
                      mb: 3,
                      bgcolor: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      color: '#6ee7b7',
                      '& .MuiAlert-icon': {
                        color: '#10b981',
                      },
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Reset link sent!
                    </Typography>
                    <Typography variant="body2">
                      Please check your email inbox for the password reset link.
                    </Typography>
                  </Alert>
                </Fade>
              )}

              {/* Error Alert */}
              {error && (
                <Fade in>
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
                </Fade>
              )}

              {!success && (
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
                      mb: 3,
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

                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    startIcon={
                      loading ? (
                        <CircularProgress size={20} sx={{ color: 'white' }} />
                      ) : (
                        <Email />
                      )
                    }
                    sx={{
                      py: 1.8,
                      fontSize: '1rem',
                      fontWeight: 700,
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        boxShadow: '0 12px 32px rgba(99, 102, 241, 0.4)',
                        transform: 'translateY(-2px)',
                      },
                      '&:disabled': {
                        background: 'rgba(99, 102, 241, 0.3)',
                        color: 'rgba(255,255,255,0.5)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </form>
              )}

              {/* Alternative Contact Info */}
              {!success && (
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    bgcolor: 'rgba(99, 102, 241, 0.05)',
                    border: '1px solid rgba(99, 102, 241, 0.1)',
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(255,255,255,0.6)',
                      display: 'block',
                      textAlign: 'center',
                    }}
                  >
                    Need help? Contact us at{' '}
                    <Link
                      href="mailto:support@vettcode.com"
                      sx={{
                        color: '#6366f1',
                        fontWeight: 600,
                        textDecoration: 'none',
                        '&:hover': {
                          color: '#8b5cf6',
                        },
                      }}
                    >
                      support@vettcode.com
                    </Link>
                  </Typography>
                </Box>
              )}

              {/* Back to Login */}
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Link
                  component="button"
                  type="button"
                  variant="body2"
                  onClick={() => navigate('/login')}
                  sx={{
                    color: '#6366f1',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    '&:hover': {
                      color: '#8b5cf6',
                    },
                  }}
                >
                  <ArrowBack fontSize="small" />
                  Back to Login
                </Link>
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

export default ForgotPassword;
