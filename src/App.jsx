import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'

// Home
import Home from './pages/Home'

// Auth
import SellerLogin from './pages/auth/SellerLogin'
import SellerSignup from './pages/auth/SellerSignup'
import ForgotPassword from './pages/auth/ForgotPassword'

// Seller Pages
import SellerDashboard from './pages/seller/SellerDashboard'
import AllApplications from './pages/seller/AllApplications'
import CreateApplication from './pages/seller/CreateApplication'
import EditApplication from './pages/seller/EditApplication'
import ApplicationPreview from './pages/seller/ApplicationPreview'
import SellerMarketing from './pages/seller/SellerMarketing'
import SellerDrafts from './pages/seller/SellerDrafts'
import BulkUpload from './pages/seller/BulkUpload'
import BulkEdit from './pages/seller/BulkEdit'
import BulkUploadHistory from './pages/seller/BulkUploadHistory'
import SellerSettings from './pages/seller/SellerSettings'
import ShopSettings from './pages/seller/ShopSettings'
import ProfileSettings from './pages/seller/ProfileSettings'
import PaymentSettings from './pages/seller/PaymentSettings'
import ChangePassword from './pages/seller/ChangePassword'
import SellerRefund from './pages/seller/SellerRefund'
import SellerAnalytics from './pages/seller/SellerAnalytics'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminSellerManagement from './pages/admin/AdminSellerManagement'
import AdminPendingSellers from './pages/admin/AdminPendingSellers'
import AdminUserManagement from './pages/admin/AdminUserManagement'
import AdminUserDetail from './pages/admin/AdminUserDetail'
import AdminApplicationManagement from './pages/admin/AdminApplicationManagement'
import AdminApplicationDetail from './pages/admin/AdminApplicationDetail'
import AdminPushNotifications from './pages/admin/AdminPushNotifications'
import AdminNotificationHistory from './pages/admin/AdminNotificationHistory'

// Layout
import DashboardLayout from './components/layout/DashboardLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Home />} />
        
        {/* Public Routes */}
        <Route path="/login" element={<SellerLogin />} />
        <Route path="/signup" element={<SellerSignup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Seller Routes */}
        <Route
          path="/seller/*"
          element={
            <ProtectedRoute>
              <DashboardLayout userType="seller">
                <Routes>
                  <Route path="dashboard" element={<SellerDashboard />} />
                  <Route path="analytics" element={<SellerAnalytics />} />
                  <Route path="applications" element={<AllApplications />} />
                  <Route path="applications/create" element={<CreateApplication />} />
                  <Route path="applications/edit/:id" element={<EditApplication />} />
                  <Route path="applications/preview/:id" element={<ApplicationPreview />} />
                  <Route path="refunds" element={<SellerRefund />} />
                  <Route path="marketing" element={<SellerMarketing />} />
                  <Route path="drafts" element={<SellerDrafts />} />
                  <Route path="bulk-upload" element={<BulkUpload />} />
                  <Route path="bulk-edit" element={<BulkEdit />} />
                  <Route path="bulk-history" element={<BulkUploadHistory />} />
                  <Route path="settings" element={<SellerSettings />} />
                  <Route path="settings/shop" element={<ShopSettings />} />
                  <Route path="settings/profile" element={<ProfileSettings />} />
                  <Route path="settings/payment" element={<PaymentSettings />} />
                  <Route path="settings/password" element={<ChangePassword />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requireAdmin>
              <DashboardLayout userType="admin">
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="sellers" element={<AdminSellerManagement />} />
                  <Route path="sellers/pending" element={<AdminPendingSellers />} />
                  <Route path="users" element={<AdminUserManagement />} />
                  <Route path="users/:id" element={<AdminUserDetail />} />
                  <Route path="applications" element={<AdminApplicationManagement />} />
                  <Route path="applications/:id" element={<AdminApplicationDetail />} />
                  <Route path="notifications" element={<AdminPushNotifications />} />
                  <Route path="notifications/history" element={<AdminNotificationHistory />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Default Redirects */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  )
}

export default App
