// Application Categories
export const APP_CATEGORIES = [
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
  'CMS/Blog Platform',
  'Dashboard/Admin Panel',
  'Other',
]

// Technology Stack Options
export const TECHNOLOGY_STACK = [
  'React', 'React Native', 'Vue.js', 'Angular', 'Next.js', 'Nuxt.js',
  'Node.js', 'Express', 'NestJS', 'Django', 'Flask', 'FastAPI',
  'Laravel', 'Symfony', 'Ruby on Rails', 'Spring Boot',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase',
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes',
  'GraphQL', 'REST API', 'WebSocket', 'TypeScript', 'JavaScript',
  'Python', 'Java', 'PHP', 'Ruby', 'Go', 'Rust',
  'TailwindCSS', 'Material-UI', 'Bootstrap', 'Sass',
]

// Supported Platforms
export const PLATFORMS = [
  'Web Browser',
  'iOS',
  'Android',
  'Windows',
  'macOS',
  'Linux',
  'Cross-platform',
]

// License Types
export const LICENSE_TYPES = [
  'MIT',
  'Apache 2.0',
  'GPL v3',
  'BSD',
  'ISC',
  'Commercial',
  'Proprietary',
  'Creative Commons',
  'Other',
]

// Currencies
export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'UGX', symbol: 'UGX', name: 'Ugandan Shilling' },
]

// Order Status
export const ORDER_STATUS = {
  pending: { label: 'Pending', color: '#9b59b6', icon: 'HourglassEmpty' },
  processing: { label: 'Processing', color: '#f39c12', icon: 'Schedule' },
  shipped: { label: 'Shipped', color: '#3498db', icon: 'LocalShipping' },
  delivered: { label: 'Delivered', color: '#27ae60', icon: 'CheckCircle' },
  cancelled: { label: 'Cancelled', color: '#e74c3c', icon: 'Cancel' },
  refund_in_progress: { label: 'Refund In Progress', color: '#e67e22', icon: 'Refresh' },
  refunded: { label: 'Refunded', color: '#16a085', icon: 'DoneAll' },
}

// Campaign Types
export const CAMPAIGN_TYPES = [
  { key: 'discount', label: 'Discount', icon: 'LocalOffer', color: '#e74c3c' },
  { key: 'flash_sale', label: 'Flash Sale', icon: 'FlashOn', color: '#f39c12' },
  { key: 'bundle', label: 'Bundle Deal', icon: 'Layers', color: '#27ae60' },
  { key: 'free_access', label: 'Free Access', icon: 'CardGiftcard', color: '#9b59b6' },
  { key: 'launch_promo', label: 'Launch Promo', icon: 'Rocket', color: '#3498db' },
  { key: 'limited_offer', label: 'Limited Offer', icon: 'Timer', color: '#e67e22' },
]

// Campaign Status
export const CAMPAIGN_STATUS = {
  active: { label: 'Active', color: '#27ae60', bg: '#e8f5e9' },
  draft: { label: 'Draft', color: '#f39c12', bg: '#fff8e1' },
  paused: { label: 'Paused', color: '#95a5a6', bg: '#f5f5f5' },
  ended: { label: 'Ended', color: '#e74c3c', bg: '#fdecea' },
}

// Delivery Methods
export const DELIVERY_METHODS = [
  {
    key: 'instant_download',
    label: 'Instant Download',
    icon: 'CloudDownload',
    color: '#6366f1',
    description: 'Buyer gets a download link immediately after payment is confirmed.',
    hasUrl: true,
    urlLabel: 'Download URL',
    urlPlaceholder: 'https://drive.google.com/file/... or direct file link',
    automated: true,
  },
  {
    key: 'email_delivery',
    label: 'Email Delivery',
    icon: 'Email',
    color: '#3b82f6',
    description: 'Source code / files are sent to the buyer email after purchase.',
    hasUrl: false,
    hasNote: true,
    noteLabel: 'Email instructions for buyer',
    notePlaceholder: 'e.g. You will receive the source code at your registered email within 1 hour.',
    automated: true,
  },
  {
    key: 'github_access',
    label: 'GitHub Repository Access',
    icon: 'GitHub',
    color: '#1a1f36',
    description: 'Buyer receives collaborator access to your private GitHub repository.',
    hasUrl: true,
    urlLabel: 'GitHub Repository URL',
    urlPlaceholder: 'https://github.com/username/repository',
    hasNote: true,
    noteLabel: 'Instructions for buyer',
    notePlaceholder: 'e.g. Send your GitHub username to our email and we will add you as a collaborator within 24 hours.',
    automated: false,
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp / Telegram',
    icon: 'Chat',
    color: '#25d366',
    description: 'You manually send the files to the buyer via WhatsApp or Telegram.',
    hasUrl: false,
    hasNote: true,
    noteLabel: 'Contact number / username',
    notePlaceholder: 'e.g. WhatsApp: +256 700 000000 or Telegram: @yourusername',
    automated: false,
  },
  {
    key: 'google_drive',
    label: 'Google Drive / Dropbox',
    icon: 'FolderOpen',
    color: '#f59e0b',
    description: 'Share a folder link with the buyer after purchase.',
    hasUrl: true,
    urlLabel: 'Shared Folder URL',
    urlPlaceholder: 'https://drive.google.com/drive/folders/... or Dropbox link',
    hasNote: true,
    noteLabel: 'Access instructions',
    notePlaceholder: 'e.g. Access will be granted within 24 hours of purchase.',
    automated: false,
  },
  {
    key: 'custom',
    label: 'Custom Instructions',
    icon: 'Description',
    color: '#8b5cf6',
    description: 'Provide custom delivery instructions to the buyer.',
    hasUrl: false,
    hasNote: true,
    noteLabel: 'Custom delivery instructions',
    notePlaceholder: 'Describe how the buyer will receive the product...',
    automated: false,
  },
]

// Verification Status
export const VERIFICATION_STATUS = {
  verified: { label: 'Verified', color: '#27ae60', icon: 'Verified' },
  pending: { label: 'Pending', color: '#f39c12', icon: 'Schedule' },
  rejected: { label: 'Rejected', color: '#e74c3c', icon: 'Cancel' },
}

// Seller Status
export const SELLER_STATUS = {
  active: { label: 'Active', color: '#059669', bg: '#05966915' },
  pending: { label: 'Pending', color: '#d97706', bg: '#d9770615' },
  suspended: { label: 'Suspended', color: '#dc2626', bg: '#dc262615' },
  banned: { label: 'Banned', color: '#94a3b8', bg: '#94a3b815' },
}

// Approval Status
export const APPROVAL_STATUS = {
  pending_review: { label: 'Pending Review', color: '#d97706' },
  approved: { label: 'Approved', color: '#059669' },
  rejected: { label: 'Rejected', color: '#dc2626' },
}
