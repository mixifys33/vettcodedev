import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Chip,
  useMediaQuery,
  useTheme,
  Fade,
  Grow,
  Slide,
  Zoom,
} from '@mui/material';
import {
  Code,
  Rocket,
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
  Menu as MenuIcon,
  Close,
  LocalOffer,
  Bolt,
  AutoAwesome,
  Verified,
  Star,
} from '@mui/icons-material';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Store sx={{ fontSize: 50 }} />,
      title: 'Your Digital Storefront',
      description: 'Create your professional seller profile and showcase your applications to thousands of potential buyers.',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    },
    {
      icon: <CloudUpload sx={{ fontSize: 50 }} />,
      title: 'Easy Upload & Management',
      description: 'Upload applications individually or in bulk. Manage your entire catalogue from one powerful dashboard.',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    },
    {
      icon: <Campaign sx={{ fontSize: 50 }} />,
      title: 'Marketing Tools',
      description: 'Run promotional campaigns, create discount codes, and boost your sales with built-in marketing features.',
      gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    },
    {
      icon: <Analytics sx={{ fontSize: 50 }} />,
      title: 'Real-time Analytics',
      description: 'Track your sales, monitor performance, and make data-driven decisions with comprehensive analytics.',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
    {
      icon: <AttachMoney sx={{ fontSize: 50 }} />,
      title: 'Flexible Pricing',
      description: 'Set your own prices, offer free trials, and create bundle deals. You control your revenue model.',
      gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
    },
    {
      icon: <Security sx={{ fontSize: 50 }} />,
      title: 'Secure Payments',
      description: 'Get paid securely through multiple payment methods. We handle the transactions, you focus on building.',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Active Buyers', icon: <People sx={{ fontSize: 32 }} />, color: '#3b82f6' },
    { value: '5K+', label: 'Apps Sold', icon: <Inventory sx={{ fontSize: 32 }} />, color: '#10b981' },
    { value: '$2M+', label: 'Revenue', icon: <AttachMoney sx={{ fontSize: 32 }} />, color: '#8b5cf6' },
    { value: '98%', label: 'Satisfaction', icon: <Star sx={{ fontSize: 32 }} />, color: '#f97316' },
  ];

  const benefits = [
    'Zero upfront costs - only pay when you sell',
    'Reach a global audience of developers and businesses',
    'Automated delivery and distribution',
    'Comprehensive seller dashboard',
    'Marketing and promotional tools',
    'Secure payment processing',
    'Dedicated seller support',
    'Regular platform updates',
  ];

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
      highlighted: false,
    },
    {
      name: 'Professional',
      price: '$29',
      period: '/month',
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
      highlighted: false,
    },
  ];

  return (
    <Box sx={{ bgcolor: '#0a0e27', minHeight: '100vh' }}>
      {/* Navigation */}
      <AppBar
        position="fixed"
        elevation={scrollY > 50 ? 8 : 0}
        sx={{
          bgcolor: scrollY > 50 ? 'rgba(15, 23, 42, 0.95)' : 'transparent',
          backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none',
          borderBottom: scrollY > 50 ? '1px solid rgba(139, 92, 246, 0.2)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar sx={{ py: { xs: 1, sm: 1.5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
            <Box
              sx={{
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                borderRadius: 2,
                background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(139, 92, 246, 0.5)',
              }}
            >
              <Code sx={{ fontSize: { xs: 24, sm: 28 }, color: 'white' }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '1.1rem', sm: '1.3rem' },
                  background: 'linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.5px',
                }}
              >
                VETTCODE
              </Typography>
              <Chip
                label="SELLERS"
                size="small"
                sx={{
                  height: 16,
                  fontSize: '0.6rem',
                  fontWeight: 900,
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
                    color: 'rgba(255,255,255,0.8)',
                    fontWeight: 700,
                    textTransform: 'none',
                    px: 2.5,
                    fontSize: '0.95rem',
                    '&:hover': {
                      bgcolor: 'rgba(139, 92, 246, 0.15)',
                      color: '#a78bfa',
                    },
                  }}
                >
                  {item}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/login')}
              sx={{
                borderColor: '#8b5cf6',
                color: '#a78bfa',
                fontWeight: 700,
                textTransform: 'none',
                borderWidth: 2,
                px: 3,
                '&:hover': {
                  borderColor: '#a78bfa',
                  bgcolor: 'rgba(139, 92, 246, 0.1)',
                  borderWidth: 2,
                },
              }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/signup')}
              sx={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                color: 'white',
                fontWeight: 700,
                textTransform: 'none',
                px: 3,
                boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
                  boxShadow: '0 6px 20px rgba(139, 92, 246, 0.5)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Get Started
            </Button>
          </Box>

          {isMobile && (
            <IconButton
              edge="end"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ ml: 2, color: '#a78bfa' }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: 'rgba(15, 23, 42, 0.98)',
            backdropFilter: 'blur(20px)',
            borderLeft: '1px solid rgba(139, 92, 246, 0.2)',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <IconButton onClick={() => setMobileMenuOpen(false)} sx={{ color: '#a78bfa' }}>
              <Close />
            </IconButton>
          </Box>
          <List>
            {['Features', 'Benefits', 'Pricing'].map((item) => (
              <ListItem key={item} disablePadding>
                <ListItemButton
                  onClick={() => {
                    setMobileMenuOpen(false);
                    document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'rgba(139, 92, 246, 0.15)',
                      color: '#a78bfa',
                    },
                  }}
                >
                  <ListItemText primary={item} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Box sx={{ mt: 3, px: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate('/login')}
              sx={{
                borderColor: '#8b5cf6',
                color: '#a78bfa',
                fontWeight: 700,
                textTransform: 'none',
                borderWidth: 2,
                '&:hover': {
                  borderColor: '#a78bfa',
                  bgcolor: 'rgba(139, 92, 246, 0.1)',
                  borderWidth: 2,
                },
              }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate('/signup')}
              sx={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                color: 'white',
                fontWeight: 700,
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)',
              }}
            >
              Get Started
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          pt: { xs: 12, sm: 16, md: 20 },
          pb: { xs: 8, sm: 12, md: 16 },
          overflow: 'hidden',
        }}
      >
        {/* Animated Background */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          {/* Grid Pattern */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'linear-gradient(rgba(139,92,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.03) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />

          {/* Floating Code Snippets */}
          <Box
            className="animate-float"
            sx={{
              position: 'absolute',
              top: '10%',
              left: '5%',
              color: 'rgba(139, 92, 246, 0.2)',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              display: { xs: 'none', md: 'block' },
            }}
          >
            <pre>{`const sell = () => {\n  return <Revenue />;\n}`}</pre>
          </Box>
          <Box
            className="animate-float-delayed"
            sx={{
              position: 'absolute',
              top: '25%',
              right: '10%',
              color: 'rgba(59, 130, 246, 0.2)',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              display: { xs: 'none', md: 'block' },
            }}
          >
            <pre>{`function upload() {\n  return success;\n}`}</pre>
          </Box>
          <Box
            className="animate-float-slow"
            sx={{
              position: 'absolute',
              bottom: '30%',
              left: '25%',
              color: 'rgba(20, 184, 166, 0.2)',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              display: { xs: 'none', lg: 'block' },
            }}
          >
            <pre>{`import { earnings } from 'vettcode'`}</pre>
          </Box>

          {/* Gradient Orbs */}
          <Box
            className="animate-pulse-slow"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 384,
              height: 384,
              bgcolor: 'rgba(139, 92, 246, 0.1)',
              borderRadius: '50%',
              filter: 'blur(80px)',
            }}
          />
          <Box
            className="animate-pulse-slower"
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 384,
              height: 384,
              bgcolor: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '50%',
              filter: 'blur(80px)',
            }}
          />
          <Box
            className="animate-pulse-slow"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 384,
              height: 384,
              bgcolor: 'rgba(20, 184, 166, 0.1)',
              borderRadius: '50%',
              filter: 'blur(80px)',
            }}
          />
        </Box>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={800}>
                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  <Chip
                    icon={<Bolt sx={{ fontSize: 18 }} />}
                    label="Trusted by 10,000+ Sellers"
                    sx={{
                      bgcolor: 'rgba(139, 92, 246, 0.2)',
                      color: '#a78bfa',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      mb: 3,
                      fontWeight: 700,
                    }}
                  />
                  <Typography
                    variant="h1"
                    sx={{
                      fontWeight: 900,
                      mb: 3,
                      fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                      lineHeight: 1.1,
                      color: 'white',
                    }}
                  >
                    Turn Your Code Into{' '}
                    <Box
                      component="span"
                      sx={{
                        display: 'block',
                        background: 'linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%, #5eead4 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Revenue
                    </Box>
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 5,
                      color: 'rgba(255,255,255,0.8)',
                      lineHeight: 1.6,
                      fontWeight: 500,
                      fontSize: { xs: '1.1rem', md: '1.3rem' },
                    }}
                  >
                    Join VETTCODE's marketplace and sell your applications to thousands of developers
                    and businesses worldwide. Start earning today.
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: 3,
                      justifyContent: { xs: 'center', md: 'flex-start' },
                      mb: 5,
                    }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/signup')}
                      endIcon={<Rocket />}
                      sx={{
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                        color: 'white',
                        px: 5,
                        py: 2,
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        borderRadius: 3,
                        textTransform: 'none',
                        boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 40px rgba(139, 92, 246, 0.5)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Start Selling Free
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/login')}
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
                          borderColor: '#a78bfa',
                          bgcolor: 'rgba(167, 139, 250, 0.1)',
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
                      { icon: <Bolt />, text: 'Instant Payouts' },
                      { icon: <Security />, text: '24/7 Support' },
                    ].map((item, index) => (
                      <Grid item xs={12} sm={4} key={index}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                          <Box sx={{ color: '#14b8a6', display: 'flex' }}>
                            {item.icon}
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
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
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 4,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
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
                    <Grid container spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
                      {[
                        { icon: <Code sx={{ fontSize: 50 }} />, label: 'Upload', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' },
                        { icon: <Analytics sx={{ fontSize: 50 }} />, label: 'Track', gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
                        { icon: <AttachMoney sx={{ fontSize: 50 }} />, label: 'Earn', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
                        { icon: <TrendingUp sx={{ fontSize: 50 }} />, label: 'Grow', gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' },
                      ].map((item, index) => (
                        <Grid item xs={6} key={index}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Box
                              sx={{
                                display: 'inline-flex',
                                p: 3,
                                borderRadius: 3,
                                background: item.gradient,
                                color: 'white',
                                mb: 2,
                                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                  transform: 'scale(1.1)',
                                },
                              }}
                            >
                              {item.icon}
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
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

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Grow in timeout={800 + index * 200}>
                <Card
                  sx={{
                    textAlign: 'center',
                    py: 4,
                    px: 2,
                    background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
                    border: `2px solid ${stat.color}30`,
                    borderRadius: 3,
                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.02)',
                      boxShadow: `0 20px 40px ${stat.color}40`,
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 2.5,
                        borderRadius: '50%',
                        bgcolor: `${stat.color}20`,
                        color: stat.color,
                        mb: 2,
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 900,
                        color: stat.color,
                        mb: 1,
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box id="features" sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Chip
              icon={<AutoAwesome sx={{ fontSize: 18 }} />}
              label="POWERFUL FEATURES"
              sx={{
                bgcolor: 'rgba(139, 92, 246, 0.2)',
                color: '#a78bfa',
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
                fontSize: { xs: '2rem', md: '3rem' },
                background: 'linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Everything You Need to Succeed
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)', maxWidth: 600, mx: 'auto' }}>
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
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '2px solid rgba(139, 92, 246, 0.2)',
                      borderRadius: 3,
                      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      '&:hover': {
                        transform: 'translateY(-12px) scale(1.02)',
                        boxShadow: '0 20px 50px rgba(139, 92, 246, 0.3)',
                        borderColor: 'rgba(139, 92, 246, 0.4)',
                        '& .feature-icon': {
                          transform: 'scale(1.1) rotate(5deg)',
                        },
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
                          background: feature.gradient,
                          color: 'white',
                          mb: 3,
                          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: 'white' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
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
      <Container id="benefits" maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6}>
            <Fade in timeout={1000}>
              <Box>
                <Chip
                  icon={<Verified sx={{ fontSize: 18 }} />}
                  label="WHY VETTCODE"
                  sx={{
                    bgcolor: 'rgba(59, 130, 246, 0.2)',
                    color: '#60a5fa',
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
                    fontSize: { xs: '2rem', md: '3rem' },
                    background: 'linear-gradient(135deg, #60a5fa 0%, #5eead4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Why Sell on VETTCODE?
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)', mb: 5 }}>
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
                            background: 'linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%)',
                            flexShrink: 0,
                          }}
                        >
                          <CheckCircle sx={{ color: 'white', fontSize: 20 }} />
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '1.05rem', color: 'rgba(255,255,255,0.9)' }}>
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
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(20, 184, 166, 0.2)',
                }}
              >
                <TrendingUp sx={{ fontSize: 180, color: '#14b8a6', opacity: 0.3 }} />
              </Box>
            </Zoom>
          </Grid>
        </Grid>
      </Container>

      {/* Pricing Section */}
      <Box id="pricing" sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Chip
              icon={<LocalOffer sx={{ fontSize: 18 }} />}
              label="PRICING PLANS"
              sx={{
                bgcolor: 'rgba(252, 211, 77, 0.2)',
                color: '#fcd34d',
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
                fontSize: { xs: '2rem', md: '3rem' },
                background: 'linear-gradient(135deg, #fcd34d 0%, #f97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Simple, Transparent Pricing
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)' }}>
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
                      border: plan.highlighted ? '3px solid #8b5cf6' : '2px solid rgba(139, 92, 246, 0.2)',
                      borderRadius: 3,
                      transform: plan.highlighted ? 'scale(1.05)' : 'scale(1)',
                      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      background: plan.highlighted
                        ? 'rgba(139, 92, 246, 0.1)'
                        : 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        transform: plan.highlighted ? 'scale(1.08)' : 'scale(1.03)',
                        boxShadow: plan.highlighted
                          ? '0 24px 60px rgba(139, 92, 246, 0.4)'
                          : '0 12px 32px rgba(139, 92, 246, 0.2)',
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
                          bgcolor: '#8b5cf6',
                          color: 'white',
                          fontSize: '0.75rem',
                          height: 28,
                        }}
                      />
                    )}
                    <CardContent sx={{ p: 5, textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: 'white' }}>
                        {plan.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 4 }}>
                        {plan.description}
                      </Typography>
                      <Typography
                        variant="h2"
                        sx={{
                          fontWeight: 900,
                          mb: 1,
                          background: 'linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {plan.price}
                      </Typography>
                      {plan.period && (
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 4 }}>
                          {plan.period}
                        </Typography>
                      )}
                      <Button
                        fullWidth
                        variant={plan.highlighted ? 'contained' : 'outlined'}
                        size="large"
                        onClick={() => navigate('/signup')}
                        sx={{
                          mb: 4,
                          py: 1.5,
                          fontWeight: 800,
                          textTransform: 'none',
                          fontSize: '1.05rem',
                          ...(plan.highlighted
                            ? {
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                                color: 'white',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
                                },
                              }
                            : {
                                borderColor: '#8b5cf6',
                                color: '#a78bfa',
                                borderWidth: 2,
                                '&:hover': {
                                  borderColor: '#a78bfa',
                                  bgcolor: 'rgba(139, 92, 246, 0.1)',
                                  borderWidth: 2,
                                },
                              }),
                        }}
                      >
                        {plan.highlighted ? 'Start Free Trial' : 'Get Started'}
                      </Button>
                      <Box sx={{ textAlign: 'left' }}>
                        {plan.features.map((feature, idx) => (
                          <Box
                            key={idx}
                            sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}
                          >
                            <CheckCircle
                              sx={{
                                color: plan.highlighted ? '#8b5cf6' : '#14b8a6',
                                fontSize: 20,
                              }}
                            />
                            <Typography variant="body2" sx={{ fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>
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
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Fade in timeout={1000}>
            <Box
              sx={{
                background: 'rgba(139, 92, 246, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(139, 92, 246, 0.3)',
                borderRadius: 6,
                p: { xs: 6, md: 10 },
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  mb: 3,
                  fontSize: { xs: '2rem', md: '3rem' },
                  color: 'white',
                }}
              >
                Ready to Start Selling?
              </Typography>
              <Typography variant="h5" sx={{ mb: 5, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                Join VETTCODE today and reach thousands of potential buyers worldwide
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/signup')}
                endIcon={<ArrowForward />}
                sx={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                  color: 'white',
                  px: 6,
                  py: 2.5,
                  fontSize: '1.3rem',
                  fontWeight: 900,
                  borderRadius: 3,
                  textTransform: 'none',
                  boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 32px rgba(139, 92, 246, 0.5)',
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
      <Box sx={{ bgcolor: '#0f172a', borderTop: '1px solid rgba(139, 92, 246, 0.2)', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Code sx={{ fontSize: 28, color: 'white' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 900, color: 'white' }}>
                  VETTCODE
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                The premier marketplace for buying and selling verified, production-ready applications.
                Built by developers, trusted by founders.
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={4}>
                {[
                  { title: 'Product', links: ['Features', 'Pricing', 'Benefits'] },
                  { title: 'Company', links: ['About', 'Blog', 'Careers'] },
                  { title: 'Support', links: ['Help Center', 'Contact', 'Status'] },
                  { title: 'Legal', links: ['Privacy', 'Terms', 'License'] },
                ].map((section, index) => (
                  <Grid item xs={6} md={3} key={index}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: '#fcd34d' }}>
                      {section.title}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {section.links.map((link, idx) => (
                        <Button
                          key={idx}
                          href={`#${link.toLowerCase()}`}
                          sx={{
                            color: 'rgba(255,255,255,0.6)',
                            justifyContent: 'flex-start',
                            p: 0,
                            textTransform: 'none',
                            fontWeight: 500,
                            '&:hover': { color: 'white' },
                          }}
                        >
                          {link}
                        </Button>
                      ))}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
          <Box
            sx={{
              borderTop: '1px solid rgba(139, 92, 246, 0.2)',
              mt: 8,
              pt: 6,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
              © 2026 VETTCODE. All rights reserved. Built with ❤️ for developers.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
