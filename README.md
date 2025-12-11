# Fix My Locality

A comprehensive civic issue reporting and management platform that connects citizens, workers, and administrators to efficiently resolve local problems. Built with modern web technologies to provide a seamless experience for reporting, tracking, and managing civic complaints.

## 🌟 Features

### For Citizens (Users)
- **Secure Authentication**: Phone-based OTP verification and password login
- **Complaint Reporting**: 
  - GPS-enabled location capture
  - Photo evidence upload (device or camera)
  - Real-time address detection
  - Detailed complaint descriptions
- **Complaint Tracking**: Real-time status updates with timeline view
- **My Complaints**: View all submitted complaints with search and filter
- **User Profile**: Manage account details and view statistics

### For Workers
- **Assigned Complaints Dashboard**: View and manage assigned complaints
- **Status Updates**: Update complaint status (pending, in-progress, resolved)
- **Timeline Management**: Add updates and notes to complaint timeline
- **Performance Tracking**: Monitor workload and completion rates
- **Worker Profile**: Manage personal information

### For Administrators
- **Complaint Management**: 
  - View all complaints across the platform
  - Assign complaints to workers
  - Update complaint status
  - View detailed complaint timelines
- **Worker Management**: 
  - Create, edit, and delete worker accounts
  - Monitor worker performance
  - Track workload distribution
- **User Management**: Manage all user accounts (citizens, workers, admins)
- **Analytics Dashboard**: Overview of platform statistics and metrics
- **Settings**: Configure platform settings

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Beautiful toast notifications
- **Lucide React** - Modern icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Twilio** - OTP verification via SMS
- **Google Generative AI** - AI-powered features
- **Cloudinary** - Image upload and management
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

## 📁 Project Structure

```
CivicEye/
├── Client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── Admin/      # Admin-specific components
│   │   │   ├── User/       # User-specific components
│   │   │   └── Worker/     # Worker-specific components
│   │   ├── pages/          # Page components
│   │   │   ├── Admin/      # Admin dashboard
│   │   │   ├── User/       # User dashboard
│   │   │   └── Worker/     # Worker dashboard
│   │   ├── lib/            # API and utilities
│   │   │   ├── api.js      # API functions
│   │   │   └── axios.js    # Axios configuration
│   │   ├── utils/          # Utility functions
│   │   └── App.jsx         # Main app component
│   └── package.json
│
└── Server/                 # Backend Node.js application
    ├── src/
    │   ├── controllers/    # Request handlers
    │   ├── models/         # Database models
    │   ├── routes/         # API routes
    │   ├── middlewares/   # Custom middlewares
    │   ├── services/       # Business logic
    │   ├── utils/          # Utility functions
    │   └── app.js          # Express app configuration
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB database
- Twilio account (for OTP)
- Cloudinary account (for image uploads)
- Google Generative AI API key (optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Yaswantsoni1128/CivicEye.git
cd CivicEye
```

2. **Install Frontend Dependencies**
```bash
cd Client
npm install
```

3. **Install Backend Dependencies**
```bash
cd ../Server
npm install
```

4. **Environment Configuration**

   **Frontend (.env in Client/)**
   ```env
   VITE_BACKEND_URL=http://localhost:3000
   VITE_CLOUD_NAME=your_cloudinary_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

   **Backend (.env in Server/)**
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   GOOGLE_GEN_AI_API_KEY=your_google_gen_ai_key
   ```

5. **Run the Application**

   **Start Backend Server**
   ```bash
   cd Server
   npm run dev
   ```
   Server will run on `http://localhost:3000`

   **Start Frontend Development Server**
   ```bash
   cd Client
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## 📱 Usage

### For Users
1. Sign up with phone number and verify OTP
2. Complete profile setup
3. Report complaints with location and photo evidence
4. Track complaint status in real-time
5. View all your complaints and their history

### For Workers
1. Login with worker credentials
2. View assigned complaints
3. Update complaint status as you work
4. Add timeline updates
5. Mark complaints as resolved

### For Administrators
1. Login with admin credentials
2. View all complaints and assign to workers
3. Manage worker accounts
4. Monitor platform analytics
5. Configure system settings

## 🔐 Authentication & Authorization

- **JWT-based Authentication**: Secure token-based authentication
- **Role-based Access Control**: Separate dashboards for Users, Workers, and Admins
- **OTP Verification**: Phone number verification via Twilio SMS
- **Protected Routes**: Client-side route protection
- **Token Interceptors**: Automatic token attachment to API requests

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach, works on all devices
- **Smooth Animations**: Framer Motion for delightful interactions
- **Modern UI**: Clean, professional design with Tailwind CSS
- **Loading States**: Proper loading indicators
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Real-time feedback for user actions
- **Modal Dialogs**: Clean modal interfaces for forms and details

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout

### OTP
- `POST /api/otp/send-otp` - Send OTP to phone
- `POST /api/otp/verify-otp` - Verify OTP

### Complaints
- `POST /api/complain` - Create new complaint
- `GET /api/complain/my-complaints` - Get user's complaints
- `GET /api/complain/:id` - Get complaint details
- `PUT /api/complain/:id` - Update complaint
- `GET /api/complain/all` - Get all complaints (admin)

### Workers
- `GET /api/worker/complaints` - Get assigned complaints
- `PUT /api/worker/complaint/:id` - Update complaint status
- `POST /api/worker/timeline` - Add timeline update

### Admin
- `GET /api/admin/stats` - Get platform statistics
- `POST /api/admin/worker` - Create worker
- `PUT /api/admin/worker/:id` - Update worker
- `DELETE /api/admin/worker/:id` - Delete worker
- `PUT /api/admin/complaint/:id/assign` - Assign complaint to worker

## 🚢 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend
- Deploy to platforms like Railway, Render, or Heroku
- Set environment variables in deployment platform
- Ensure MongoDB connection is accessible

## 🌐 Live Demo

**Live Application**: [https://fix-my-locality.vercel.app/](https://fix-my-locality.vercel.app/)

## 📝 License

MIT License

## 👥 Contributors

- **Yaswant** - [@Yaswantsoni1128](https://github.com/Yaswantsoni1128)
- **Srishti** - [@srishtisethi28](https://github.com/srishtisethi28)
- **Vaibhav** - [@vaibhavVS18](https://github.com/vaibhavVS18)

## 🙏 Acknowledgments

- OpenStreetMap for geocoding services
- Cloudinary for image hosting
- Twilio for SMS services
- All open-source contributors whose libraries made this project possible

---

**Made with ❤️ for better civic engagement and community improvement**
