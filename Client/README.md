# Fix My Locality Client

A modern, responsive React application for citizen civic issue reporting and tracking.

## Features

- **User Authentication**: Secure login/signup with OTP verification
- **Complaint Reporting**: GPS-enabled complaint submission with photo uploads
- **Complaint Tracking**: Real-time status tracking with search and filter
- **User Profile**: Editable user profile with account statistics
- **Responsive Design**: Mobile-first design with smooth animations
- **Error Handling**: Comprehensive error boundaries and user feedback

## Tech Stack

- **React 19** - Latest React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Beautiful toast notifications
- **Lucide React** - Modern icon library

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── User/           # User-specific components
│   ├── ErrorBoundary.jsx
│   ├── LoadingSpinner.jsx
│   └── ProtectedRoute.jsx
├── pages/              # Page components
│   ├── User/           # User dashboard pages
│   ├── About.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   └── Signup.jsx
├── lib/                # API and utilities
│   ├── api.js          # API functions
│   └── axios.js        # Axios configuration
├── utils/              # Utility functions
│   └── validation.js   # Form validation
├── App.jsx             # Main app component
└── main.jsx           # App entry point
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```env
VITE_BACKEND_URL=http://localhost:3000
VITE_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=civicEye_uploads
```

4. Start development server:
```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

## Key Features

### Authentication
- Secure login with phone/password
- OTP-based signup verification
- Protected routes with token validation
- Automatic role-based redirection

### Complaint Management
- GPS location capture
- Photo upload with Cloudinary integration
- Real-time status tracking
- Search and filter functionality

### User Experience
- Responsive mobile-first design
- Smooth animations with Framer Motion
- Loading states and error handling
- Toast notifications for user feedback

## API Integration

The app integrates with a Node.js backend API. Key endpoints:

- `POST /auth/login` - User authentication
- `POST /auth/signup` - User registration
- `POST /otp/send-otp` - Send OTP for verification
- `POST /otp/verify-otp` - Verify OTP
- `POST /complain` - Submit complaint
- `GET /complain/my-complaints` - Fetch user complaints

## Error Handling

- Global error boundary for component crashes
- API error handling with user-friendly messages
- Form validation with real-time feedback
- Network error detection and retry mechanisms

## Performance Optimizations

- Code splitting with React.lazy (ready for implementation)
- Image optimization with Cloudinary
- Efficient re-renders with proper state management
- Lazy loading for better initial load times

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow the existing code style
2. Use meaningful commit messages
3. Test your changes thoroughly
4. Update documentation as needed

## License

This project is part of the CivicEye platform for citizen engagement and civic issue reporting.