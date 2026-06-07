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
  alpha,
  TablePagination,
  Breadcrumbs,
  Button,
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
  NavigateNext,
  Timer,
  Security,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { colors } from '../../theme/tokens'

const StatCard = ({ title, value, subtitle, icon: Icon, color, bgColor, trend }) => (
  <Card
    sx={{
      bgcolor: colors.cardBackground,
      border: `1px solid ${colors.border}`,
      borderRadius: '8px',
      boxShadow: 'none',
      height: '100%',
      transition: 'border-color 0.2s',
      '&:hover': { borderColor: colors.slate300 },
    }}
  >
    <CardContent sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="body2" sx={{ color: colors.textSecondary, fontWeight: 500 }}>
          {title}
        </Typography>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '6px',
            bgcolor: bgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
          }}
        >
          <Icon sx={{ fontSize: 18 }} />
        </Box>
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 700, color: colors.textPrimary, fontSize: '26px', mb: 0.5 }}>
        {value ?? '—'}
      </Typography>
      {subtitle && (
        <Typography variant="caption" sx={{ color: colors.textSecondary, display: 'block' }}>
          {subtitle}
        </Typography>
      )}
      {trend && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
          {trend > 0 ? (
            <TrendingUp sx={{ fontSize: 14, color: colors.success }} />
          ) : (
            <TrendingDown sx={{ fontSize: 14, color: colors.error }} />
          )}
          <Typography variant="caption" sx={{ color: trend > 0 ? colors.success : colors.error, fontWeight: 600 }}>
            {Math.abs(trend)}% vs last period
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
)

const AdminScanAnalytics = () => {
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
      case 'critical': return colors.error
      case 'high': return colors.warning
      case 'medium': return colors.info
      default: return colors.slate500
    }
  }

  const fmt = (n) => (n != null ? Number(n).toLocaleString() : '—')

  if (!summary && loading) {
    return (
      <Box sx={{ bgcolor: colors.pageBackground, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ color: colors.primary }} />
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: colors.pageBackground, minHeight: '100vh', width: '100%' }}>
        {/* Page Header */}
        <Box
          sx={{
            bgcolor: colors.cardBackground,
            borderBottom: `1px solid ${colors.border}`,
            px: 3,
            py: 2,
            mb: 3,
          }}
        >
          <Breadcrumbs
            separator={<NavigateNext fontSize="small" sx={{ color: colors.slate400 }} />}
            sx={{ mb: 1 }}
          >
            <Typography
              sx={{ color: colors.textSecondary, fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}
              onClick={() => navigate('/admin/dashboard')}
            >
              Dashboard
            </Typography>
            <Typography sx={{ color: colors.textPrimary, fontSize: '14px', fontWeight: 600 }}>
              Scan Analytics
            </Typography>
          </Breadcrumbs>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 0.5 }}>
                Scan Analytics
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                Monitor VettCode Engine scan activity, performance, and insights
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Period</InputLabel>
                <Select
                  value={period}
                  label="Period"
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <MenuItem value="all">All Time</MenuItem>
                  <MenuItem value="day">Today</MenuItem>
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                  <MenuItem value="year">This Year</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleRefresh}
                sx={{
                  textTransform: 'none',
                  borderColor: colors.border,
                  color: colors.textSecondary,
                }}
              >
                Refresh
              </Button>
            </Box>
          </Box>
        </Box>

        <Box sx={{ px: 3, pb: 4, maxWidth: 1600, mx: 'auto' }}>

          {/* Summary Cards */}
          {summary && (
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} lg={3}>
                <StatCard
                  title="Total Scans"
                  value={fmt(summary.summary.totalScans)}
                  subtitle={`${summary.timePeriods.today} today, ${summary.timePeriods.thisWeek} this week`}
                  icon={Assessment}
                  color={colors.primary}
                  bgColor={colors.primaryBg}
                />
              </Grid>

              <Grid item xs={12} sm={6} lg={3}>
                <StatCard
                  title="Authenticated Users"
                  value={fmt(summary.summary.authenticatedScans)}
                  subtitle={`${fmt(summary.summary.unauthenticatedScans)} free users`}
                  icon={People}
                  color={colors.info}
                  bgColor={colors.infoBg}
                />
              </Grid>

              <Grid item xs={12} sm={6} lg={3}>
                <StatCard
                  title="Average Score"
                  value={summary.summary.averageScore}
                  subtitle={`Most common: Grade ${summary.summary.mostCommonGrade || 'N/A'}`}
                  icon={TrendingUp}
                  color={colors.success}
                  bgColor={colors.successBg}
                />
              </Grid>

              <Grid item xs={12} sm={6} lg={3}>
                <StatCard
                  title="Total Findings"
                  value={fmt(summary.summary.totalFindings)}
                  subtitle={`${summary.summary.totalCriticalFindings} critical, ${summary.summary.totalHighFindings} high`}
                  icon={BugReport}
                  color={colors.error}
                  bgColor={colors.errorBg}
                />
              </Grid>
            </Grid>
          )}

          {/* Performance & Distribution Cards */}
          {summary && (
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
              {/* Performance Metrics */}
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    bgcolor: colors.cardBackground,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    boxShadow: 'none',
                    height: '100%',
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '6px',
                          bgcolor: alpha(colors.primary, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: colors.primary,
                        }}
                      >
                        <Speed sx={{ fontSize: 20 }} />
                      </Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.textPrimary }}>
                        Performance
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2.5 }}>
                      <Typography variant="body2" color={colors.textSecondary} sx={{ mb: 0.5 }}>
                        Average Scan Duration
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: colors.textPrimary }}>
                        {summary.summary.averageScanDuration}s
                      </Typography>
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color={colors.textSecondary}>
                          Success Rate
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: colors.textPrimary }}>
                          {((summary.summary.successfulScans / summary.summary.totalScans) * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(summary.summary.successfulScans / summary.summary.totalScans) * 100}
                        sx={{
                          height: 8,
                          borderRadius: 1,
                          bgcolor: colors.slate100,
                          '& .MuiLinearProgress-bar': {
                            bgcolor: colors.success,
                            borderRadius: 1,
                          },
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Grade Distribution */}
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    bgcolor: colors.cardBackground,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    boxShadow: 'none',
                    height: '100%',
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '6px',
                          bgcolor: alpha(colors.info, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: colors.info,
                        }}
                      >
                        <Assessment sx={{ fontSize: 20 }} />
                      </Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.textPrimary }}>
                        Grade Distribution
                      </Typography>
                    </Box>

                    {summary.gradeDistribution.slice(0, 4).map((item) => {
                      const gradeColor = item.grade.startsWith('A') ? colors.success
                        : item.grade.startsWith('B') ? colors.info
                        : item.grade.startsWith('C') ? colors.warning
                        : colors.error
                      
                      return (
                        <Box key={item.grade} sx={{ mb: 1.5, '&:last-child': { mb: 0 } }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2" color={colors.textSecondary}>
                              Grade {item.grade}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: colors.textPrimary }}>
                              {item.count} ({((item.count / summary.summary.totalScans) * 100).toFixed(0)}%)
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={(item.count / summary.summary.totalScans) * 100}
                            sx={{
                              height: 6,
                              borderRadius: 1,
                              bgcolor: colors.slate100,
                              '& .MuiLinearProgress-bar': {
                                bgcolor: gradeColor,
                                borderRadius: 1,
                              },
                            }}
                          />
                        </Box>
                      )
                    })}
                  </CardContent>
                </Card>
              </Grid>

              {/* Scan Modes */}
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    bgcolor: colors.cardBackground,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    boxShadow: 'none',
                    height: '100%',
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '6px',
                          bgcolor: 'rgba(124, 58, 237, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#7C3AED',
                        }}
                      >
                        <Security sx={{ fontSize: 20 }} />
                      </Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.textPrimary }}>
                        Scan Modes
                      </Typography>
                    </Box>

                    {summary.scanModeDistribution.map((item) => {
                      const modeColor = item.mode === 'deep' ? '#7C3AED' : colors.primary
                      
                      return (
                        <Box key={item.mode} sx={{ mb: 2.5, '&:last-child': { mb: 0 } }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: colors.textPrimary, textTransform: 'capitalize', mb: 0.25 }}>
                                {item.mode} Scan
                              </Typography>
                              <Typography variant="caption" color={colors.textSecondary}>
                                {((item.count / summary.summary.totalScans) * 100).toFixed(1)}% of all scans
                              </Typography>
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary }}>
                              {item.count}
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={(item.count / summary.summary.totalScans) * 100}
                            sx={{
                              height: 6,
                              borderRadius: 1,
                              bgcolor: colors.slate100,
                              '& .MuiLinearProgress-bar': {
                                bgcolor: modeColor,
                                borderRadius: 1,
                              },
                            }}
                          />
                        </Box>
                      )
                    })}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Filters */}
          <Card
            sx={{
              bgcolor: colors.cardBackground,
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              boxShadow: 'none',
              mb: 3,
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <FilterList sx={{ fontSize: 18, color: colors.textSecondary }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.textPrimary }}>
                  Filters
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>User Type</InputLabel>
                    <Select
                      value={filters.authenticated}
                      label="User Type"
                      onChange={(e) => handleFilterChange('authenticated', e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="true">Authenticated</MenuItem>
                      <MenuItem value="false">Free Users</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filters.success}
                      label="Status"
                      onChange={(e) => handleFilterChange('success', e.target.value)}
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
                      startAdornment: <Search sx={{ mr: 1, color: colors.textSecondary, fontSize: 20 }} />,
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Scans Table */}
          <Card
            sx={{
              bgcolor: colors.cardBackground,
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              boxShadow: 'none',
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${colors.border}` }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.textPrimary }}>
                  Recent Scans
                </Typography>
                <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                  Detailed scan history with performance metrics and findings
                </Typography>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: colors.slate50 }}>
                      <TableCell sx={{ color: colors.textSecondary, fontWeight: 600, fontSize: '13px', borderColor: colors.border }}>
                        Project
                      </TableCell>
                      <TableCell sx={{ color: colors.textSecondary, fontWeight: 600, fontSize: '13px', borderColor: colors.border }}>
                        User
                      </TableCell>
                      <TableCell sx={{ color: colors.textSecondary, fontWeight: 600, fontSize: '13px', borderColor: colors.border }}>
                        Score
                      </TableCell>
                      <TableCell sx={{ color: colors.textSecondary, fontWeight: 600, fontSize: '13px', borderColor: colors.border }}>
                        Findings
                      </TableCell>
                      <TableCell sx={{ color: colors.textSecondary, fontWeight: 600, fontSize: '13px', borderColor: colors.border }}>
                        Mode
                      </TableCell>
                      <TableCell sx={{ color: colors.textSecondary, fontWeight: 600, fontSize: '13px', borderColor: colors.border }}>
                        Duration
                      </TableCell>
                      <TableCell sx={{ color: colors.textSecondary, fontWeight: 600, fontSize: '13px', borderColor: colors.border }}>
                        Date
                      </TableCell>
                      <TableCell sx={{ color: colors.textSecondary, fontWeight: 600, fontSize: '13px', borderColor: colors.border }}>
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 4, borderColor: colors.border }}>
                          <CircularProgress size={32} sx={{ color: colors.primary }} />
                        </TableCell>
                      </TableRow>
                    ) : scans.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 4, color: colors.textSecondary, borderColor: colors.border }}>
                          No scans found
                        </TableCell>
                      </TableRow>
                    ) : (
                      scans.map((scan) => (
                        <TableRow 
                          key={scan.scanId} 
                          sx={{ 
                            '&:hover': { bgcolor: colors.slate50 },
                            transition: 'background-color 0.15s',
                          }}
                        >
                          <TableCell sx={{ borderColor: colors.border }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: colors.textPrimary, mb: 0.25 }}>
                              {scan.projectName}
                            </Typography>
                            <Typography variant="caption" color={colors.textSecondary}>
                              {scan.filesScanned} files, {scan.linesScanned.toLocaleString()} lines
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ borderColor: colors.border }}>
                            {scan.isAuthenticated ? (
                              <>
                                <Typography variant="body2" sx={{ color: colors.textPrimary, mb: 0.25 }}>
                                  {scan.userName || 'User'}
                                </Typography>
                                <Typography variant="caption" color={colors.textSecondary}>
                                  {scan.userEmail}
                                </Typography>
                              </>
                            ) : (
                              <Chip 
                                label="Free User" 
                                size="small" 
                                sx={{ 
                                  bgcolor: colors.slate100, 
                                  color: colors.textSecondary,
                                  fontWeight: 500,
                                  fontSize: '12px',
                                }} 
                              />
                            )}
                          </TableCell>
                          <TableCell sx={{ borderColor: colors.border }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary }}>
                                {scan.score}
                              </Typography>
                              <Chip
                                label={scan.grade}
                                size="small"
                                color={getGradeColor(scan.grade)}
                                sx={{ fontWeight: 600, fontSize: '11px' }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell sx={{ borderColor: colors.border }}>
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {scan.criticalFindings > 0 && (
                                <Chip
                                  label={`${scan.criticalFindings} Critical`}
                                  size="small"
                                  sx={{ 
                                    bgcolor: colors.errorBg, 
                                    color: colors.errorText,
                                    fontWeight: 600,
                                    fontSize: '11px',
                                  }}
                                />
                              )}
                              {scan.highFindings > 0 && (
                                <Chip
                                  label={`${scan.highFindings} High`}
                                  size="small"
                                  sx={{ 
                                    bgcolor: colors.warningBg, 
                                    color: colors.warningText,
                                    fontWeight: 600,
                                    fontSize: '11px',
                                  }}
                                />
                              )}
                              {scan.totalFindings === 0 && (
                                <Chip 
                                  label="Clean" 
                                  size="small" 
                                  sx={{ 
                                    bgcolor: colors.successBg, 
                                    color: colors.successText,
                                    fontWeight: 600,
                                    fontSize: '11px',
                                  }} 
                                />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ borderColor: colors.border }}>
                            <Chip
                              label={scan.scanMode}
                              size="small"
                              sx={{
                                bgcolor: scan.scanMode === 'deep' ? 'rgba(124, 58, 237, 0.08)' : colors.primaryBg,
                                color: scan.scanMode === 'deep' ? '#7C3AED' : colors.primary,
                                textTransform: 'capitalize',
                                fontWeight: 600,
                                fontSize: '11px',
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ borderColor: colors.border }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Timer sx={{ fontSize: 14, color: colors.textSecondary }} />
                              <Typography variant="body2" sx={{ color: colors.textPrimary, fontWeight: 500 }}>
                                {formatDuration(scan.scanDurationMs)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ borderColor: colors.border }}>
                            <Typography variant="body2" sx={{ color: colors.textPrimary, mb: 0.25 }}>
                              {new Date(scan.createdAt).toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption" color={colors.textSecondary}>
                              {new Date(scan.createdAt).toLocaleTimeString()}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ borderColor: colors.border }}>
                            {scan.success ? (
                              <Chip
                                icon={<CheckCircle sx={{ fontSize: 14 }} />}
                                label="Success"
                                size="small"
                                sx={{ 
                                  bgcolor: colors.successBg, 
                                  color: colors.successText,
                                  fontWeight: 600,
                                  fontSize: '11px',
                                }}
                              />
                            ) : (
                              <Tooltip title={scan.errorMessage || 'Scan failed'}>
                                <Chip
                                  icon={<ErrorIcon sx={{ fontSize: 14 }} />}
                                  label="Failed"
                                  size="small"
                                  sx={{ 
                                    bgcolor: colors.errorBg, 
                                    color: colors.errorText,
                                    fontWeight: 600,
                                    fontSize: '11px',
                                  }}
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
              
              <Box sx={{ borderTop: `1px solid ${colors.border}` }}>
                <TablePagination
                  component="div"
                  count={total}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[10, 20, 50, 100]}
                  sx={{
                    '.MuiTablePagination-toolbar': { px: 2 },
                    '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                      color: colors.textSecondary,
                      fontSize: '13px',
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
  )
}

export default AdminScanAnalytics
