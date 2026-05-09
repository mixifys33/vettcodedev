import { useState, useEffect, useRef } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip,
  Fade,
  Grow,
  Slide,
  Zoom,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Close,
  Apps,
  TrendingUp,
  Security,
  Speed,
  CloudUpload,
  Campaign,
  Analytics,
  Support,
  CheckCircle,
  ArrowForward,
  Store,
  AttachMoney,
  People,
  Inventory,
  Code,
  Rocket,
  Star,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const features = [
    {
      icon: <Store sx={{ fontSize: 40 }} />,
      title: 'Your Digital Storefront',
      description: 'Create your professional seller profile and showcase your applications to thousands of potential buyers.',
    },
    {
      icon: <CloudUpload sx={{ fontSize: 40 }} />,
      title: 'Easy Upload & Management',
      description: 'Upload applications individually or in bulk. Manage your entire catalogue from one powerful dashboard.',
    },
    {
      icon: <Campaign sx={{ fontSize: 40 }} />,
      title: 'Marketing Tools',
      description: 'Run promotional campaigns, create discount codes, and boost your sales with built-in marketing features.',
    },
    {
      icon: <Analytics sx={{ fontSize: 40 }} />,
      title: 'Real-time Analytics',
      description: 'Track your sales, monitor performance, and make data-driven decisions with comprehensive analytics.',
    },
    {
      icon: <AttachMoney sx={{ fontSize: 40 }} />,
      title: 'Flexible Pricing',
      description: 'Set your own prices, offer free trials, and create bundle deals. You control your revenue model.',
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Secure Payments',
      description: 'Get paid securely through multiple payment methods. We handle the transactions, you focus on building.',
    },
  ]

  const stats = [
    { value: '10K+', label: 'Active Buyers', icon: <People /> },
    { value: '5K+', label: 'Applications Sold', icon: <Inventory /> },
    { value: '$2M+', label: 'Total Revenue', icon: <AttachMoney /> },
    { value: '98%', label: 'Seller Satisfaction', icon: <CheckCircle /> },
  ]

  const benefits = [
    'Zero upfront costs - only pay when you sell',
    'Reach a global audience of developers and businesses',
    'Automated delivery and distribution',
    'Comprehensive seller dashboard',
    'Marketing and promotional tools',
    'Secure payment processing',
    'Dedicated seller support',
    'Regular platform updates',
  ]

  const pricingPlans = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'Perfect for getting started',
      features: [
        'List up to 5 applications',
        'Basic analytics',
        'Standard support',
        '10% platform fee',
        'Manual payouts',
      ],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Professional',
      price: '$29/mo',
      description: 'For serious sellers',
      features: [
        'Unlimited applications',
        'Advanced analytics',
        'Priority support',
        '5% platform fee',
        'Automated payouts',
        'Marketing tools',
        'Bulk upload',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations',
      features: [
        'Everything in Professional',
        'Dedicated account manager',
        'Custom integrations',
        'Negotiable fees',
        'White-label options',
        'API access',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ]

  const handleGetStarted = () => {
    navigate('/signup')
  }

  const handleLogin = () => {
    navigate('/login')
  }

  return (
    <Box>
      {/* Navigation */}
      <AppBar
        position="sticky"
        sx={{
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <Apps sx={{ fontSize: 32, color: 'secondary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
              VettCode
            </Typography>
            <Chip label="Sellers" size="small" color="secondary" sx={{ ml: 1 }} />
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 3, mr: 3 }}>
              <Button color="inherit" href="#features">Features</Button>
              <Button color="inherit" href="#benefits">Benefits</Button>
              <Button color="inherit" href="#pricing">Pricing</Button>
              <Button color="inherit" href="#faq">FAQ</Button>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={handleLogin}>
              Login
            </Button>
            <Button variant="contained" onClick={handleGetStarted}>
              Get Started
            </Button>
          </Box>

          {isMobile && (
            <IconButton
              edge="end"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ ml: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Menu */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 250, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <IconButton onClick={() => setMobileMenuOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          <List>
            {['Features', 'Benefits', 'Pricing', 'FAQ'].map((item) => (
              <ListItem key={item} disablePadding>
                <ListItemButton
                  onClick={() => {
                    setMobileMenuOpen(false)
                    document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  <ListItemText primary={item} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0a1628 0%, #1a3a5c 50%, #0a1628 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                }}
              >
                Sell Your Applications to{' '}
                <Box component="span" sx={{ color: 'secondary.main' }}>
                  Thousands
                </Box>
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, lineHeight: 1.6 }}>
                Join VettCode's marketplace and turn your code into revenue. Reach developers and
                businesses worldwide with our powerful seller platform.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGetStarted}
                  sx={{
                    bgcolor: 'secondary.main',
                    color: 'primary.main',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': { bgcolor: 'secondary.light' },
                  }}
                  endIcon={<ArrowForward />}
                >
                  Start Selling Today
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': { borderColor: 'secondary.main', bgcolor: 'rgba(255,255,255,0.1)' },
                  }}
                  onClick={handleLogin}
                >
                  Sign In
                </Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 3, mt: 4, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ color: 'secondary.main' }} />
                  <Typography variant="body2">No setup fees</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ color: 'secondary.main' }} />
                  <Typography variant="body2">Instant payouts</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ color: 'secondary.main' }} />
                  <Typography variant="body2">24/7 support</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  height: { xs: 300, md: 400 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: 4,
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <Apps sx={{ fontSize: 120, color: 'secondary.main', opacity: 0.5 }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card
                sx={{
                  textAlign: 'center',
                  py: 3,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: '50%',
                      bgcolor: 'secondary.light',
                      color: 'primary.main',
                      mb: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box id="features" sx={{ bgcolor: 'background.default', py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              Everything You Need to Succeed
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Powerful tools designed specifically for application sellers
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'secondary.light',
                        color: 'primary.main',
                        mb: 3,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Container id="benefits" maxWidth="lg" sx={{ py: 10 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 3 }}>
              Why Sell on VettCode?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Join thousands of successful sellers who trust VettCode to grow their business
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {benefits.map((benefit, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckCircle sx={{ color: 'success.main', fontSize: 28 }} />
                  <Typography variant="body1">{benefit}</Typography>
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: 400,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUp sx={{ fontSize: 120, color: 'white', opacity: 0.5 }} />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Pricing Section */}
      <Box id="pricing" sx={{ bgcolor: 'background.default', py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              Simple, Transparent Pricing
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Choose the plan that fits your needs
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {pricingPlans.map((plan, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    position: 'relative',
                    border: plan.highlighted ? 3 : 1,
                    borderColor: plan.highlighted ? 'secondary.main' : 'divider',
                    transform: plan.highlighted ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: plan.highlighted ? 'scale(1.08)' : 'scale(1.03)',
                      boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  {plan.highlighted && (
                    <Chip
                      label="Most Popular"
                      color="secondary"
                      sx={{
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontWeight: 700,
                      }}
                    />
                  )}
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                      {plan.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {plan.description}
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                      {plan.price}
                    </Typography>
                    {plan.price !== 'Custom' && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                        per month
                      </Typography>
                    )}
                    <Button
                      fullWidth
                      variant={plan.highlighted ? 'contained' : 'outlined'}
                      size="large"
                      sx={{ mb: 3 }}
                      onClick={handleGetStarted}
                    >
                      {plan.cta}
                    </Button>
                    <Box sx={{ textAlign: 'left' }}>
                      {plan.features.map((feature, idx) => (
                        <Box
                          key={idx}
                          sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}
                        >
                          <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                          <Typography variant="body2">{feature}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 10,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 3 }}>
            Ready to Start Selling?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join VettCode today and reach thousands of potential buyers worldwide
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              fontWeight: 700,
              '&:hover': { bgcolor: 'secondary.main' },
            }}
            endIcon={<ArrowForward />}
          >
            Get Started for Free
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Apps sx={{ fontSize: 32, color: 'secondary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  VettCode
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                The premier marketplace for buying and selling quality applications.
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={4}>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                    Product
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button color="inherit" sx={{ justifyContent: 'flex-start', p: 0 }}>
                      Features
                    </Button>
                    <Button color="inherit" sx={{ justifyContent: 'flex-start', p: 0 }}>
                      Pricing
                    </Button>
                    <Button color="inherit" sx={{ justifyContent: 'flex-start', p: 0 }}>
                      FAQ
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                    Company
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button color="inherit" sx={{ justifyContent: 'flex-start', p: 0 }}>
                      About
                    </Button>
                    <Button color="inherit" sx={{ justifyContent: 'flex-start', p: 0 }}>
                      Blog
                    </Button>
                    <Button color="inherit" sx={{ justifyContent: 'flex-start', p: 0 }}>
                      Careers
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                    Support
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button color="inherit" sx={{ justifyContent: 'flex-start', p: 0 }}>
                      Help Center
                    </Button>
                    <Button color="inherit" sx={{ justifyContent: 'flex-start', p: 0 }}>
                      Contact
                    </Button>
                    <Button color="inherit" sx={{ justifyContent: 'flex-start', p: 0 }}>
                      Status
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                    Legal
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button color="inherit" sx={{ justifyContent: 'flex-start', p: 0 }}>
                      Privacy
                    </Button>
                    <Button color="inherit" sx={{ justifyContent: 'flex-start', p: 0 }}>
                      Terms
                    </Button>
                    <Button color="inherit" sx={{ justifyContent: 'flex-start', p: 0 }}>
                      License
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box sx={{ borderTop: 1, borderColor: 'rgba(255,255,255,0.1)', mt: 6, pt: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © 2026 VettCode. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default Home
