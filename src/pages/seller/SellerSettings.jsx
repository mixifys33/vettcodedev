import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material'
import { Store, Person, Payment, Lock } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const SellerSettings = () => {
  const navigate = useNavigate()

  const settingsCards = [
    {
      title: 'Shop Settings',
      description: 'Manage your shop information and branding',
      icon: <Store sx={{ fontSize: 40 }} />,
      path: '/seller/settings/shop',
      color: '#6366f1',
    },
    {
      title: 'Profile Settings',
      description: 'Update your personal information',
      icon: <Person sx={{ fontSize: 40 }} />,
      path: '/seller/settings/profile',
      color: '#8b5cf6',
    },
    {
      title: 'Payment Settings',
      description: 'Configure payment and banking details',
      icon: <Payment sx={{ fontSize: 40 }} />,
      path: '/seller/settings/payment',
      color: '#10b981',
    },
    {
      title: 'Change Password',
      description: 'Update your account password',
      icon: <Lock sx={{ fontSize: 40 }} />,
      path: '/seller/settings/password',
      color: '#ef4444',
    },
  ]

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
        Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Manage your account and preferences
      </Typography>

      <Grid container spacing={3}>
        {settingsCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                },
              }}
              onClick={() => navigate(card.path)}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: 2,
                    bgcolor: `${card.color}15`,
                    color: card.color,
                    mb: 2,
                  }}
                >
                  {card.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default SellerSettings
