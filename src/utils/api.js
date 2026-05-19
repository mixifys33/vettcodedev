import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api' : 'https://easyshop-d00e.onrender.com/api')

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('sellerToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Allow callers to handle expected errors (e.g. optional endpoints not yet deployed)
    if (error.config?.silentError) {
      return Promise.reject(error)
    }

    if (error.response) {
      // Server responded with error
      const { status, data } = error.response
      
      if (status === 401) {
        // Unauthorized - clear storage and redirect to login
        localStorage.clear()
        window.location.href = '/login'
        toast.error('Session expired. Please login again.')
      } else if (status === 403) {
        const sellerBlockedCodes = [
          'SELLER_BANNED',
          'SELLER_SUSPENDED',
          'SELLER_REJECTED',
          'SELLER_INACTIVE',
          'SELLER_PENDING_APPROVAL',
          'SELLER_UNVERIFIED',
        ]
        if (sellerBlockedCodes.includes(data?.code)) {
          localStorage.clear()
          window.location.href = '/login'
          toast.error(data?.error || 'Your seller account access has been restricted.')
        } else {
          toast.error(data?.error || data?.message || 'Access denied')
        }
      } else if (status === 404) {
        toast.error('Resource not found')
      } else if (status >= 500) {
        toast.error('Server error. Please try again later.')
      } else {
        toast.error(data?.error || data?.message || 'An error occurred')
      }
    } else if (error.request) {
      // Request made but no response
      toast.error('Network error. Please check your connection.')
    } else {
      // Something else happened
      toast.error('An unexpected error occurred')
    }
    
    return Promise.reject(error)
  }
)

export default api
export { API_BASE }
