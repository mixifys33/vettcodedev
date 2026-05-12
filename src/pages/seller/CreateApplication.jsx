import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
  Chip,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Switch,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  Autocomplete,
  Dialog,
  DialogContent,
  DialogActions,
  Tooltip,
} from '@mui/material'
import {
  Add,
  Delete,
  CloudUpload,
  Save,
  ArrowBack,
  ArrowForward,
  CheckCircle,
  ZoomIn,
  Close,
  Image as ImageIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import api from '../../utils/api'
import useAuthStore from '../../store/authStore'
import { uploadToImageKit, uploadMultipleToImageKit } from '../../utils/imagekit'
import {
  APP_CATEGORIES,
  TECHNOLOGY_STACK,
  PLATFORMS,
  LICENSE_TYPES,
  CURRENCIES,
} from '../../utils/constants'

const steps = ['Basic Info', 'Details & Pricing', 'Media & Links', 'Review']

const CreateApplication = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  const [screenshots, setScreenshots] = useState([])
  const [appIcon, setAppIcon] = useState(null)
  const [appFile, setAppFile] = useState(null)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [selectedTech, setSelectedTech] = useState([])
  const [selectedPlatforms, setSelectedPlatforms] = useState([])
  const [dependencies, setDependencies] = useState([])
  const [newDependency, setNewDependency] = useState('')
  const [imagePreview, setImagePreview] = useState({ open: false, image: null, title: '' })

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      appName: '',
      shortDescription: '',
      detailedDescription: '',
      appCategory: '',
      price: '',
      currency: 'USD',
      isFree: false,
      licenseType: '',
      liveDemo: '',
      documentationUrl: '',
      videoDemo: '',
      tags: '',
      commercialUse: 'Yes',
      resaleRights: 'No',
      supportLevel: 'Community',
      updateFrequency: 'Active',
      warranty: '30 days',
      installationSupport: 'Yes',
    },
  })

  const isFree = watch('isFree')

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0))
  }

  const handleScreenshotUpload = async (event) => {
    const files = Array.from(event.target.files)
    if (screenshots.length + files.length > 5) {
      toast.error('Maximum 5 screenshots allowed')
      return
    }

    // Show loading toast
    const uploadToast = toast.loading(`Uploading ${files.length} screenshot(s)...`)

    try {
      const uploadResults = await uploadMultipleToImageKit(files, 'applications/screenshots')
      
      // Add uploaded images to screenshots
      const newScreenshots = uploadResults.map(result => ({
        preview: result.url,
        fileId: result.fileId,
        fileName: result.fileName,
        uploaded: true
      }))
      
      setScreenshots((prev) => [...prev, ...newScreenshots])
      toast.success(`${files.length} screenshot(s) uploaded successfully`, { id: uploadToast })
    } catch (error) {
      console.error('Screenshot upload error:', error)
      toast.error('Failed to upload screenshots. Please try again.', { id: uploadToast })
    }
  }

  const handleIconUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Show loading toast
    const uploadToast = toast.loading('Uploading app icon...')

    try {
      const uploadResult = await uploadToImageKit(file, 'applications/icons')
      
      setAppIcon({
        preview: uploadResult.url,
        fileId: uploadResult.fileId,
        fileName: uploadResult.fileName,
        uploaded: true
      })
      
      toast.success('App icon uploaded successfully', { id: uploadToast })
    } catch (error) {
      console.error('Icon upload error:', error)
      toast.error('Failed to upload app icon. Please try again.', { id: uploadToast })
    }
  }

  const removeIcon = () => {
    setAppIcon(null)
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('File size must be less than 50MB')
      return
    }

    setUploadingFile(true)
    try {
      // Read file as base64 directly without any compression
      const reader = new FileReader()
      
      reader.onloadend = async () => {
        try {
          const base64 = reader.result

          // Upload to ImageKit as-is
          const response = await api.post('/imagekit/upload-application', {
            file: base64,
            fileName: file.name,
          })

          if (response.data.success) {
            setAppFile({
              url: response.data.url,
              fileId: response.data.fileId,
              fileName: file.name,
              fileSize: file.size,
            })
            toast.success(`File uploaded successfully! (${(file.size / 1024 / 1024).toFixed(2)}MB)`)
          }
        } catch (error) {
          console.error('Upload error:', error)
          toast.error(error.response?.data?.message || 'Failed to upload file')
        } finally {
          setUploadingFile(false)
        }
      }
      
      reader.onerror = () => {
        toast.error('Failed to read file')
        setUploadingFile(false)
      }
      
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload file')
      setUploadingFile(false)
    }
  }

  // Handle folder upload - creates ZIP maintaining folder structure
  const handleFolderUpload = async (event) => {
    const files = Array.from(event.target.files)
    if (files.length === 0) return

    // Calculate total size
    const totalSize = files.reduce((sum, file) => sum + file.size, 0)
    const maxSize = 50 * 1024 * 1024
    
    if (totalSize > maxSize) {
      toast.error(`Total folder size (${(totalSize / 1024 / 1024).toFixed(2)}MB) exceeds 50MB limit`)
      return
    }

    setUploadingFile(true)
    const loadingToast = toast.loading(`Processing ${files.length} files...`)

    try {
      // Dynamically import JSZip
      const JSZip = (await import('jszip')).default
      const zip = new JSZip()

      // Add all files to ZIP maintaining folder structure
      for (const file of files) {
        // Get relative path from webkitRelativePath
        const relativePath = file.webkitRelativePath || file.name
        
        // Read file content
        const content = await file.arrayBuffer()
        
        // Add to ZIP with full path to maintain folder structure
        zip.file(relativePath, content)
      }

      // Generate ZIP file without compression to preserve structure
      toast.loading('Creating ZIP file...', { id: loadingToast })
      const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'STORE', // No compression - just store files as-is
      })

      // Check if ZIP exceeds size limit
      if (zipBlob.size > maxSize) {
        toast.error(`ZIP file (${(zipBlob.size / 1024 / 1024).toFixed(2)}MB) exceeds 50MB limit`, { id: loadingToast })
        setUploadingFile(false)
        return
      }

      // Get folder name from first file's path
      const folderName = files[0].webkitRelativePath?.split('/')[0] || 'application'
      const zipFileName = `${folderName}.zip`

      console.log(`Created ZIP: ${files.length} files, ${(zipBlob.size / 1024 / 1024).toFixed(2)}MB`)

      // Convert to base64 and upload
      const reader = new FileReader()
      reader.onloadend = async () => {
        try {
          const base64 = reader.result

          toast.loading('Uploading to cloud...', { id: loadingToast })
          const response = await api.post('/imagekit/upload-application', {
            file: base64,
            fileName: zipFileName,
          })

          if (response.data.success) {
            setAppFile({
              url: response.data.url,
              fileId: response.data.fileId,
              fileName: zipFileName,
              fileSize: zipBlob.size,
              originalFileCount: files.length,
            })
            toast.success(`Folder uploaded! ${files.length} files (${(zipBlob.size / 1024 / 1024).toFixed(2)}MB)`, { id: loadingToast })
          }
        } catch (error) {
          console.error('Upload error:', error)
          toast.error(error.response?.data?.message || 'Failed to upload folder', { id: loadingToast })
        } finally {
          setUploadingFile(false)
        }
      }

      reader.onerror = () => {
        toast.error('Failed to process ZIP file', { id: loadingToast })
        setUploadingFile(false)
      }

      reader.readAsDataURL(zipBlob)
    } catch (error) {
      console.error('ZIP creation error:', error)
      toast.error('Failed to create ZIP from folder', { id: loadingToast })
      setUploadingFile(false)
    }
  }

  const removeAppFile = async () => {
    if (appFile?.fileId) {
      try {
        await api.delete('/imagekit/delete', { data: { fileId: appFile.fileId } })
      } catch (error) {
        console.error('Failed to delete file from ImageKit:', error)
      }
    }
    setAppFile(null)
  }

  const removeScreenshot = (index) => {
    setScreenshots((prev) => prev.filter((_, i) => i !== index))
  }

  const addDependency = () => {
    if (newDependency.trim()) {
      // Parse multiple dependencies from pasted text
      const lines = newDependency.split('\n').map(line => line.trim()).filter(Boolean)
      
      const parsedDeps = []
      
      lines.forEach(line => {
        // Remove common prefixes and clean up
        let cleaned = line
          .replace(/^[-*•]\s*/, '') // Remove bullet points
          .replace(/^\d+\.\s*/, '') // Remove numbered lists
          .replace(/^[•·]\s*/, '') // Remove other bullets
          .trim()
        
        // Split by common separators if multiple deps in one line
        const parts = cleaned.split(/[,;]/).map(p => p.trim()).filter(Boolean)
        
        parts.forEach(part => {
          // Clean up common patterns
          let dep = part
            .replace(/^["']|["']$/g, '') // Remove quotes
            .replace(/\s+/g, ' ') // Normalize spaces
            .trim()
          
          if (dep && !dependencies.includes(dep) && !parsedDeps.includes(dep)) {
            parsedDeps.push(dep)
          }
        })
      })
      
      if (parsedDeps.length > 0) {
        setDependencies((prev) => [...prev, ...parsedDeps])
        setNewDependency('')
        toast.success(`Added ${parsedDeps.length} ${parsedDeps.length === 1 ? 'dependency' : 'dependencies'}`)
      } else {
        toast.error('No valid dependencies found')
      }
    }
  }

  const removeDependency = (index) => {
    setDependencies((prev) => prev.filter((_, i) => i !== index))
  }

  const openImagePreview = (image, title) => {
    setImagePreview({ open: true, image, title })
  }

  const closeImagePreview = () => {
    setImagePreview({ open: false, image: null, title: '' })
  }

  const onSubmit = async (data, isDraft = false) => {
    try {
      isDraft ? setSavingDraft(true) : setLoading(true)

      const sellerId = user?.id || user?._id

      // Validate required fields for draft
      if (isDraft && !data.appName?.trim()) {
        toast.error('Application name is required to save as draft')
        return
      }

      // Validate application file for published apps
      if (!isDraft && !appFile) {
        toast.error('Application ZIP file is required')
        return
      }

      // Prepare form data - images are already uploaded to ImageKit
      const formData = {
        appName: data.appName?.trim() || '',
        shortDescription: data.shortDescription?.trim() || '',
        detailedDescription: data.detailedDescription?.trim() || '',
        appCategory: data.appCategory || '',
        tags: data.tags?.trim() || '',
        price: data.isFree ? 0 : parseFloat(data.price) || 0,
        currency: data.currency || 'USD',
        isFree: Boolean(data.isFree),
        licenseType: data.licenseType || '',
        liveDemo: data.liveDemo?.trim() || '',
        documentationUrl: data.documentationUrl?.trim() || '',
        videoDemo: data.videoDemo?.trim() || '',
        commercialUse: data.commercialUse || 'Yes',
        resaleRights: data.resaleRights || 'No',
        supportLevel: data.supportLevel || 'Community',
        updateFrequency: data.updateFrequency || 'Active',
        warranty: data.warranty || '30 days',
        installationSupport: data.installationSupport || 'Yes',
        sellerId,
        technologyStack: Array.isArray(selectedTech) ? selectedTech : [],
        supportedPlatforms: Array.isArray(selectedPlatforms) ? selectedPlatforms : [],
        dependencies: Array.isArray(dependencies) ? dependencies.filter(d => typeof d === 'string') : [],
        screenshots: Array.isArray(screenshots) ? screenshots.map((s) => ({
          url: s.preview,
          fileId: s.fileId || null,
          thumbnailUrl: s.thumbnailUrl || s.preview,
          fileName: s.fileName || null,
          uploaded: s.uploaded || false
        })).filter(s => s.url) : [],
        appIcon: appIcon ? {
          url: appIcon.preview,
          fileId: appIcon.fileId || null,
          thumbnailUrl: appIcon.thumbnailUrl || appIcon.preview,
          fileName: appIcon.fileName || null,
          uploaded: appIcon.uploaded || false
        } : null,
        sourceCodeFile: appFile || null,
      }

      // Use different endpoint for drafts
      const endpoint = isDraft ? '/applications/draft' : '/applications'
      const response = await api.post(endpoint, formData)

      if (response.data.success) {
        toast.success(isDraft ? 'Draft saved successfully!' : 'Application created successfully!')
        navigate(isDraft ? '/seller/drafts' : '/seller/applications')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create application'
      const errors = error.response?.data?.errors
      
      if (errors && errors.length > 0) {
        toast.error(`${errorMessage}: ${errors.join(', ')}`)
      } else {
        toast.error(errorMessage)
      }
      console.error(error)
    } finally {
      setLoading(false)
      setSavingDraft(false)
    }
  }

  const handleSaveDraft = () => {
    handleSubmit((data) => onSubmit(data, true))()
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Application Name"
                {...register('appName', { required: 'Application name is required' })}
                error={!!errors.appName}
                helperText={errors.appName?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Short Description"
                multiline
                rows={2}
                {...register('shortDescription', {
                  required: 'Short description is required',
                  maxLength: { value: 200, message: 'Maximum 200 characters' },
                })}
                error={!!errors.shortDescription}
                helperText={errors.shortDescription?.message || 'Brief description (max 200 characters)'}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'white', fontWeight: 600 }}>
                Detailed Description
              </Typography>
              <Controller
                name="detailedDescription"
                control={control}
                rules={{ required: 'Detailed description is required' }}
                render={({ field }) => (
                  <ReactQuill
                    theme="snow"
                    value={field.value}
                    onChange={field.onChange}
                    style={{ height: 200, marginBottom: 50 }}
                  />
                )}
              />
              {errors.detailedDescription && (
                <Typography variant="caption" color="error">
                  {errors.detailedDescription.message}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Category"
                {...register('appCategory', { required: 'Category is required' })}
                error={!!errors.appCategory}
                helperText={errors.appCategory?.message}
                defaultValue=""
              >
                {APP_CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tags (comma separated)"
                {...register('tags')}
                helperText="e.g. react, ecommerce, dashboard"
              />
            </Grid>
          </Grid>
        )

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch {...register('isFree')} />}
                label="This is a free application"
              />
            </Grid>

            {!isFree && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Price"
                    type="number"
                    {...register('price', {
                      required: !isFree && 'Price is required',
                      min: { value: 0, message: 'Price must be positive' },
                    })}
                    error={!!errors.price}
                    helperText={errors.price?.message}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Currency"
                    {...register('currency')}
                    defaultValue="USD"
                  >
                    {CURRENCIES.map((curr) => (
                      <MenuItem key={curr.code} value={curr.code}>
                        {curr.symbol} {curr.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </>
            )}

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="License Type"
                {...register('licenseType', { required: 'License type is required' })}
                error={!!errors.licenseType}
                helperText={errors.licenseType?.message}
                defaultValue=""
              >
                {LICENSE_TYPES.map((license) => (
                  <MenuItem key={license} value={license}>
                    {license}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Commercial Use"
                {...register('commercialUse')}
                defaultValue="Yes"
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
                <MenuItem value="With License">With License</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'white', fontWeight: 600 }}>
                Technology Stack
              </Typography>
              <Autocomplete
                multiple
                options={TECHNOLOGY_STACK}
                value={selectedTech}
                onChange={(e, newValue) => setSelectedTech(newValue)}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select technologies" />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip label={option} {...getTagProps({ index })} key={option} />
                  ))
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'white', fontWeight: 600 }}>
                Supported Platforms
              </Typography>
              <Autocomplete
                multiple
                options={PLATFORMS}
                value={selectedPlatforms}
                onChange={(e, newValue) => setSelectedPlatforms(newValue)}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select platforms" />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip label={option} {...getTagProps({ index })} key={option} />
                  ))
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'white', fontWeight: 600 }}>
                Dependencies
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'rgba(255,255,255,0.5)' }}>
                Add one or paste multiple dependencies (one per line, comma, or semicolon separated)
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Examples:&#10;Node.js >= 14&#10;MongoDB >= 4.0&#10;Redis, PostgreSQL&#10;Docker (optional)"
                  value={newDependency}
                  onChange={(e) => setNewDependency(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(99, 102, 241, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#6366f1',
                      },
                    },
                  }}
                />
                <Button 
                  variant="outlined" 
                  onClick={addDependency} 
                  startIcon={<Add />}
                  sx={{ 
                    minWidth: '100px',
                    height: 'fit-content',
                  }}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {dependencies.map((dep, index) => (
                  <Chip
                    key={index}
                    label={dep}
                    onDelete={() => removeDependency(index)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'white', fontWeight: 600 }}>
                Application Source Code *
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mb: 2, color: 'rgba(255,255,255,0.5)' }}>
                Upload your application source code as a file or folder (max 50MB, any format)
              </Typography>
              
              {appFile ? (
                <Box
                  sx={{
                    p: 2,
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: 2,
                    bgcolor: 'rgba(99, 102, 241, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CheckCircle sx={{ color: '#10b981' }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                        {appFile.fileName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        {(appFile.fileSize / 1024 / 1024).toFixed(2)} MB
                        {appFile.originalFileCount && ` • ${appFile.originalFileCount} files`}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    onClick={removeAppFile}
                    sx={{
                      color: '#ef4444',
                      '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' },
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={uploadingFile ? <CircularProgress size={16} /> : <CloudUpload />}
                    disabled={uploadingFile}
                    sx={{
                      flex: 1,
                      minWidth: '200px',
                      borderColor: 'rgba(99, 102, 241, 0.5)',
                      color: '#6366f1',
                      '&:hover': {
                        borderColor: '#6366f1',
                        bgcolor: 'rgba(99, 102, 241, 0.1)',
                      },
                    }}
                  >
                    {uploadingFile ? 'Uploading...' : 'Upload File'}
                    <input
                      type="file"
                      hidden
                      onChange={handleFileUpload}
                      disabled={uploadingFile}
                    />
                  </Button>
                  
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={uploadingFile ? <CircularProgress size={16} /> : <CloudUpload />}
                    disabled={uploadingFile}
                    sx={{
                      flex: 1,
                      minWidth: '200px',
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5558e3 0%, #7c4de8 100%)',
                      },
                    }}
                  >
                    {uploadingFile ? 'Processing...' : 'Upload Folder'}
                    <input
                      type="file"
                      hidden
                      webkitdirectory=""
                      directory=""
                      multiple
                      onChange={handleFolderUpload}
                      disabled={uploadingFile}
                    />
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
        )

      case 2:
        // TWO-COLUMN LAYOUT: Rendered in main return statement
        return null

      case 3:
        return (
          <Box>
            <Alert 
              severity="info" 
              sx={{ 
                mb: 3,
                bgcolor: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: 'white',
                '& .MuiAlert-icon': {
                  color: '#6366f1',
                },
              }}
            >
              Please review your application details before submitting. Your application will be
              reviewed by our team before it goes live.
            </Alert>

            <Card 
              sx={{ 
                mb: 2,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: 'white', fontWeight: 600 }}>
                  Application Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      Name
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>{watch('appName') || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      Category
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>{watch('appCategory') || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      Price
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      {watch('isFree') ? 'Free' : `${watch('currency')} ${watch('price')}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      License
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>{watch('licenseType') || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      Technologies
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                      {selectedTech.map((tech) => (
                        <Chip 
                          key={tech} 
                          label={tech} 
                          size="small"
                          sx={{
                            bgcolor: 'rgba(99, 102, 241, 0.2)',
                            color: '#6366f1',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      Screenshots
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>{screenshots.length} uploaded</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      Application File
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      {appFile ? `${appFile.fileName} (${(appFile.fileSize / 1024 / 1024).toFixed(2)} MB)` : 'Not uploaded'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        )

      default:
        return null
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/seller/applications')}
          sx={{ 
            mb: 2,
            color: 'rgba(255,255,255,0.7)',
            '&:hover': {
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.05)',
            },
          }}
        >
          Back to Applications
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
          Create New Application
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
          Fill in the details to list your application on the marketplace
        </Typography>
      </Box>

      {/* Stepper */}
      <Card
        sx={{
          mb: 3,
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stepper 
            activeStep={activeStep}
            sx={{
              '& .MuiStepLabel-root .Mui-completed': {
                color: '#10b981',
              },
              '& .MuiStepLabel-root .Mui-active': {
                color: '#6366f1',
              },
              '& .MuiStepLabel-label': {
                color: 'rgba(255,255,255,0.6)',
              },
              '& .MuiStepLabel-label.Mui-active': {
                color: 'white',
                fontWeight: 600,
              },
              '& .MuiStepLabel-label.Mui-completed': {
                color: 'rgba(255,255,255,0.8)',
              },
              '& .MuiStepIcon-root': {
                color: 'rgba(255,255,255,0.2)',
              },
              '& .MuiStepIcon-root.Mui-active': {
                color: '#6366f1',
              },
              '& .MuiStepIcon-root.Mui-completed': {
                color: '#10b981',
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* TWO-COLUMN LAYOUT FOR MEDIA & LINKS STEP (Step 2) */}
      {activeStep === 2 ? (
        <Grid container spacing={3}>
          {/* LEFT COLUMN - Image Preview (Sticky) */}
          <Grid item xs={12} lg={5}>
            <Card
              sx={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 2,
                position: { xs: 'relative', lg: 'sticky' },
                top: { lg: 20 },
                maxHeight: { lg: 'calc(100vh - 40px)' },
                overflow: 'auto',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(99, 102, 241, 0.5)',
                  borderRadius: '4px',
                  '&:hover': {
                    background: 'rgba(99, 102, 241, 0.7)',
                  },
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                  Media Preview
                </Typography>

                {/* App Icon Preview */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2, fontSize: '0.875rem' }}>
                    App Icon
                  </Typography>
                  <Box
                    sx={{
                      width: '100%',
                      aspectRatio: '1',
                      maxWidth: 300,
                      mx: 'auto',
                      border: '2px dashed rgba(99, 102, 241, 0.3)',
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'rgba(0,0,0,0.2)',
                      overflow: 'hidden',
                      position: 'relative',
                      cursor: appIcon ? 'pointer' : 'default',
                      transition: 'all 0.3s',
                      '&:hover': appIcon ? {
                        transform: 'scale(1.02)',
                        border: '2px dashed rgba(99, 102, 241, 0.6)',
                      } : {},
                    }}
                    onClick={() => appIcon && openImagePreview(appIcon.preview, 'App Icon')}
                  >
                    {appIcon ? (
                      <>
                        <Box
                          component="img"
                          src={appIcon.preview}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'rgba(239, 68, 68, 0.9)',
                            color: 'white',
                            '&:hover': { bgcolor: '#ef4444' },
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            removeIcon()
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </>
                    ) : (
                      <Box sx={{ textAlign: 'center', p: 3 }}>
                        <ImageIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.4)', mb: 0.5 }}>
                          512 × 512
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>
                          No icon uploaded yet
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Screenshots Preview */}
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2, fontSize: '0.875rem' }}>
                    Screenshots ({screenshots.length}/5)
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {screenshots.map((screenshot, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: 'relative',
                          width: '100%',
                          aspectRatio: '16/9',
                          border: '1px solid rgba(99, 102, 241, 0.3)',
                          borderRadius: 2,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          '&:hover': {
                            transform: 'scale(1.02)',
                            border: '1px solid rgba(99, 102, 241, 0.6)',
                          },
                        }}
                        onClick={() => openImagePreview(screenshot.preview, `Screenshot ${index + 1}`)}
                      >
                        <Box
                          component="img"
                          src={screenshot.preview}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                        <Chip
                          label={`#${index + 1}`}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            bgcolor: 'rgba(99, 102, 241, 0.9)',
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'rgba(239, 68, 68, 0.9)',
                            color: 'white',
                            '&:hover': { bgcolor: '#ef4444' },
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            removeScreenshot(index)
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                    {screenshots.length === 0 && (
                      <Box
                        sx={{
                          width: '100%',
                          aspectRatio: '16/9',
                          border: '2px dashed rgba(99, 102, 241, 0.3)',
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'rgba(0,0,0,0.2)',
                        }}
                      >
                        <Box sx={{ textAlign: 'center', p: 3 }}>
                          <ImageIcon sx={{ fontSize: 48, color: 'rgba(255,255,255,0.2)', mb: 1 }} />
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>
                            No screenshots uploaded
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* RIGHT COLUMN - Upload Controls & Form Fields */}
          <Grid item xs={12} lg={7}>
            <Card
              sx={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={3}>
                    {/* App Icon Upload Section */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" sx={{ mb: 2, color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ImageIcon /> App Icon *
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', mb: 2, color: 'rgba(255,255,255,0.5)' }}>
                        Upload a square icon (recommended: 512x512px, PNG or JPG)
                      </Typography>
                      
                      <Button 
                        variant="contained" 
                        component="label" 
                        startIcon={<CloudUpload />}
                        fullWidth
                        sx={{
                          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          py: 1.5,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5558e3 0%, #7c4de8 100%)',
                          }
                        }}
                      >
                        {appIcon ? 'Change App Icon' : 'Upload App Icon'}
                        <input type="file" hidden accept="image/*" onChange={handleIconUpload} />
                      </Button>
                    </Grid>

                    {/* Screenshots Upload Section */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" sx={{ mb: 2, color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ImageIcon /> Screenshots (Max 5) *
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', mb: 2, color: 'rgba(255,255,255,0.5)' }}>
                        Upload high-quality screenshots of your application (recommended: 1920x1080px)
                      </Typography>
                      
                      <Button
                        variant="contained"
                        component="label"
                        startIcon={<CloudUpload />}
                        disabled={screenshots.length >= 5}
                        fullWidth
                        sx={{
                          py: 1.5,
                          background: screenshots.length >= 5 
                            ? 'rgba(255,255,255,0.1)' 
                            : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          '&:hover': {
                            background: screenshots.length >= 5 
                              ? 'rgba(255,255,255,0.1)' 
                              : 'linear-gradient(135deg, #5558e3 0%, #7c4de8 100%)',
                          },
                          '&:disabled': {
                            background: 'rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.3)',
                          }
                        }}
                      >
                        {screenshots.length >= 5 ? 'Maximum Reached (5/5)' : `Upload Screenshots (${screenshots.length}/5)`}
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          multiple
                          onChange={handleScreenshotUpload}
                          disabled={screenshots.length >= 5}
                        />
                      </Button>
                    </Grid>

                    {/* Optional Links Section */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" sx={{ mb: 2, color: 'white', fontWeight: 600 }}>
                        Additional Resources (Optional)
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', mb: 2, color: 'rgba(255,255,255,0.5)' }}>
                        Provide links to help users understand and use your application
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Live Demo URL"
                        {...register('liveDemo')}
                        placeholder="https://demo.example.com"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: 'rgba(255,255,255,0.05)',
                            color: 'white',
                            '& fieldset': {
                              borderColor: 'rgba(255,255,255,0.1)',
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
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#6366f1',
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Documentation URL"
                        {...register('documentationUrl')}
                        placeholder="https://docs.example.com"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: 'rgba(255,255,255,0.05)',
                            color: 'white',
                            '& fieldset': {
                              borderColor: 'rgba(255,255,255,0.1)',
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
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#6366f1',
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Video Demo URL (YouTube, Vimeo, etc.)"
                        {...register('videoDemo')}
                        placeholder="https://youtube.com/watch?v=..."
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: 'rgba(255,255,255,0.05)',
                            color: 'white',
                            '& fieldset': {
                              borderColor: 'rgba(255,255,255,0.1)',
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
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#6366f1',
                          },
                        }}
                      />
                    </Grid>
                  </Grid>

                  {/* Navigation */}
                  <Box sx={{ display: 'flex', gap: 2, mt: 4, pt: 3, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <Button 
                      variant="outlined" 
                      onClick={handleBack} 
                      startIcon={<ArrowBack />}
                      sx={{
                        borderColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        '&:hover': {
                          borderColor: '#6366f1',
                          bgcolor: 'rgba(99, 102, 241, 0.1)',
                        },
                      }}
                    >
                      Back
                    </Button>

                    <Box sx={{ flex: 1 }} />

                    <Button
                      variant="outlined"
                      onClick={handleSaveDraft}
                      disabled={savingDraft || loading}
                      startIcon={savingDraft ? <CircularProgress size={16} /> : <Save />}
                      sx={{
                        borderColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        '&:hover': {
                          borderColor: '#8b5cf6',
                          bgcolor: 'rgba(139, 92, 246, 0.1)',
                        },
                        '&:disabled': {
                          borderColor: 'rgba(255,255,255,0.1)',
                          color: 'rgba(255,255,255,0.3)',
                        },
                      }}
                    >
                      {savingDraft ? 'Saving...' : 'Save Draft'}
                    </Button>

                    <Button 
                      variant="contained" 
                      onClick={handleNext} 
                      endIcon={<ArrowForward />}
                      sx={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                        '&:hover': {
                          boxShadow: '0 6px 16px rgba(99, 102, 241, 0.5)',
                        },
                      }}
                    >
                      Next
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        /* SINGLE COLUMN LAYOUT FOR OTHER STEPS */
        <Card
          sx={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box
                sx={{
                  '& .MuiTextField-root': {
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(255,255,255,0.05)',
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.1)',
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
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#6366f1',
                    },
                    '& .MuiFormHelperText-root': {
                      color: 'rgba(255,255,255,0.5)',
                    },
                  },
                '& .MuiAutocomplete-root': {
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255,255,255,0.05)',
                    color: 'white',
                  },
                },
                '& .MuiChip-root': {
                  bgcolor: 'rgba(99, 102, 241, 0.2)',
                  color: '#6366f1',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                },
                '& .MuiSwitch-root': {
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#6366f1',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    bgcolor: '#6366f1',
                  },
                },
              }}
            >
              {renderStepContent()}
            </Box>

            {/* Navigation */}
            <Box sx={{ display: 'flex', gap: 2, mt: 4, pt: 3, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {activeStep > 0 && (
                <Button 
                  variant="outlined" 
                  onClick={handleBack} 
                  startIcon={<ArrowBack />}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '&:hover': {
                      borderColor: '#6366f1',
                      bgcolor: 'rgba(99, 102, 241, 0.1)',
                    },
                  }}
                >
                  Back
                </Button>
              )}

              <Box sx={{ flex: 1 }} />

              <Button
                variant="outlined"
                onClick={handleSaveDraft}
                disabled={savingDraft || loading}
                startIcon={savingDraft ? <CircularProgress size={16} /> : <Save />}
                sx={{
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': {
                    borderColor: '#8b5cf6',
                    bgcolor: 'rgba(139, 92, 246, 0.1)',
                  },
                  '&:disabled': {
                    borderColor: 'rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.3)',
                  },
                }}
              >
                {savingDraft ? 'Saving...' : 'Save Draft'}
              </Button>

              {activeStep < steps.length - 1 ? (
                <Button 
                  variant="contained" 
                  onClick={handleNext} 
                  endIcon={<ArrowForward />}
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(99, 102, 241, 0.5)',
                    },
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || savingDraft}
                  startIcon={loading ? <CircularProgress size={16} /> : <CheckCircle />}
                  sx={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(16, 185, 129, 0.5)',
                    },
                    '&:disabled': {
                      background: 'rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.3)',
                    },
                  }}
                >
                  {loading ? 'Creating...' : 'Create Application'}
                </Button>
              )}
            </Box>
          </form>
        </CardContent>
      </Card>
      )}

      {/* Image Preview Modal */}
      <Dialog
        open={imagePreview.open}
        onClose={closeImagePreview}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(15, 23, 42, 0.98)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 2,
          },
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={closeImagePreview}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0,0,0,0.5)',
              color: 'white',
              zIndex: 1,
              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
            }}
          >
            <Close />
          </IconButton>
          {imagePreview.image && (
            <Box
              component="img"
              src={imagePreview.image}
              alt={imagePreview.title}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '80vh',
                objectFit: 'contain',
              }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="body2" sx={{ color: 'white', flex: 1 }}>
            {imagePreview.title}
          </Typography>
          <Button onClick={closeImagePreview} sx={{ color: '#6366f1' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CreateApplication
