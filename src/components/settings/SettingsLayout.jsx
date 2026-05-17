import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import { st } from './settingsTheme'

const NAV = [
  { id: 'overview', label: 'Overview', path: '/seller/settings', end: true },
  { id: 'shop', label: 'Shop', path: '/seller/settings/shop' },
  { id: 'profile', label: 'Profile', path: '/seller/settings/profile' },
  { id: 'payment', label: 'Payouts', path: '/seller/settings/payment' },
  { id: 'password', label: 'Password', path: '/seller/settings/password' },
]

const NavItem = ({ item, active, onClick }) => (
  <Box
    component="button"
    type="button"
    onClick={onClick}
    sx={{
      display: 'block',
      width: '100%',
      textAlign: 'left',
      border: 'none',
      cursor: 'pointer',
      fontFamily: st.fontSans,
      fontSize: '14px',
      fontWeight: active ? 600 : 500,
      color: active ? st.ink : st.inkSecondary,
      bgcolor: active ? st.accentSoft : 'transparent',
      borderLeft: active ? `3px solid ${st.accent}` : '3px solid transparent',
      py: 1.25,
      px: 2,
      transition: 'background 0.15s, color 0.15s',
      '&:hover': {
        bgcolor: active ? st.accentSoft : st.panelMuted,
        color: st.ink,
      },
    }}
  >
    {item.label}
  </Box>
)

const SettingsLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const isActive = (item) => {
    if (item.end) return location.pathname === item.path
    return location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: st.workspace,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      {/* Secondary nav */}
      <Box
        component="nav"
        sx={{
          width: { xs: '100%', md: 200 },
          flexShrink: 0,
          bgcolor: st.panel,
          borderRight: { md: `1px solid ${st.line}` },
          borderBottom: { xs: `1px solid ${st.line}`, md: 'none' },
        }}
      >
        <Box sx={{ px: 2, pt: 2.5, pb: 1 }}>
          <Typography
            sx={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: st.inkMuted,
              fontFamily: st.fontSans,
            }}
          >
            Settings
          </Typography>
        </Box>

        {isMobile ? (
          <Box
            sx={{
              display: 'flex',
              gap: 0.5,
              px: 1.5,
              pb: 1.5,
              overflowX: 'auto',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {NAV.map((item) => {
              const active = isActive(item)
              return (
                <Box
                  key={item.id}
                  component="button"
                  type="button"
                  onClick={() => navigate(item.path)}
                  sx={{
                    flexShrink: 0,
                    border: `1px solid ${active ? st.accent : st.line}`,
                    bgcolor: active ? st.accentSoft : st.panel,
                    color: active ? st.accent : st.inkSecondary,
                    borderRadius: st.radius,
                    px: 1.5,
                    py: 0.75,
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: st.fontSans,
                  }}
                >
                  {item.label}
                </Box>
              )
            })}
          </Box>
        ) : (
          <Box sx={{ py: 0.5 }}>
            {NAV.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                active={isActive(item)}
                onClick={() => navigate(item.path)}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Page content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          p: { xs: 2, sm: 3, lg: 4 },
          maxWidth: 900,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}

export default SettingsLayout
