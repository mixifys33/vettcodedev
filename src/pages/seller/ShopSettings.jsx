import { useState, useEffect, useMemo, useRef } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  LinearProgress,
  Alert,
  Grid,
  Chip,
  Breadcrumbs,
  Link,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material'
import {
  Save,
  NavigateNext,
  Store,
  Palette,
  LocationOn,
  VerifiedUser,
  CloudUpload,
  CheckCircle,
  Language,
  Image as ImageIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import useAuthStore from '../../store/authStore'
import { uploadToImageKit } from '../../utils/imagekit'
import { colors } from '../../theme/tokens'

const BUSINESS_TYPES = [
  { label: 'Software & Developer Tools', value: 'services' },
  { label: 'Electronics & Hardware', value: 'electronics' },
  { label: 'Books & Educational', value: 'books' },
  { label: 'Art, Design & Crafts', value: 'art-crafts' },
  { label: 'Automotive', value: 'automotive' },
  { label: 'Health & Beauty', value: 'health-beauty' },
  { label: 'Home & Garden', value: 'home-garden' },
  { label: 'Sports & Outdoors', value: 'sports' },
  { label: 'Food & Beverages', value: 'food-beverages' },
  { label: 'Fashion & Apparel', value: 'fashion' },
  { label: 'Jewelry', value: 'jewelry' },
  { label: 'Toys & Games', value: 'toys-games' },
  { label: 'Other', value: 'other' },
]

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    bgcolor: colors.cardBackground,
    fontSize: '14px',
    '& fieldset': { borderColor: colors.border },
    '&:hover fieldset': { borderColor: colors.slate300 },
    '&.Mui-focused fieldset': { borderColor: colors.primary, borderWidth: '1px' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: colors.primary },
}

const SectionHeader = ({ step, title, subtitle, icon }) => (
  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: '10px',
        bgcolor: colors.primaryBg,
        color: colors.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography
        variant="overline"
        sx={{ color: colors.primary, fontWeight: 700, letterSpacing: '0.12em', lineHeight: 1.2 }}
      >
        {step}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 600, color: colors.textPrimary, fontSize: '17px' }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: colors.textSecondary, mt: 0.25 }}>
        {subtitle}
      </Typography>
    </Box>
  </Box>
)

const ShopSettings = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [logoPreview, setLogoPreview] = useState(null)
  const [bannerPreview, setBannerPreview] = useState(null)
  const [existingLogo, setExistingLogo] = useState(null)
  const [existingBanner, setExistingBanner] = useState(null)
  const [pendingLogo, setPendingLogo] = useState(null)
  const [pendingBanner, setPendingBanner] = useState(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const logoInputRef = useRef(null)
  const bannerInputRef = useRef(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      shopName: '',
      shopDescription: '',
      businessType: '',
      businessAddress: '',
      city: '',
      website: '',
      businessLicense: '',
      taxId: '',
    },
  })

  const watched = watch()

  const completion = useMemo(() => {
    const checks = [
      Boolean(watched.shopName?.trim()?.length >= 3),
      Boolean(watched.shopDescription?.trim()?.length >= 20),
      Boolean(watched.businessType),
      Boolean(watched.businessAddress?.trim()),
      Boolean(watched.city?.trim()),
      Boolean(logoPreview || existingLogo?.url),
    ]
    return Math.round((checks.filter(Boolean).length / checks.length) * 100)
  }, [watched, logoPreview, existingLogo])

  useEffect(() => {
    loadShopData()
  }, [])

  const loadShopData = async () => {
    try {
      setLoading(true)
      const sellerId = user?.id || user?._id
      const response = await api.get(`/sellers/profile/${sellerId}`)

      if (response.data.success) {
        const shop = response.data.profile.shop || {}
        setValue('shopName', shop.shopName || '')
        setValue('shopDescription', shop.shopDescription || '')
        setValue('businessType', shop.businessType || '')
        setValue('businessAddress', shop.businessAddress || '')
        setValue('city', shop.city || '')
        setValue('website', shop.website || '')
        setValue('businessLicense', shop.businessLicense || '')
        setValue('taxId', shop.taxId || '')
        if (shop.logo?.url) {
          setExistingLogo(shop.logo)
          setLogoPreview(shop.logo.url)
        }
        if (shop.banner?.url) {
          setExistingBanner(shop.banner)
          setBannerPreview(shop.banner.url)
        }
      }
    } catch (error) {
      toast.error('Failed to load shop settings')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageSelect = async (file, type) => {
    if (!file?.type?.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB')
      return
    }

    const preview = URL.createObjectURL(file)
    if (type === 'logo') {
      setLogoPreview(preview)
      setUploadingLogo(true)
    } else {
      setBannerPreview(preview)
      setUploadingBanner(true)
    }

    try {
      const folder = type === 'logo' ? 'sellers/logos' : 'sellers/banners'
      const result = await uploadToImageKit(file, folder)
      if (type === 'logo') {
        setPendingLogo(result)
      } else {
        setPendingBanner(result)
      }
      toast.success(`${type === 'logo' ? 'Logo' : 'Banner'} ready to save`)
    } catch {
      toast.error(`Failed to upload ${type}`)
      if (type === 'logo') {
        setLogoPreview(existingLogo?.url || null)
        setPendingLogo(null)
      } else {
        setBannerPreview(existingBanner?.url || null)
        setPendingBanner(null)
      }
    } finally {
      if (type === 'logo') setUploadingLogo(false)
      else setUploadingBanner(false)
    }
  }

  const buildImagePayload = (pending, existing) => {
    if (pending?.url) {
      return {
        imagekitUrl: pending.url,
        imagekitFileId: pending.fileId,
        imagekitThumbnail: pending.thumbnailUrl,
        fileName: pending.fileName,
      }
    }
    if (existing?.url) {
      return {
        imagekitUrl: existing.url,
        imagekitFileId: existing.fileId,
        imagekitThumbnail: existing.thumbnailUrl,
        fileName: existing.fileName,
      }
    }
    return undefined
  }

  const onSubmit = async (data) => {
    try {
      setSaving(true)
      const sellerId = user?.id || user?._id

      const payload = {
        sellerId,
        ...data,
        shopLogo: buildImagePayload(pendingLogo, existingLogo),
        shopBanner: buildImagePayload(pendingBanner, existingBanner),
      }

      const response = await api.post('/sellers/shop-setup', payload)

      if (response.data.success) {
        toast.success('Shop profile saved successfully')
        const updatedShop = {
          ...user?.shop,
          ...data,
          isSetup: true,
          logo: pendingLogo
            ? { url: pendingLogo.url, fileId: pendingLogo.fileId, thumbnailUrl: pendingLogo.thumbnailUrl }
            : existingLogo,
          banner: pendingBanner
            ? { url: pendingBanner.url, fileId: pendingBanner.fileId, thumbnailUrl: pendingBanner.thumbnailUrl }
            : existingBanner,
        }
        updateUser({ ...user, shop: updatedShop })
        if (pendingLogo) setExistingLogo(updatedShop.logo)
        if (pendingBanner) setExistingBanner(updatedShop.banner)
        setPendingLogo(null)
        setPendingBanner(null)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save shop settings')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const businessTypeLabel =
    BUSINESS_TYPES.find((t) => t.value === watched.businessType)?.label || 'Not set'

  if (loading) {
    return (
      <Box sx={{ bgcolor: colors.pageBackground, minHeight: '60vh', p: 3 }}>
        <LinearProgress
          sx={{
            borderRadius: 1,
            bgcolor: colors.border,
            '& .MuiLinearProgress-bar': { bgcolor: colors.primary },
          }}
        />
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: colors.pageBackground, minHeight: '100vh', pb: 4 }}>
      {/* Page header */}
      <Box
        sx={{
          bgcolor: colors.cardBackground,
          borderBottom: `1px solid ${colors.border}`,
          px: { xs: 2, md: 3 },
          py: 2.5,
          mb: 3,
        }}
      >
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" sx={{ color: colors.slate400 }} />}
          sx={{ mb: 1.5 }}
        >
          <Link
            underline="hover"
            color="inherit"
            href="/seller/settings"
            onClick={(e) => {
              e.preventDefault()
              navigate('/seller/settings')
            }}
            sx={{ color: colors.textSecondary, fontSize: '14px', fontWeight: 500 }}
          >
            Settings
          </Link>
          <Typography sx={{ color: colors.textPrimary, fontSize: '14px', fontWeight: 600 }}>
            Shop
          </Typography>
        </Breadcrumbs>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: colors.textPrimary }}>
                Shop Profile
              </Typography>
              {user?.shop?.isSetup ? (
                <Chip
                  icon={<CheckCircle sx={{ fontSize: 16 }} />}
                  label="Live"
                  size="small"
                  sx={{ bgcolor: colors.successBg, color: colors.successText, fontWeight: 600 }}
                />
              ) : (
                <Chip label="Setup required" size="small" color="warning" variant="outlined" />
              )}
            </Stack>
            <Typography variant="body2" sx={{ color: colors.textSecondary, maxWidth: 520 }}>
              Configure how your storefront appears on VettCode. Buyers see this when they visit your shop.
            </Typography>
          </Box>

          <Box sx={{ minWidth: 200 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
              <Typography variant="caption" sx={{ color: colors.textSecondary, fontWeight: 600 }}>
                Profile completeness
              </Typography>
              <Typography variant="caption" sx={{ color: colors.primary, fontWeight: 700 }}>
                {completion}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={completion}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: colors.border,
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  bgcolor: completion === 100 ? colors.success : colors.primary,
                },
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: { xs: 2, md: 3 } }}>
        {!user?.shop?.isSetup && (
          <Alert
            severity="info"
            sx={{
              mb: 3,
              borderRadius: '8px',
              border: `1px solid ${colors.info}`,
              bgcolor: colors.infoBg,
              '& .MuiAlert-icon': { color: colors.info },
            }}
          >
            Complete your shop profile to publish applications and appear in the marketplace directory.
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Live preview */}
            <Grid item xs={12} lg={5}>
              <Box sx={{ position: { lg: 'sticky' }, top: 24 }}>
                <Typography
                  variant="overline"
                  sx={{
                    color: colors.textSecondary,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    mb: 1.5,
                    display: 'block',
                  }}
                >
                  Storefront preview
                </Typography>
                <Card
                  sx={{
                    borderRadius: '12px',
                    border: `1px solid ${colors.border}`,
                    boxShadow: 'none',
                    overflow: 'hidden',
                    bgcolor: colors.cardBackground,
                  }}
                >
                  <Box
                    sx={{
                      height: 140,
                      background: bannerPreview
                        ? `url(${bannerPreview}) center/cover no-repeat`
                        : `linear-gradient(135deg, ${colors.slate800} 0%, ${colors.primary} 100%)`,
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(180deg, transparent 40%, rgba(15,23,42,0.75) 100%)',
                      }}
                    />
                    <Tooltip title="Change banner">
                      <IconButton
                        size="small"
                        onClick={() => bannerInputRef.current?.click()}
                        disabled={uploadingBanner}
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          bgcolor: 'rgba(255,255,255,0.92)',
                          '&:hover': { bgcolor: '#fff' },
                        }}
                      >
                        <ImageIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <CardContent sx={{ pt: 0, px: 2.5, pb: 2.5 }}>
                    <Box sx={{ display: 'flex', gap: 2, mt: -4, position: 'relative', zIndex: 1 }}>
                      <Box
                        sx={{
                          width: 72,
                          height: 72,
                          borderRadius: '12px',
                          border: `3px solid ${colors.cardBackground}`,
                          bgcolor: colors.slate100,
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                          flexShrink: 0,
                        }}
                      >
                        {logoPreview ? (
                          <Box
                            component="img"
                            src={logoPreview}
                            alt="Shop logo"
                            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <Store sx={{ fontSize: 32, color: colors.slate400 }} />
                        )}
                      </Box>
                      <Box sx={{ pt: 4.5, minWidth: 0 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: colors.textPrimary,
                            fontSize: '18px',
                            lineHeight: 1.2,
                          }}
                          noWrap
                        >
                          {watched.shopName?.trim() || 'Your Shop Name'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                          {businessTypeLabel}
                          {watched.city ? ` · ${watched.city}` : ''}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.textSecondary,
                        mt: 2,
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {watched.shopDescription?.trim() ||
                        'Your shop description will appear here. Tell buyers what you build and why they should trust your applications.'}
                    </Typography>
                    {watched.website?.trim() && (
                      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1.5 }}>
                        <Language sx={{ fontSize: 14, color: colors.primary }} />
                        <Typography
                          variant="caption"
                          sx={{ color: colors.primary, fontWeight: 500 }}
                          noWrap
                        >
                          {watched.website.replace(/^https?:\/\//, '')}
                        </Typography>
                      </Stack>
                    )}
                  </CardContent>
                </Card>

                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadingLogo}
                    sx={{ textTransform: 'none', borderColor: colors.border }}
                  >
                    {uploadingLogo ? 'Uploading logo…' : 'Upload logo'}
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    onClick={() => bannerInputRef.current?.click()}
                    disabled={uploadingBanner}
                    sx={{ textTransform: 'none', borderColor: colors.border }}
                  >
                    {uploadingBanner ? 'Uploading banner…' : 'Upload banner'}
                  </Button>
                </Stack>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageSelect(file, 'logo')
                    e.target.value = ''
                  }}
                />
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageSelect(file, 'banner')
                    e.target.value = ''
                  }}
                />
              </Box>
            </Grid>

            {/* Form sections */}
            <Grid item xs={12} lg={7}>
              <Stack spacing={3}>
                <Card
                  sx={{
                    borderRadius: '12px',
                    border: `1px solid ${colors.border}`,
                    boxShadow: 'none',
                  }}
                >
                  <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                    <SectionHeader
                      step="01 — BRAND"
                      title="Identity & positioning"
                      subtitle="Name and story that represent your developer brand on the marketplace."
                      icon={<Palette sx={{ fontSize: 20 }} />}
                    />
                    <Stack spacing={2.5}>
                      <TextField
                        fullWidth
                        label="Shop name"
                        placeholder="e.g. Apex Code Labs"
                        {...register('shopName', {
                          required: 'Shop name is required',
                          minLength: { value: 3, message: 'At least 3 characters' },
                        })}
                        error={!!errors.shopName}
                        helperText={errors.shopName?.message || 'Public name shown on your storefront'}
                        sx={fieldSx}
                      />
                      <TextField
                        fullWidth
                        label="Shop description"
                        placeholder="Describe your expertise, tech stack, and the types of applications you publish…"
                        multiline
                        rows={4}
                        {...register('shopDescription', {
                          required: 'Description is required',
                          minLength: { value: 20, message: 'At least 20 characters' },
                        })}
                        error={!!errors.shopDescription}
                        helperText={
                          errors.shopDescription?.message ||
                          `${(watched.shopDescription || '').length}/500 · Minimum 20 characters`
                        }
                        inputProps={{ maxLength: 500 }}
                        sx={fieldSx}
                      />
                      <TextField
                        fullWidth
                        select
                        label="Primary category"
                        {...register('businessType', { required: 'Select a category' })}
                        error={!!errors.businessType}
                        helperText={errors.businessType?.message || 'How buyers discover your shop'}
                        defaultValue=""
                        sx={fieldSx}
                      >
                        {BUSINESS_TYPES.map((type) => (
                          <MenuItem key={type.value} value={type.value}>
                            {type.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Stack>
                  </CardContent>
                </Card>

                <Card
                  sx={{
                    borderRadius: '12px',
                    border: `1px solid ${colors.border}`,
                    boxShadow: 'none',
                  }}
                >
                  <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                    <SectionHeader
                      step="02 — LOCATION"
                      title="Business location"
                      subtitle="Used for compliance and regional discovery. Shown where required by policy."
                      icon={<LocationOn sx={{ fontSize: 20 }} />}
                    />
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Business address"
                          {...register('businessAddress', { required: 'Address is required' })}
                          error={!!errors.businessAddress}
                          helperText={errors.businessAddress?.message}
                          sx={fieldSx}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="City"
                          {...register('city', { required: 'City is required' })}
                          error={!!errors.city}
                          helperText={errors.city?.message}
                          sx={fieldSx}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Website"
                          placeholder="https://yourdomain.com"
                          {...register('website')}
                          sx={fieldSx}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Card
                  sx={{
                    borderRadius: '12px',
                    border: `1px solid ${colors.border}`,
                    boxShadow: 'none',
                  }}
                >
                  <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                    <SectionHeader
                      step="03 — COMPLIANCE"
                      title="Optional verification"
                      subtitle="Accelerate trust reviews. Leave blank if not applicable in your region."
                      icon={<VerifiedUser sx={{ fontSize: 20 }} />}
                    />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Business license"
                          {...register('businessLicense')}
                          sx={fieldSx}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Tax ID"
                          {...register('taxId')}
                          sx={fieldSx}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>

          <Card
            sx={{
              mt: 3,
              borderRadius: '12px',
              border: `1px solid ${colors.border}`,
              boxShadow: 'none',
            }}
          >
            <CardContent
              sx={{
                py: 2,
                px: { xs: 2, md: 3 },
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                {isDirty || pendingLogo || pendingBanner
                  ? 'You have unsaved changes'
                  : 'Review your storefront preview before saving'}
              </Typography>
              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/seller/settings')}
                  disabled={saving}
                  sx={{ textTransform: 'none', borderColor: colors.border, color: colors.textSecondary }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving || uploadingLogo || uploadingBanner}
                  startIcon={<Save />}
                  sx={{
                    textTransform: 'none',
                    bgcolor: colors.primary,
                    px: 3,
                    boxShadow: 'none',
                    '&:hover': { bgcolor: colors.primaryDark, boxShadow: 'none' },
                  }}
                >
                  {saving ? 'Saving…' : 'Save shop profile'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </form>
      </Box>
    </Box>
  )
}

export default ShopSettings
