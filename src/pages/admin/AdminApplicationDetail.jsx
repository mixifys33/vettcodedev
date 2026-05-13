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
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Breadcrumbs,
  LinearProgress,
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
  ContentCopy,
  OpenInNew,
  MoreVert,
  NavigateNext,
  CalendarToday,
  Store,
  Email,
  CheckBox,
  CheckBoxOutlineBlank,
  ZoomIn,
} from '@mui/icons-material'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const STATUS_CONFIG = {
  pending: { 
    color: 'warning', 
    label: 'Pending Review', 
    icon: Schedule,
    bgColor: '#FEF3C7',
    textColor: '#92400E',
    borderColor: '#FDE68A'
  },
  verified: { 
    color: 'success', 
    label: 'Verified', 
    icon: CheckCircle,
    bgColor: '#D1FAE5',
    textColor: '#065F46',
    borderColor: '#A7F3D0'
  },
  rejected: { 
    color: 'error', 
    label: 'Rejected', 
    icon: Cancel,
    bgColor: '#FEE2E2',
    textColor: '#991B1B',
    borderColor: '#FECACA'
  },
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
  const [downloadMenuAnchor, setDownloadMenuAnchor] = useState(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImage, setLightboxImage] = useState(null)
  const [expandedShortDesc, setExpandedShortDesc] = useState(false)
  const [expandedDetailedDesc, setExpandedDetailedDesc] = useState(false)
  
  // Review checklist state
  const [reviewChecklist, setReviewChecklist] = useState({
    codeVerified: false,
    maliciousCheck: false,
    functionalityTested: false,
    dependenciesChecked: false,
    qualityVerified: false,
  })

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
        console.log('=== APPLICATION DEBUG INFO ===')
        console.log('Application Name:', app.appName)
        console.log('Has sourceCodeFile object:', !!app.sourceCodeFile)
        console.log('sourceCodeFile structure:', JSON.stringify(app.sourceCodeFile, null, 2))
        console.log('sourceCodeFile.url exists:', !!app.sourceCodeFile?.url)
        console.log('sourceCodeFile.url value:', app.sourceCodeFile?.url)
        console.log('sourceCodeFile.uploaded:', app.sourceCodeFile?.uploaded)
        console.log('sourceCodeFile.fileId:', app.sourceCodeFile?.fileId)
        console.log('sourceCodeFile.fileName:', app.sourceCodeFile?.fileName)
        console.log('sourceCodeFile.originalFileCount:', app.sourceCodeFile?.originalFileCount)
        console.log('==============================')
        
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

    // Check if all checklist items are completed for verification
    if (action === 'verified') {
      const allChecked = Object.values(reviewChecklist).every(val => val === true)
      if (!allChecked) {
        toast.error('Please complete all review checklist items before verifying')
        return
      }
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

  const handleChecklistChange = (key) => {
    setReviewChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const isChecklistComplete = () => {
    return Object.values(reviewChecklist).every(val => val === true)
  }

  // Helper function to strip HTML tags and decode entities
  const stripHtmlTags = (html) => {
    if (!html) return ''
    
    // Create a temporary div to decode HTML entities
    const temp = document.createElement('div')
    temp.innerHTML = html
    
    // Get text content (strips all HTML tags)
    let text = temp.textContent || temp.innerText || ''
    
    // Clean up extra whitespace
    text = text.replace(/\s+/g, ' ').trim()
    
    return text
  }

  // Helper function to check if source code file is properly uploaded
  const hasValidSourceCode = () => {
    if (!application?.sourceCodeFile) {
      console.log('No sourceCodeFile object')
      return false
    }
    
    const file = application.sourceCodeFile
    
    // Check if url exists and is not empty
    if (!file.url || file.url.trim() === '') {
      console.log('sourceCodeFile.url is missing or empty:', file.url)
      return false
    }
    
    // Additional validation - check if fileId exists (indicates successful upload)
    if (!file.fileId || file.fileId.trim() === '') {
      console.log('sourceCodeFile.fileId is missing or empty:', file.fileId)
      return false
    }
    
    console.log('Source code file is valid:', {
      url: file.url,
      fileId: file.fileId,
      fileName: file.fileName,
      isFolder: !!file.originalFileCount
    })
    
    return true
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
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', pb: 4 }}>
      {/* Sticky Command Header */}
      <Box 
        sx={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 1000, 
          bgcolor: 'white',
          borderBottom: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box sx={{ maxWidth: 1400, mx: 'auto', px: 3, py: 2 }}>
          {/* Breadcrumbs */}
          <Breadcrumbs 
            separator={<NavigateNext fontSize="small" sx={{ color: '#94A3B8' }} />}
            sx={{ mb: 2, fontSize: '0.875rem', color: '#64748B' }}
          >
            <Box 
              component="span" 
              sx={{ cursor: 'pointer', '&:hover': { color: '#0F172A' } }}
              onClick={() => navigate('/admin/applications')}
            >
              Applications
            </Box>
            <Box component="span" sx={{ cursor: 'pointer', '&:hover': { color: '#0F172A' } }}>
              Review
            </Box>
            <Box component="span" sx={{ color: '#0F172A', fontWeight: 600 }}>
              {application.appName}
            </Box>
          </Breadcrumbs>

          {/* Title Area & Actions */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#0F172A',
                  mb: 0.5,
                  fontSize: '1.75rem',
                  letterSpacing: '-0.025em'
                }}
              >
                {application.appName}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="body2" sx={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarToday sx={{ fontSize: 16 }} />
                  Submitted {new Date(application.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </Typography>
                <Chip
                  icon={<StatusIcon sx={{ fontSize: 16 }} />}
                  label={statusConfig.label}
                  size="small"
                  sx={{
                    bgcolor: statusConfig.bgColor,
                    color: statusConfig.textColor,
                    border: `1px solid ${statusConfig.borderColor}`,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    height: 24,
                    borderRadius: '6px',
                    '& .MuiChip-icon': { color: statusConfig.textColor }
                  }}
                />
                {application.adminRating > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Star sx={{ fontSize: 16, color: '#F59E0B' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A' }}>
                      {application.adminRating.toFixed(1)}
                    </Typography>
                  </Box>
                )}
                {application.completionScore > 0 && (
                  <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500 }}>
                    {application.completionScore}% Complete
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1.5, ml: 2 }}>
              {isPending && (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={() => openReviewDialog('rejected')}
                    sx={{
                      borderColor: '#FCA5A5',
                      color: '#DC2626',
                      borderRadius: '6px',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      '&:hover': {
                        borderColor: '#DC2626',
                        bgcolor: '#FEF2F2'
                      }
                    }}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<CheckCircle />}
                    onClick={() => openReviewDialog('verified')}
                    disabled={!isChecklistComplete()}
                    sx={{
                      bgcolor: '#10B981',
                      color: 'white',
                      borderRadius: '6px',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      boxShadow: 'none',
                      '&:hover': {
                        bgcolor: '#059669',
                        boxShadow: 'none'
                      },
                      '&:disabled': {
                        bgcolor: '#D1D5DB',
                        color: '#9CA3AF'
                      }
                    }}
                  >
                    Verify Application
                  </Button>
                </>
              )}
              {!isPending && (
                <Button
                  variant="outlined"
                  onClick={() => openReviewDialog(application.verificationStatus)}
                  sx={{
                    borderColor: '#CBD5E1',
                    color: '#475569',
                    borderRadius: '6px',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    '&:hover': {
                      borderColor: '#94A3B8',
                      bgcolor: '#F8FAFC'
                    }
                  }}
                >
                  Update Review
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: 3, mt: 3 }}>
        <Grid container spacing={3}>
          {/* Left Column - Main Info */}
          <Grid item xs={12} md={8}>
            
            {/* THE INSPECTION ROOM - Source Code Card */}
            {hasValidSourceCode() && (
              <Card 
                sx={{ 
                  mb: 2, 
                  borderRadius: '6px',
                  border: '1px solid #E2E8F0',
                  boxShadow: 'none',
                  overflow: 'hidden'
                }}
              >
                {/* Dark Header - Action Zone */}
                <Box sx={{ bgcolor: '#18181B', color: 'white', p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <FolderZip sx={{ fontSize: 28 }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.125rem', mb: 0.25 }}>
                          Source Code Package
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#A1A1AA', fontSize: '0.8125rem' }}>
                          Critical Review Required
                          {application.sourceCodeFile.originalFileCount && 
                            ` • ${application.sourceCodeFile.originalFileCount} files`
                          }
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      icon={<CheckCircle sx={{ fontSize: 14 }} />}
                      label="Uploaded"
                      size="small"
                      sx={{
                        bgcolor: '#065F46',
                        color: '#D1FAE5',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 22,
                        '& .MuiChip-icon': { color: '#D1FAE5' }
                      }}
                    />
                  </Box>
                </Box>

                <CardContent sx={{ p: 2.5 }}>
                  {/* File Details Grid */}
                  <Grid container spacing={2} sx={{ mb: 2.5 }}>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        File Name
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A', mt: 0.5, fontSize: '0.875rem', fontFamily: 'monospace' }}>
                        {application.sourceCodeFile.fileName || 'application.zip'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        File Size
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A', mt: 0.5, fontSize: '0.875rem', fontFamily: 'monospace' }}>
                        {application.sourceCodeFile.fileSize 
                          ? `${(application.sourceCodeFile.fileSize / (1024 * 1024)).toFixed(2)} MB`
                          : 'Unknown'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Upload Type
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A', mt: 0.5, fontSize: '0.875rem' }}>
                        {application.sourceCodeFile.originalFileCount 
                          ? `Folder (${application.sourceCodeFile.originalFileCount})`
                          : 'Direct ZIP'
                        }
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        File ID
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A', mt: 0.5, fontSize: '0.75rem', fontFamily: 'monospace' }}>
                        {application.sourceCodeFile.fileId?.substring(0, 12) || 'N/A'}...
                      </Typography>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2.5 }} />

                  {/* Interactive Checklist */}
                  <Box sx={{ mb: 2.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A', mb: 1.5, fontSize: '0.875rem' }}>
                      Review Checklist (Required for Verification)
                    </Typography>
                    <Stack spacing={0.75}>
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={reviewChecklist.codeVerified}
                            onChange={() => handleChecklistChange('codeVerified')}
                            size="small"
                            sx={{ py: 0.5 }}
                          />
                        }
                        label={
                          <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#475569' }}>
                            ZIP contains actual source code/application files
                          </Typography>
                        }
                        sx={{ ml: 0, mr: 0 }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={reviewChecklist.maliciousCheck}
                            onChange={() => handleChecklistChange('maliciousCheck')}
                            size="small"
                            sx={{ py: 0.5 }}
                          />
                        }
                        label={
                          <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#475569' }}>
                            Checked for malicious code or suspicious files
                          </Typography>
                        }
                        sx={{ ml: 0, mr: 0 }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={reviewChecklist.functionalityTested}
                            onChange={() => handleChecklistChange('functionalityTested')}
                            size="small"
                            sx={{ py: 0.5 }}
                          />
                        }
                        label={
                          <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#475569' }}>
                            Application functionality matches description
                          </Typography>
                        }
                        sx={{ ml: 0, mr: 0 }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={reviewChecklist.dependenciesChecked}
                            onChange={() => handleChecklistChange('dependenciesChecked')}
                            size="small"
                            sx={{ py: 0.5 }}
                          />
                        }
                        label={
                          <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#475569' }}>
                            All dependencies are documented
                          </Typography>
                        }
                        sx={{ ml: 0, mr: 0 }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={reviewChecklist.qualityVerified}
                            onChange={() => handleChecklistChange('qualityVerified')}
                            size="small"
                            sx={{ py: 0.5 }}
                          />
                        }
                        label={
                          <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#475569' }}>
                            Code quality and completeness verified
                          </Typography>
                        }
                        sx={{ ml: 0, mr: 0 }}
                      />
                    </Stack>
                  </Box>

                  {/* Split Download Button */}
                  <Box sx={{ display: 'flex', gap: 0 }}>
                    <Button
                      variant="contained"
                      startIcon={<Download />}
                      href={application.sourceCodeFile.url}
                      download
                      target="_blank"
                      sx={{
                        flex: 1,
                        bgcolor: '#3B82F6',
                        color: 'white',
                        borderRadius: '6px 0 0 6px',
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 1.25,
                        boxShadow: 'none',
                        '&:hover': {
                          bgcolor: '#2563EB',
                          boxShadow: 'none'
                        }
                      }}
                    >
                      Download ZIP Package
                    </Button>
                    <Button
                      variant="contained"
                      onClick={(e) => setDownloadMenuAnchor(e.currentTarget)}
                      sx={{
                        minWidth: 'auto',
                        px: 1.5,
                        bgcolor: '#3B82F6',
                        color: 'white',
                        borderRadius: '0 6px 6px 0',
                        borderLeft: '1px solid rgba(255,255,255,0.2)',
                        boxShadow: 'none',
                        '&:hover': {
                          bgcolor: '#2563EB',
                          boxShadow: 'none'
                        }
                      }}
                    >
                      <ExpandMore />
                    </Button>
                  </Box>
                  
                  <Menu
                    anchorEl={downloadMenuAnchor}
                    open={Boolean(downloadMenuAnchor)}
                    onClose={() => setDownloadMenuAnchor(null)}
                  >
                    <MenuItem onClick={() => {
                      copyToClipboard(application.sourceCodeFile.url)
                      setDownloadMenuAnchor(null)
                    }}>
                      <ContentCopy sx={{ fontSize: 18, mr: 1 }} />
                      Copy Download Link
                    </MenuItem>
                    <MenuItem onClick={() => {
                      window.open(application.sourceCodeFile.url, '_blank')
                      setDownloadMenuAnchor(null)
                    }}>
                      <OpenInNew sx={{ fontSize: 18, mr: 1 }} />
                      Open in New Tab
                    </MenuItem>
                  </Menu>
                </CardContent>
              </Card>
            )}
            {/* Warning if no ZIP file */}
            {!hasValidSourceCode() && (
              <Card 
                sx={{ 
                  mb: 2, 
                  borderRadius: '6px',
                  border: '2px solid #FCA5A5',
                  bgcolor: '#FEF2F2',
                  boxShadow: 'none'
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Warning sx={{ fontSize: 28, color: '#DC2626', mt: 0.5 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#991B1B', mb: 0.5, fontSize: '1rem' }}>
                        No Application File Uploaded
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#7F1D1D', fontSize: '0.875rem', mb: 2 }}>
                        This application does not have a valid source code/ZIP file. Consider rejecting until the seller uploads the application file.
                      </Typography>
                      
                      {/* Debug Information */}
                      {application?.sourceCodeFile && (
                        <Box sx={{ mt: 2, p: 2, bgcolor: '#FEE2E2', borderRadius: '4px', border: '1px solid #FCA5A5' }}>
                          <Typography variant="caption" sx={{ color: '#991B1B', fontWeight: 700, display: 'block', mb: 1, fontSize: '0.75rem' }}>
                            🔍 Debug Information (Admin Only)
                          </Typography>
                          <Box component="pre" sx={{ 
                            fontSize: '0.7rem', 
                            color: '#7F1D1D', 
                            fontFamily: 'monospace',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-all',
                            m: 0
                          }}>
                            {JSON.stringify(application.sourceCodeFile, null, 2)}
                          </Box>
                          <Typography variant="caption" sx={{ color: '#991B1B', display: 'block', mt: 1, fontSize: '0.7rem' }}>
                            Check browser console for detailed logs
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Property Grid - Basic Information & Seller */}
            <Card 
              sx={{ 
                mb: 2, 
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                boxShadow: 'none'
              }}
            >
              <CardContent sx={{ p: 0 }}>
                {/* Basic Information Section */}
                <Box sx={{ p: 2.5, borderBottom: '1px solid #F1F5F9' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 2, fontSize: '1rem' }}>
                    Application Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Category
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A', mt: 0.5, fontSize: '0.875rem' }}>
                        {application.appCategory}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Price
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A', mt: 0.5, fontSize: '0.875rem', fontFamily: 'monospace' }}>
                        {application.isFree ? 'FREE' : `$${application.price || 0}`}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Submitted
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A', mt: 0.5, fontSize: '0.875rem' }}>
                        {new Date(application.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        App ID
                      </Typography>
                      <Tooltip title={application._id}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A', mt: 0.5, fontSize: '0.75rem', fontFamily: 'monospace', cursor: 'pointer' }}>
                          {application._id.substring(0, 8)}...
                        </Typography>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Box>

                {/* Seller Information Section */}
                <Box sx={{ p: 2.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 2, fontSize: '1rem' }}>
                    Seller Profile
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Seller Name
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A', mt: 0.5, fontSize: '0.875rem' }}>
                        {application.sellerId?.name || 'Unknown'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Email
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A', mt: 0.5, fontSize: '0.875rem', wordBreak: 'break-all' }}>
                        {application.sellerId?.email || 'N/A'}
                      </Typography>
                    </Grid>
                    {application.sellerId?.shop?.shopName && (
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Shop Name
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A', mt: 0.5, fontSize: '0.875rem' }}>
                          {application.sellerId.shop.shopName}
                        </Typography>
                      </Grid>
                    )}
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Status
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <Chip 
                          label={application.sellerId?.status || 'Unknown'} 
                          size="small" 
                          sx={{
                            bgcolor: application.sellerId?.status === 'active' ? '#D1FAE5' : '#F3F4F6',
                            color: application.sellerId?.status === 'active' ? '#065F46' : '#6B7280',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            height: 22,
                            borderRadius: '4px'
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>

          {/* Descriptions */}
          {(application.shortDescription || application.detailedDescription) && (
            <Card 
              sx={{ 
                mb: 2, 
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                boxShadow: 'none'
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                {application.shortDescription && (
                  <Box sx={{ mb: application.detailedDescription ? 2.5 : 0 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A', mb: 1, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Short Description
                    </Typography>
                    {(() => {
                      const cleanText = stripHtmlTags(application.shortDescription)
                      const lines = cleanText.split('\n')
                      const shouldTruncate = lines.length > 3 || cleanText.length > 200
                      const displayText = expandedShortDesc || !shouldTruncate 
                        ? cleanText 
                        : lines.slice(0, 3).join('\n') + (cleanText.length > 200 ? '...' : '')
                      
                      return (
                        <>
                          <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                            {displayText}
                          </Typography>
                          {shouldTruncate && (
                            <Button
                              size="small"
                              onClick={() => setExpandedShortDesc(!expandedShortDesc)}
                              sx={{
                                mt: 1,
                                textTransform: 'none',
                                color: '#3B82F6',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                p: 0,
                                minWidth: 'auto',
                                '&:hover': {
                                  bgcolor: 'transparent',
                                  textDecoration: 'underline'
                                }
                              }}
                            >
                              {expandedShortDesc ? 'Read Less' : 'Read More'}
                            </Button>
                          )}
                        </>
                      )
                    })()}
                  </Box>
                )}
                {application.detailedDescription && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A', mb: 1, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Detailed Description
                    </Typography>
                    {(() => {
                      const cleanText = stripHtmlTags(application.detailedDescription)
                      const lines = cleanText.split('\n')
                      const shouldTruncate = lines.length > 5 || cleanText.length > 500
                      const displayText = expandedDetailedDesc || !shouldTruncate 
                        ? cleanText 
                        : lines.slice(0, 5).join('\n') + (cleanText.length > 500 ? '...' : '')
                      
                      return (
                        <>
                          <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                            {displayText}
                          </Typography>
                          {shouldTruncate && (
                            <Button
                              size="small"
                              onClick={() => setExpandedDetailedDesc(!expandedDetailedDesc)}
                              sx={{
                                mt: 1,
                                textTransform: 'none',
                                color: '#3B82F6',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                p: 0,
                                minWidth: 'auto',
                                '&:hover': {
                                  bgcolor: 'transparent',
                                  textDecoration: 'underline'
                                }
                              }}
                            >
                              {expandedDetailedDesc ? 'Read Less' : 'Read More'}
                            </Button>
                          )}
                        </>
                      )
                    })()}
                  </Box>
                )}
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

          {/* Screenshots - Filmstrip View */}
          {application.screenshots && application.screenshots.length > 0 && (
            <Card 
              sx={{ 
                mb: 2, 
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                boxShadow: 'none'
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 2, fontSize: '1rem' }}>
                  Screenshots ({application.screenshots.length})
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1 }}>
                  {application.screenshots.map((screenshot, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: 'relative',
                        minWidth: 200,
                        height: 150,
                        borderRadius: '6px',
                        overflow: 'hidden',
                        border: '1px solid #E2E8F0',
                        cursor: 'pointer',
                        '&:hover': {
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          '& .zoom-icon': {
                            opacity: 1
                          }
                        }
                      }}
                      onClick={() => {
                        setLightboxImage(screenshot.url || screenshot.uri)
                        setLightboxOpen(true)
                      }}
                    >
                      <img
                        src={screenshot.url || screenshot.uri}
                        alt={`Screenshot ${index + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <Box
                        className="zoom-icon"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'rgba(0,0,0,0.6)',
                          color: 'white',
                          borderRadius: '4px',
                          p: 0.5,
                          opacity: 0,
                          transition: 'opacity 0.2s'
                        }}
                      >
                        <ZoomIn sx={{ fontSize: 18 }} />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Lightbox Dialog */}
          <Dialog
            open={lightboxOpen}
            onClose={() => setLightboxOpen(false)}
            maxWidth="lg"
            fullWidth
          >
            <DialogContent sx={{ p: 0, bgcolor: '#000' }}>
              {lightboxImage && (
                <img
                  src={lightboxImage}
                  alt="Screenshot"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              )}
            </DialogContent>
          </Dialog>

          {/* Technical Specifications - Property Grid */}
          <Card 
            sx={{ 
              mb: 2, 
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
              boxShadow: 'none'
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 2, fontSize: '1rem' }}>
                Technical Specifications
              </Typography>

              {/* Platforms */}
              {application.platforms && application.platforms.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 1 }}>
                    Platforms
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {application.platforms.map((platform) => (
                      <Chip
                        key={platform}
                        label={platform}
                        size="small"
                        icon={
                          platform.toLowerCase().includes('android') ? <Android sx={{ fontSize: 14, color: '#64748B' }} /> :
                          platform.toLowerCase().includes('ios') ? <Apple sx={{ fontSize: 14, color: '#64748B' }} /> :
                          <Language sx={{ fontSize: 14, color: '#64748B' }} />
                        }
                        sx={{
                          bgcolor: '#F8FAFC',
                          color: '#475569',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          height: 26,
                          borderRadius: '4px',
                          border: '1px solid #E2E8F0',
                          '& .MuiChip-icon': { ml: 0.5 }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Technology Stack */}
              {application.technologyStack && application.technologyStack.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 1 }}>
                    Technology Stack
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                    {application.technologyStack.map((tech) => (
                      <Box
                        key={tech}
                        sx={{
                          bgcolor: '#F1F5F9',
                          color: '#334155',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          fontFamily: 'monospace'
                        }}
                      >
                        {tech}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Features - Two Column List */}
              {application.features && application.features.length > 0 && (
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 1 }}>
                    Features
                  </Typography>
                  <Grid container spacing={1}>
                    {application.features.map((feature, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#64748B', mt: 1, flexShrink: 0 }} />
                          <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.5 }}>
                            {feature}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Links & Resources */}
          {(application.demoUrl || application.githubUrl || application.documentationUrl) && (
            <Card 
              sx={{ 
                mb: 2, 
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                boxShadow: 'none'
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 2, fontSize: '1rem' }}>
                  Links & Resources
                </Typography>
                <Stack spacing={1.5}>
                  {application.demoUrl && (
                    <Box>
                      <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 0.5 }}>
                        Demo URL
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography 
                          variant="body2" 
                          component="a" 
                          href={application.demoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          sx={{ 
                            color: '#3B82F6', 
                            fontSize: '0.875rem', 
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                            wordBreak: 'break-all'
                          }}
                        >
                          {application.demoUrl}
                        </Typography>
                        <IconButton size="small" onClick={() => copyToClipboard(application.demoUrl)}>
                          <ContentCopy sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Box>
                    </Box>
                  )}
                  {application.githubUrl && (
                    <Box>
                      <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 0.5 }}>
                        GitHub URL
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography 
                          variant="body2" 
                          component="a" 
                          href={application.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          sx={{ 
                            color: '#3B82F6', 
                            fontSize: '0.875rem', 
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                            wordBreak: 'break-all'
                          }}
                        >
                          {application.githubUrl}
                        </Typography>
                        <IconButton size="small" onClick={() => copyToClipboard(application.githubUrl)}>
                          <ContentCopy sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Box>
                    </Box>
                  )}
                  {application.documentationUrl && (
                    <Box>
                      <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 0.5 }}>
                        Documentation
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography 
                          variant="body2" 
                          component="a" 
                          href={application.documentationUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          sx={{ 
                            color: '#3B82F6', 
                            fontSize: '0.875rem', 
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                            wordBreak: 'break-all'
                          }}
                        >
                          {application.documentationUrl}
                        </Typography>
                        <IconButton size="small" onClick={() => copyToClipboard(application.documentationUrl)}>
                          <ContentCopy sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Box>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Right Column - Intelligence Sidebar */}
        <Grid item xs={12} md={4}>
          
          {/* Decision Support - Quality Meter */}
          <Card 
            sx={{ 
              mb: 2, 
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
              boxShadow: 'none'
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 2.5, fontSize: '1rem' }}>
                Quality Assessment
              </Typography>
              
              {/* Circular Completion Gauge */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size={120}
                    thickness={4}
                    sx={{ color: '#E2E8F0' }}
                  />
                  <CircularProgress
                    variant="determinate"
                    value={application.completionScore || 0}
                    size={120}
                    thickness={4}
                    sx={{
                      color: application.completionScore >= 80 ? '#10B981' : application.completionScore >= 50 ? '#F59E0B' : '#EF4444',
                      position: 'absolute',
                      left: 0,
                    }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column'
                    }}
                  >
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', fontFamily: 'monospace' }}>
                      {application.completionScore || 0}%
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem' }}>
                      Complete
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Admin Rating */}
              {application.adminRating > 0 && (
                <Box sx={{ textAlign: 'center', pt: 2, borderTop: '1px solid #F1F5F9' }}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 1 }}>
                    Admin Rating
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <Rating value={application.adminRating} readOnly precision={0.5} size="small" />
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A', fontFamily: 'monospace' }}>
                      {application.adminRating.toFixed(1)}
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Seller Trust Profile */}
          <Card 
            sx={{ 
              mb: 2, 
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
              boxShadow: 'none'
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 2, fontSize: '1rem' }}>
                Seller Trust Profile
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Avatar 
                  sx={{ 
                    width: 48, 
                    height: 48, 
                    bgcolor: '#3B82F6',
                    fontWeight: 700,
                    fontSize: '1.25rem'
                  }}
                >
                  {application.sellerId?.name?.charAt(0) || 'U'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9375rem' }}>
                    {application.sellerId?.name || 'Unknown'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem' }}>
                    {application.sellerId?.shop?.shopName || 'No shop'}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem' }}>
                    Member Since
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A', fontSize: '0.8125rem' }}>
                    {application.sellerId?.createdAt 
                      ? new Date(application.sellerId.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                      : 'Unknown'
                    }
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem' }}>
                    Total Applications
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A', fontSize: '0.8125rem', fontFamily: 'monospace' }}>
                    {sellerApplications.length + 1}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem' }}>
                    Verified Apps
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#10B981', fontSize: '0.8125rem', fontFamily: 'monospace' }}>
                    {sellerApplications.filter(app => app.verificationStatus === 'verified').length}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem' }}>
                    Rejected Apps
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#EF4444', fontSize: '0.8125rem', fontFamily: 'monospace' }}>
                    {sellerApplications.filter(app => app.verificationStatus === 'rejected').length}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Badges - Active/Inactive Slots */}
          <Card 
            sx={{ 
              mb: 2, 
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
              boxShadow: 'none'
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 2, fontSize: '1rem' }}>
                Achievement Badges
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                {AVAILABLE_BADGES.map((badge) => {
                  const isActive = application.badges && application.badges.includes(badge)
                  return (
                    <Chip
                      key={badge}
                      label={badge}
                      size="small"
                      icon={isActive ? <Verified sx={{ fontSize: 14 }} /> : <CheckBoxOutlineBlank sx={{ fontSize: 14 }} />}
                      sx={{
                        bgcolor: isActive ? '#DBEAFE' : '#F8FAFC',
                        color: isActive ? '#1E40AF' : '#94A3B8',
                        border: `1px solid ${isActive ? '#93C5FD' : '#E2E8F0'}`,
                        fontWeight: 600,
                        fontSize: '0.6875rem',
                        height: 24,
                        borderRadius: '4px',
                        '& .MuiChip-icon': { 
                          color: isActive ? '#1E40AF' : '#CBD5E1',
                          ml: 0.5
                        }
                      }}
                    />
                  )
                })}
              </Box>
              <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem', display: 'block', mt: 1.5 }}>
                {application.badges?.length || 0} of {AVAILABLE_BADGES.length} badges assigned
              </Typography>
            </CardContent>
          </Card>

          {/* Admin Notes */}
          {application.adminNotes && (
            <Card 
              sx={{ 
                mb: 2, 
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                boxShadow: 'none'
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 1.5, fontSize: '1rem' }}>
                  Admin Notes
                </Typography>
                <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {application.adminNotes}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Rejection Reason */}
          {application.verificationStatus === 'rejected' && application.verificationNotes && (
            <Card 
              sx={{ 
                mb: 2, 
                borderRadius: '6px',
                border: '2px solid #FCA5A5',
                bgcolor: '#FEF2F2',
                boxShadow: 'none'
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#991B1B', mb: 1.5, fontSize: '1rem' }}>
                  Rejection Reason
                </Typography>
                <Typography variant="body2" sx={{ color: '#7F1D1D', fontSize: '0.875rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {application.verificationNotes}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Other Applications by This Seller - Condensed Table */}
      {sellerApplications.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 2, fontSize: '1.25rem' }}>
            Other Applications by {application.sellerId?.name || 'This Seller'}
          </Typography>
          <Card 
            sx={{ 
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
              boxShadow: 'none',
              overflow: 'hidden'
            }}
          >
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5 }}>
                      Application
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5 }}>
                      Category
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5 }}>
                      Status
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5 }}>
                      Price
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5 }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sellerApplications.map((app) => {
                    const appStatus = STATUS_CONFIG[app.verificationStatus] || STATUS_CONFIG.pending
                    return (
                      <TableRow
                        key={app._id}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: '#F8FAFC'
                          },
                          borderBottom: '1px solid #F1F5F9'
                        }}
                        onClick={() => navigate(`/admin/applications/${app._id}`)}
                      >
                        <TableCell sx={{ py: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar
                              src={app.screenshots?.[0]?.url || app.appIcon?.url}
                              variant="rounded"
                              sx={{ width: 36, height: 36, bgcolor: '#E2E8F0' }}
                            >
                              <Code sx={{ fontSize: 18, color: '#64748B' }} />
                            </Avatar>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A', fontSize: '0.875rem' }}>
                              {app.appName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.875rem' }}>
                            {app.appCategory}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Chip
                            label={appStatus.label}
                            size="small"
                            sx={{
                              bgcolor: appStatus.bgColor,
                              color: appStatus.textColor,
                              border: `1px solid ${appStatus.borderColor}`,
                              fontWeight: 600,
                              fontSize: '0.6875rem',
                              height: 22,
                              borderRadius: '4px'
                            }}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A', fontSize: '0.875rem', fontFamily: 'monospace' }}>
                            {app.isFree ? 'FREE' : `$${app.price || 0}`}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1.5 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate(`/admin/applications/${app._id}`)
                            }}
                            sx={{
                              borderColor: '#CBD5E1',
                              color: '#475569',
                              borderRadius: '4px',
                              textTransform: 'none',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              px: 2,
                              py: 0.5,
                              minWidth: 'auto',
                              '&:hover': {
                                borderColor: '#94A3B8',
                                bgcolor: '#F8FAFC'
                              }
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      )}
    </Box>

      {/* Review Dialog - "Finalize Application Audit" */}
      <Dialog
        open={reviewDialog.open}
        onClose={closeReviewDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '8px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }
        }}
      >
        <DialogTitle sx={{ bgcolor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', py: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', fontSize: '1.125rem' }}>
            Finalize Application Audit
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.8125rem' }}>
            {reviewDialog.action === 'verified' ? 'Approve this application for publication' : 'Reject this application with reason'}
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          <Grid container>
            {/* Left: Summary */}
            <Grid item xs={12} md={5} sx={{ bgcolor: '#F8FAFC', p: 3, borderRight: '1px solid #E2E8F0' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A', mb: 2, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Application Summary
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem', display: 'block', mb: 0.5 }}>
                  Application Name
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A', fontSize: '0.875rem' }}>
                  {application.appName}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem', display: 'block', mb: 0.5 }}>
                  Category
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A', fontSize: '0.875rem' }}>
                  {application.appCategory}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem', display: 'block', mb: 0.5 }}>
                  Seller
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A', fontSize: '0.875rem' }}>
                  {application.sellerId?.name || 'Unknown'}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem', display: 'block', mb: 0.5 }}>
                  Price
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A', fontSize: '0.875rem', fontFamily: 'monospace' }}>
                  {application.isFree ? 'FREE' : `$${application.price || 0}`}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ bgcolor: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '6px', p: 2 }}>
                <Typography variant="caption" sx={{ color: '#92400E', fontSize: '0.75rem', fontWeight: 600, display: 'block', mb: 0.5 }}>
                  ⚠️ Audit Trail Notice
                </Typography>
                <Typography variant="caption" sx={{ color: '#78350F', fontSize: '0.75rem', lineHeight: 1.5 }}>
                  This action will be logged under your admin account. This decision is final and will notify the seller immediately.
                </Typography>
              </Box>
            </Grid>

            {/* Right: Form */}
            <Grid item xs={12} md={7} sx={{ p: 3 }}>
              <Stack spacing={2.5}>
                {/* Rating */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A', mb: 1, fontSize: '0.875rem' }}>
                    Quality Rating {reviewDialog.action === 'verified' && <span style={{ color: '#EF4444' }}>*</span>}
                  </Typography>
                  <Rating
                    value={reviewData.rating}
                    onChange={(e, newValue) => setReviewData({ ...reviewData, rating: newValue })}
                    size="large"
                    precision={0.5}
                    sx={{
                      '& .MuiRating-iconFilled': {
                        color: '#F59E0B'
                      }
                    }}
                  />
                </Box>

                {/* Completion Score */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A', mb: 1, fontSize: '0.875rem' }}>
                    Completion Score (0-100%)
                  </Typography>
                  <TextField
                    type="number"
                    fullWidth
                    size="small"
                    value={reviewData.completionScore}
                    onChange={(e) => {
                      const value = Math.min(100, Math.max(0, Number(e.target.value)))
                      setReviewData({ ...reviewData, completionScore: value })
                    }}
                    inputProps={{ min: 0, max: 100, step: 5 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '6px',
                        fontFamily: 'monospace',
                        fontWeight: 600
                      }
                    }}
                  />
                </Box>

                {/* Badges Selection */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A', mb: 1, fontSize: '0.875rem' }}>
                    Assign Badges
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                    {AVAILABLE_BADGES.map((badge) => (
                      <Chip
                        key={badge}
                        label={badge}
                        size="small"
                        onClick={() => {
                          const newBadges = reviewData.badges.includes(badge)
                            ? reviewData.badges.filter(b => b !== badge)
                            : [...reviewData.badges, badge]
                          setReviewData({ ...reviewData, badges: newBadges })
                        }}
                        sx={{
                          bgcolor: reviewData.badges.includes(badge) ? '#DBEAFE' : '#F8FAFC',
                          color: reviewData.badges.includes(badge) ? '#1E40AF' : '#64748B',
                          border: `1px solid ${reviewData.badges.includes(badge) ? '#93C5FD' : '#E2E8F0'}`,
                          fontWeight: 600,
                          fontSize: '0.6875rem',
                          height: 26,
                          borderRadius: '4px',
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: reviewData.badges.includes(badge) ? '#BFDBFE' : '#F1F5F9'
                          }
                        }}
                      />
                    ))}
                  </Box>
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem', display: 'block', mt: 1 }}>
                    {reviewData.badges.length} badge(s) selected
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
                    placeholder="Provide a clear explanation for rejection..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '6px'
                      }
                    }}
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '6px'
                    }
                  }}
                />
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ bgcolor: '#F8FAFC', borderTop: '1px solid #E2E8F0', px: 3, py: 2 }}>
          <Button 
            onClick={closeReviewDialog} 
            disabled={actionLoading}
            sx={{
              borderRadius: '6px',
              textTransform: 'none',
              fontWeight: 600,
              color: '#64748B',
              '&:hover': {
                bgcolor: '#F1F5F9'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReviewSubmit}
            variant="contained"
            disabled={actionLoading}
            sx={{
              bgcolor: reviewDialog.action === 'verified' ? '#10B981' : '#EF4444',
              color: 'white',
              borderRadius: '6px',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: reviewDialog.action === 'verified' ? '#059669' : '#DC2626',
                boxShadow: 'none'
              },
              '&:disabled': {
                bgcolor: '#D1D5DB',
                color: '#9CA3AF'
              }
            }}
          >
            {actionLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : `${reviewDialog.action === 'verified' ? 'Approve' : 'Reject'} Application`}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminApplicationDetail
