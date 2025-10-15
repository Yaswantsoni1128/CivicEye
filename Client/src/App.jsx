import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import UserDashboard from "./pages/user/UserDashboard.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import SignupPage from "./pages/Signup.jsx";
import LoginPage from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* protected user Routes */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/dashboard/track"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/dashboard/report"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/dashboard/complaints"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/dashboard/profile"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
