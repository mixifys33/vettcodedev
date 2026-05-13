import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  Divider,
  CircularProgress,
  IconButton,
  Dialog,
  Container,
  Stack,
  Avatar,
  Paper,
  Tooltip,
  Badge,
  alpha,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
} from '@mui/material'
import {
  ArrowBack,
  Edit,
  Delete,
  GitHub,
  Language,
  Description,
  VideoLibrary,
  Settings as SettingsIcon,
  CheckCircle,
  Schedule,
  Cancel,
  Close,
  Download,
  Visibility,
  Star,
  Code,
  Devices,
  Security,
  Update,
  Support,
  AttachMoney,
  CalendarToday,
  TrendingUp,
  Share,
  ContentCopy,
  OpenInNew,
  PlayCircleOutline,
  ZoomIn,
} from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import { formatCurrency, formatDate } from '../../utils/helpers'
import { colors } from '../../theme/tokens'

const ApplicationPreview = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imageDialog, setImageDialog] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchApplication()
  }, [id])

  const fetchApplication = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/applications/${id}`)

      if (response.data.success) {
        setApplication(response.data.application)
      }
    } catch (error) {
      toast.error('Failed to fetch application')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
      const response = await api.delete(`/applications/${id}`)

      if (response.data.success) {
        toast.success('Application deleted successfully')
        navigate('/seller/applications')
      }
    } catch (error) {
      toast.error('Failed to delete application')
      console.error(error)
    } finally {
      setDeleting(false)
      setDeleteDialog(false)
    }
  }

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard!')
  }

  const handleCopyId = () => {
    navigator.clipboard.writeText(application._id)
    toast.success('Application ID copied!')
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle sx={{ fontSize: 20 }} />
      case 'pending':
        return <Schedule sx={{ fontSize: 20 }} />
      case 'rejected':
        return <Cancel sx={{ fontSize: 20 }} />
      default:
        return <Schedule sx={{ fontSize: 20 }} />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return '#27ae60'
      case 'pending':
        return '#f39c12'
      case 'rejected':
        return '#e74c3c'
      default:
        return '#f39c12'
    }
  }

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh',
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)',
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} thickness={4} sx={{ color: colors.primary, mb: 2 }} />
          <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>Loading application...</Typography>
        </Box>
      </Box>
    )
  }

  if (!application) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        py: 8,
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)',
        borderRadius: 3,
        mx: 3,
        mt: 3,
      }}>
        <Cancel sx={{ fontSize: 80, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
        <Typography variant="h5" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>
          Application not found
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
          The application you're looking for doesn't exist or has been removed.
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/seller/applications')}
          sx={{
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            textTransform: 'none',
            px: 4,
            py: 1.5,
            fontWeight: 600,
          }}
        >
          Back to Applications
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100vh' }}>
      {/* Modern Header with Glassmorphism */}
      <Fade in timeout={600}>
        <Card sx={{ 
          mb: 4,
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 3,
          overflow: 'visible',
        }}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between">
              {/* Back Button */}
              <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/seller/applications')}
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: 'rgba(79, 70, 229, 0.15)',
                  },
                }}
              >
                Back to Applications
              </Button>

              {/* Action Buttons */}
              <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent={{ xs: 'center', md: 'flex-end' }}>
                <Tooltip title="Share this application">
                  <IconButton
                    onClick={handleShare}
                    sx={{
                      bgcolor: 'rgba(79, 70, 229, 0.15)',
                      color: colors.primary,
                      '&:hover': { bgcolor: 'rgba(79, 70, 229, 0.25)' },
                    }}
                  >
                    <Share />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Copy Application ID">
                  <IconButton
                    onClick={handleCopyId}
                    sx={{
                      bgcolor: 'rgba(79, 70, 229, 0.15)',
                      color: colors.primary,
                      '&:hover': { bgcolor: 'rgba(79, 70, 229, 0.25)' },
                    }}
                  >
                    <ContentCopy />
                  </IconButton>
                </Tooltip>

                <Button
                  variant="outlined"
                  startIcon={<SettingsIcon />}
                  onClick={() => navigate(`/seller/applications/${id}/delivery`)}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: colors.primary,
                      bgcolor: 'rgba(79, 70, 229, 0.1)',
                    },
                  }}
                >
                  {!isMobile && 'Delivery Settings'}
                  {isMobile && <SettingsIcon />}
                </Button>

                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={() => navigate(`/seller/applications/edit/${id}`)}
                  sx={{
                    background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(79, 70, 229, 0.5)',
                      background: 'linear-gradient(135deg, #4338CA 0%, #6D28D9 100%)',
                    },
                  }}
                >
                  Edit
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Delete />}
                  onClick={() => setDeleteDialog(true)}
                  sx={{
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#ef4444',
                      bgcolor: 'rgba(239, 68, 68, 0.1)',
                    },
                  }}
                >
                  Delete
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Fade>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Hero Section with App Icon */}
          <Zoom in timeout={800}>
            <Card sx={{ 
              mb: 3,
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '200px',
                background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%)',
                zIndex: 0,
              },
            }}>
              <CardContent sx={{ p: { xs: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
                {/* App Icon and Title */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'center', sm: 'flex-start' }} sx={{ mb: 3 }}>
                  {/* App Icon */}
                  {application.appIcon?.url && (
                    <Avatar
                      src={application.appIcon.url}
                      alt={application.appName}
                      sx={{
                        width: { xs: 100, md: 120 },
                        height: { xs: 100, md: 120 },
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                        border: '3px solid rgba(255,255,255,0.1)',
                      }}
                    />
                  )}

                  {/* Title and Status */}
                  <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                    <Typography variant="h3" sx={{ 
                      fontWeight: 800, 
                      mb: 1.5,
                      color: 'white',
                      fontSize: { xs: '1.75rem', md: '2.5rem' },
                      textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                    }}>
                      {application.appName}
                    </Typography>
                    
                    <Typography variant="h6" sx={{ 
                      color: 'rgba(255,255,255,0.8)', 
                      mb: 2,
                      fontWeight: 400,
                      lineHeight: 1.6,
                    }}>
                      {application.shortDescription}
                    </Typography>

                    {/* Status Badge */}
                    <Chip
                      icon={getStatusIcon(application.verificationStatus)}
                      label={application.verificationStatus || 'pending'}
                      sx={{
                        bgcolor: `${getStatusColor(application.verificationStatus)}20`,
                        color: getStatusColor(application.verificationStatus),
                        fontWeight: 700,
                        textTransform: 'capitalize',
                        px: 2,
                        py: 2.5,
                        fontSize: '0.875rem',
                        border: `2px solid ${getStatusColor(application.verificationStatus)}40`,
                        boxShadow: `0 4px 12px ${getStatusColor(application.verificationStatus)}30`,
                      }}
                    />
                  </Box>
                </Stack>

                {/* Category and Tags */}
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                  <Chip 
                    icon={<Code sx={{ fontSize: 18 }} />}
                    label={application.appCategory} 
                    sx={{
                      background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                      color: 'white',
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                    }}
                  />
                  {application.tags?.split(',').map((tag, index) => (
                    <Chip 
                      key={index} 
                      label={tag.trim()} 
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.9)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        fontWeight: 500,
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.15)',
                        },
                      }}
                    />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Zoom>

          {/* Description Section */}
          <Fade in timeout={1000}>
            <Card sx={{ 
              mb: 3,
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 3,
            }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                  <Description sx={{ color: colors.primary, fontSize: 28 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                    Description
                  </Typography>
                </Stack>
                <Box
                  sx={{ 
                    color: 'rgba(255,255,255,0.85)',
                    lineHeight: 1.8,
                    fontSize: '1rem',
                    '& p': { mb: 2 },
                    '& h1, & h2, & h3, & h4, & h5, & h6': { 
                      color: 'white', 
                      fontWeight: 600,
                      mt: 3,
                      mb: 2,
                    },
                    '& ul, & ol': { pl: 3, mb: 2 },
                    '& li': { mb: 1 },
                    '& a': { 
                      color: colors.primary,
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                    },
                    '& code': {
                      bgcolor: 'rgba(79, 70, 229, 0.15)',
                      color: colors.primary,
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.875rem',
                      fontFamily: 'monospace',
                    },
                  }}
                  dangerouslySetInnerHTML={{ __html: application.detailedDescription }}
                />
              </CardContent>
            </Card>
          </Fade>

          {/* Screenshots Gallery */}
          {application.screenshots && application.screenshots.length > 0 && (
            <Fade in timeout={1200}>
              <Card sx={{ 
                mb: 3,
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 3,
              }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                    <ZoomIn sx={{ color: colors.primary, fontSize: 28 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                      Screenshots
                    </Typography>
                    <Chip 
                      label={`${application.screenshots.length} images`} 
                      size="small"
                      sx={{
                        bgcolor: 'rgba(79, 70, 229, 0.2)',
                        color: colors.primary,
                        fontWeight: 600,
                      }}
                    />
                  </Stack>
                  <Grid container spacing={2}>
                    {application.screenshots.map((screenshot, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Zoom in timeout={1200 + (index * 100)}>
                          <Paper
                            elevation={0}
                            sx={{
                              position: 'relative',
                              paddingTop: '66.67%', // 3:2 aspect ratio
                              borderRadius: 2,
                              overflow: 'hidden',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              border: '1px solid rgba(255,255,255,0.1)',
                              '&:hover': {
                                transform: 'translateY(-8px) scale(1.02)',
                                boxShadow: '0 12px 40px rgba(79, 70, 229, 0.4)',
                                border: '1px solid rgba(79, 70, 229, 0.5)',
                                '& .overlay': {
                                  opacity: 1,
                                },
                              },
                            }}
                            onClick={() => {
                              setSelectedImage(screenshot.url || screenshot)
                              setImageDialog(true)
                            }}
                          >
                            <Box
                              component="img"
                              src={screenshot.url || screenshot}
                              alt={`Screenshot ${index + 1}`}
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                            <Box
                              className="overlay"
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.8) 0%, rgba(124, 58, 237, 0.8) 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 0,
                                transition: 'opacity 0.3s ease',
                              }}
                            >
                              <ZoomIn sx={{ fontSize: 48, color: 'white' }} />
                            </Box>
                          </Paper>
                        </Zoom>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Fade>
          )}

          {/* Technology Stack */}
          {application.technologyStack && application.technologyStack.length > 0 && (
            <Fade in timeout={1400}>
              <Card sx={{ 
                mb: 3,
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 3,
              }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                    <Code sx={{ color: colors.primary, fontSize: 28 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                      Technology Stack
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ gap: 1.5 }}>
                    {application.technologyStack.map((tech, index) => (
                      <Zoom in timeout={1400 + (index * 50)} key={index}>
                        <Chip 
                          label={tech}
                          icon={<Code sx={{ fontSize: 18 }} />}
                          sx={{
                            bgcolor: 'rgba(79, 70, 229, 0.15)',
                            color: 'white',
                            border: '1px solid rgba(79, 70, 229, 0.3)',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            py: 2.5,
                            px: 1,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              bgcolor: 'rgba(79, 70, 229, 0.25)',
                              border: '1px solid rgba(79, 70, 229, 0.5)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                            },
                          }}
                        />
                      </Zoom>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Fade>
          )}

          {/* Supported Platforms */}
          {application.supportedPlatforms && application.supportedPlatforms.length > 0 && (
            <Fade in timeout={1600}>
              <Card sx={{ 
                mb: 3,
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 3,
              }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                    <Devices sx={{ color: colors.primary, fontSize: 28 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                      Supported Platforms
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ gap: 1.5 }}>
                    {application.supportedPlatforms.map((platform, index) => (
                      <Zoom in timeout={1600 + (index * 50)} key={index}>
                        <Chip 
                          label={platform}
                          icon={<Devices sx={{ fontSize: 18 }} />}
                          sx={{
                            bgcolor: 'rgba(124, 58, 237, 0.15)',
                            color: 'white',
                            border: '1px solid rgba(124, 58, 237, 0.3)',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            py: 2.5,
                            px: 1,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              bgcolor: 'rgba(124, 58, 237, 0.25)',
                              border: '1px solid rgba(124, 58, 237, 0.5)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
                            },
                          }}
                        />
                      </Zoom>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Fade>
          )}

          {/* Dependencies */}
          {application.dependencies && application.dependencies.length > 0 && (
            <Fade in timeout={1800}>
              <Card sx={{ 
                mb: 3,
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 3,
              }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                    <Security sx={{ color: colors.primary, fontSize: 28 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                      Dependencies
                    </Typography>
                    <Chip 
                      label={`${application.dependencies.length} packages`} 
                      size="small"
                      sx={{
                        bgcolor: 'rgba(79, 70, 229, 0.2)',
                        color: colors.primary,
                        fontWeight: 600,
                      }}
                    />
                  </Stack>
                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                    {application.dependencies.map((dep, index) => (
                      <Chip 
                        key={index} 
                        label={dep} 
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.05)',
                          color: 'rgba(255,255,255,0.8)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.1)',
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Fade>
          )}

          {/* Links & Resources */}
          <Fade in timeout={2000}>
            <Card sx={{ 
              mb: 3,
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 3,
            }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                  <OpenInNew sx={{ color: colors.primary, fontSize: 28 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                    Links & Resources
                  </Typography>
                </Stack>
                <Grid container spacing={2}>
                  {application.githubRepo && (
                    <Grid item xs={12} sm={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<GitHub />}
                        endIcon={<OpenInNew sx={{ fontSize: 16 }} />}
                        href={application.githubRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          py: 1.5,
                          borderColor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: colors.primary,
                            bgcolor: 'rgba(79, 70, 229, 0.1)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                          },
                        }}
                      >
                        GitHub Repository
                      </Button>
                    </Grid>
                  )}
                  {application.liveDemo && (
                    <Grid item xs={12} sm={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Language />}
                        endIcon={<OpenInNew sx={{ fontSize: 16 }} />}
                        href={application.liveDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          py: 1.5,
                          borderColor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: '#10b981',
                            bgcolor: 'rgba(16, 185, 129, 0.1)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                          },
                        }}
                      >
                        Live Demo
                      </Button>
                    </Grid>
                  )}
                  {application.documentationUrl && (
                    <Grid item xs={12} sm={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Description />}
                        endIcon={<OpenInNew sx={{ fontSize: 16 }} />}
                        href={application.documentationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          py: 1.5,
                          borderColor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: '#f59e0b',
                            bgcolor: 'rgba(245, 158, 11, 0.1)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                          },
                        }}
                      >
                        Documentation
                      </Button>
                    </Grid>
                  )}
                  {application.videoDemo && (
                    <Grid item xs={12} sm={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<PlayCircleOutline />}
                        endIcon={<OpenInNew sx={{ fontSize: 16 }} />}
                        href={application.videoDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          py: 1.5,
                          borderColor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: '#ef4444',
                            bgcolor: 'rgba(239, 68, 68, 0.1)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                          },
                        }}
                      >
                        Video Demo
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Pricing Card */}
          <Zoom in timeout={600}>
            <Card sx={{ 
              mb: 3,
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(79, 70, 229, 0.3)',
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -50,
                right: -50,
                width: 150,
                height: 150,
                background: 'radial-gradient(circle, rgba(79, 70, 229, 0.3) 0%, transparent 70%)',
                borderRadius: '50%',
              },
            }}>
              <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                  <AttachMoney sx={{ color: colors.primary, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
                    Pricing
                  </Typography>
                </Stack>
                {application.isFree ? (
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h2" sx={{ 
                      fontWeight: 900, 
                      color: '#10b981',
                      textShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                      mb: 1,
                    }}>
                      FREE
                    </Typography>
                    <Chip 
                      label="No cost" 
                      sx={{
                        bgcolor: 'rgba(16, 185, 129, 0.2)',
                        color: '#10b981',
                        fontWeight: 600,
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                      }}
                    />
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h2" sx={{ 
                      fontWeight: 900, 
                      background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 4px 20px rgba(79, 70, 229, 0.4)',
                      mb: 1,
                    }}>
                      {formatCurrency(application.price, application.currency)}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
                      One-time payment
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Zoom>

          {/* License & Terms */}
          <Zoom in timeout={800}>
            <Card sx={{ 
              mb: 3,
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 3,
            }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                  <Security sx={{ color: colors.primary, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
                    License & Terms
                  </Typography>
                </Stack>
                <Stack spacing={2.5}>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <Description sx={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }} />
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        License Type
                      </Typography>
                    </Stack>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'white', pl: 3.5 }}>
                      {application.licenseType}
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <AttachMoney sx={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }} />
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Commercial Use
                      </Typography>
                    </Stack>
                    <Chip 
                      label={application.commercialUse}
                      size="small"
                      sx={{
                        ml: 3.5,
                        bgcolor: application.commercialUse === 'Yes' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: application.commercialUse === 'Yes' ? '#10b981' : '#ef4444',
                        fontWeight: 600,
                        border: `1px solid ${application.commercialUse === 'Yes' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                      }}
                    />
                  </Box>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <TrendingUp sx={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }} />
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Resale Rights
                      </Typography>
                    </Stack>
                    <Chip 
                      label={application.resaleRights}
                      size="small"
                      sx={{
                        ml: 3.5,
                        bgcolor: application.resaleRights === 'Yes' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: application.resaleRights === 'Yes' ? '#10b981' : '#ef4444',
                        fontWeight: 600,
                        border: `1px solid ${application.resaleRights === 'Yes' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                      }}
                    />
                  </Box>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <Support sx={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }} />
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Support Level
                      </Typography>
                    </Stack>
                    <Chip 
                      label={application.supportLevel}
                      size="small"
                      sx={{
                        ml: 3.5,
                        bgcolor: 'rgba(79, 70, 229, 0.2)',
                        color: colors.primary,
                        fontWeight: 600,
                        border: '1px solid rgba(79, 70, 229, 0.3)',
                      }}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Zoom>

          {/* Metadata */}
          <Zoom in timeout={1000}>
            <Card sx={{ 
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 3,
            }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                  <CalendarToday sx={{ color: colors.primary, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
                    Information
                  </Typography>
                </Stack>
                <Stack spacing={2.5}>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <CalendarToday sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} />
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Created
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'white', pl: 3 }}>
                      {formatDate(application.createdAt)}
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <Update sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} />
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Last Updated
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'white', pl: 3 }}>
                      {formatDate(application.updatedAt)}
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <Visibility sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} />
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Views
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'white', pl: 3 }}>
                      {application.views || 0} views
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <Download sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} />
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Downloads
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'white', pl: 3 }}>
                      {application.downloads || 0} downloads
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <ContentCopy sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} />
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Application ID
                      </Typography>
                    </Stack>
                    <Tooltip title="Click to copy">
                      <Typography 
                        variant="body2" 
                        onClick={handleCopyId}
                        sx={{ 
                          fontWeight: 600, 
                          color: colors.primary, 
                          pl: 3,
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          wordBreak: 'break-all',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {application._id}
                      </Typography>
                    </Tooltip>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>
      </Grid>

      {/* Image Preview Dialog */}
      <Dialog
        open={imageDialog}
        onClose={() => setImageDialog(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(15, 23, 42, 0.98)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 3,
          },
        }}
      >
        <IconButton
          sx={{ 
            position: 'absolute', 
            top: 16, 
            right: 16, 
            bgcolor: 'rgba(0,0,0,0.5)',
            color: 'white',
            zIndex: 1,
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.7)',
            },
          }}
          onClick={() => setImageDialog(false)}
        >
          <Close />
        </IconButton>
        <Box sx={{ p: 2 }}>
          <img
            src={selectedImage}
            alt="Preview"
            style={{ width: '100%', height: 'auto', borderRadius: 12 }}
          />
        </Box>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog}
        onClose={() => !deleting && setDeleteDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 3,
            minWidth: { xs: '90%', sm: 400 },
          },
        }}
      >
        <DialogTitle sx={{ color: 'white', display: 'flex', alignItems: 'center', gap: 1.5, pb: 2 }}>
          <Avatar sx={{ bgcolor: 'rgba(239, 68, 68, 0.2)', width: 48, height: 48 }}>
            <Delete sx={{ color: '#ef4444', fontSize: 24 }} />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Delete Application?
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              This action cannot be undone
            </Typography>
          </Box>
        </DialogTitle>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <Box sx={{ p: 3 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
            Are you sure you want to delete <strong style={{ color: '#fff' }}>"{application?.appName}"</strong>?
          </Typography>
          <Paper sx={{ 
            p: 2, 
            bgcolor: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 2,
          }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
              ⚠️ All associated data will be permanently removed including:
            </Typography>
            <Box component="ul" sx={{ mt: 1, pl: 2, color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
              <li>Application details and metadata</li>
              <li>Screenshots and app icon</li>
              <li>Source code files</li>
              <li>All related content from ImageKit</li>
            </Box>
          </Paper>
        </Box>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <Box sx={{ p: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            onClick={() => setDeleteDialog(false)}
            disabled={deleting}
            variant="outlined"
            sx={{
              color: 'rgba(255,255,255,0.8)',
              borderColor: 'rgba(255,255,255,0.2)',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              '&:hover': { 
                bgcolor: 'rgba(255,255,255,0.05)',
                borderColor: 'rgba(255,255,255,0.3)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={deleting}
            variant="contained"
            startIcon={deleting ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <Delete />}
            sx={{
              bgcolor: '#ef4444',
              color: 'white',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              '&:hover': { bgcolor: '#dc2626' },
              '&:disabled': { bgcolor: alpha('#ef4444', 0.5) },
            }}
          >
            {deleting ? 'Deleting...' : 'Delete Application'}
          </Button>
        </Box>
      </Dialog>
    </Box>
  )
}

export default ApplicationPreview
