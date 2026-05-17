import { useState, useEffect, useRef } from 'react'
import {
  Box,
  TextField,
  MenuItem,
  Grid,
  LinearProgress,
  Typography,
  Button,
  Stack,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import useAuthStore from '../../store/authStore'
import { uploadToImageKit } from '../../utils/imagekit'
import { st, inputSx } from '../../components/settings/settingsTheme'
import { PageHeader, Panel, FieldLabel, FormFooter } from '../../components/settings/SettingsPage'

const BUSINESS_TYPES = [
  { label: 'Software & Developer Tools', value: 'services' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Books & Education', value: 'books' },
  { label: 'Art & Design', value: 'art-crafts' },
  { label: 'Automotive', value: 'automotive' },
  { label: 'Health & Beauty', value: 'health-beauty' },
  { label: 'Home & Garden', value: 'home-garden' },
  { label: 'Sports', value: 'sports' },
  { label: 'Food & Beverages', value: 'food-beverages' },
  { label: 'Fashion', value: 'fashion' },
  { label: 'Other', value: 'other' },
]

const ShopSettings = () => {
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
  const logoRef = useRef(null)
  const bannerRef = useRef(null)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
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

  const w = watch()

  useEffect(() => {
    const load = async () => {
      try {
        const sellerId = user?.id || user?._id
        const res = await api.get(`/sellers/profile/${sellerId}`)
        if (res.data.success) {
          const shop = res.data.profile.shop || {}
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
      } catch {
        toast.error('Could not load shop')
      } finally {
        setLoading(false)
      }
    }
    if (user) load()
  }, [user, setValue])

  const handleImage = async (file, type) => {
    if (!file?.type?.startsWith('image/')) return toast.error('Image file only')
    if (file.size > 5 * 1024 * 1024) return toast.error('Max 5MB')

    const preview = URL.createObjectURL(file)
    if (type === 'logo') {
      setLogoPreview(preview)
      setUploadingLogo(true)
    } else {
      setBannerPreview(preview)
      setUploadingBanner(true)
    }

    try {
      const result = await uploadToImageKit(file, type === 'logo' ? 'sellers/logos' : 'sellers/banners')
      if (type === 'logo') setPendingLogo(result)
      else setPendingBanner(result)
    } catch {
      toast.error('Upload failed')
    } finally {
      if (type === 'logo') setUploadingLogo(false)
      else setUploadingBanner(false)
    }
  }

  const imgPayload = (pending, existing) => {
    if (pending?.url)
      return {
        imagekitUrl: pending.url,
        imagekitFileId: pending.fileId,
        imagekitThumbnail: pending.thumbnailUrl,
        fileName: pending.fileName,
      }
    if (existing?.url)
      return {
        imagekitUrl: existing.url,
        imagekitFileId: existing.fileId,
        imagekitThumbnail: existing.thumbnailUrl,
        fileName: existing.fileName,
      }
    return undefined
  }

  const onSubmit = async (data) => {
    try {
      setSaving(true)
      const sellerId = user?.id || user?._id
      const res = await api.post('/sellers/shop-setup', {
        sellerId,
        ...data,
        shopLogo: imgPayload(pendingLogo, existingLogo),
        shopBanner: imgPayload(pendingBanner, existingBanner),
      })
      if (res.data.success) {
        toast.success('Shop saved')
        updateUser({
          ...user,
          shop: {
            ...user?.shop,
            ...data,
            isSetup: true,
            logo: pendingLogo
              ? { url: pendingLogo.url, fileId: pendingLogo.fileId }
              : existingLogo,
            banner: pendingBanner
              ? { url: pendingBanner.url, fileId: pendingBanner.fileId }
              : existingBanner,
          },
        })
        setPendingLogo(null)
        setPendingBanner(null)
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LinearProgress sx={{ bgcolor: st.line, '& .MuiLinearProgress-bar': { bgcolor: st.accent } }} />
  }

  return (
    <>
      <PageHeader
        title="Shop"
        description="Public storefront on VettCode — name, visuals, and business info buyers see before purchasing your apps."
      />

      {/* Compact live preview */}
      <Panel noPadding sx={{ mb: 2 }}>
        <Box
          sx={{
            height: 100,
            bgcolor: st.panelMuted,
            backgroundImage: bannerPreview ? `url(${bannerPreview})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderBottom: `1px solid ${st.line}`,
          }}
        />
        <Box sx={{ display: 'flex', gap: 2, p: 2, alignItems: 'flex-end', mt: -3 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: st.radius,
              border: `2px solid ${st.panel}`,
              bgcolor: st.panelMuted,
              overflow: 'hidden',
              flexShrink: 0,
              backgroundImage: logoPreview ? `url(${logoPreview})` : 'none',
              backgroundSize: 'cover',
            }}
          />
          <Box sx={{ minWidth: 0, pb: 0.5 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '17px', color: st.ink }} noWrap>
              {w.shopName || 'Shop name'}
            </Typography>
            <Typography sx={{ fontSize: '12px', color: st.inkSecondary, fontFamily: st.fontMono }}>
              {w.city || 'City'} · {BUSINESS_TYPES.find((b) => b.value === w.businessType)?.label || 'Category'}
            </Typography>
          </Box>
        </Box>
        <Stack direction="row" spacing={1} sx={{ px: 2, pb: 2 }}>
          <Button
            size="small"
            variant="outlined"
            disabled={uploadingLogo}
            onClick={() => logoRef.current?.click()}
            sx={{ textTransform: 'none', borderColor: st.line, fontSize: '12px' }}
          >
            {uploadingLogo ? 'Uploading…' : 'Logo'}
          </Button>
          <Button
            size="small"
            variant="outlined"
            disabled={uploadingBanner}
            onClick={() => bannerRef.current?.click()}
            sx={{ textTransform: 'none', borderColor: st.line, fontSize: '12px' }}
          >
            {uploadingBanner ? 'Uploading…' : 'Banner'}
          </Button>
        </Stack>
        <input ref={logoRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0], 'logo')} />
        <input ref={bannerRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0], 'banner')} />
      </Panel>

      <Panel>
        <Box component="form" id="shop-form" onSubmit={handleSubmit(onSubmit)}>
          <Typography sx={{ fontSize: '13px', fontWeight: 600, color: st.ink, mb: 2 }}>
            Store details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FieldLabel required>Shop name</FieldLabel>
              <TextField
                fullWidth
                {...register('shopName', { required: 'Required', minLength: { value: 3, message: 'Min 3 chars' } })}
                error={!!errors.shopName}
                helperText={errors.shopName?.message}
                sx={inputSx}
              />
            </Grid>
            <Grid item xs={12}>
              <FieldLabel required>Description</FieldLabel>
              <TextField
                fullWidth
                multiline
                rows={4}
                {...register('shopDescription', {
                  required: 'Required',
                  minLength: { value: 20, message: 'Min 20 characters' },
                })}
                error={!!errors.shopDescription}
                helperText={errors.shopDescription?.message || `${(w.shopDescription || '').length}/500`}
                inputProps={{ maxLength: 500 }}
                sx={inputSx}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FieldLabel required>Category</FieldLabel>
              <TextField
                fullWidth
                select
                defaultValue=""
                {...register('businessType', { required: 'Required' })}
                error={!!errors.businessType}
                helperText={errors.businessType?.message}
                sx={inputSx}
              >
                {BUSINESS_TYPES.map((t) => (
                  <MenuItem key={t.value} value={t.value}>
                    {t.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FieldLabel>Website</FieldLabel>
              <TextField fullWidth placeholder="https://" {...register('website')} sx={inputSx} />
            </Grid>
            <Grid item xs={12}>
              <FieldLabel required>Address</FieldLabel>
              <TextField
                fullWidth
                {...register('businessAddress', { required: 'Required' })}
                error={!!errors.businessAddress}
                helperText={errors.businessAddress?.message}
                sx={inputSx}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FieldLabel required>City</FieldLabel>
              <TextField
                fullWidth
                {...register('city', { required: 'Required' })}
                error={!!errors.city}
                helperText={errors.city?.message}
                sx={inputSx}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FieldLabel>Tax ID</FieldLabel>
              <TextField fullWidth {...register('taxId')} sx={inputSx} />
            </Grid>
            <Grid item xs={12}>
              <FieldLabel>Business license</FieldLabel>
              <TextField fullWidth {...register('businessLicense')} sx={inputSx} />
            </Grid>
          </Grid>
          <FormFooter saving={saving || uploadingLogo || uploadingBanner} saveLabel="Save shop" formId="shop-form" />
        </Box>
      </Panel>
    </>
  )
}

export default ShopSettings
