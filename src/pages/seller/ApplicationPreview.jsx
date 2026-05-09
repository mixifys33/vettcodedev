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
} from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import { formatCurrency, formatDate } from '../../utils/helpers'

const ApplicationPreview = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imageDialog, setImageDialog] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

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
    if (!window.confirm('Are you sure you want to delete this application?')) return

    try {
      const response = await api.delete(`/applications/${id}`)

      if (response.data.success) {
        toast.success('Application deleted successfully')
        navigate('/seller/applications')
      }
    } catch (error) {
      toast.error('Failed to delete application')
      console.error(error)
    }
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!application) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h6" color="text.secondary">
          Application not found
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/seller/applications')}
          sx={{ mt: 2 }}
        >
          Back to Applications
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/seller/applications')}
        >
          Back to Applications
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={() => navigate(`/seller/applications/${id}/delivery`)}
          >
            Delivery Settings
          </Button>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => navigate(`/seller/applications/edit/${id}`)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              {/* Title and Status */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {application.appName}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {application.shortDescription}
                  </Typography>
                </Box>
                <Chip
                  icon={getStatusIcon(application.verificationStatus)}
                  label={application.verificationStatus || 'pending'}
                  sx={{
                    bgcolor: `${getStatusColor(application.verificationStatus)}15`,
                    color: getStatusColor(application.verificationStatus),
                    fontWeight: 600,
                    textTransform: 'capitalize',
                  }}
                />
              </Box>

              {/* Category and Tags */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                <Chip label={application.appCategory} color="primary" />
                {application.tags?.split(',').map((tag, index) => (
                  <Chip key={index} label={tag.trim()} variant="outlined" size="small" />
                ))}
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Detailed Description */}
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Description
              </Typography>
              <Box
                sx={{ mb: 3 }}
                dangerouslySetInnerHTML={{ __html: application.detailedDescription }}
              />

              <Divider sx={{ my: 3 }} />

              {/* Screenshots */}
              {application.screenshots && application.screenshots.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Screenshots
                  </Typography>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {application.screenshots.map((screenshot, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Box
                          component="img"
                          src={screenshot.url || screenshot}
                          alt={`Screenshot ${index + 1}`}
                          sx={{
                            width: '100%',
                            height: 200,
                            objectFit: 'cover',
                            borderRadius: 2,
                            cursor: 'pointer',
                            '&:hover': { opacity: 0.8 },
                          }}
                          onClick={() => {
                            setSelectedImage(screenshot.url || screenshot)
                            setImageDialog(true)
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                  <Divider sx={{ my: 3 }} />
                </>
              )}

              {/* Technology Stack */}
              {application.technologyStack && application.technologyStack.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Technology Stack
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                    {application.technologyStack.map((tech, index) => (
                      <Chip key={index} label={tech} color="secondary" variant="outlined" />
                    ))}
                  </Box>
                  <Divider sx={{ my: 3 }} />
                </>
              )}

              {/* Platforms */}
              {application.supportedPlatforms && application.supportedPlatforms.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Supported Platforms
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                    {application.supportedPlatforms.map((platform, index) => (
                      <Chip key={index} label={platform} variant="outlined" />
                    ))}
                  </Box>
                  <Divider sx={{ my: 3 }} />
                </>
              )}

              {/* Dependencies */}
              {application.dependencies && application.dependencies.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Dependencies
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                    {application.dependencies.map((dep, index) => (
                      <Chip key={index} label={dep} size="small" />
                    ))}
                  </Box>
                </>
              )}
            </CardContent>
          </Card>

          {/* Links */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Links & Resources
              </Typography>
              <Grid container spacing={2}>
                {application.githubRepo && (
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<GitHub />}
                      href={application.githubRepo}
                      target="_blank"
                      rel="noopener noreferrer"
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
                      href={application.liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
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
                      href={application.documentationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
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
                      startIcon={<VideoLibrary />}
                      href={application.videoDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Video Demo
                    </Button>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Pricing */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Pricing
              </Typography>
              {application.isFree ? (
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.main' }}>
                  FREE
                </Typography>
              ) : (
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {formatCurrency(application.price, application.currency)}
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* License & Terms */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                License & Terms
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    License Type
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {application.licenseType}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Commercial Use
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {application.commercialUse}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Resale Rights
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {application.resaleRights}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Support Level
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {application.supportLevel}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Created
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatDate(application.createdAt)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatDate(application.updatedAt)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Application ID
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                    {application._id}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Image Dialog */}
      <Dialog
        open={imageDialog}
        onClose={() => setImageDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <IconButton
          sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'background.paper' }}
          onClick={() => setImageDialog(false)}
        >
          <Close />
        </IconButton>
        <Box sx={{ p: 2 }}>
          <img
            src={selectedImage}
            alt="Preview"
            style={{ width: '100%', height: 'auto', borderRadius: 8 }}
          />
        </Box>
      </Dialog>
    </Box>
  )
}

export default ApplicationPreview
