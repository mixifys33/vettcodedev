import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material'
import {
  ArrowBack,
  Save,
  CloudDownload,
  Email,
  GitHub,
  Chat,
  FolderOpen,
  Description,
} from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import { DELIVERY_METHODS } from '../../utils/constants'

const DeliverySettings = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [application, setApplication] = useState(null)
  const [selectedMethods, setSelectedMethods] = useState({})

  const { register, handleSubmit, watch, setValue } = useForm()

  useEffect(() => {
    fetchApplication()
  }, [id])

  const fetchApplication = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/applications/${id}`)

      if (response.data.success) {
        setApplication(response.data.application)
        
        // Load existing delivery settings
        if (response.data.application.deliverySettings) {
          const settings = response.data.application.deliverySettings
          setSelectedMethods(settings)
          
          // Set form values
          Object.keys(settings).forEach((key) => {
            if (settings[key].enabled) {
              setValue(`${key}_enabled`, true)
              if (settings[key].url) setValue(`${key}_url`, settings[key].url)
              if (settings[key].note) setValue(`${key}_note`, settings[key].note)
            }
          })
        }
      }
    } catch (error) {
      toast.error('Failed to fetch application')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setSaving(true)

      // Build delivery settings object
      const deliverySettings = {}
      
      DELIVERY_METHODS.forEach((method) => {
        const enabled = data[`${method.key}_enabled`] || false
        deliverySettings[method.key] = {
          enabled,
          ...(method.hasUrl && { url: data[`${method.key}_url`] || '' }),
          ...(method.hasNote && { note: data[`${method.key}_note`] || '' }),
        }
      })

      const response = await api.post(`/applications/${id}/distribution`, {
        deliverySettings,
      })

      if (response.data.success) {
        toast.success('Delivery settings saved successfully!')
        navigate('/seller/applications')
      }
    } catch (error) {
      toast.error('Failed to save delivery settings')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const getMethodIcon = (iconName) => {
    const icons = {
      CloudDownload,
      Email,
      GitHub,
      Chat,
      FolderOpen,
      Description,
    }
    const Icon = icons[iconName] || Description
    return <Icon />
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
          Delivery Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure how buyers will receive: {application?.appName}
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Select one or more delivery methods. Buyers will see these options after purchase.
      </Alert>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {DELIVERY_METHODS.map((method) => {
            const isEnabled = watch(`${method.key}_enabled`)

            return (
              <Grid item xs={12} key={method.key}>
                <Card
                  variant="outlined"
                  sx={{
                    borderColor: isEnabled ? method.color : 'divider',
                    borderWidth: isEnabled ? 2 : 1,
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          bgcolor: `${method.color}15`,
                          color: method.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {getMethodIcon(method.icon)}
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {method.label}
                          </Typography>
                          {method.automated && (
                            <Chip label="Automated" size="small" color="success" />
                          )}
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {method.description}
                        </Typography>

                        <FormControlLabel
                          control={
                            <Switch
                              {...register(`${method.key}_enabled`)}
                              color="primary"
                            />
                          }
                          label="Enable this delivery method"
                        />

                        {isEnabled && (
                          <Box sx={{ mt: 2, pl: 2, borderLeft: 2, borderColor: method.color }}>
                            {method.hasUrl && (
                              <TextField
                                fullWidth
                                label={method.urlLabel}
                                placeholder={method.urlPlaceholder}
                                {...register(`${method.key}_url`, {
                                  required: isEnabled && 'URL is required',
                                })}
                                sx={{ mb: 2 }}
                              />
                            )}

                            {method.hasNote && (
                              <TextField
                                fullWidth
                                label={method.noteLabel}
                                placeholder={method.notePlaceholder}
                                multiline
                                rows={3}
                                {...register(`${method.key}_note`)}
                              />
                            )}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/seller/applications')}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={20} /> : <Save />}
          >
            {saving ? 'Saving...' : 'Save Delivery Settings'}
          </Button>
        </Box>
      </form>
    </Box>
  )
}

export default DeliverySettings
