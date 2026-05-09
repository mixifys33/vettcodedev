# VettCode Seller Web - Quick Start Guide

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
cd vettcode-seller-web
npm install
```

If you encounter dependency conflicts, use:

```bash
npm install --legacy-peer-deps
```

### 2. Configure Environment

The `.env` file is already configured with:

```env
VITE_API_URL=https://easyshop-d00e.onrender.com/api
VITE_PROJECT_ID=91912c3f-b71d-46a0-ae44-b811bd0d8966
```

### 3. Start Development Server

```bash
npm run dev
```

The app will open at: **http://localhost:3000**

## 🔐 Test Accounts

### Seller Account

- Email: (use your registered seller email)
- Password: (your password)

### Admin Account

- Email: `admin@eshop.ug`
- Password: (admin password)

## 📱 Features You Can Test

### ✅ Fully Functional

1. **Login/Signup** - Create account or login
2. **Dashboard** - View statistics and overview
3. **Create Application** - Full multi-step form
4. **View Applications** - Grid/list view with filters
5. **Application Preview** - Detailed view
6. **Delivery Settings** - Configure delivery methods
7. **Orders** - View and manage orders
8. **Shop Settings** - Update shop information
9. **Profile Settings** - Update personal info
10. **Change Password** - Update password

### 🚧 Placeholder Pages

- Edit Application
- Drafts
- Marketing Campaigns
- Bulk Upload
- Refunds
- Payment Settings
- All Admin Pages

## 🎨 UI Features

### Responsive Design

- ✅ Desktop (1920px+)
- ✅ Laptop (1280px-1919px)
- ✅ Tablet (768px-1279px)
- ✅ Mobile (320px-767px)

### Theme

- Navy (#0a1628) + Gold (#f0a500) color scheme
- Material-UI components
- Smooth animations
- Toast notifications

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📂 Key Files to Know

### Configuration

- `vite.config.js` - Vite configuration
- `.env` - Environment variables
- `package.json` - Dependencies

### Entry Points

- `src/main.jsx` - App entry point
- `src/App.jsx` - Routes configuration
- `src/index.css` - Global styles

### Core Components

- `src/components/layout/DashboardLayout.jsx` - Main layout
- `src/components/auth/ProtectedRoute.jsx` - Route protection

### State Management

- `src/store/authStore.js` - Authentication state

### Utilities

- `src/utils/api.js` - API client
- `src/utils/constants.js` - App constants
- `src/utils/helpers.js` - Helper functions

## 🎯 Testing Workflow

### 1. Authentication Flow

1. Go to http://localhost:3000
2. Click "Sign Up" to create account
3. Fill multi-step form
4. Login with credentials
5. Should redirect to dashboard

### 2. Create Application

1. Click "Create Application" button
2. Fill in Basic Info (step 1)
3. Add pricing and tech stack (step 2)
4. Upload screenshots and links (step 3)
5. Review and submit (step 4)
6. Check "All Applications" page

### 3. Configure Delivery

1. Go to "All Applications"
2. Click menu (3 dots) on an application
3. Select "Delivery Settings"
4. Enable delivery methods
5. Save configuration

### 4. Manage Orders

1. Go to "Orders" from sidebar
2. View order statistics
3. Filter by status tabs
4. Click "View" to see details
5. Update order status

### 5. Update Settings

1. Go to "Settings" from sidebar
2. Click "Shop Settings"
3. Update shop information
4. Save changes
5. Try other settings pages

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- --port 3001
```

### Dependency Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### API Connection Issues

1. Check `.env` file exists
2. Verify API_URL is correct
3. Check network connection
4. Check browser console for errors

### Build Errors

```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Rebuild
npm run build
```

## 📊 Performance Tips

### Development

- Use React DevTools for debugging
- Check Network tab for API calls
- Monitor console for errors

### Production

- Build optimizes automatically
- Code splitting by route
- Lazy loading for images
- Minified CSS/JS

## 🔗 Useful Links

- [React Documentation](https://react.dev)
- [Material-UI Documentation](https://mui.com)
- [Vite Documentation](https://vitejs.dev)
- [React Router Documentation](https://reactrouter.com)
- [React Hook Form](https://react-hook-form.com)

## 💡 Tips

1. **Hot Reload**: Changes auto-refresh in dev mode
2. **Console Logs**: Check browser console for errors
3. **Network Tab**: Monitor API requests
4. **React DevTools**: Install for better debugging
5. **State Inspection**: Use Zustand DevTools

## 🎓 Learning Resources

### For Beginners

1. Start with Login/Signup pages
2. Understand routing in App.jsx
3. Study DashboardLayout component
4. Learn state management in authStore
5. Explore API integration in utils/api.js

### For Advanced

1. Implement remaining placeholder pages
2. Add real-time features (WebSocket)
3. Optimize performance
4. Add analytics
5. Implement PWA features

## 📞 Need Help?

- Check IMPLEMENTATION_STATUS.md for feature status
- Review README.md for detailed documentation
- Check browser console for errors
- Review API responses in Network tab

## 🎉 You're Ready!

Start the dev server and begin testing:

```bash
npm run dev
```

Happy coding! 🚀
