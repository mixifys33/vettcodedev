import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { st } from '../../components/settings/settingsTheme'
import { PageHeader, Panel, PanelDivider, StatusDot } from '../../components/settings/SettingsPage'

const Row = ({ title, hint, status, ok, onClick }) => (
  <Box
    component="button"
    type="button"
    onClick={onClick}
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      textAlign: 'left',
      border: 'none',
      bgcolor: 'transparent',
      cursor: 'pointer',
      py: 2,
      px: { xs: 2, sm: 2.5 },
      fontFamily: st.fontSans,
      transition: 'background 0.12s',
      '&:hover': { bgcolor: st.panelMuted },
    }}
  >
    <Box>
      <Typography sx={{ fontSize: '15px', fontWeight: 600, color: st.ink }}>{title}</Typography>
      <Typography sx={{ fontSize: '13px', color: st.inkSecondary, mt: 0.35 }}>{hint}</Typography>
    </Box>
    <StatusDot ok={ok} label={status} />
  </Box>
)

const SellerSettings = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const rows = [
    {
      title: 'Shop',
      hint: 'Name, branding, and business details',
      ok: Boolean(user?.shop?.isSetup),
      status: user?.shop?.isSetup ? 'ready' : 'incomplete',
      path: '/seller/settings/shop',
    },
    {
      title: 'Profile',
      hint: 'Name, email, phone',
      ok: Boolean(user?.name && user?.email),
      status: user?.name && user?.email ? 'ready' : 'incomplete',
      path: '/seller/settings/profile',
    },
    {
      title: 'Payouts',
      hint: 'Where we send your earnings',
      ok: Boolean(user?.paymentSettings?.isSetup),
      status: user?.paymentSettings?.isSetup ? 'ready' : 'incomplete',
      path: '/seller/settings/payment',
    },
    {
      title: 'Password',
      hint: 'Sign-in credentials',
      ok: true,
      status: 'ready',
      path: '/seller/settings/password',
    },
  ]

  return (
    <>
      <PageHeader
        title="Overview"
        description="Everything that defines your seller identity on VettCode. Incomplete items may limit publishing or payouts."
      />

      <Panel noPadding>
        {rows.map((row, i) => (
          <Box key={row.path}>
            {i > 0 && <PanelDivider />}
            <Row {...row} onClick={() => navigate(row.path)} />
          </Box>
        ))}
      </Panel>

      <Typography
        sx={{
          mt: 2.5,
          fontSize: '12px',
          color: st.inkMuted,
          fontFamily: st.fontMono,
          lineHeight: 1.6,
        }}
      >
        seller / {user?.email || '—'}
      </Typography>
    </>
  )
}

export default SellerSettings
