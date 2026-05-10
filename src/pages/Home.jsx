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
  Analytics,
  CheckCircle,
  ArrowForward,
  Store,
  AttachMoney,
  People,
  Inventory,
  Menu as MenuIcon,
  Close,
  Speed,
  Verified,
  Star,
  BarChart,
  Update,
  Lock,
  Language,
  Description,
  Api,
  AutoAwesome,
  Bolt,
  Shield,
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

  const trustCards = [
    {
      icon: <Code sx={{ fontSize: 40 }} />,
      title: 'Sell Digital Products',
      items: ['SaaS applications', 'AI tools', 'APIs', 'Source code', 'Templates', 'Automation systems'],
    },
    {
      icon: <Language sx={{ fontSize: 40 }} />,
      title: 'Reach Global Buyers',
      items: ['Developers', 'Startups', 'Agencies', 'Businesses'],
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'Keep Control',
      items: ['Set your own pricing', 'Update products anytime', 'Manage licenses', 'Track analytics'],
    },
    {
      icon: <AttachMoney sx={{ fontSize: 40 }} />,
      title: 'Fast Payouts',
      items: ['Secure payments', 'Seller dashboard', 'Transparent earnings'],
    },
  ];

  const whyVettCode = [
    {
      title: 'Built for Software — Not Generic Digital Junk',
      description: 'Most marketplaces mix ebooks, PDFs, and low-quality assets together. VettCode focuses on real software products and developer tools.',
      icon: <Verified sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Better Discovery for Technical Products',
      description: 'Your products are organized for developers searching for real solutions — not random marketplace clutter.',
      icon: <AutoAwesome sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Grow Beyond Freelancing',
      description: 'Instead of trading hours for money, sell scalable digital products that can generate revenue repeatedly.',
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Launch Faster',
      description: 'Upload your product, add screenshots, pricing, documentation, and start selling globally.',
      icon: <Rocket sx={{ fontSize: 40 }} />,
    },
  ];

  const exampleProducts = [
    { name: 'AI Resume Builder', price: '$49', downloads: '2.4K', rating: 4.9, revenue: '$117K' },
    { name: 'SaaS Boilerplate', price: '$99', downloads: '1.8K', rating: 4.8, revenue: '$178K' },
    { name: 'AI Chat Template', price: '$39', downloads: '3.2K', rating: 4.9, revenue: '$124K' },
    { name: 'CRM Dashboard', price: '$79', downloads: '1.5K', rating: 4.7, revenue: '$118K' },
  ];

  const features = [
    { icon: <Analytics />, label: 'Seller Analytics' },
    { icon: <BarChart />, label: 'Product Performance' },
    { icon: <Update />, label: 'Instant Updates' },
    { icon: <Lock />, label: 'Secure Checkout' },
    { icon: <Star />, label: 'Ratings & Reviews' },
    { icon: <Shield />, label: 'Licensing' },
    { icon: <Api />, label: 'API Integration' },
    { icon: <Description />, label: 'Documentation Support' },
  ];

  const stats = [
    { value: '10K+', label: 'Downloads' },
    { value: '2.5K+', label: 'Products Sold' },
    { value: '500+', label: 'Active Sellers' },
    { value: '80+', label: 'Countries' },
  ];

  return (
    <Box sx={{ bgcolor: '#0a0e27', minHeight: '100vh' }}>
      {/* Navigation */}
      <AppBar
        position="fixed"
        elevation={scrollY > 50 ? 8 : 0}
        sx={{
          bgcolor: scrollY > 50 ? 'rgba(10, 14, 39, 0.95)' : 'transparent',
          backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none',
          borderBottom: scrollY > 50 ? '1px solid rgba(139, 92, 246, 0.1)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar sx={{ py: { xs: 1, sm: 1.5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
            <Box
              sx={{
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                borderRadius: 1.5,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Code sx={{ fontSize: { xs: 24, sm: 28 }, color: 'white' }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.1rem', sm: '1.3rem' },
                color: 'white',
                letterSpacing: '-0.5px',
              }}
            >
              VettCode
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, mr: 3 }}>
              <Button
                href="#why"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 2.5,
                  fontSize: '0.95rem',
                  '&:hover': {
                    bgcolor: 'rgba(99, 102, 241, 0.1)',
                    color: 'white',
                  },
                }}
              >
                Why VettCode
              </Button>
              <Button
                href="#how"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 2.5,
                  fontSize: '0.95rem',
                  '&:hover': {
                    bgcolor: 'rgba(99, 102, 241, 0.1)',
                    color: 'white',
                  },
                }}
              >
                How It Works
              </Button>
            </Box>
          )}

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/login')}
              sx={{
                borderColor: 'rgba(99, 102, 241, 0.5)',
                color: 'white',
                fontWeight: 600,
                textTransform: 'none',
                px: 3,
                '&:hover': {
                  borderColor: '#6366f1',
                  bgcolor: 'rgba(99, 102, 241, 0.1)',
                },
              }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/signup')}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                fontWeight: 700,
                textTransform: 'none',
                px: 3,
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  boxShadow: '0 6px 20px rgba(99, 102, 241, 0.5)',
                },
              }}
            >
              Start Selling
            </Button>
          </Box>

          {isMobile && (
            <IconButton
              edge="end"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ ml: 2, color: 'white' }}
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
            bgcolor: '#0f172a',
            borderLeft: '1px solid rgba(99, 102, 241, 0.2)',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <IconButton onClick={() => setMobileMenuOpen(false)} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Box>
          <List>
            {['Why VettCode', 'How It Works'].map((item) => (
              <ListItem key={item} disablePadding>
                <ListItemButton
                  onClick={() => {
                    setMobileMenuOpen(false);
                    document.getElementById(item === 'Why VettCode' ? 'why' : 'how')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    '&:hover': {
                      bgcolor: 'rgba(99, 102, 241, 0.1)',
                      color: 'white',
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
                borderColor: 'rgba(99, 102, 241, 0.5)',
                color: 'white',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#6366f1',
                  bgcolor: 'rgba(99, 102, 241, 0.1)',
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
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                fontWeight: 700,
                textTransform: 'none',
              }}
            >
              Start Selling
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          pt: { xs: 14, sm: 18, md: 22 },
          pb: { xs: 10, sm: 14, md: 18 },
          overflow: 'hidden',
        }}
      >
        {/* Minimal Background */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(99,102,241,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.02) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in timeout={800}>
            <Box sx={{ textAlign: 'center', maxWidth: 900, mx: 'auto' }}>
              <Chip
                label="Trusted by developers building the next generation of software products"
                sx={{
                  bgcolor: 'rgba(99, 102, 241, 0.1)',
                  color: 'rgba(255,255,255,0.9)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  mb: 4,
                  fontWeight: 600,
                  fontSize: '0.85rem',
                }}
              />
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 900,
                  mb: 3,
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                  lineHeight: 1.1,
                  color: 'white',
                  letterSpacing: '-0.02em',
                }}
              >
                Sell Software That{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Actually Matters
                </Box>
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 6,
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: 1.6,
                  fontWeight: 400,
                  fontSize: { xs: '1.1rem', md: '1.35rem' },
                  maxWidth: 800,
                  mx: 'auto',
                }}
              >
                Monetize your SaaS products, AI tools, APIs, templates, and developer systems with a marketplace built for modern software creators.
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 3,
                  justifyContent: 'center',
                  mb: 8,
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/signup')}
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: 'white',
                    px: 6,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                      boxShadow: '0 12px 40px rgba(99, 102, 241, 0.4)',
                    },
                  }}
                >
                  Start Selling
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/products')}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    px: 6,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.4)',
                      bgcolor: 'rgba(255,255,255,0.05)',
                    },
                  }}
                >
                  Explore Marketplace
                </Button>
              </Box>

              {/* Hero Visual - Dashboard Preview */}
              <Zoom in timeout={1000}>
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: 3,
                    overflow: 'hidden',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    bgcolor: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(20px)',
                    p: 4,
                  }}
                >
                  <Grid container spacing={3}>
                    {/* Earnings Card */}
                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{
                          bgcolor: 'rgba(16, 185, 129, 0.1)',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                          borderRadius: 2,
                          p: 3,
                        }}
                      >
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>
                          Total Earnings
                        </Typography>
                        <Typography variant="h3" sx={{ color: '#10b981', fontWeight: 900, mb: 1 }}>
                          $24,580
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TrendingUp sx={{ fontSize: 16, color: '#10b981' }} />
                          <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600 }}>
                            +18% this month
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Downloads Card */}
                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{
                          bgcolor: 'rgba(99, 102, 241, 0.1)',
                          border: '1px solid rgba(99, 102, 241, 0.2)',
                          borderRadius: 2,
                          p: 3,
                        }}
                      >
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>
                          Total Downloads
                        </Typography>
                        <Typography variant="h3" sx={{ color: '#6366f1', fontWeight: 900, mb: 1 }}>
                          8,420
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Inventory sx={{ fontSize: 16, color: '#6366f1' }} />
                          <Typography variant="body2" sx={{ color: '#6366f1', fontWeight: 600 }}>
                            Across 4 products
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Rating Card */}
                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{
                          bgcolor: 'rgba(251, 191, 36, 0.1)',
                          border: '1px solid rgba(251, 191, 36, 0.2)',
                          borderRadius: 2,
                          p: 3,
                        }}
                      >
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>
                          Average Rating
                        </Typography>
                        <Typography variant="h3" sx={{ color: '#fbbf24', fontWeight: 900, mb: 1 }}>
                          4.9
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Star sx={{ fontSize: 16, color: '#fbbf24' }} />
                          <Typography variant="body2" sx={{ color: '#fbbf24', fontWeight: 600 }}>
                            From 2,340 reviews
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Mini Product Cards */}
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    {['AI Resume Builder', 'SaaS Boilerplate'].map((product, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Box
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 2,
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 1.5,
                              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Code sx={{ color: 'white' }} />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, mb: 0.5 }}>
                              {product}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                              {index === 0 ? '2.4K downloads' : '1.8K downloads'}
                            </Typography>
                          </Box>
                          <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 700 }}>
                            {index === 0 ? '$49' : '$99'}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Zoom>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Origin Story Section - The WHY */}
      <Box sx={{ bgcolor: 'rgba(99, 102, 241, 0.03)', py: { xs: 10, md: 16 } }}>
        <Container maxWidth="md">
          <Fade in timeout={1000}>
            <Box>
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Chip
                  label="OUR STORY"
                  sx={{
                    bgcolor: 'rgba(99, 102, 241, 0.15)',
                    color: '#a78bfa',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    mb: 4,
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}
                />
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    mb: 4,
                    fontSize: { xs: '2rem', md: '3rem' },
                    color: 'white',
                    lineHeight: 1.2,
                  }}
                >
                  We Built VettCode Because We've Been There
                </Typography>
              </Box>

              <Box sx={{ mb: 5 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'rgba(255,255,255,0.85)',
                    lineHeight: 1.9,
                    fontWeight: 400,
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                    mb: 3,
                  }}
                >
                  We realized something heartbreaking: <Box component="span" sx={{ color: '#6366f1', fontWeight: 700 }}>thousands of developers out there build real-world, production-ready applications</Box> — AI tools that solve actual problems, SaaS platforms that could change businesses, automation systems that save hours of work, APIs that power innovation.
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'rgba(255,255,255,0.85)',
                    lineHeight: 1.9,
                    fontWeight: 400,
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                    mb: 3,
                  }}
                >
                  But here's the painful truth: <Box component="span" sx={{ color: '#ef4444', fontWeight: 700 }}>most of them never make a single dollar from their work.</Box>
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'rgba(255,255,255,0.85)',
                    lineHeight: 1.9,
                    fontWeight: 400,
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                    mb: 3,
                  }}
                >
                  Not because their software isn't good enough. Not because there's no market. But because <Box component="span" sx={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>they don't have a platform that understands what they've built.</Box>
                </Typography>
              </Box>

              <Box
                sx={{
                  bgcolor: 'rgba(15, 23, 42, 0.8)',
                  border: '2px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: 3,
                  p: { xs: 4, md: 5 },
                  mb: 5,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    mb: 3,
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                  }}
                >
                  The Problem We're Solving:
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 3, listStyle: 'none' }}>
                  {[
                    'Generic marketplaces that mix your professional software with ebooks and Photoshop templates',
                    'Platforms that don\'t understand technical products or the developers who build them',
                    'No proper way to showcase documentation, APIs, tech stacks, or integration capabilities',
                    'Buyers who can\'t find quality software because it\'s buried under low-effort digital products',
                    'Developers trading hours for money instead of building scalable product businesses',
                  ].map((problem, idx) => (
                    <Box
                      component="li"
                      key={idx}
                      sx={{
                        color: 'rgba(255,255,255,0.75)',
                        fontSize: { xs: '0.95rem', md: '1.05rem' },
                        mb: 2,
                        position: 'relative',
                        pl: 3,
                        lineHeight: 1.7,
                        '&::before': {
                          content: '"✗"',
                          position: 'absolute',
                          left: 0,
                          color: '#ef4444',
                          fontWeight: 900,
                        },
                      }}
                    >
                      {problem}
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box
                sx={{
                  bgcolor: 'rgba(16, 185, 129, 0.1)',
                  border: '2px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: 3,
                  p: { xs: 4, md: 5 },
                  mb: 5,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    mb: 3,
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                  }}
                >
                  What VettCode Changes:
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 3, listStyle: 'none' }}>
                  {[
                    'A marketplace exclusively for real software — SaaS, AI tools, APIs, templates, and automation systems',
                    'Built by developers who understand what makes technical products valuable',
                    'Proper product pages with documentation, tech stack details, API references, and integration guides',
                    'Buyers actively searching for production-ready software, not random digital downloads',
                    'Turn your side projects into revenue-generating digital products that sell while you sleep',
                  ].map((solution, idx) => (
                    <Box
                      component="li"
                      key={idx}
                      sx={{
                        color: 'rgba(255,255,255,0.85)',
                        fontSize: { xs: '0.95rem', md: '1.05rem' },
                        mb: 2,
                        position: 'relative',
                        pl: 3,
                        lineHeight: 1.7,
                        '&::before': {
                          content: '"✓"',
                          position: 'absolute',
                          left: 0,
                          color: '#10b981',
                          fontWeight: 900,
                        },
                      }}
                    >
                      {solution}
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    mb: 3,
                    fontSize: { xs: '1.35rem', md: '1.75rem' },
                    lineHeight: 1.4,
                  }}
                >
                  VettCode exists to give your software the platform it deserves.
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    lineHeight: 1.8,
                    fontWeight: 400,
                    fontSize: { xs: '1.05rem', md: '1.2rem' },
                  }}
                >
                  Whether you built an AI resume generator, a SaaS boilerplate, a CRM dashboard, an automation toolkit, or an API that solves a real problem — <Box component="span" sx={{ color: '#6366f1', fontWeight: 700 }}>this is where it belongs.</Box>
                </Typography>
              </Box>

              <Box
                sx={{
                  textAlign: 'center',
                  pt: 4,
                  borderTop: '1px solid rgba(99, 102, 241, 0.2)',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: 'rgba(255,255,255,0.6)',
                    fontStyle: 'italic',
                    mb: 4,
                    fontSize: { xs: '1rem', md: '1.15rem' },
                  }}
                >
                  "Your code has value. Your time has value. Your expertise has value. It's time the world paid you for it."
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/signup')}
                  endIcon={<ArrowForward />}
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: 'white',
                    px: 6,
                    py: 2.5,
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                      boxShadow: '0 12px 40px rgba(99, 102, 241, 0.5)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Join the Movement
                </Button>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Trust Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: '2rem', md: '2.5rem' },
              color: 'white',
            }}
          >
            Built for Serious Developers & Digital Founders
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {trustCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Grow in timeout={600 + index * 150}>
                <Card
                  sx={{
                    height: '100%',
                    bgcolor: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(99, 102, 241, 0.1)',
                    borderRadius: 2,
                    p: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.04)',
                      borderColor: 'rgba(99, 102, 241, 0.3)',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box
                      sx={{
                        color: '#6366f1',
                        mb: 2,
                      }}
                    >
                      {card.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'white' }}>
                      {card.title}
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2.5, listStyle: 'none' }}>
                      {card.items.map((item, idx) => (
                        <Box
                          component="li"
                          key={idx}
                          sx={{
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '0.9rem',
                            mb: 0.75,
                            position: 'relative',
                            '&::before': {
                              content: '"•"',
                              position: 'absolute',
                              left: -16,
                              color: '#6366f1',
                            },
                          }}
                        >
                          {item}
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

      {/* Stats Section */}
      <Box sx={{ bgcolor: 'rgba(99, 102, 241, 0.05)', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 6,
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              color: 'white',
              textAlign: 'center',
            }}
          >
            Developers Are Building Businesses Here
          </Typography>
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 900,
                      color: '#6366f1',
                      mb: 1,
                      fontSize: { xs: '2.5rem', md: '3rem' },
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Why VettCode Section */}
      <Container id="why" maxWidth="lg" sx={{ py: { xs: 10, md: 14 } }}>
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: '2rem', md: '2.75rem' },
              color: 'white',
            }}
          >
            Why Developers Choose VettCode
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.6)',
              maxWidth: 700,
              mx: 'auto',
              fontWeight: 400,
            }}
          >
            A marketplace designed for real software products, not generic digital clutter
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {whyVettCode.map((item, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Slide direction="up" in timeout={700 + index * 150}>
                <Box
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(99, 102, 241, 0.1)',
                    borderRadius: 2,
                    p: 4,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.04)',
                      borderColor: 'rgba(99, 102, 241, 0.3)',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Box sx={{ color: '#6366f1', mb: 2 }}>{item.icon}</Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'white' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
                    {item.description}
                  </Typography>
                </Box>
              </Slide>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Seller Earnings Section */}
      <Box sx={{ bgcolor: 'rgba(99, 102, 241, 0.05)', py: { xs: 10, md: 14 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: '2rem', md: '2.75rem' },
                color: 'white',
              }}
            >
              Build Once. Sell Repeatedly.
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.6)',
                maxWidth: 700,
                mx: 'auto',
                fontWeight: 400,
              }}
            >
              Real developers earning from their software products
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {exampleProducts.map((product, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Grow in timeout={800 + index * 150}>
                  <Card
                    sx={{
                      bgcolor: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      borderRadius: 2,
                      p: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'rgba(99, 102, 241, 0.4)',
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(99, 102, 241, 0.2)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 0 }}>
                      <Box
                        sx={{
                          width: '100%',
                          height: 120,
                          borderRadius: 1.5,
                          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                        }}
                      >
                        <Code sx={{ fontSize: 48, color: 'white' }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'white' }}>
                        {product.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#6366f1' }}>
                          {product.price}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Star sx={{ fontSize: 16, color: '#fbbf24' }} />
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            {product.rating}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 2 }}>
                        {product.downloads} downloads
                      </Typography>
                      <Box
                        sx={{
                          bgcolor: 'rgba(16, 185, 129, 0.1)',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                          borderRadius: 1,
                          p: 1.5,
                          textAlign: 'center',
                        }}
                      >
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mb: 0.5 }}>
                          Total Revenue
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 800 }}>
                          {product.revenue}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Container id="how" maxWidth="lg" sx={{ py: { xs: 10, md: 14 } }}>
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: '2rem', md: '2.75rem' },
              color: 'white',
            }}
          >
            How It Works
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {[
            { step: '1', title: 'Upload Your Product', description: 'Add your software, screenshots, and documentation', icon: <CloudUpload sx={{ fontSize: 40 }} /> },
            { step: '2', title: 'Add Pricing & Documentation', description: 'Set your price, add features, and create product pages', icon: <Description sx={{ fontSize: 40 }} /> },
            { step: '3', title: 'Reach Buyers Worldwide', description: 'Your product is instantly available to global developers', icon: <Language sx={{ fontSize: 40 }} /> },
            { step: '4', title: 'Earn From Every Sale', description: 'Get paid securely with transparent seller analytics', icon: <AttachMoney sx={{ fontSize: 40 }} /> },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Fade in timeout={800 + index * 150}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      position: 'relative',
                      '&::before': {
                        content: `"${item.step}"`,
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: '#10b981',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1rem',
                      },
                    }}
                  >
                    <Box sx={{ color: 'white' }}>{item.icon}</Box>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: 'white' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                    {item.description}
                  </Typography>
                </Box>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Emotional Section - Enhanced */}
      <Box sx={{ bgcolor: 'rgba(99, 102, 241, 0.05)', py: { xs: 10, md: 14 } }}>
        <Container maxWidth="md">
          <Fade in timeout={1000}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  mb: 4,
                  fontSize: { xs: '2rem', md: '2.75rem' },
                  color: 'white',
                  lineHeight: 1.3,
                }}
              >
                Stop Building Projects That Never Pay You Back
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255,255,255,0.75)',
                  lineHeight: 1.9,
                  fontWeight: 400,
                  mb: 4,
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                }}
              >
                You've spent <Box component="span" sx={{ color: '#6366f1', fontWeight: 700 }}>countless nights coding</Box>. You've solved real problems. You've built something that actually works.
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255,255,255,0.75)',
                  lineHeight: 1.9,
                  fontWeight: 400,
                  mb: 4,
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                }}
              >
                But it's sitting on GitHub. Or running locally. Or shared with a few friends who said "this is amazing, you should sell this."
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255,255,255,0.75)',
                  lineHeight: 1.9,
                  fontWeight: 400,
                  mb: 6,
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                }}
              >
                <Box component="span" sx={{ color: 'white', fontWeight: 700 }}>VettCode helps turn side projects, SaaS tools, AI systems, templates, and developer products into scalable digital businesses.</Box> The kind that generate revenue while you're building the next thing.
              </Typography>

              <Box
                sx={{
                  bgcolor: 'rgba(15, 23, 42, 0.8)',
                  border: '2px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: 3,
                  p: { xs: 4, md: 5 },
                  mb: 6,
                  textAlign: 'left',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    mb: 3,
                  }}
                >
                  Imagine if:
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 3, listStyle: 'none' }}>
                  {[
                    'That AI tool you built in a weekend was earning $2,000/month',
                    'Your SaaS boilerplate had 500+ downloads at $99 each',
                    'Developers worldwide were using (and paying for) your automation scripts',
                    'Your side project was generating enough to quit freelancing',
                    'You woke up to "New Sale" notifications instead of "New Bug" reports',
                  ].map((scenario, idx) => (
                    <Box
                      component="li"
                      key={idx}
                      sx={{
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: { xs: '0.95rem', md: '1.05rem' },
                        mb: 2,
                        position: 'relative',
                        pl: 3,
                        lineHeight: 1.7,
                        '&::before': {
                          content: '"→"',
                          position: 'absolute',
                          left: 0,
                          color: '#10b981',
                          fontWeight: 900,
                        },
                      }}
                    >
                      {scenario}
                    </Box>
                  ))}
                </Box>
              </Box>

              <Typography
                variant="h5"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  mb: 4,
                  fontSize: { xs: '1.35rem', md: '1.65rem' },
                }}
              >
                That's not a dream. That's what VettCode sellers do every day.
              </Typography>

              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/signup')}
                endIcon={<ArrowForward />}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: 'white',
                  px: 6,
                  py: 2.5,
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    boxShadow: '0 12px 40px rgba(99, 102, 241, 0.4)',
                  },
                }}
              >
                Start Selling Today
              </Button>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Features Grid */}
      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 14 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: '2rem', md: '2.75rem' },
              color: 'white',
            }}
          >
            Everything You Need to Succeed
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Grow in timeout={600 + index * 100}>
                <Box
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(99, 102, 241, 0.1)',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.04)',
                      borderColor: 'rgba(99, 102, 241, 0.3)',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Box sx={{ color: '#6366f1', mb: 1.5 }}>{feature.icon}</Box>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                    {feature.label}
                  </Typography>
                </Box>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Final CTA */}
      <Box sx={{ bgcolor: 'rgba(99, 102, 241, 0.05)', py: { xs: 10, md: 14 } }}>
        <Container maxWidth="md">
          <Fade in timeout={1000}>
            <Box
              sx={{
                bgcolor: 'rgba(15, 23, 42, 0.8)',
                border: '2px solid rgba(99, 102, 241, 0.3)',
                borderRadius: 3,
                p: { xs: 6, md: 8 },
                textAlign: 'center',
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  mb: 3,
                  fontSize: { xs: '2rem', md: '2.75rem' },
                  color: 'white',
                }}
              >
                Start Selling on VettCode Today
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 5,
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 400,
                }}
              >
                Launch your software products to developers, startups, and businesses worldwide.
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 3,
                  justifyContent: 'center',
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/signup')}
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: 'white',
                    px: 6,
                    py: 2.5,
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                      boxShadow: '0 12px 40px rgba(99, 102, 241, 0.4)',
                    },
                  }}
                >
                  Become a Seller
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/signup')}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    px: 6,
                    py: 2.5,
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.5)',
                      bgcolor: 'rgba(255,255,255,0.05)',
                    },
                  }}
                >
                  Upload Your First Product
                </Button>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#0f172a', borderTop: '1px solid rgba(99, 102, 241, 0.1)', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 1.5,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Code sx={{ fontSize: 28, color: 'white' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'white' }}>
                  VettCode
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
                A marketplace built for modern software creators. Sell SaaS products, AI tools, APIs, templates, and developer systems to a global audience.
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={4}>
                {[
                  { title: 'Product', links: ['Marketplace', 'Pricing', 'Features'] },
                  { title: 'Sellers', links: ['Become a Seller', 'Seller Dashboard', 'Documentation'] },
                  { title: 'Company', links: ['About', 'Blog', 'Careers'] },
                  { title: 'Support', links: ['Help Center', 'Contact', 'Terms'] },
                ].map((section, index) => (
                  <Grid item xs={6} md={3} key={index}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: 'white' }}>
                      {section.title}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {section.links.map((link, idx) => (
                        <Button
                          key={idx}
                          href="#"
                          sx={{
                            color: 'rgba(255,255,255,0.5)',
                            justifyContent: 'flex-start',
                            p: 0,
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: '0.875rem',
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
              borderTop: '1px solid rgba(99, 102, 241, 0.1)',
              mt: 8,
              pt: 6,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
              © 2026 VettCode. Built for developers who build software that matters.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
