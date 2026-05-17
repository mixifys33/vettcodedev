export const BULK_APPLICATION_FIELDS = [
  { key: 'appName', label: 'Application Name', required: true },
  { key: 'shortDescription', label: 'Short Description', required: true },
  { key: 'detailedDescription', label: 'Detailed Description', required: false },
  { key: 'price', label: 'Price', required: true },
  { key: 'currency', label: 'Currency', required: false },
  { key: 'appCategory', label: 'App Category', required: true },
  { key: 'technologyStack', label: 'Technology Stack', required: false },
  { key: 'supportedPlatforms', label: 'Supported Platforms', required: false },
  { key: 'licenseType', label: 'License Type', required: false },
  { key: 'githubRepo', label: 'GitHub Repository', required: false },
  { key: 'liveDemo', label: 'Live Demo URL', required: false },
  { key: 'screenshots', label: 'Screenshot URLs', required: false },
  { key: 'videoUrl', label: 'Video URL', required: false },
  { key: 'tags', label: 'Tags', required: false },
  { key: 'dependencies', label: 'Dependencies', required: false },
]

export const VALID_APP_CATEGORIES = [
  'Web Application',
  'Mobile App (React Native)',
  'Mobile App (Native iOS)',
  'Mobile App (Native Android)',
  'Desktop Application',
  'API/Backend Service',
  'Chrome Extension',
  'WordPress Plugin',
  'NPM Package/Library',
  'CLI Tool',
  'Game',
  'E-commerce Platform',
  'E-commerce Solution',
  'CMS/Blog Platform',
  'Dashboard/Admin Panel',
  'Other',
]

const REQUIRED_KEYS = BULK_APPLICATION_FIELDS.filter((f) => f.required).map((f) => f.key)

export const validateApplicationRow = (row, rowIndex = 0) => {
  const issues = []
  const label = row.appName?.trim() || `Row ${rowIndex + 1}`

  REQUIRED_KEYS.forEach((key) => {
    const field = BULK_APPLICATION_FIELDS.find((f) => f.key === key)
    const val = row[key]
    if (val === undefined || val === null || String(val).trim() === '') {
      issues.push(`${field?.label || key} is required`)
    }
  })

  if (row.price !== undefined && row.price !== '' && Number.isNaN(Number(row.price))) {
    issues.push('Price must be a number')
  }

  if (row.appCategory?.trim() && !VALID_APP_CATEGORIES.includes(row.appCategory.trim())) {
    issues.push(`Invalid category: "${row.appCategory}"`)
  }

  if (issues.length) {
    return { valid: false, label, issues }
  }
  return { valid: true, label, issues: [] }
}

export const prepareApplicationsForApi = (rows) =>
  rows.map((row) => ({
    appName: String(row.appName || '').trim(),
    shortDescription: String(row.shortDescription || '').trim(),
    detailedDescription: String(row.detailedDescription || '').trim(),
    price: parseFloat(row.price) || 0,
    currency: String(row.currency || 'USD').trim() || 'USD',
    appCategory: String(row.appCategory || '').trim(),
    technologyStack: row.technologyStack,
    supportedPlatforms: row.supportedPlatforms,
    licenseType: row.licenseType,
    githubRepo: row.githubRepo,
    liveDemo: row.liveDemo,
    screenshots: row.screenshots,
    videoUrl: row.videoUrl,
    tags: row.tags,
    dependencies: row.dependencies,
  }))

export const BULK_BATCH_SIZE = 10
export const BULK_UPLOAD_HISTORY_KEY = 'bulkUploadLastResult'
