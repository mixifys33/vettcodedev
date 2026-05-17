import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Alert,
  Breadcrumbs,
  Link,
  Chip,
} from '@mui/material'
import { NavigateNext, CloudUpload, History } from '@mui/icons-material'
import { colors } from '../../theme/tokens'
import { BULK_UPLOAD_HISTORY_KEY } from '../../utils/bulkUpload'

const BulkUploadHistory = () => {
  const navigate = useNavigate()

  const lastRun = useMemo(() => {
    try {
      const raw = localStorage.getItem(BULK_UPLOAD_HISTORY_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }, [])

  return (
    <Box>
      <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 2 }}>
        <Link
          component="button"
          underline="hover"
          color="inherit"
          onClick={() => navigate('/seller/bulk-upload')}
          sx={{ cursor: 'pointer' }}
        >
          Bulk upload
        </Link>
        <Typography color="text.primary">History</Typography>
      </Breadcrumbs>

      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <History sx={{ color: colors.primary }} />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Upload history
        </Typography>
      </Stack>

      {!lastRun ? (
        <Card sx={{ border: `1px solid ${colors.border}`, boxShadow: 'none' }}>
          <CardContent sx={{ py: 6, textAlign: 'center' }}>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              No bulk uploads recorded on this device yet.
            </Typography>
            <Button
              variant="contained"
              startIcon={<CloudUpload />}
              onClick={() => navigate('/seller/bulk-upload')}
              sx={{ bgcolor: colors.primary }}
            >
              Start bulk upload
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ border: `1px solid ${colors.border}`, boxShadow: 'none' }}>
          <CardContent>
            <Typography variant="overline" sx={{ color: colors.textSecondary }}>
              Last import on this browser
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              {lastRun.fileName || 'Bulk upload'}
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
              <Chip label={`${lastRun.success ?? 0} succeeded`} sx={{ bgcolor: colors.successBg }} />
              {(lastRun.failed ?? 0) > 0 && (
                <Chip label={`${lastRun.failed} failed`} sx={{ bgcolor: colors.errorBg }} />
              )}
              <Chip label={`${lastRun.totalRows ?? 0} rows`} variant="outlined" />
            </Stack>
            {lastRun.importedAt && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {new Date(lastRun.importedAt).toLocaleString()}
              </Typography>
            )}
            {lastRun.errors?.length > 0 && (
              <Alert severity="warning" sx={{ mb: 2, textAlign: 'left' }}>
                {lastRun.errors.slice(0, 5).map((e, i) => (
                  <Typography key={i} variant="body2">
                    {e.application}: {e.error}
                  </Typography>
                ))}
              </Alert>
            )}
            <Button variant="outlined" onClick={() => navigate('/seller/bulk-upload')}>
              New upload
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default BulkUploadHistory
