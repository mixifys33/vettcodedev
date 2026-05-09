import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      token: null,

      // Login
      login: (userData, token, isAdmin = false) => {
        localStorage.setItem(isAdmin ? 'adminToken' : 'sellerToken', token)
        localStorage.setItem(isAdmin ? 'currentAdmin' : 'currentSeller', JSON.stringify(userData))
        
        set({
          user: userData,
          token,
          isAuthenticated: true,
          isAdmin,
        })
      },

      // Logout
      logout: () => {
        localStorage.clear()
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isAdmin: false,
        })
      },

      // Update user
      updateUser: (userData) => {
        const { isAdmin } = get()
        localStorage.setItem(isAdmin ? 'currentAdmin' : 'currentSeller', JSON.stringify(userData))
        set({ user: userData })
      },

      // Check if authenticated
      checkAuth: () => {
        const adminToken = localStorage.getItem('adminToken')
        const sellerToken = localStorage.getItem('sellerToken')
        const currentAdmin = localStorage.getItem('currentAdmin')
        const currentSeller = localStorage.getItem('currentSeller')

        if (adminToken && currentAdmin) {
          try {
            const user = JSON.parse(currentAdmin)
            set({
              user,
              token: adminToken,
              isAuthenticated: true,
              isAdmin: true,
            })
            return true
          } catch (err) {
            console.error('Failed to parse admin data:', err)
          }
        } else if (sellerToken && currentSeller) {
          try {
            const user = JSON.parse(currentSeller)
            set({
              user,
              token: sellerToken,
              isAuthenticated: true,
              isAdmin: false,
            })
            return true
          } catch (err) {
            console.error('Failed to parse seller data:', err)
          }
        }

        return false
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
        token: state.token,
      }),
    }
  )
)

export default useAuthStore
