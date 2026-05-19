import { Navigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { useEffect } from 'react'

const BLOCKED_SELLER_STATUSES = ['banned', 'suspended']

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, user, checkAuth, logout } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/seller/dashboard" replace />
  }

  if (
    !requireAdmin &&
    !isAdmin &&
    user?.status &&
    BLOCKED_SELLER_STATUSES.includes(user.status)
  ) {
    logout()
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
