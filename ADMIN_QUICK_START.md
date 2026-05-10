# Admin Web - Quick Start Guide

## 🚀 Getting Started

### 1. Login as Admin

```
URL: http://localhost:5173/login
Email: admin@eshop.ug
Password: [your admin password]
```

The system automatically detects the admin email and routes you to `/admin/dashboard`.

### 2. Admin Routes

All admin routes are under `/admin/*`:

```
/admin/dashboard              - Main dashboard with statistics
/admin/sellers                - Manage all sellers
/admin/sellers/pending        - Review pending seller applications
/admin/users                  - Manage customers
/admin/users/:id              - View user details
/admin/applications           - Manage applications
/admin/notifications          - Send push notifications
/admin/notifications/history  - View notification history
```

## 📋 Implemented Features

### ✅ AdminDashboard

- Overview tab with all statistics
- Sellers tab for seller management
- Notifications tab for push notifications
- Users tab for customer management
- Interactive stat cards
- Quick action buttons

### ✅ AdminSellerManagement

- List all sellers
- Filter by status (All, Active, Pending, Suspended)
- Search by name, email, phone, shop name
- Approve/Reject/Suspend/Unsuspend actions
- Confirmation dialogs

### ✅ AdminPendingSellers

- View all pending seller applications
- Detailed seller information
- Shop details and application notes
- Approve/Reject with one click
- Empty state when no pending sellers

### ✅ AdminPushNotifications

- Send to Users, Sellers, or Everyone
- Quick templates for common messages
- Character limits (title: 100, body: 300)
- Real-time reach statistics
- Recent sent history

## 🔑 Authentication Flow

```javascript
// Login automatically detects admin email
const ADMIN_EMAIL = "admin@eshop.ug";

// On successful login:
localStorage.setItem("adminToken", token);
localStorage.setItem("currentAdmin", JSON.stringify(adminData));

// Protected routes check:
if (requireAdmin && !isAdmin) {
  navigate("/seller/dashboard"); // Redirect non-admins
}
```

## 🛠️ Making API Calls

```javascript
// Get admin token
const getToken = () => localStorage.getItem("adminToken");

// Make authenticated request
const response = await api.get("/admin/endpoint", {
  headers: { Authorization: `Bearer ${getToken()}` },
});

// For push notifications (requires admin secret)
const secret = localStorage.getItem("adminSecret");
const response = await api.post("/push-tokens/broadcast", data, {
  headers: { "x-admin-key": secret },
});
```

## 📝 Adding a New Admin Page

1. **Create the page file**

```javascript
// src/pages/admin/AdminNewPage.jsx
import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import api from "../../utils/api";
import toast from "react-hot-toast";

const AdminNewPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const getToken = () => localStorage.getItem("adminToken");

  const fetchData = async () => {
    try {
      const token = getToken();
      const response = await api.get("/admin/your-endpoint", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Your Page Title
      </Typography>
      {/* Your content */}
    </Box>
  );
};

export default AdminNewPage;
```

2. **Add route in App.jsx**

```javascript
// src/App.jsx
import AdminNewPage from "./pages/admin/AdminNewPage";

// Inside admin routes:
<Route path="new-page" element={<AdminNewPage />} />;
```

3. **Add navigation link (optional)**

```javascript
// In DashboardLayout.jsx or wherever you have admin navigation
<ListItem button onClick={() => navigate("/admin/new-page")}>
  <ListItemIcon>
    <YourIcon />
  </ListItemIcon>
  <ListItemText primary="New Page" />
</ListItem>
```

## 🎨 Common UI Patterns

### Stat Card

```javascript
<Card>
  <CardContent>
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 2,
          bgcolor: "primary.light",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon />
      </Box>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </Box>
  </CardContent>
</Card>
```

### Action Button with Confirmation

```javascript
const [confirmDialog, setConfirmDialog] = useState(false)

// Button
<Button onClick={() => setConfirmDialog(true)}>
  Delete
</Button>

// Dialog
<Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
  <DialogTitle>Confirm Action</DialogTitle>
  <DialogContent>
    <Typography>Are you sure?</Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
    <Button onClick={handleAction} variant="contained">Confirm</Button>
  </DialogActions>
</Dialog>
```

### Loading State

```javascript
if (loading) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
      <CircularProgress />
    </Box>
  );
}
```

### Empty State

```javascript
if (data.length === 0) {
  return (
    <Box sx={{ textAlign: "center", py: 8 }}>
      <Icon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
      <Typography variant="h6" color="text.secondary">
        No data found
      </Typography>
    </Box>
  );
}
```

## 🔔 User Feedback

### Success

```javascript
import toast from "react-hot-toast";

toast.success("Action completed successfully!");
```

### Error

```javascript
toast.error("Something went wrong. Please try again.");
```

### Loading

```javascript
const toastId = toast.loading("Processing...");
// ... do work
toast.success("Done!", { id: toastId });
```

## 🐛 Debugging Tips

### Check Authentication

```javascript
// In browser console
localStorage.getItem("adminToken");
localStorage.getItem("currentAdmin");
```

### Check API Calls

```javascript
// In browser DevTools > Network tab
// Look for requests to /admin/* endpoints
// Check Authorization header
// Check response status and data
```

### Check Routing

```javascript
// In browser console
window.location.pathname; // Current route
```

## 📊 Backend API Requirements

Your backend should have these endpoints:

```javascript
// Dashboard
GET /api/admin/dashboard
Response: { success: true, stats: { sellers: {...}, users: {...}, ... } }

// Sellers
GET /api/admin/sellers?status=active
GET /api/admin/sellers/pending
PATCH /api/admin/sellers/:id/approve
PATCH /api/admin/sellers/:id/reject
PATCH /api/admin/sellers/:id/suspend
PATCH /api/admin/sellers/:id/unsuspend

// Push Notifications
GET /api/push-tokens/stats
POST /api/push-tokens/broadcast
POST /api/push-tokens/send-to-users
POST /api/push-tokens/send-to-sellers
```

## 🎯 Testing Checklist

- [ ] Login with admin email redirects to `/admin/dashboard`
- [ ] Login with seller email redirects to `/seller/dashboard`
- [ ] Dashboard loads statistics correctly
- [ ] Seller management shows all sellers
- [ ] Filters work (All, Active, Pending, Suspended)
- [ ] Search works for name, email, phone, shop
- [ ] Approve action works and updates UI
- [ ] Reject action works and updates UI
- [ ] Suspend action works and updates UI
- [ ] Pending sellers page shows only pending
- [ ] Push notifications can be sent
- [ ] Templates apply correctly
- [ ] Target selection works (Users, Sellers, All)
- [ ] Notification history persists
- [ ] Logout clears admin session

## 🚨 Common Issues

### Issue: "Failed to load data"

**Solution**: Check API endpoint, verify token, check network tab

### Issue: Redirected to login

**Solution**: Token expired, check localStorage, re-login

### Issue: Actions not working

**Solution**: Check confirmation dialog, verify API endpoint, check console

### Issue: Stats not loading

**Solution**: Check `/admin/dashboard` endpoint, verify response format

## 📚 Resources

- [Material-UI Documentation](https://mui.com/)
- [React Router Documentation](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)
- [React Hot Toast](https://react-hot-toast.com/)

## 🎓 Next Steps

1. Test all implemented features
2. Implement remaining admin pages (Users, Applications, History)
3. Add more statistics to dashboard
4. Enhance search and filter capabilities
5. Add export functionality (CSV, PDF)
6. Implement bulk actions
7. Add activity logs
8. Enhance notification templates

---

**Need Help?** Check the full documentation in `ADMIN_IMPLEMENTATION_SUMMARY.md`
