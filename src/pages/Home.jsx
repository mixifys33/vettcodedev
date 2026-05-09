import { useState, useEffect } from 'react'
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
  Chip,
  Fade,
  Grow,
  Slide,
  Zoom,
  keyframes,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Close,
  TrendingUp,
  Security,
  CloudUpload,
  Campaign,
  Analytics,
  CheckCircle,
  ArrowForward,
  Store,
  AttachMoney,
  People,
  Inventory,
  Code,
  Rocket,
  AutoAwesome,
  Bolt,
  Speed,
  Verified,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

// Animated code snippets for background
const codeSnippets = [
  'const sellApp = () => { return revenue; }',
  'function uploadProduct() { ... }',
  'export default Marketplace;',
  'import { success } from "vettcode";',
  'class Seller extends Platform { }',
  'async function getPayment() { }',
  'const analytics = await fetch();',
  'return <Dashboard />;',
  'npm install @vettcode/sdk',
  'git push origin main',
  'const profit = sales * 0.95;',
  'await deploy("production");',
]

// Keyframe animations
const float = keyframes`
  0%, 100% { transform: translateY(0px) translateX(0px); }
  25% { transform: translateY(-20px) translateX(10px); }
  50% { transform: translateY(-40px) translateX(-10px); }
  75% { transform: translateY(-20px) translateX(10px); }
`

const codeScroll = keyframes`
  0% { transform: translateY(-100%); opacity: 0; }
  10% { opacity: 0.6; }
  90% { opacity: 0.6; }
  100% { transform: translateY(100vh); opacity: 0; }
`

const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
`

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const Home = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
        elevation={scrollY > 50 ? 4 : 0}
        sx={{
          bgcolor: 'white',
          color: 'text.primary',
          transition: 'all 0.3s ease',
          borderBottom: scrollY > 50 ? 'none' : '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 42,
                height: 42,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #14b8a6 0%, #6366f1 100%)',
              }}
            >
              <Code sx={{ fontSize: 28, color: 'white' }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #0f766e 0%, #6366f1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.5px',
                }}
              >
                VETTCODE
              </Typography>
              <Chip
                label="Sellers"
                size="small"
                sx={{
                  height: 18,
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  bgcolor: '#fcd34d',
                  color: '#0f766e',
                  '& .MuiChip-label': { px: 1 },
                }}
              />
            </Box>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, mr: 3 }}>
              {['Features', 'Benefits', 'Pricing'].map((item) => (
                <Button
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  sx={{
                    color: 'text.primary',
                    fontWeight: 600,
                    textTransform: 'none',
                    px: 2,
                    '&:hover': {
                      bgcolor: 'rgba(20, 184, 166, 0.08)',
                      color: '#0f766e',
                    },
                  }}
                >
                  {item}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleLogin}
              sx={{
                borderColor: '#14b8a6',
                color: '#0f766e',
                fontWeight: 700,
                textTransform: 'none',
                borderWidth: 2,
                '&:hover': {
                  borderColor: '#0f766e',
                  bgcolor: 'rgba(15, 118, 110, 0.04)',
                  borderWidth: 2,
                },
              }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={handleGetStarted}
              sx={{
                background: 'linear-gradient(135deg, #14b8a6 0%, #6366f1 100%)',
                color: 'white',
                fontWeight: 700,
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(20, 184, 166, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0f766e 0%, #5b21b6 100%)',
                  boxShadow: '0 6px 20px rgba(20, 184, 166, 0.4)',
                },
              }}
            >
              Get Started
            </Button>
          </Box>

          {isMobile && (
            <IconButton
              edge="end"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ ml: 2, color: '#0f766e' }}
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
            {['Features', 'Benefits', 'Pricing'].map((item) => (
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

      {/* Hero Section - Redesigned with Code Animations */}
      <Box
        sx={{
          position: 'relative',
          background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 50%, #6366f1 100%)',
          color: 'white',
          py: { xs: 10, md: 15 },
          overflow: 'hidden',
        }}
      >
        {/* Animated Code Background */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.15,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          {codeSnippets.map((code, index) => (
            <Box
              key={index}
              sx={{
                position: 'absolute',
                left: `${(index * 15) % 100}%`,
                animation: `${codeScroll} ${12 + index * 2}s linear infinite`,
                animationDelay: `${index * 1.5}s`,
                fontFamily: 'monospace',
                fontSize: { xs: '0.75rem', md: '0.9rem' },
                whiteSpace: 'nowrap',
                color: 'white',
                fontWeight: 600,
              }}
            >
              {code}
            </Box>
          ))}
        </Box>

        {/* Floating Geometric Shapes */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          {[...Array(6)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                width: { xs: 60, md: 100 },
                height: { xs: 60, md: 100 },
                borderRadius: i % 2 === 0 ? '50%' : '20%',
                background: `rgba(255, 255, 255, ${0.05 + i * 0.02})`,
                top: `${10 + i * 15}%`,
                left: `${5 + i * 15}%`,
                animation: `${float} ${6 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </Box>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={800}>
                <Box>
                  <Chip
                    icon={<Bolt sx={{ fontSize: 18 }} />}
                    label="Trusted by 10,000+ Sellers"
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      mb: 3,
                      fontWeight: 700,
                    }}
                  />
                  <Typography
                    variant="h1"
                    sx={{
                      fontWeight: 900,
                      mb: 3,
                      fontSize: { xs: '2.5rem', md: '4rem' },
                      lineHeight: 1.1,
                      background: 'linear-gradient(135deg, #ffffff 0%, #fcd34d 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Turn Your Code Into{' '}
                    <Box component="span" sx={{ display: 'block', color: '#fcd34d' }}>
                      Revenue
                    </Box>
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 5,
                      opacity: 0.95,
                      lineHeight: 1.6,
                      fontWeight: 500,
                      fontSize: { xs: '1.1rem', md: '1.3rem' },
                    }}
                  >
                    Join VETTCODE's marketplace and sell your applications to thousands of developers
                    and businesses worldwide. Start earning today.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 5 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleGetStarted}
                      endIcon={<Rocket />}
                      sx={{
                        bgcolor: '#fcd34d',
                        color: '#0f766e',
                        px: 5,
                        py: 2,
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        borderRadius: 3,
                        textTransform: 'none',
                        boxShadow: '0 8px 32px rgba(252, 211, 77, 0.4)',
                        '&:hover': {
                          bgcolor: '#f59e0b',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 40px rgba(252, 211, 77, 0.5)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Start Selling Free
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={handleLogin}
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        px: 5,
                        py: 2,
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        borderRadius: 3,
                        borderWidth: 2,
                        textTransform: 'none',
                        '&:hover': {
                          borderColor: '#fcd34d',
                          bgcolor: 'rgba(252, 211, 77, 0.1)',
                          borderWidth: 2,
                        },
                      }}
                    >
                      Sign In
                    </Button>
                  </Box>
                  <Grid container spacing={3}>
                    {[
                      { icon: <CheckCircle />, text: 'Zero Setup Fees' },
                      { icon: <CheckCircle />, text: 'Instant Payouts' },
                      { icon: <CheckCircle />, text: '24/7 Support' },
                    ].map((item, index) => (
                      <Grid item xs={12} sm={4} key={index}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box
                            sx={{
                              color: '#fcd34d',
                              display: 'flex',
                              animation: `${pulse} 2s ease-in-out infinite`,
                              animationDelay: `${index * 0.3}s`,
                            }}
                          >
                            {item.icon}
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {item.text}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Zoom in timeout={1000}>
                <Box
                  sx={{
                    position: 'relative',
                    height: { xs: 350, md: 500 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Glassmorphism Card */}
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 6,
                      backdropFilter: 'blur(20px)',
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      p: 4,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Shimmer Effect */}
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        backgroundSize: '200% 100%',
                        animation: `${shimmer} 3s infinite`,
                      }}
                    />

                    {/* Icon Grid */}
                    <Grid container spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
                      {[
                        { icon: <Code sx={{ fontSize: 50 }} />, label: 'Upload' },
                        { icon: <Analytics sx={{ fontSize: 50 }} />, label: 'Track' },
                        { icon: <AttachMoney sx={{ fontSize: 50 }} />, label: 'Earn' },
                        { icon: <TrendingUp sx={{ fontSize: 50 }} />, label: 'Grow' },
                      ].map((item, index) => (
                        <Grid item xs={6} key={index}>
                          <Box
                            sx={{
                              textAlign: 'center',
                              animation: `${float} ${4 + index}s ease-in-out infinite`,
                              animationDelay: `${index * 0.2}s`,
                            }}
                          >
                            <Box
                              sx={{
                                display: 'inline-flex',
                                p: 3,
                                borderRadius: 4,
                                bgcolor: 'rgba(252, 211, 77, 0.2)',
                                color: '#fcd34d',
                                mb: 2,
                                border: '2px solid rgba(252, 211, 77, 0.3)',
                              }}
                            >
                              {item.icon}
                            </Box>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: 700, color: 'white' }}
                            >
                              {item.label}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Box>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section - Animated */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Grow in timeout={800 + index * 200}>
                <Card
                  sx={{
                    textAlign: 'center',
                    py: 4,
                    px: 2,
                    background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)',
                    border: '2px solid transparent',
                    backgroundClip: 'padding-box',
                    position: 'relative',
                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.02)',
                      boxShadow: '0 20px 40px rgba(20, 184, 166, 0.2)',
                      '&::before': {
                        opacity: 1,
                      },
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 'inherit',
                      padding: '2px',
                      background: 'linear-gradient(135deg, #14b8a6, #6366f1)',
                      WebkitMask:
                        'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                      opacity: 0,
                      transition: 'opacity 0.4s',
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 2.5,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #14b8a6 0%, #6366f1 100%)',
                        color: 'white',
                        mb: 2,
                        animation: `${pulse} 3s ease-in-out infinite`,
                        animationDelay: `${index * 0.3}s`,
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 900,
                        background: 'linear-gradient(135deg, #0f766e 0%, #6366f1 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        mb: 1,
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section - Redesigned */}
      <Box id="features" sx={{ bgcolor: '#f8fafc', py: 12 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Chip
              icon={<AutoAwesome sx={{ fontSize: 18 }} />}
              label="POWERFUL FEATURES"
              sx={{
                bgcolor: 'rgba(20, 184, 166, 0.1)',
                color: '#0f766e',
                fontWeight: 800,
                mb: 3,
                px: 2,
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                mb: 2,
                background: 'linear-gradient(135deg, #0f766e 0%, #6366f1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Everything You Need to Succeed
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Powerful tools designed specifically for application sellers
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Slide direction="up" in timeout={600 + index * 150}>
                  <Card
                    sx={{
                      height: '100%',
                      p: 4,
                      background: 'white',
                      border: '2px solid transparent',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      '&:hover': {
                        transform: 'translateY(-12px) scale(1.02)',
                        boxShadow: '0 20px 50px rgba(99, 102, 241, 0.15)',
                        '&::before': {
                          opacity: 1,
                        },
                        '& .feature-icon': {
                          transform: 'scale(1.1) rotate(5deg)',
                        },
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 'inherit',
                        padding: '2px',
                        background: 'linear-gradient(135deg, #14b8a6, #6366f1)',
                        WebkitMask:
                          'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                        opacity: 0,
                        transition: 'opacity 0.4s',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 0 }}>
                      <Box
                        className="feature-icon"
                        sx={{
                          display: 'inline-flex',
                          p: 2.5,
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, #14b8a6 0%, #6366f1 100%)',
                          color: 'white',
                          mb: 3,
                          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: '#0f766e' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Slide>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Container id="benefits" maxWidth="lg" sx={{ py: 12 }}>
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6}>
            <Fade in timeout={1000}>
              <Box>
                <Chip
                  icon={<Verified sx={{ fontSize: 18 }} />}
                  label="WHY VETTCODE"
                  sx={{
                    bgcolor: 'rgba(99, 102, 241, 0.1)',
                    color: '#6366f1',
                    fontWeight: 800,
                    mb: 3,
                    px: 2,
                  }}
                />
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    mb: 3,
                    background: 'linear-gradient(135deg, #0f766e 0%, #6366f1 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Why Sell on VETTCODE?
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 5 }}>
                  Join thousands of successful sellers who trust VETTCODE to grow their business
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {benefits.map((benefit, index) => (
                    <Slide direction="right" in timeout={800 + index * 100} key={index}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #14b8a6 0%, #6366f1 100%)',
                            flexShrink: 0,
                          }}
                        >
                          <CheckCircle sx={{ color: 'white', fontSize: 20 }} />
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '1.05rem' }}>
                          {benefit}
                        </Typography>
                      </Box>
                    </Slide>
                  ))}
                </Box>
              </Box>
            </Fade>
          </Grid>
          <Grid item xs={12} md={6}>
            <Zoom in timeout={1200}>
              <Box
                sx={{
                  height: 500,
                  background: 'linear-gradient(135deg, #14b8a6 0%, #6366f1 100%)',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Animated Background Pattern */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.1,
                  }}
                >
                  {[...Array(20)].map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        position: 'absolute',
                        width: 2,
                        height: 2,
                        bgcolor: 'white',
                        borderRadius: '50%',
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animation: `${pulse} ${2 + Math.random() * 3}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 2}s`,
                      }}
                    />
                  ))}
                </Box>
                <TrendingUp sx={{ fontSize: 180, color: 'white', opacity: 0.3 }} />
              </Box>
            </Zoom>
          </Grid>
        </Grid>
      </Container>

      {/* Pricing Section */}
      <Box id="pricing" sx={{ bgcolor: '#f8fafc', py: 12 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Chip
              icon={<AttachMoney sx={{ fontSize: 18 }} />}
              label="PRICING PLANS"
              sx={{
                bgcolor: 'rgba(252, 211, 77, 0.2)',
                color: '#d97706',
                fontWeight: 800,
                mb: 3,
                px: 2,
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                mb: 2,
                background: 'linear-gradient(135deg, #0f766e 0%, #6366f1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Simple, Transparent Pricing
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Choose the plan that fits your needs
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {pricingPlans.map((plan, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Grow in timeout={800 + index * 200}>
                  <Card
                    sx={{
                      height: '100%',
                      position: 'relative',
                      border: plan.highlighted ? '3px solid' : '2px solid',
                      borderColor: plan.highlighted ? '#6366f1' : 'rgba(0,0,0,0.08)',
                      transform: plan.highlighted ? 'scale(1.05)' : 'scale(1)',
                      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      background: plan.highlighted
                        ? 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)'
                        : 'white',
                      '&:hover': {
                        transform: plan.highlighted ? 'scale(1.08)' : 'scale(1.03)',
                        boxShadow: plan.highlighted
                          ? '0 24px 60px rgba(99, 102, 241, 0.25)'
                          : '0 12px 32px rgba(0,0,0,0.12)',
                      },
                    }}
                  >
                    {plan.highlighted && (
                      <Chip
                        label="MOST POPULAR"
                        sx={{
                          position: 'absolute',
                          top: -14,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontWeight: 900,
                          bgcolor: '#6366f1',
                          color: 'white',
                          fontSize: '0.75rem',
                          height: 28,
                        }}
                      />
                    )}
                    <CardContent sx={{ p: 5, textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: '#0f766e' }}>
                        {plan.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                        {plan.description}
                      </Typography>
                      <Typography
                        variant="h2"
                        sx={{
                          fontWeight: 900,
                          mb: 1,
                          background: 'linear-gradient(135deg, #0f766e 0%, #6366f1 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        {plan.price}
                      </Typography>
                      {plan.price !== 'Custom' && plan.price !== 'Free' && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                          per month
                        </Typography>
                      )}
                      <Button
                        fullWidth
                        variant={plan.highlighted ? 'contained' : 'outlined'}
                        size="large"
                        onClick={handleGetStarted}
                        sx={{
                          mb: 4,
                          py: 1.5,
                          fontWeight: 800,
                          textTransform: 'none',
                          fontSize: '1.05rem',
                          ...(plan.highlighted
                            ? {
                                background: 'linear-gradient(135deg, #14b8a6 0%, #6366f1 100%)',
                                color: 'white',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #0f766e 0%, #5b21b6 100%)',
                                },
                              }
                            : {
                                borderColor: '#14b8a6',
                                color: '#0f766e',
                                borderWidth: 2,
                                '&:hover': {
                                  borderColor: '#0f766e',
                                  bgcolor: 'rgba(15, 118, 110, 0.04)',
                                  borderWidth: 2,
                                },
                              }),
                        }}
                      >
                        {plan.cta}
                      </Button>
                      <Box sx={{ textAlign: 'left' }}>
                        {plan.features.map((feature, idx) => (
                          <Box
                            key={idx}
                            sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}
                          >
                            <CheckCircle
                              sx={{
                                color: plan.highlighted ? '#6366f1' : '#14b8a6',
                                fontSize: 20,
                              }}
                            />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 50%, #6366f1 100%)',
          color: 'white',
          py: 12,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated Background */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.1,
          }}
        >
          {[...Array(30)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                width: 3,
                height: 3,
                bgcolor: 'white',
                borderRadius: '50%',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `${pulse} ${2 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </Box>

        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Fade in timeout={1000}>
            <Box>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  mb: 3,
                  fontSize: { xs: '2rem', md: '3rem' },
                }}
              >
                Ready to Start Selling?
              </Typography>
              <Typography variant="h5" sx={{ mb: 5, opacity: 0.95, fontWeight: 500 }}>
                Join VETTCODE today and reach thousands of potential buyers worldwide
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={handleGetStarted}
                endIcon={<ArrowForward />}
                sx={{
                  bgcolor: '#fcd34d',
                  color: '#0f766e',
                  px: 6,
                  py: 2.5,
                  fontSize: '1.3rem',
                  fontWeight: 900,
                  borderRadius: 3,
                  textTransform: 'none',
                  boxShadow: '0 12px 40px rgba(252, 211, 77, 0.4)',
                  '&:hover': {
                    bgcolor: '#f59e0b',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 16px 50px rgba(252, 211, 77, 0.5)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Get Started for Free
              </Button>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#0f172a', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 42,
                    height: 42,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #14b8a6 0%, #6366f1 100%)',
                  }}
                >
                  <Code sx={{ fontSize: 28, color: 'white' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                  VETTCODE
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.7 }}>
                The premier marketplace for buying and selling verified, production-ready applications.
                Built by developers, trusted by founders.
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={4}>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: '#fcd34d' }}>
                    Product
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {['Features', 'Pricing', 'Benefits'].map((item) => (
                      <Button
                        key={item}
                        href={`#${item.toLowerCase()}`}
                        sx={{
                          color: 'rgba(255,255,255,0.7)',
                          justifyContent: 'flex-start',
                          p: 0,
                          textTransform: 'none',
                          fontWeight: 500,
                          '&:hover': { color: 'white' },
                        }}
                      >
                        {item}
                      </Button>
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: '#fcd34d' }}>
                    Company
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {['About', 'Blog', 'Careers'].map((item) => (
                      <Button
                        key={item}
                        sx={{
                          color: 'rgba(255,255,255,0.7)',
                          justifyContent: 'flex-start',
                          p: 0,
                          textTransform: 'none',
                          fontWeight: 500,
                          '&:hover': { color: 'white' },
                        }}
                      >
                        {item}
                      </Button>
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: '#fcd34d' }}>
                    Support
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {['Help Center', 'Contact', 'Status'].map((item) => (
                      <Button
                        key={item}
                        sx={{
                          color: 'rgba(255,255,255,0.7)',
                          justifyContent: 'flex-start',
                          p: 0,
                          textTransform: 'none',
                          fontWeight: 500,
                          '&:hover': { color: 'white' },
                        }}
                      >
                        {item}
                      </Button>
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: '#fcd34d' }}>
                    Legal
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {['Privacy', 'Terms', 'License'].map((item) => (
                      <Button
                        key={item}
                        sx={{
                          color: 'rgba(255,255,255,0.7)',
                          justifyContent: 'flex-start',
                          p: 0,
                          textTransform: 'none',
                          fontWeight: 500,
                          '&:hover': { color: 'white' },
                        }}
                      >
                        {item}
                      </Button>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box
            sx={{
              borderTop: '1px solid rgba(255,255,255,0.1)',
              mt: 8,
              pt: 6,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              © 2026 VETTCODE. All rights reserved. Built with ❤️ for developers.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default Home
