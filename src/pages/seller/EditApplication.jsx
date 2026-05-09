import { useState, useEffect } from 'react'
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
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import api from '../../utils/api'
import {
  APP_CATEGORIES,
  TECHNOLOGY_STACK,
  PLATFORMS,
  LICENSE_TYPES,
  CURRENCIES,
} from '../../utils/constants'

const steps = ['Basic Info', 'Details & Pricing', 'Media & Links', 'Review']

const EditApplication = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
    setValue,
    formState: { errors },
  } = useForm()

  const isFree = watch('isFree')

  useEffect(() => {
    fetchApplication()
  }, [id])

  const fetchApplication = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/applications/${id}`)

      if (response.data.success) {
        const app = response.data.application

        // Set form values
        setValue('appName', app.appName || '')
        setValue('shortDescription', app.shortDescription || '')
        setValue('detailedDescription', app.detailedDescription || '')
        setValue('appCategory', app.appCategory || '')
        setValue('price', app.price || '')
        setValue('currency', app.currency || 'USD')
        setValue('isFree', app.isFree || false)
        setValue('licenseType', app.licenseType || '')
        setValue('githubRepo', app.githubRepo || '')
        setValue('liveDemo', app.liveDemo || '')
        setValue('documentationUrl', app.documentationUrl || '')
        setValue('videoDemo', app.videoDemo || '')
        setValue('tags', app.tags || '')
        setValue('commercialUse', app.commercialUse || 'Yes')
        setValue('resaleRights', app.resaleRights || 'No')
        setValue('supportLevel', app.supportLevel || 'Community')
        setValue('updateFrequency', app.updateFrequency || 'Active')
        setValue('warranty', app.warranty || '30 days')
        setValue('installationSupport', app.installationSupport || 'Yes')

        // Set arrays
        setSelectedTech(app.technologyStack || [])
        setSelectedPlatforms(app.supportedPlatforms || [])
        setDependencies(app.dependencies || [])

        // Set images
        if (app.screenshots) {
          setScreenshots(
            app.screenshots.map((s) => ({
              preview: s.url || s,
              existing: true,
            }))
          )
        }

        if (app.appIcon) {
          setAppIcon({
            preview: app.appIcon.url || app.appIcon,
            existing: true,
          })
        }
      }
    } catch (error) {
      toast.error('Failed to fetch application')
      console.error(error)
      navigate('/seller/applications')
    } finally {
      setLoading(false)
    }
  }

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
        setScreenshots((prev) => [...prev, { file, preview: reader.result, existing: false }])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleIconUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAppIcon({ file, preview: reader.result, existing: false })
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

  const onSubmit = async (data) => {
    try {
      setSaving(true)

      // Prepare form data - avoid circular references
      const formData = {
        appName: data.appName,
        shortDescription: data.shortDescription,
        detailedDescription: data.detailedDescription,
        appCategory: data.appCategory,
        tags: data.tags,
        price: data.isFree ? 0 : data.price,
        currency: data.currency,
        isFree: data.isFree,
        licenseType: data.licenseType,
        githubRepo: data.githubRepo,
        liveDemo: data.liveDemo,
        documentationUrl: data.documentationUrl,
        videoDemo: data.videoDemo,
        commercialUse: data.commercialUse,
        resaleRights: data.resaleRights,
        supportLevel: data.supportLevel,
        updateFrequency: data.updateFrequency,
        warranty: data.warranty,
        installationSupport: data.installationSupport,
        technologyStack: selectedTech,
        supportedPlatforms: selectedPlatforms,
        dependencies,
        screenshots: screenshots.map((s) => s.preview),
        appIcon: appIcon?.preview,
      }

      const response = await api.put(`/applications/${id}`, formData)

      if (response.data.success) {
        toast.success('Application updated successfully!')
        navigate('/seller/applications')
      }
    } catch (error) {
      toast.error('Failed to update application')
      console.error(error)
    } finally {
      setSaving(false)
    }
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
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
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
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
                <MenuItem value="With License">With License</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
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
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
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
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
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
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
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
                  {appIcon ? 'Change Icon' : 'Upload Icon'}
                  <input type="file" hidden accept="image/*" onChange={handleIconUpload} />
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
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
            <Alert severity="info" sx={{ mb: 3 }}>
              Review your changes before updating the application.
            </Alert>

            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Application Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Name
                    </Typography>
                    <Typography variant="body2">{watch('appName') || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Category
                    </Typography>
                    <Typography variant="body2">{watch('appCategory') || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Price
                    </Typography>
                    <Typography variant="body2">
                      {watch('isFree') ? 'Free' : `${watch('currency')} ${watch('price')}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      License
                    </Typography>
                    <Typography variant="body2">{watch('licenseType') || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">
                      Technologies
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                      {selectedTech.map((tech) => (
                        <Chip key={tech} label={tech} size="small" />
                      ))}
                    </Box>
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/seller/applications')}
          sx={{ mb: 2 }}
        >
          Back to Applications
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          Edit Application
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Update your application details
        </Typography>
      </Box>

      {/* Stepper */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Form */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStepContent()}

            {/* Navigation */}
            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              {activeStep > 0 && (
                <Button variant="outlined" onClick={handleBack} startIcon={<ArrowBack />}>
                  Back
                </Button>
              )}

              <Box sx={{ flex: 1 }} />

              {activeStep < steps.length - 1 ? (
                <Button variant="contained" onClick={handleNext} endIcon={<ArrowForward />}>
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                  startIcon={saving ? <CircularProgress size={16} /> : <CheckCircle />}
                >
                  {saving ? 'Updating...' : 'Update Application'}
                </Button>
              )}
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default EditApplication
