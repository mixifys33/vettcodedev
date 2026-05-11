import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  Grid,
  CircularProgress,
  InputAdornment,
  Tabs,
  Tab,
  Avatar,
} from '@mui/material'
import {
  Search,
  Code,
  CheckCircle,
  Cancel,
  Schedule,
  Star,
} from '@mui/icons-material'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const STATUS_CONFIG = {
  pending: { color: 'warning', label: 'Pending', icon: Schedule },
  verified: { color: 'success', label: 'Verified', icon: CheckCircle },
  rejected: { color: 'error', label: 'Rejected', icon: Cancel },
}

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'verified', label: 'Verified' },
  { key: 'rejected', label: 'Rejected' },
]

const AdminApplicationManagement = () => {
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchApplications()
  }, [filter])

  const getToken = () => localStorage.getItem('adminToken')

  const fetchApplications = async () => {
    try {
      const token = getToken()
      const params = filter !== 'all' ? `?status=${filter}` : ''
      const response = await api.get(`/admin/applications${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.data.success) {
        setApplications(response.data.applications || [])
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error)
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (app, status) => {
    try {
      const token = getToken()
      const response = await api.patch(
        `/admin/applications/${app._id}/review`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.data.success) {
        toast.success(`Application ${status}`)
        fetchApplications()
      }
    } catch (error) {
      toast.error('Action failed')
    }
  }

  const filtered = applications.filter(
    (a) =>
      !search.trim() ||
      a.appName?.toLowerCase().includes(search.toLowerCase()) ||
      a.appCategory?.toLowerCase().includes(search.toLowerCase())
  )

  const ApplicationCard = ({ app }) => {
    const statusConfig = STATUS_CONFIG[app.verificationStatus] || STATUS_CONFIG.pending
    const StatusIcon = statusConfig.icon
    const img = app.screenshots?.[0]?.url || app.screenshots?.[0]?.uri

    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
            <Avatar
              src={img}
              variant="rounded"
              sx={{ width: 64, height: 64, bgcolor: 'background.default' }}
            >
              <Code />
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }} noWrap>
                {app.appName}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {app.appCategory}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                by {app.sellerId?.name || 'Unknown'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Chip
                  icon={<StatusIcon />}
                  label={statusConfig.label}
                  size="small"
                  color={statusConfig.color}
                />
                {app.adminRating > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Star sx={{ fontSize: 16, color: 'secondary.main' }} />
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {app.adminRating}/5
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
                ${app.price || 0}
              </Typography>
              {app.completionScore > 0 && (
                <Typography variant="caption" color="info.main" sx={{ fontWeight: 600 }}>
                  {app.completionScore}%
                </Typography>
              )}
            </Box>
          </Box>

          {app.badges?.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
              {app.badges.slice(0, 3).map((badge) => (
                <Chip key={badge} label={badge} size="small" variant="outlined" />
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 1 }}>
            {app.verificationStatus === 'pending' && (
              <>
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircle />}
                  onClick={() => handleAction(app, 'verified')}
                >
                  Verify
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  startIcon={<Cancel />}
                  onClick={() => handleAction(app, 'rejected')}
                >
                  Reject
                </Button>
              </>
            )}
            <Button 
              size="small" 
              variant="outlined" 
              sx={{ ml: 'auto' }}
              onClick={() => navigate(`/admin/applications/${app._id}`)}
            >
              Full Review
            </Button>
          </Box>
        </CardContent>
      </Card>
    )
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
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Application Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {applications.length} total applications
        </Typography>
        <Chip
          label={`${applications.filter((a) => a.verificationStatus === 'pending').length} pending`}
          color="warning"
          size="small"
          sx={{ mt: 1 }}
        />
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search by name or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />

      {/* Filters */}
      <Tabs value={filter} onChange={(e, newValue) => setFilter(newValue)} sx={{ mb: 3 }}>
        {FILTERS.map((f) => (
          <Tab key={f.key} label={f.label} value={f.key} />
        ))}
      </Tabs>

      {/* Applications List */}
      {filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Code sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No applications found
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filtered.map((app) => (
            <Grid item xs={12} key={app._id}>
              <ApplicationCard app={app} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

export default AdminApplicationManagement
