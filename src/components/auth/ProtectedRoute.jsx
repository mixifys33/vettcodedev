import { Navigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { useEffect } from 'react'

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/seller/dashboard" replace />
  }

  return children
}

export default ProtectedRoute
