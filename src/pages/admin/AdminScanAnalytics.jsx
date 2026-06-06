import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Select,
  FormControl,
  InputLabel,
  LinearProgress,
  useTheme,
  alpha,
  TablePagination,
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  Assessment,
  People,
  PersonOff,
  BugReport,
  Speed,
  Code,
  CheckCircle,
  Error as ErrorIcon,
  Refresh,
  Search,
  FilterList,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const AdminScanAnalytics = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  
  // State
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState(null)
  const [scans, setScans] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState({
    authenticated: '',
    success: '',
    minScore: '',
    maxScore: '',
    search: '',
  })
  const [period, setPeriod] = useState('all')

  // Fetch summary data
  const fetchSummary = async () => {
    try {
      const response = await api.get('/scan-analytics/summary', {
        params: { period, authenticated: filters.authenticated },
        silentError: false // Allow normal error handling
      })
      if (response.data.success) {
        setSummary(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching summary:', error)
      // Don't show toast if we're being redirected
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        toast.error('Failed to load analytics summary')
      }
    }
  }

  // Fetch scans list
  const fetchScans = async () => {
    try {
      setLoading(true)
      const response = await api.get('/scan-analytics/scans', {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          ...filters,
        },
        silentError: false
      })
      if (response.data.success) {
        setScans(response.data.data.scans)
        setTotal(response.data.data.pagination.total)
      }
    } catch (error) {
      console.error('Error fetching scans:', error)
      // Don't show toast if we're being redirected
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        toast.error('Failed to load scans')
      }
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchSummary()
  }, [period, filters.authenticated])

  useEffect(() => {
    fetchScans()
  }, [page, rowsPerPage, filters])

  // Handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(0)
  }

  const handleRefresh = () => {
    fetchSummary()
    fetchScans()
  }

  // Format functions
  const formatDuration = (ms) => {
    if (ms < 1000) return `${ms}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
    return `${(ms / 60000).toFixed(1)}m`
  }

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'success'
    if (grade.startsWith('B')) return 'info'
    if (grade.startsWith('C')) return 'warning'
    return 'error'
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return theme.palette.error.main
      case 'high': return theme.palette.warning.main
      case 'medium': return theme.palette.info.main
      default: return theme.palette.grey[500]
    }
  }

  if (!summary && loading) {
    return (
      <DashboardLayout userType="admin">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userType="admin">
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1600, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
              Scan Analytics
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Monitor VettCode Engine scan activity and performance
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Period</InputLabel>
              <Select
                value={period}
                label="Period"
                onChange={(e) => setPeriod(e.target.value)}
                sx={{
                  color: 'white',
                  '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.23)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.4)' },
                }}
              >
                <MenuItem value="all">All Time</MenuItem>
                <MenuItem value="day">Today</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="year">This Year</MenuItem>
              </Select>
            </FormControl>
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.05)' }}>
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Summary Cards */}
        {summary && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Assessment sx={{ fontSize: 40, opacity: 0.8 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {summary.summary.totalScans.toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Scans</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {summary.timePeriods.today} today, {summary.timePeriods.thisWeek} this week
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <People sx={{ fontSize: 40, opacity: 0.8 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {summary.summary.authenticatedScans.toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Authenticated Users</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <PersonOff sx={{ fontSize: 16, opacity: 0.7 }} />
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      {summary.summary.unauthenticatedScans.toLocaleString()} free users
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {summary.summary.averageScore}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Average Score</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    Most common: {summary.summary.mostCommonGrade || 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <BugReport sx={{ fontSize: 40, opacity: 0.8 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {summary.summary.totalFindings.toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Findings</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {summary.summary.totalCriticalFindings} critical, {summary.summary.totalHighFindings} high
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Additional Stats */}
        {summary && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Speed /> Performance
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">Avg Scan Duration</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {summary.summary.averageScanDuration}s
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ mb: 1 }}>
                      Success Rate
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(summary.summary.successfulScans / summary.summary.totalScans) * 100}
                        sx={{ flex: 1, height: 8, borderRadius: 1, bgcolor: 'rgba(255,255,255,0.1)' }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {((summary.summary.successfulScans / summary.summary.totalScans) * 100).toFixed(1)}%
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Assessment /> Grade Distribution
                  </Typography>
                  {summary.gradeDistribution.map((item) => (
                    <Box key={item.grade} sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">Grade {item.grade}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.count}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(item.count / summary.summary.totalScans) * 100}
                        sx={{
                          height: 6,
                          borderRadius: 1,
                          bgcolor: 'rgba(255,255,255,0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: item.grade.startsWith('A') ? '#10b981' : item.grade.startsWith('B') ? '#3b82f6' : item.grade.startsWith('C') ? '#f59e0b' : '#ef4444',
                          },
                        }}
                      />
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Code /> Scan Modes
                  </Typography>
                  {summary.scanModeDistribution.map((item) => (
                    <Box key={item.mode} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{item.mode} Scan</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.count} ({((item.count / summary.summary.totalScans) * 100).toFixed(1)}%)
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(item.count / summary.summary.totalScans) * 100}
                        sx={{
                          height: 6,
                          borderRadius: 1,
                          bgcolor: 'rgba(255,255,255,0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: item.mode === 'deep' ? '#8b5cf6' : '#6366f1',
                          },
                        }}
                      />
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Filters */}
        <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white', mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>User Type</InputLabel>
                  <Select
                    value={filters.authenticated}
                    label="User Type"
                    onChange={(e) => handleFilterChange('authenticated', e.target.value)}
                    sx={{
                      color: 'white',
                      '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.23)' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.4)' },
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="true">Authenticated</MenuItem>
                    <MenuItem value="false">Free Users</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Status</InputLabel>
                  <Select
                    value={filters.success}
                    label="Status"
                    onChange={(e) => handleFilterChange('success', e.target.value)}
                    sx={{
                      color: 'white',
                      '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.23)' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.4)' },
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="true">Success</MenuItem>
                    <MenuItem value="false">Failed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Min Score"
                  type="number"
                  value={filters.minScore}
                  onChange={(e) => handleFilterChange('minScore', e.target.value)}
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.23)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Max Score"
                  type="number"
                  value={filters.maxScore}
                  onChange={(e) => handleFilterChange('maxScore', e.target.value)}
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.23)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Search project, user..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'rgba(255,255,255,0.5)' }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.23)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Scans Table */}
        <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Recent Scans</Typography>
            <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, borderColor: 'rgba(255,255,255,0.1)' }}>
                      Project
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, borderColor: 'rgba(255,255,255,0.1)' }}>
                      User
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, borderColor: 'rgba(255,255,255,0.1)' }}>
                      Score
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, borderColor: 'rgba(255,255,255,0.1)' }}>
                      Findings
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, borderColor: 'rgba(255,255,255,0.1)' }}>
                      Mode
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, borderColor: 'rgba(255,255,255,0.1)' }}>
                      Duration
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, borderColor: 'rgba(255,255,255,0.1)' }}>
                      Date
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, borderColor: 'rgba(255,255,255,0.1)' }}>
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4, borderColor: 'rgba(255,255,255,0.1)' }}>
                        <CircularProgress size={32} />
                      </TableCell>
                    </TableRow>
                  ) : scans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.1)' }}>
                        No scans found
                      </TableCell>
                    </TableRow>
                  ) : (
                    scans.map((scan) => (
                      <TableRow key={scan.scanId} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                        <TableCell sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {scan.projectName}
                          </Typography>
                          <Typography variant="caption" color="rgba(255,255,255,0.5)">
                            {scan.filesScanned} files, {scan.linesScanned.toLocaleString()} lines
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}>
                          {scan.isAuthenticated ? (
                            <>
                              <Typography variant="body2">{scan.userName || 'User'}</Typography>
                              <Typography variant="caption" color="rgba(255,255,255,0.5)">
                                {scan.userEmail}
                              </Typography>
                            </>
                          ) : (
                            <Chip label="Free User" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                          )}
                        </TableCell>
                        <TableCell sx={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
                              {scan.score}
                            </Typography>
                            <Chip
                              label={scan.grade}
                              size="small"
                              color={getGradeColor(scan.grade)}
                            />
                          </Box>
                        </TableCell>
                        <TableCell sx={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {scan.criticalFindings > 0 && (
                              <Chip
                                label={`${scan.criticalFindings} Critical`}
                                size="small"
                                sx={{ bgcolor: alpha(theme.palette.error.main, 0.2), color: theme.palette.error.light }}
                              />
                            )}
                            {scan.highFindings > 0 && (
                              <Chip
                                label={`${scan.highFindings} High`}
                                size="small"
                                sx={{ bgcolor: alpha(theme.palette.warning.main, 0.2), color: theme.palette.warning.light }}
                              />
                            )}
                            {scan.totalFindings === 0 && (
                              <Chip label="Clean" size="small" color="success" />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}>
                          <Chip
                            label={scan.scanMode}
                            size="small"
                            sx={{
                              bgcolor: scan.scanMode === 'deep' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                              color: 'white',
                              textTransform: 'capitalize',
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}>
                          {formatDuration(scan.scanDurationMs)}
                        </TableCell>
                        <TableCell sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}>
                          <Typography variant="body2">
                            {new Date(scan.createdAt).toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" color="rgba(255,255,255,0.5)">
                            {new Date(scan.createdAt).toLocaleTimeString()}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                          {scan.success ? (
                            <Chip
                              icon={<CheckCircle />}
                              label="Success"
                              size="small"
                              color="success"
                            />
                          ) : (
                            <Tooltip title={scan.errorMessage || 'Scan failed'}>
                              <Chip
                                icon={<ErrorIcon />}
                                label="Failed"
                                size="small"
                                color="error"
                              />
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={total}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[10, 20, 50, 100]}
              sx={{
                color: 'white',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                '.MuiTablePagination-select': { color: 'white' },
                '.MuiTablePagination-selectIcon': { color: 'white' },
                '.MuiTablePagination-actions button': { color: 'white' },
              }}
            />
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  )
}

export default AdminScanAnalytics
