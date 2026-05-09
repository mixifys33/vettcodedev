# VettCode Seller & Admin Web Dashboard

A modern, responsive web application for VettCode sellers and administrators to manage their applications, orders, and business operations.

## Features

### Seller Features

- ✅ **Dashboard** - Overview of applications, orders, and revenue
- ✅ **Application Management** - Create, view, edit, and delete applications
- ✅ **Order Management** - Track and manage customer orders
- 🚧 **Marketing Campaigns** - Create and manage promotional campaigns
- 🚧 **Bulk Upload** - Upload multiple applications at once
- 🚧 **Delivery Settings** - Configure how buyers receive products
- 🚧 **Settings** - Shop, profile, payment, and password management

### Admin Features

- 🚧 **Admin Dashboard** - System-wide statistics and insights
- 🚧 **Seller Management** - Approve and manage seller accounts
- 🚧 **User Management** - Manage buyer accounts
- 🚧 **Application Management** - Review and verify applications
- 🚧 **Push Notifications** - Send notifications to users

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **State Management**: Zustand
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios
- **Rich Text Editor**: React Quill
- **Charts**: Recharts
- **Notifications**: React Hot Toast
- **File Upload**: React Dropzone
- **CSV Parsing**: PapaParse

## Getting Started

### Prerequisites

- Node.js >= 14
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd vettcode-seller-web
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables
   Create a `.env` file in the root directory:

```env
VITE_API_URL=https://easyshop-d00e.onrender.com/api
VITE_PROJECT_ID=91912c3f-b71d-46a0-ae44-b811bd0d8966
```

4. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
vettcode-seller-web/
├── src/
│   ├── components/
│   │   ├── auth/          # Authentication components
│   │   └── layout/        # Layout components (Dashboard, Sidebar, etc.)
│   ├── pages/
│   │   ├── auth/          # Login, Signup, Forgot Password
│   │   ├── seller/        # Seller pages
│   │   └── admin/         # Admin pages
│   ├── store/             # Zustand state management
│   ├── utils/             # Utility functions and constants
│   ├── App.jsx            # Main app component with routes
│   ├── main.jsx           # App entry point
│   └── index.css          # Global styles
├── public/                # Static assets
├── .env                   # Environment variables
├── package.json           # Dependencies and scripts
└── vite.config.js         # Vite configuration
```

## Key Features Implementation

### Authentication

- Email/password login for sellers
- Admin auto-detection (admin@eshop.ug)
- Protected routes with role-based access
- Session persistence with localStorage

### Dashboard

- Real-time statistics (applications, orders, revenue)
- Onboarding checklist for new sellers
- Quick actions and shortcuts
- Recent orders and top applications

### Application Management

- Multi-step creation wizard
- Rich text editor for descriptions
- Image upload with preview
- Technology stack and platform selection
- Draft saving functionality
- Grid and list view modes
- Advanced filtering and search

### Order Management

- Order status tracking
- Status update workflow
- Customer information display
- Revenue calculations
- Tab-based filtering

## API Integration

The application integrates with the VettCode backend API:

- **Base URL**: `https://easyshop-d00e.onrender.com/api`
- **Authentication**: Bearer token in Authorization header
- **Endpoints**: RESTful API with JSON payloads

## Styling & Theming

- Custom Material-UI theme with VettCode branding
- Navy (#0a1628) and Gold (#f0a500) color scheme
- Responsive design for mobile, tablet, and desktop
- Consistent spacing and typography
- Smooth transitions and animations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Status

✅ = Completed
🚧 = Under Construction

### Completed Features

- Authentication (Login, Signup, Forgot Password)
- Dashboard Layout with Sidebar Navigation
- Seller Dashboard with Statistics
- All Applications Page (Grid/List View)
- Create Application (Multi-step Form)
- Order Management

### In Progress

- Edit Application
- Application Preview
- Delivery Settings
- Marketing Campaigns
- Bulk Upload
- Settings Pages
- Admin Features

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Proprietary - VettCode Platform

## Support

For support, email support@vettcode.com or contact the development team.
