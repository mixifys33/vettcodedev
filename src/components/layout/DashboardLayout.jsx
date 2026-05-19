import { useState, useMemo, useEffect } from 'react'
import toast from 'react-hot-toast'
import {
  Box,
  Drawer,
  List,
  Typography,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
  useMediaQuery,
  alpha,
  Fade,
  Badge,
  Divider,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard,
  Apps,
  Campaign,
  Drafts,
  CloudUpload,
  Settings,
  Logout,
  Person,
  Store,
  People,
  PendingActions,
  Inventory,
  Send,
  History,
  Close,
  Code,
  ChevronLeft,
  ChevronRight,
  Analytics,
  HelpOutline,
  Notifications,
  TrendingUp,
  PersonSearch,
  Storefront,
  BarChart,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

const drawerWidthExpanded = 280
const drawerWidthCollapsed = 70

// Menu structure with grouping and role-based permissions
const sellerMenuGroups = [
  {
    label: 'OVERVIEW',
    items: [
      { text: 'Dashboard', icon: <Dashboard />, path: '/seller/dashboard', roles: ['owner', 'manager', 'support'] },
      { text: 'Analytics', icon: <Analytics />, path: '/seller/analytics', roles: ['owner', 'manager'] },
    ],
  },
  {
    label: 'MANAGEMENT',
    items: [
      { text: 'Applications', icon: <Apps />, path: '/seller/applications', roles: ['owner', 'manager'], badge: 0 },
      { text: 'Drafts', icon: <Drafts />, path: '/seller/drafts', roles: ['owner', 'manager'] },
    ],
  },
  {
    label: 'GROWTH',
    items: [
      { text: 'Marketing', icon: <Campaign />, path: '/seller/marketing', roles: ['owner', 'manager'] },
      { text: 'Bulk Upload', icon: <CloudUpload />, path: '/seller/bulk-upload', roles: ['owner'] },
    ],
  },
  {
    label: 'ACCOUNT',
    items: [
      { text: 'Settings', icon: <Settings />, path: '/seller/settings', roles: ['owner', 'manager'] },
      { text: 'Help & Support', icon: <HelpOutline />, path: '/seller/support', roles: ['owner', 'manager', 'support'] },
    ],
  },
]

const adminMenuGroups = [
  {
    label: 'OVERVIEW',
    items: [
      { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard', roles: ['admin'] },
    ],
  },
  {
    label: 'ANALYTICS',
    items: [
      { text: 'User Analytics',    icon: <PersonSearch />, path: '/admin/analytics/users',    roles: ['admin'] },
      { text: 'Seller Analytics',  icon: <Storefront />,   path: '/admin/analytics/sellers',  roles: ['admin'] },
      { text: 'Platform Overview', icon: <BarChart />,     path: '/admin/analytics/overview', roles: ['admin'] },
    ],
  },
  {
    label: 'MANAGEMENT',
    items: [
      { text: 'Sellers',        icon: <Store />,         path: '/admin/sellers',          roles: ['admin'] },
      { text: 'Pending Sellers',icon: <PendingActions />,path: '/admin/sellers/pending',  roles: ['admin'], badge: 'pending' },
      { text: 'Users',          icon: <People />,        path: '/admin/users',            roles: ['admin'] },
      { text: 'Applications',   icon: <Inventory />,     path: '/admin/applications',     roles: ['admin'] },
    ],
  },
  {
    label: 'COMMUNICATION',
    items: [
      { text: 'Notifications', icon: <Send />,    path: '/admin/notifications',         roles: ['admin'] },
      { text: 'History',       icon: <History />, path: '/admin/notifications/history', roles: ['admin'] },
    ],
  },
  {
    label: 'ACCOUNT',
    items: [
      { text: 'Settings',      icon: <Settings />,    path: '/admin/settings', roles: ['admin'] },
      { text: 'Help & Support',icon: <HelpOutline />, path: '/admin/support',  roles: ['admin'] },
    ],
  },
]

const DashboardLayout = ({ children, userType = 'seller' }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, updateUser } = useAuthStore()

  // Mock role - replace with actual user role from your auth system
  const userRole = user?.role || 'owner' // Can be: 'owner', 'manager', 'support', 'admin'

  // Mock notification counts - replace with actual data
  const notificationCounts = {
    pending: 5, // Pending sellers (admin)
  }

  const menuGroups = userType === 'admin' ? adminMenuGroups : sellerMenuGroups

  // Kick banned/suspended sellers out of an existing session
  useEffect(() => {
    if (userType !== 'seller') return
    const sellerId = user?.id || user?._id
    if (!sellerId) return

    const verifyAccount = async () => {
      try {
        const { default: api } = await import('../../utils/api')
        const res = await api.get(`/sellers/account-status/${sellerId}`)
        if (res.data?.success && res.data.allowed === false) {
          toast.error(res.data.error || 'Your account access has been restricted.')
          logout()
          navigate('/login')
          return
        }
        if (res.data?.status && user?.status !== res.data.status) {
          updateUser({ ...user, status: res.data.status, approvalStatus: res.data.approvalStatus })
        }
      } catch {
        // ignore — network errors should not lock users out
      }
    }

    verifyAccount()
  }, [userType, user?.id, user?._id, user?.status, logout, navigate, updateUser])

  // Filter menu items based on user role
  const filteredMenuGroups = useMemo(() => {
    return menuGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.roles.includes(userRole)),
      }))
      .filter((group) => group.items.length > 0)
  }, [menuGroups, userRole])

  const drawerWidth = collapsed ? drawerWidthCollapsed : drawerWidthExpanded

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleCollapseToggle = () => {
    setCollapsed(!collapsed)
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleNavigate = (path) => {
    navigate(path)
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  // Check if current path matches or is a sub-route
  const isActiveRoute = (itemPath) => {
    if (location.pathname === itemPath) return true
    // Check if current path is a sub-route (e.g., /seller/applications/edit)
    if (location.pathname.startsWith(itemPath + '/')) return true
    return false
  }

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
          animation: 'pulse 4s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': { transform: 'scale(1)', opacity: 0.5 },
            '50%': { transform: 'scale(1.1)', opacity: 0.8 },
          },
        }}
      />

      {/* Logo & Collapse Toggle */}
      <Box
        sx={{
          p: collapsed ? 2 : 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap: 2,
          position: 'relative',
          zIndex: 1,
          transition: 'all 0.3s',
        }}
      >
        {!collapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
              }}
            >
              <Code sx={{ fontSize: 28, color: 'white' }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  lineHeight: 1.2,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                VettCode
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>
                {userType === 'admin' ? 'Admin Panel' : 'Seller Dashboard'}
              </Typography>
            </Box>
          </Box>
        )}

        {collapsed && (
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1.5,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
            }}
          >
            <Code sx={{ fontSize: 24, color: 'white' }} />
          </Box>
        )}

        {!isMobile && !collapsed && (
          <Tooltip title="Collapse sidebar" placement="right">
            <IconButton
              onClick={handleCollapseToggle}
              sx={{
                color: 'rgba(255,255,255,0.6)',
                bgcolor: 'rgba(255,255,255,0.05)',
                width: 32,
                height: 32,
                '&:hover': {
                  bgcolor: 'rgba(99, 102, 241, 0.2)',
                  color: '#6366f1',
                },
              }}
            >
              <ChevronLeft fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Expand Button (when collapsed) */}
      {!isMobile && collapsed && (
        <Box sx={{ px: 2, pb: 2, position: 'relative', zIndex: 1 }}>
          <Tooltip title="Expand sidebar" placement="right">
            <IconButton
              onClick={handleCollapseToggle}
              sx={{
                color: 'rgba(255,255,255,0.6)',
                bgcolor: 'rgba(255,255,255,0.05)',
                width: '100%',
                height: 40,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'rgba(99, 102, 241, 0.2)',
                  color: '#6366f1',
                },
              }}
            >
              <ChevronRight fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* Navigation with Groups */}
      <Box sx={{ flex: 1, py: 2, px: 2, position: 'relative', zIndex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {filteredMenuGroups.map((group, groupIndex) => (
          <Box key={group.label} sx={{ mb: 3 }}>
            {/* Group Label */}
            {!collapsed && (
              <Typography
                variant="caption"
                sx={{
                  px: 2,
                  py: 1,
                  display: 'block',
                  color: 'rgba(255,255,255,0.4)',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                {group.label}
              </Typography>
            )}

            {collapsed && groupIndex > 0 && (
              <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.08)' }} />
            )}

            {/* Group Items */}
            <List sx={{ py: 0 }}>
              {group.items.map((item) => {
                const isActive = isActiveRoute(item.path)
                const badgeCount = item.badge ? notificationCounts[item.badge] : 0

                const menuButton = (
                  <ListItemButton
                    onClick={() => handleNavigate(item.path)}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      px: collapsed ? 1.5 : 2,
                      mb: 0.5,
                      position: 'relative',
                      overflow: 'hidden',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      bgcolor: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                      border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 3,
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        opacity: isActive ? 1 : 0,
                        transition: 'opacity 0.3s',
                      },
                      '&:hover': {
                        bgcolor: isActive ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        transform: collapsed ? 'scale(1.05)' : 'translateX(4px)',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActive ? '#6366f1' : 'rgba(255,255,255,0.6)',
                        minWidth: collapsed ? 'auto' : 40,
                        justifyContent: 'center',
                        transition: 'all 0.3s',
                      }}
                    >
                      {badgeCount > 0 ? (
                        <Badge
                          badgeContent={badgeCount}
                          color="error"
                          sx={{
                            '& .MuiBadge-badge': {
                              fontSize: '0.65rem',
                              height: 16,
                              minWidth: 16,
                              padding: '0 4px',
                            },
                          }}
                        >
                          {item.icon}
                        </Badge>
                      ) : (
                        item.icon
                      )}
                    </ListItemIcon>
                    {!collapsed && (
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: '0.95rem',
                          fontWeight: isActive ? 600 : 500,
                          color: isActive ? 'white' : 'rgba(255,255,255,0.8)',
                        }}
                      />
                    )}
                  </ListItemButton>
                )

                return (
                  <ListItem key={item.text} disablePadding>
                    {collapsed ? (
                      <Tooltip title={item.text} placement="right" arrow>
                        {menuButton}
                      </Tooltip>
                    ) : (
                      menuButton
                    )}
                  </ListItem>
                )
              })}
            </List>
          </Box>
        ))}
      </Box>

      {/* User Info */}
      <Box
        sx={{
          p: 2,
          position: 'relative',
          zIndex: 1,
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Tooltip title={collapsed ? user?.name || 'User' : ''} placement="right" arrow>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: collapsed ? 0 : 2,
              p: collapsed ? 1.5 : 2,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.08)',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': {
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                transform: 'translateY(-2px)',
              },
            }}
            onClick={handleMenuOpen}
          >
            <Avatar
              sx={{
                width: collapsed ? 36 : 44,
                height: collapsed ? 36 : 44,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                fontWeight: 700,
                fontSize: collapsed ? '0.9rem' : '1.1rem',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
              }}
            >
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </Avatar>
            {!collapsed && (
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: 'white',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user?.name || 'User'}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255,255,255,0.6)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'block',
                  }}
                >
                  {user?.email || ''}
                </Typography>
              </Box>
            )}
          </Box>
        </Tooltip>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0a0e27' }}>
      {/* Mobile Header */}
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1200,
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Code sx={{ fontSize: 20, color: 'white' }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                VettCode
              </Typography>
            </Box>
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.05)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              {mobileOpen ? <Close /> : <MenuIcon />}
            </IconButton>
          </Box>
        </Box>
      )}

      {/* Drawer */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidthExpanded,
              border: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              borderRight: '1px solid rgba(255,255,255,0.08)',
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: '#0a0e27',
          pt: { xs: 8, md: 0 },
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {children}
      </Box>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 220,
            borderRadius: 2,
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose()
            navigate(userType === 'admin' ? '/admin/dashboard' : '/seller/settings/profile')
          }}
          sx={{
            color: 'white',
            py: 1.5,
            px: 2,
            '&:hover': {
              bgcolor: 'rgba(99, 102, 241, 0.15)',
            },
          }}
        >
          <ListItemIcon sx={{ color: '#6366f1' }}>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose()
            navigate(userType === 'admin' ? '/admin/settings' : '/seller/settings')
          }}
          sx={{
            color: 'white',
            py: 1.5,
            px: 2,
            '&:hover': {
              bgcolor: 'rgba(99, 102, 241, 0.15)',
            },
          }}
        >
          <ListItemIcon sx={{ color: '#6366f1' }}>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <Box sx={{ my: 1, borderTop: '1px solid rgba(255,255,255,0.08)' }} />
        <MenuItem
          onClick={() => {
            handleMenuClose()
            handleLogout()
          }}
          sx={{
            color: '#ef4444',
            py: 1.5,
            px: 2,
            '&:hover': {
              bgcolor: 'rgba(239, 68, 68, 0.15)',
            },
          }}
        >
          <ListItemIcon sx={{ color: '#ef4444' }}>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default DashboardLayout
