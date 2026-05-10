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
} from '@mui/material'
import {
  Add,
  Delete,
  CloudUpload,
  Save,
  ArrowBack,
  ArrowForward,
  CheckCircle,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import api from '../../utils/api'
import useAuthStore from '../../store/authStore'
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
  const [selectedTech, setSelectedTech] = useState([])
  const [selectedPlatforms, setSelectedPlatforms] = useState([])
  const [dependencies, setDependencies] = useState([])
  const [newDependency, setNewDependency] = useState('')

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
      githubRepo: '',
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

  const handleScreenshotUpload = (event) => {
    const files = Array.from(event.target.files)
    if (screenshots.length + files.length > 5) {
      toast.error('Maximum 5 screenshots allowed')
      return
    }

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setScreenshots((prev) => [...prev, { file, preview: reader.result }])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleIconUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAppIcon({ file, preview: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeScreenshot = (index) => {
    setScreenshots((prev) => prev.filter((_, i) => i !== index))
  }

  const addDependency = () => {
    if (newDependency.trim()) {
      setDependencies((prev) => [...prev, newDependency.trim()])
      setNewDependency('')
    }
  }

  const removeDependency = (index) => {
    setDependencies((prev) => prev.filter((_, i) => i !== index))
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

      // Prepare form data - avoid circular references
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
        githubRepo: data.githubRepo?.trim() || '',
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
        screenshots: Array.isArray(screenshots) ? screenshots.map((s) => s.preview).filter(Boolean) : [],
        appIcon: appIcon?.preview || null,
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
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Add dependency (e.g., Node.js >= 14)"
                  value={newDependency}
                  onChange={(e) => setNewDependency(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDependency())}
                />
                <Button variant="outlined" onClick={addDependency} startIcon={<Add />}>
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
          </Grid>
        )

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'white', fontWeight: 600 }}>
                App Icon
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {appIcon && (
                  <Box
                    component="img"
                    src={appIcon.preview}
                    sx={{ width: 100, height: 100, borderRadius: 2, objectFit: 'cover' }}
                  />
                )}
                <Button variant="outlined" component="label" startIcon={<CloudUpload />}>
                  Upload Icon
                  <input type="file" hidden accept="image/*" onChange={handleIconUpload} />
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'white', fontWeight: 600 }}>
                Screenshots (Max 5)
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                {screenshots.map((screenshot, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                    <Box
                      component="img"
                      src={screenshot.preview}
                      sx={{ width: 150, height: 100, borderRadius: 2, objectFit: 'cover' }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        bgcolor: 'error.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'error.dark' },
                      }}
                      onClick={() => removeScreenshot(index)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                disabled={screenshots.length >= 5}
              >
                Upload Screenshots
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  multiple
                  onChange={handleScreenshotUpload}
                />
              </Button>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="GitHub Repository URL"
                {...register('githubRepo')}
                placeholder="https://github.com/username/repo"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Live Demo URL"
                {...register('liveDemo')}
                placeholder="https://demo.example.com"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Documentation URL"
                {...register('documentationUrl')}
                placeholder="https://docs.example.com"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Video Demo URL"
                {...register('videoDemo')}
                placeholder="https://youtube.com/watch?v=..."
              />
            </Grid>
          </Grid>
        )

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

      {/* Form */}
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
    </Box>
  )
}

export default CreateApplication
