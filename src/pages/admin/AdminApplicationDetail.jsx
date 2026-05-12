import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  CircularProgress,
  Divider,
  TextField,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Avatar,
  ImageList,
  ImageListItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Stack,
} from '@mui/material'
import {
  ArrowBack,
  CheckCircle,
  Cancel,
  Schedule,
  Star,
  Code,
  ExpandMore,
  Person,
  AttachMoney,
  Category,
  Description,
  Image,
  Link as LinkIcon,
  Android,
  Apple,
  Language,
  Build,
  Security,
  Speed,
  Verified,
  Download,
  FolderZip,
  Warning,
} from '@mui/icons-material'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const STATUS_CONFIG = {
  pending: { color: 'warning', label: 'Pending', icon: Schedule },
  verified: { color: 'success', label: 'Verified', icon: CheckCircle },
  rejected: { color: 'error', label: 'Rejected', icon: Cancel },
}

const AdminApplicationDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [reviewDialog, setReviewDialog] = useState({ open: false, action: null })
  const [reviewData, setReviewData] = useState({
    rating: 0,
    reason: '',
    notes: '',
    completionScore: 0,
    badges: [],
  })
  const [sellerApplications, setSellerApplications] = useState([])

  // Available badges
  const AVAILABLE_BADGES = [
    'Featured',
    'Trending',
    'Best Seller',
    'New Release',
    'Editor\'s Choice',
    'Premium Quality',
    'Well Documented',
    'Active Support',
    'Regular Updates',
    'Verified Code',
  ]

  useEffect(() => {
    fetchApplicationDetail()
  }, [id])

  useEffect(() => {
    if (application?.sellerId?._id) {
      fetchSellerApplications()
    }
  }, [application])

  const getToken = () => localStorage.getItem('adminToken')

  const fetchApplicationDetail = async () => {
    try {
      const token = getToken()
      const response = await api.get(`/admin/applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.data.success) {
        const app = response.data.application
        
        // Debug logging for sourceCodeFile
        console.log('Application Data:', {
          appName: app.appName,
          hasSourceCodeFile: !!app.sourceCodeFile,
          sourceCodeFileUrl: app.sourceCodeFile?.url,
          sourceCodeFileStructure: app.sourceCodeFile
        })
        
        setApplication(app)
        setReviewData({
          rating: app.adminRating || 0,
          reason: app.verificationNotes || '',
          notes: app.adminNotes || '',
          completionScore: app.completionScore || 0,
          badges: app.badges || [],
        })
      }
    } catch (error) {
      console.error('Failed to fetch application:', error)
      toast.error('Failed to load application details')
    } finally {
      setLoading(false)
    }
  }

  const fetchSellerApplications = async () => {
    try {
      const token = getToken()
      const response = await api.get(`/admin/applications?sellerId=${application.sellerId._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.data.success) {
        // Filter out current application
        const otherApps = response.data.applications.filter(app => app._id !== id)
        setSellerApplications(otherApps)
      }
    } catch (error) {
      console.error('Failed to fetch seller applications:', error)
    }
  }

  const handleReviewSubmit = async () => {
    const { action } = reviewDialog

    if (action === 'rejected' && !reviewData.reason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }

    if (action === 'verified' && reviewData.rating === 0) {
      toast.error('Please provide a rating')
      return
    }

    setActionLoading(true)

    try {
      const token = getToken()
      const payload = {
        status: action,
        adminRating: reviewData.rating,
        adminNotes: reviewData.notes,
        completionScore: reviewData.completionScore,
        badges: reviewData.badges,
      }

      if (action === 'rejected') {
        payload.reason = reviewData.reason
      }

      const response = await api.patch(
        `/admin/applications/${id}/review`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        toast.success(`Application ${action} successfully`)
        setReviewDialog({ open: false, action: null })
        fetchApplicationDetail()
      }
    } catch (error) {
      console.error('Review failed:', error)
      toast.error('Failed to submit review')
    } finally {
      setActionLoading(false)
    }
  }

  const openReviewDialog = (action) => {
    setReviewDialog({ open: true, action })
  }

  const closeReviewDialog = () => {
    setReviewDialog({ open: false, action: null })
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
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Application not found
        </Typography>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/admin/applications')}
          sx={{ mt: 2 }}
        >
          Back to Applications
        </Button>
      </Box>
    )
  }

  const statusConfig = STATUS_CONFIG[application.verificationStatus] || STATUS_CONFIG.pending
  const StatusIcon = statusConfig.icon
  const isPending = application.verificationStatus === 'pending'

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/admin/applications')}
          sx={{ mb: 2 }}
        >
          Back to Applications
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              {application.appName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                icon={<StatusIcon />}
                label={statusConfig.label}
                color={statusConfig.color}
              />
              {application.adminRating > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Star sx={{ fontSize: 20, color: 'secondary.main' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {application.adminRating}/5
                  </Typography>
                </Box>
              )}
              {application.completionScore > 0 && (
                <Chip
                  label={`${application.completionScore}% Complete`}
                  size="small"
                  color="info"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>

          {/* Action Buttons */}
          {isPending && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={() => openReviewDialog('verified')}
              >
                Verify
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Cancel />}
                onClick={() => openReviewDialog('rejected')}
              >
                Reject
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Main Info */}
        <Grid item xs={12} md={8}>
          {/* Basic Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Basic Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Code sx={{ color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Application Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {application.appName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Category sx={{ color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Category
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {application.appCategory}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <AttachMoney sx={{ color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Price
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {application.isFree ? 'FREE' : `$${application.price || 0}`}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Schedule sx={{ color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Submitted
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {new Date(application.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Seller Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                Seller Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Seller Name
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {application.sellerId?.name || 'Unknown'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body2">
                    {application.sellerId?.email || 'N/A'}
                  </Typography>
                </Grid>
                {application.sellerId?.shop?.shopName && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Shop Name
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {application.sellerId.shop.shopName}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Seller Status
                  </Typography>
                  <Chip 
                    label={application.sellerId?.status || 'Unknown'} 
                    size="small" 
                    color={application.sellerId?.status === 'active' ? 'success' : 'default'}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Short Description */}
          {application.shortDescription && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Short Description
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {application.shortDescription}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Detailed Description */}
          {application.detailedDescription && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  <Description sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Detailed Description
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                  {application.detailedDescription}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Application ZIP File - CRITICAL FOR REVIEW */}
          {application.sourceCodeFile && application.sourceCodeFile.url && (
            <Card sx={{ mb: 3, borderColor: 'primary.main', borderWidth: 2, borderStyle: 'solid' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <FolderZip sx={{ fontSize: 32, color: 'primary.main' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Application Source Code / ZIP File
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Download and test the application before approval
                      {application.sourceCodeFile.originalFileCount && 
                        ` (${application.sourceCodeFile.originalFileCount} files from folder upload)`
                      }
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      File Name
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-all' }}>
                      {application.sourceCodeFile.fileName || 'application.zip'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      File Size
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {application.sourceCodeFile.fileSize 
                        ? `${(application.sourceCodeFile.fileSize / (1024 * 1024)).toFixed(2)} MB`
                        : 'Unknown'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Upload Type
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {application.sourceCodeFile.originalFileCount 
                        ? `Folder Upload (${application.sourceCodeFile.originalFileCount} files)`
                        : 'Direct ZIP Upload'
                      }
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Upload Status
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {application.sourceCodeFile.uploaded || application.sourceCodeFile.url ? (
                        <>
                          <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                            Uploaded
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Warning sx={{ fontSize: 16, color: 'warning.main' }} />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'warning.main' }}>
                            Pending
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, p: 2, bgcolor: 'info.lighter', borderRadius: 1 }}>
                  <Typography variant="caption" color="info.dark" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Security sx={{ fontSize: 16 }} />
                    <strong>Review Checklist:</strong>
                  </Typography>
                  <Typography variant="caption" color="info.dark" component="div">
                    • Verify the ZIP contains actual source code/application files<br />
                    • Check for malicious code or suspicious files<br />
                    • Test the application functionality matches description<br />
                    • Ensure all dependencies are documented<br />
                    • Verify the code quality and completeness
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<Download />}
                  href={application.sourceCodeFile.url}
                  download
                  target="_blank"
                  sx={{ mt: 2 }}
                >
                  Download Application ZIP
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Warning if no ZIP file */}
          {(!application.sourceCodeFile || !application.sourceCodeFile.url) && (
            <Card sx={{ mb: 3, borderColor: 'error.main', borderWidth: 2, borderStyle: 'solid', bgcolor: 'error.lighter' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Warning sx={{ fontSize: 32, color: 'error.main' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'error.main' }}>
                      No Application File Uploaded
                    </Typography>
                    <Typography variant="body2" color="error.dark">
                      This application does not have a source code/ZIP file. Consider rejecting until the seller uploads the application file.
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Screenshots */}
          {application.screenshots && application.screenshots.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  <Image sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Screenshots ({application.screenshots.length})
                </Typography>
                <ImageList cols={3} gap={8}>
                  {application.screenshots.map((screenshot, index) => (
                    <ImageListItem key={index}>
                      <img
                        src={screenshot.url || screenshot.uri}
                        alt={`Screenshot ${index + 1}`}
                        loading="lazy"
                        style={{ borderRadius: 8, objectFit: 'cover', height: 200 }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </CardContent>
            </Card>
          )}

          {/* Technical Details */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                <Build sx={{ mr: 1, verticalAlign: 'middle' }} />
                Technical Details
              </Typography>

              {/* Platforms */}
              {application.platforms && application.platforms.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Platforms
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {application.platforms.map((platform) => (
                      <Chip
                        key={platform}
                        label={platform}
                        size="small"
                        icon={
                          platform.toLowerCase().includes('android') ? <Android /> :
                          platform.toLowerCase().includes('ios') ? <Apple /> :
                          <Language />
                        }
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Technology Stack */}
              {application.technologyStack && application.technologyStack.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Technology Stack
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {application.technologyStack.map((tech) => (
                      <Chip key={tech} label={tech} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Features */}
              {application.features && application.features.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Features
                  </Typography>
                  <List dense>
                    {application.features.map((feature, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={`• ${feature}`} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Links & Resources */}
          {(application.demoUrl || application.githubUrl || application.documentationUrl) && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  <LinkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Links & Resources
                </Typography>
                <Stack spacing={1}>
                  {application.demoUrl && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Demo URL
                      </Typography>
                      <Typography variant="body2">
                        <a href={application.demoUrl} target="_blank" rel="noopener noreferrer">
                          {application.demoUrl}
                        </a>
                      </Typography>
                    </Box>
                  )}
                  {application.githubUrl && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        GitHub URL
                      </Typography>
                      <Typography variant="body2">
                        <a href={application.githubUrl} target="_blank" rel="noopener noreferrer">
                          {application.githubUrl}
                        </a>
                      </Typography>
                    </Box>
                  )}
                  {application.documentationUrl && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Documentation
                      </Typography>
                      <Typography variant="body2">
                        <a href={application.documentationUrl} target="_blank" rel="noopener noreferrer">
                          {application.documentationUrl}
                        </a>
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Right Column - Review & Stats */}
        <Grid item xs={12} md={4}>
          {/* Source Code Status - IMPORTANT */}
          <Card sx={{ mb: 3, borderColor: (application.sourceCodeFile && application.sourceCodeFile.url) ? 'success.main' : 'error.main', borderWidth: 1, borderStyle: 'solid' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                <FolderZip sx={{ mr: 1, verticalAlign: 'middle' }} />
                Source Code Status
              </Typography>
              {(application.sourceCodeFile && application.sourceCodeFile.url) ? (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CheckCircle sx={{ color: 'success.main' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                      {application.sourceCodeFile.originalFileCount 
                        ? 'Folder Uploaded (as ZIP)'
                        : 'ZIP File Uploaded'
                      }
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    {application.sourceCodeFile.fileName}
                  </Typography>
                  {application.sourceCodeFile.originalFileCount && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                      Contains {application.sourceCodeFile.originalFileCount} files
                    </Typography>
                  )}
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={<Download />}
                    href={application.sourceCodeFile.url}
                    download
                    target="_blank"
                  >
                    Download ZIP
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Warning sx={{ color: 'error.main' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.main' }}>
                      No File Uploaded
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Seller has not uploaded the application file yet.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Quality Scores */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Quality Scores
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      Completion
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {application.completionScore || 0}%
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      height: 8,
                      bgcolor: 'grey.200',
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        width: `${application.completionScore || 0}%`,
                        bgcolor: 'primary.main',
                      }}
                    />
                  </Box>
                </Box>

                {application.adminRating > 0 && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Admin Rating
                    </Typography>
                    <Rating value={application.adminRating} readOnly precision={0.5} />
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>

          {/* Badges */}
          {application.badges && application.badges.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  <Verified sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Badges
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {application.badges.map((badge) => (
                    <Chip key={badge} label={badge} size="small" color="primary" />
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Admin Notes */}
          {application.adminNotes && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Admin Notes
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                  {application.adminNotes}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Rejection Reason */}
          {application.verificationStatus === 'rejected' && application.verificationNotes && (
            <Card sx={{ mb: 3, borderColor: 'error.main', borderWidth: 1, borderStyle: 'solid' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'error.main' }}>
                  Rejection Reason
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                  {application.verificationNotes}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Update Review (if already reviewed) */}
          {!isPending && (
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Update Review
                </Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => openReviewDialog(application.verificationStatus)}
                >
                  Edit Review
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Other Applications by This Seller */}
      {sellerApplications.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
            Other Applications by {application.sellerId?.name || 'This Seller'}
          </Typography>
          <Grid container spacing={2}>
            {sellerApplications.map((app) => (
              <Grid item xs={12} sm={6} md={4} key={app._id}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 4 },
                    transition: 'box-shadow 0.3s'
                  }}
                  onClick={() => navigate(`/admin/applications/${app._id}`)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Avatar
                        src={app.screenshots?.[0]?.url || app.appIcon?.url}
                        variant="rounded"
                        sx={{ width: 48, height: 48 }}
                      >
                        <Code />
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap>
                          {app.appName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {app.appCategory}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                      <Chip
                        label={STATUS_CONFIG[app.verificationStatus]?.label || 'Pending'}
                        size="small"
                        color={STATUS_CONFIG[app.verificationStatus]?.color || 'default'}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ${app.price || 0}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Review Dialog */}
      <Dialog
        open={reviewDialog.open}
        onClose={closeReviewDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {reviewDialog.action === 'verified' ? 'Verify Application' : 'Reject Application'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* Rating */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Rating {reviewDialog.action === 'verified' && <span style={{ color: 'red' }}>*</span>}
              </Typography>
              <Rating
                value={reviewData.rating}
                onChange={(e, newValue) => setReviewData({ ...reviewData, rating: newValue })}
                size="large"
                precision={0.5}
              />
            </Box>

            {/* Completion Score */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Completion Score (0-100%)
              </Typography>
              <TextField
                type="number"
                fullWidth
                value={reviewData.completionScore}
                onChange={(e) => {
                  const value = Math.min(100, Math.max(0, Number(e.target.value)))
                  setReviewData({ ...reviewData, completionScore: value })
                }}
                inputProps={{ min: 0, max: 100, step: 5 }}
                helperText="How complete is this application? (0-100%)"
              />
            </Box>

            {/* Badges Selection */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Assign Badges
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {AVAILABLE_BADGES.map((badge) => (
                  <Chip
                    key={badge}
                    label={badge}
                    size="small"
                    color={reviewData.badges.includes(badge) ? 'primary' : 'default'}
                    onClick={() => {
                      const newBadges = reviewData.badges.includes(badge)
                        ? reviewData.badges.filter(b => b !== badge)
                        : [...reviewData.badges, badge]
                      setReviewData({ ...reviewData, badges: newBadges })
                    }}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Click badges to select/deselect. Selected: {reviewData.badges.length}
              </Typography>
            </Box>

            {/* Rejection Reason (only for reject) */}
            {reviewDialog.action === 'rejected' && (
              <TextField
                label="Rejection Reason"
                multiline
                rows={4}
                fullWidth
                required
                value={reviewData.reason}
                onChange={(e) => setReviewData({ ...reviewData, reason: e.target.value })}
                placeholder="Explain why this application is being rejected..."
              />
            )}

            {/* Admin Notes */}
            <TextField
              label="Admin Notes (Optional)"
              multiline
              rows={3}
              fullWidth
              value={reviewData.notes}
              onChange={(e) => setReviewData({ ...reviewData, notes: e.target.value })}
              placeholder="Internal notes about this application..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeReviewDialog} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleReviewSubmit}
            variant="contained"
            color={reviewDialog.action === 'verified' ? 'success' : 'error'}
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={24} /> : 'Submit Review'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminApplicationDetail
