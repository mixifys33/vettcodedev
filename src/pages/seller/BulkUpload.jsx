import { useState, useCallback, useMemo } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  IconButton,
  Tooltip,
  Breadcrumbs,
  Link,
} from '@mui/material'
import {
  CloudUpload,
  Download,
  CheckCircle,
  ErrorOutline,
  NavigateNext,
  InsertDriveFile,
  Close,
  PlayArrow,
  Refresh,
  History,
  TableChart,
} from '@mui/icons-material'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import useAuthStore from '../../store/authStore'
import { colors } from '../../theme/tokens'
import {
  BULK_APPLICATION_FIELDS,
  BULK_BATCH_SIZE,
  BULK_UPLOAD_HISTORY_KEY,
  prepareApplicationsForApi,
  validateApplicationRow,
} from '../../utils/bulkUpload'

const STEPS = ['upload', 'review', 'importing', 'complete']
const STEP_LABELS = ['Upload file', 'Review data', 'Import', 'Done']

const ACCEPTED_TYPES = {
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-excel': ['.xls'],
  'text/csv': ['.csv'],
}

const StepIndicator = ({ activeIndex }) => (
  <Stack direction="row" alignItems="center" spacing={0} sx={{ mb: 4, flexWrap: 'wrap', gap: 1 }}>
    {STEP_LABELS.map((label, index) => {
      const done = index < activeIndex
      const active = index === activeIndex
      return (
        <Stack key={label} direction="row" alignItems="center" spacing={1}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: 14,
              bgcolor: done ? colors.success : active ? colors.primary : colors.slate200,
              color: done || active ? '#fff' : colors.slate500,
            }}
          >
            {done ? <CheckCircle sx={{ fontSize: 18 }} /> : index + 1}
          </Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: active ? 600 : 500,
              color: active ? colors.textPrimary : colors.textSecondary,
              mr: 1,
            }}
          >
            {label}
          </Typography>
          {index < STEP_LABELS.length - 1 && (
            <Box sx={{ width: 32, height: 2, bgcolor: done ? colors.success : colors.slate200, mx: 0.5 }} />
          )}
        </Stack>
      )
    })}
  </Stack>
)

const BulkUpload = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const sellerId = user?.id || user?._id

  const [step, setStep] = useState('upload')
  const [file, setFile] = useState(null)
  const [parsedRows, setParsedRows] = useState([])
  const [fileHeaders, setFileHeaders] = useState([])
  const [parsing, setParsing] = useState(false)
  const [downloading, setDownloading] = useState(null)
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [currentBatch, setCurrentBatch] = useState(0)
  const [totalBatches, setTotalBatches] = useState(0)
  const [results, setResults] = useState({ success: 0, failed: 0, errors: [], created: [] })

  const stepIndex = STEPS.indexOf(step)

  const rowValidations = useMemo(
    () => parsedRows.map((row, i) => validateApplicationRow(row, i)),
    [parsedRows]
  )

  const validCount = rowValidations.filter((v) => v.valid).length
  const invalidCount = rowValidations.length - validCount

  const downloadTemplate = async (type) => {
    if (!sellerId && type === 'existing') {
      toast.error('Sign in to download your applications template')
      return
    }
    try {
      setDownloading(type)
      const query = type === 'existing' && sellerId ? `?sellerId=${sellerId}` : ''
      const res = await api.get(`/applications/bulk-upload/template/${type}${query}`, {
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.download = `applications_${type}_template.xlsx`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast.success(type === 'blank' ? 'Blank template downloaded' : 'Your applications exported to template')
    } catch {
      toast.error('Failed to download template')
    } finally {
      setDownloading(null)
    }
  }

  const parseFile = async (selectedFile) => {
    if (!selectedFile) return
    if (selectedFile.size > 50 * 1024 * 1024) {
      toast.error('File is too large. Maximum size is 50MB.')
      return
    }

    setParsing(true)
    setFile(selectedFile)
    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const res = await api.post('/applications/bulk-upload/parse', formData)
      const { data, headers, totalRows } = res.data

      if (!data?.length) {
        toast.error('No application rows found. Use the template and fill at least one row.')
        setFile(null)
        return
      }

      setParsedRows(data)
      setFileHeaders(headers || [])
      toast.success(`Parsed ${totalRows} application${totalRows === 1 ? '' : 's'}`)
      setStep('review')
    } catch {
      setFile(null)
    } finally {
      setParsing(false)
    }
  }

  const onDrop = useCallback((accepted) => {
    if (accepted[0]) parseFile(accepted[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    disabled: parsing,
  })

  const resetFlow = () => {
    setStep('upload')
    setFile(null)
    setParsedRows([])
    setFileHeaders([])
    setImportProgress(0)
    setCurrentBatch(0)
    setTotalBatches(0)
    setResults({ success: 0, failed: 0, errors: [], created: [] })
  }

  const runImport = async () => {
    if (!sellerId) {
      toast.error('Seller account required')
      return
    }
    if (invalidCount > 0) {
      toast.error(`Fix ${invalidCount} invalid row${invalidCount === 1 ? '' : 's'} before importing`)
      return
    }

    const applications = prepareApplicationsForApi(parsedRows)
    const batches = []
    for (let i = 0; i < applications.length; i += BULK_BATCH_SIZE) {
      batches.push(applications.slice(i, i + BULK_BATCH_SIZE))
    }

    setStep('importing')
    setImporting(true)
    setTotalBatches(batches.length)
    setImportProgress(0)
    setCurrentBatch(0)

    let totalSuccess = 0
    let totalFailed = 0
    const allErrors = []
    const allCreated = []

    try {
      for (let i = 0; i < batches.length; i++) {
        setCurrentBatch(i + 1)
        const res = await api.post('/applications/bulk-upload/process', {
          applications: batches[i],
          sellerId,
          batchNumber: i + 1,
          totalBatches: batches.length,
        })
        const batch = res.data?.results || {}
        totalSuccess += batch.success || 0
        totalFailed += batch.failed || 0
        if (batch.errors?.length) allErrors.push(...batch.errors)
        if (batch.created?.length) allCreated.push(...batch.created)
        setImportProgress(Math.round(((i + 1) / batches.length) * 100))
      }

      const summary = {
        success: totalSuccess,
        failed: totalFailed,
        errors: allErrors,
        created: allCreated,
        fileName: file?.name,
        importedAt: new Date().toISOString(),
        totalRows: applications.length,
      }
      setResults(summary)
      localStorage.setItem(BULK_UPLOAD_HISTORY_KEY, JSON.stringify(summary))

      if (totalFailed === 0) {
        toast.success(`Imported ${totalSuccess} application${totalSuccess === 1 ? '' : 's'}`)
      } else {
        toast.error(`Imported ${totalSuccess}, ${totalFailed} failed`)
      }
      setStep('complete')
    } catch {
      setStep('review')
    } finally {
      setImporting(false)
    }
  }

  const previewColumns = BULK_APPLICATION_FIELDS.filter((f) =>
    ['appName', 'shortDescription', 'price', 'currency', 'appCategory'].includes(f.key)
  )

  return (
    <Box>
      <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 2 }}>
        <Link
          component="button"
          underline="hover"
          color="inherit"
          onClick={() => navigate('/seller/dashboard')}
          sx={{ cursor: 'pointer' }}
        >
          Dashboard
        </Link>
        <Typography color="text.primary">Bulk upload</Typography>
      </Breadcrumbs>

      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 0.5 }}>
            Bulk upload applications
          </Typography>
          <Typography variant="body2" sx={{ color: colors.textSecondary, maxWidth: 560 }}>
            Import many apps at once from Excel or CSV. Download a template, fill your rows, then upload to
            review and submit for verification.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<History />}
          onClick={() => navigate('/seller/bulk-history')}
          sx={{ borderColor: colors.border, color: colors.textSecondary, flexShrink: 0 }}
        >
          History
        </Button>
      </Stack>

      <StepIndicator activeIndex={stepIndex} />

      {step === 'upload' && (
        <Stack spacing={3}>
          <Card sx={{ border: `1px solid ${colors.border}`, boxShadow: 'none' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <TableChart sx={{ color: colors.primary }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  1. Get a template
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>
                Required columns: Application Name, Short Description, Price, and App Category. Currency defaults
                to USD.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  disabled={!!downloading}
                  onClick={() => downloadTemplate('blank')}
                  sx={{ borderColor: colors.primary, color: colors.primary }}
                >
                  {downloading === 'blank' ? 'Downloading…' : 'Blank template'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  disabled={!!downloading}
                  onClick={() => downloadTemplate('existing')}
                  sx={{ borderColor: colors.border }}
                >
                  {downloading === 'existing' ? 'Downloading…' : 'Export my applications'}
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ border: `1px solid ${colors.border}`, boxShadow: 'none' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <CloudUpload sx={{ color: colors.primary }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  2. Upload your file
                </Typography>
              </Stack>

              <Box
                {...getRootProps()}
                sx={{
                  border: `2px dashed ${isDragActive ? colors.primary : colors.border}`,
                  borderRadius: 2,
                  p: 5,
                  textAlign: 'center',
                  cursor: parsing ? 'wait' : 'pointer',
                  bgcolor: isDragActive ? colors.primaryBg : colors.slate50,
                  transition: 'border-color 0.2s, background 0.2s',
                }}
              >
                <input {...getInputProps()} />
                {parsing ? (
                  <Stack alignItems="center" spacing={2}>
                    <LinearProgress sx={{ width: '100%', maxWidth: 320 }} />
                    <Typography color="text.secondary">Parsing {file?.name}…</Typography>
                  </Stack>
                ) : (
                  <>
                    <CloudUpload sx={{ fontSize: 48, color: colors.slate400, mb: 1 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {isDragActive ? 'Drop file here' : 'Drag & drop or click to browse'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      .xlsx, .xls, or .csv — max 50MB
                    </Typography>
                  </>
                )}
              </Box>

              {file && !parsing && (
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
                  <InsertDriveFile sx={{ color: colors.primary }} />
                  <Typography variant="body2">{file.name}</Typography>
                  <IconButton size="small" onClick={() => setFile(null)} aria-label="Remove file">
                    <Close fontSize="small" />
                  </IconButton>
                </Stack>
              )}
            </CardContent>
          </Card>
        </Stack>
      )}

      {step === 'review' && (
        <Stack spacing={3}>
          <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center">
            <Chip
              icon={<InsertDriveFile />}
              label={file?.name || 'Uploaded file'}
              variant="outlined"
            />
            <Chip label={`${parsedRows.length} rows`} color="primary" variant="outlined" />
            <Chip label={`${validCount} valid`} sx={{ bgcolor: colors.successBg, color: colors.successText }} />
            {invalidCount > 0 && (
              <Chip
                icon={<ErrorOutline />}
                label={`${invalidCount} need fixes`}
                sx={{ bgcolor: colors.errorBg, color: colors.errorText }}
              />
            )}
          </Stack>

          {invalidCount > 0 && (
            <Alert severity="warning">
              Rows with missing required fields or invalid categories cannot be imported. Edit your spreadsheet
              and re-upload, or remove invalid rows.
            </Alert>
          )}

          {fileHeaders.length > 0 && (
            <Typography variant="caption" sx={{ color: colors.textSecondary }}>
              Detected columns: {fileHeaders.join(', ')}
            </Typography>
          )}

          <TableContainer component={Paper} sx={{ border: `1px solid ${colors.border}`, boxShadow: 'none' }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, bgcolor: colors.slate50 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: colors.slate50 }}>Status</TableCell>
                  {previewColumns.map((col) => (
                    <TableCell key={col.key} sx={{ fontWeight: 600, bgcolor: colors.slate50 }}>
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {parsedRows.map((row, index) => {
                  const validation = rowValidations[index]
                  return (
                    <TableRow
                      key={index}
                      sx={{
                        bgcolor: validation.valid ? 'inherit' : colors.errorBg,
                        '&:last-child td': { borderBottom: 0 },
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {validation.valid ? (
                          <Tooltip title="Ready to import">
                            <CheckCircle sx={{ color: colors.success, fontSize: 20 }} />
                          </Tooltip>
                        ) : (
                          <Tooltip title={validation.issues.join(' · ')}>
                            <ErrorOutline sx={{ color: colors.error, fontSize: 20 }} />
                          </Tooltip>
                        )}
                      </TableCell>
                      {previewColumns.map((col) => (
                        <TableCell key={col.key} sx={{ maxWidth: 200 }}>
                          <Typography variant="body2" noWrap title={String(row[col.key] ?? '')}>
                            {row[col.key] ?? '—'}
                          </Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={resetFlow} startIcon={<Refresh />}>
              Start over
            </Button>
            <Button
              variant="contained"
              startIcon={<PlayArrow />}
              disabled={validCount === 0 || importing}
              onClick={runImport}
              sx={{ bgcolor: colors.primary, '&:hover': { bgcolor: colors.primaryDark } }}
            >
              Import {validCount} application{validCount === 1 ? '' : 's'}
            </Button>
          </Stack>
        </Stack>
      )}

      {step === 'importing' && (
        <Card sx={{ border: `1px solid ${colors.border}`, boxShadow: 'none', p: 4 }}>
          <Stack spacing={3} alignItems="center" sx={{ maxWidth: 480, mx: 'auto' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Importing applications…
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Batch {currentBatch} of {totalBatches} · Do not close this page
            </Typography>
            <LinearProgress variant="determinate" value={importProgress} sx={{ width: '100%' }} />
            <Typography variant="body2" color="text.secondary">
              {importProgress}% complete
            </Typography>
          </Stack>
        </Card>
      )}

      {step === 'complete' && (
        <Card sx={{ border: `1px solid ${colors.border}`, boxShadow: 'none' }}>
          <CardContent sx={{ textAlign: 'center', py: 5 }}>
            <CheckCircle sx={{ fontSize: 64, color: colors.success, mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              Import complete
            </Typography>
            <Typography variant="body1" sx={{ color: colors.textSecondary, mb: 3 }}>
              {results.success} created successfully
              {results.failed > 0 ? ` · ${results.failed} failed` : ''}
            </Typography>

            {results.errors?.length > 0 && (
              <Alert severity="error" sx={{ textAlign: 'left', mb: 3, maxWidth: 560, mx: 'auto' }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Errors
                </Typography>
                {results.errors.slice(0, 8).map((err, i) => (
                  <Typography key={i} variant="body2">
                    {err.application}: {err.error}
                  </Typography>
                ))}
                {results.errors.length > 8 && (
                  <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                    +{results.errors.length - 8} more
                  </Typography>
                )}
              </Alert>
            )}

            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
              <Button variant="outlined" onClick={resetFlow} startIcon={<Refresh />}>
                Upload another file
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/seller/applications')}
                sx={{ bgcolor: colors.primary }}
              >
                View applications
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default BulkUpload
