import { format, formatDistanceToNow } from 'date-fns'

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    UGX: 'UGX ',
  }
  
  const symbol = currencySymbols[currency] || currency
  const formattedAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: currency === 'UGX' ? 0 : 2,
    maximumFractionDigits: currency === 'UGX' ? 0 : 2,
  }).format(amount)
  
  return currency === 'UGX' ? `${symbol}${formattedAmount}` : `${symbol}${formattedAmount}`
}

// Format date
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return ''
  return format(new Date(date), formatStr)
}

// Format relative time
export const formatRelativeTime = (date) => {
  if (!date) return ''
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

// Validate email
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Validate URL
export const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Generate random color
export const generateColor = (seed) => {
  const colors = [
    '#e74c3c', '#f39c12', '#27ae60', '#3498db', '#9b59b6',
    '#1abc9c', '#e67e22', '#2c3e50', '#16a085', '#c0392b',
  ]
  const index = seed ? seed.length % colors.length : Math.floor(Math.random() * colors.length)
  return colors[index]
}

// Download file
export const downloadFile = (url, filename) => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy:', err)
    return false
  }
}

// Debounce function
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Parse CSV
export const parseCSV = (text) => {
  const lines = text.split('\n').filter(line => line.trim())
  if (lines.length === 0) return { headers: [], rows: [] }
  
  const headers = lines[0].split(',').map(h => h.trim())
  const rows = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim())
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index] || ''
      return obj
    }, {})
  })
  
  return { headers, rows }
}

// Generate CSV template
export const generateCSVTemplate = (fields) => {
  const headers = fields.map(f => f.label).join(',')
  return headers
}
