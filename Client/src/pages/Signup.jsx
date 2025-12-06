import { useState } from "react";
import { motion } from "framer-motion";
import { requestOtp, verifyOtp, signup } from "../lib/api";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import bgImg from "../assets/bg.jpg";

export default function SignupPage() {
  const [step, setStep] = useState(1); // 1 = phone+OTP, 2 = details
  const [form, setForm] = useState({
    phone: "",
    otp: "",
    name: "",
    email: "",
    password: "",
    role: "citizen",
  });
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const navigation = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const requestOtpHandler = async () => {
    if (!form.phone) {
      setError("Please enter phone number");
      toast.error("Please enter phone number");
      return;
    }

    try {
      const response = await requestOtp({ phone: form.phone });
      if (response) {
        setOtpSent(true);
        setError("");
        toast.success("OTP sent successfully");
        console.log("OTP requested for:", form.phone);
      }
    } catch (error) {
      const errorMessage = error.message || "Failed to send OTP";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("OTP request error:", error);
    }
  };

  const verifyOtpHandler = async () => {
    if (!form.otp) {
      setError("Please enter OTP");
      toast.error("Please enter OTP");
      return;
    }
    
    try {
      const response = await verifyOtp({ phone: form.phone, otp: form.otp });
      if (response) {
        setVerified(true);
        setStep(2);
        setError("");
        toast.success("OTP verified successfully");
        console.log("OTP verified");
      }
    } catch (error) {
      const errorMessage = error.message || "Failed to verify OTP";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("OTP verification error:", error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required!");
      toast.error("All fields are required!");
      return;
    }
    setError("");
    console.log("Signup data:", form);
    
    try {
      const response = await signup(form);
      if (response) {
        console.log("Signup successful");
        toast.success("Signup successful!");
        navigation("/login");
      }
    } catch (error) {
      const errorMessage = error.message || "Failed to sign up";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 py-4 sm:py-8">
      <img
        src={bgImg}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover opacity-20 sm:opacity-30 z-0"
        style={{ pointerEvents: "none" }}
      />

      {/* Main flex container (responsive layout) */}
      <div className="relative z-10 flex flex-col lg:flex-row w-full max-w-6xl items-center justify-center lg:justify-between px-4 sm:px-6 gap-6 sm:gap-8 lg:gap-12">
        {/* Left side: Logo + Heading */}
        <div className="flex flex-col items-center text-center lg:items-center lg:text-left w-full lg:w-auto">
          <motion.img
            src={"/fix_my_locality.png"}
            alt="Fix My Locality Logo"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40 rounded-full shadow-lg mb-3 sm:mb-4 border-2 sm:border-4 border-green-400 bg-white"
          />
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-green-700 drop-shadow-lg tracking-wide mb-2 sm:mb-3 lg:mb-4"
          >
            Fix My Locality
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 font-medium px-2 sm:px-0"
          >
            {step === 1 ? "Join our community! Let's get started" : "Complete your profile to continue"}
          </motion.p>
        </div>

        {/* Right side: Signup Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full sm:w-full lg:flex-1 lg:max-w-md bg-white/90 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 p-4 sm:p-6 lg:p-8"
        >
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl sm:text-3xl font-bold text-center text-green-700 mb-4 sm:mb-6 lg:mb-8"
          >
            {step === 1 ? "Get Started" : "Complete Profile"}
          </motion.h2>

          {/* Step 1 - Phone + OTP */}
          {step === 1 && (
            <div className="space-y-4 sm:space-y-5 lg:space-y-6">
              {/* Phone Input */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                <label className="block text-sm sm:text-base font-semibold mb-2 text-green-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-green-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-base sm:text-lg bg-white shadow-sm"
                />
              </motion.div>

              {/* OTP Input - Only show when OTP is sent */}
              {otpSent && (
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.7 }}
                >
                  <label className="block text-sm sm:text-base font-semibold mb-2 text-green-700">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    name="otp"
                    value={form.otp}
                    onChange={handleChange}
                    placeholder="Enter the 6-digit code"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-green-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-base sm:text-lg bg-white shadow-sm"
                  />
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-xs sm:text-sm font-semibold"
                >
                  {error}
                </motion.p>
              )}

              {/* Action Button */}
              <motion.button
                onClick={!otpSent ? requestOtpHandler : verifyOtpHandler}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 sm:py-3 mt-2 bg-gradient-to-r from-green-500 via-blue-400 to-purple-400 text-white font-bold rounded-lg sm:rounded-xl shadow-lg hover:from-green-600 hover:to-purple-500 transition text-base sm:text-lg tracking-wide"
              >
                {!otpSent ? "Send Verification Code" : "Verify Code"}
              </motion.button>
            </div>
          )}

          {/* Step 2 - Signup Details */}
          {step === 2 && (
            <form onSubmit={handleSignup} className="space-y-4 sm:space-y-5 lg:space-y-6">
              {/* Name Input */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                <label className="block text-sm sm:text-base font-semibold mb-2 text-green-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-green-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-base sm:text-lg bg-white shadow-sm"
                />
              </motion.div>

              {/* Email Input */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.7 }}
              >
                <label className="block text-sm sm:text-base font-semibold mb-2 text-green-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-green-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-base sm:text-lg bg-white shadow-sm"
                />
              </motion.div>

              {/* Password Input */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.9 }}
              >
                <label className="block text-sm sm:text-base font-semibold mb-2 text-green-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-green-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-base sm:text-lg bg-white shadow-sm"
                />
              </motion.div>

              {/* Role Selector */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 1.1 }}
              >
                <label className="block text-sm sm:text-base font-semibold mb-2 text-green-700">
                  Sign up as
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-green-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-base sm:text-lg bg-white shadow-sm"
                >
                  <option value="citizen">Citizen</option>
                  <option value="admin">Admin (first admin only)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1 px-1">
                  Admin option works only for the very first admin. After that, new admins must be created by an existing admin.
                </p>
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-xs sm:text-sm font-semibold"
                >
                  {error}
                </motion.p>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 sm:py-3 mt-2 bg-gradient-to-r from-green-500 via-blue-400 to-purple-400 text-white font-bold rounded-lg sm:rounded-xl shadow-lg hover:from-green-600 hover:to-purple-500 transition text-base sm:text-lg tracking-wide"
              >
                Create Account
              </motion.button>
            </form>
          )}

          {/* Login Toggle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center text-gray-600 text-xs sm:text-sm mt-4 sm:mt-5 lg:mt-6"
          >
            Already have an account?{" "}
            <span
              onClick={() => navigation('/login')}
              className="text-green-600 font-semibold cursor-pointer hover:underline"
            >
              Sign in
            </span>
          </motion.p>
        </motion.div>
      </div>

      {/* Floating shapes - hidden on mobile, visible on larger screens */}
      <motion.div
        className="hidden sm:block absolute inset-0 z-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute top-10 left-10 w-12 h-12 sm:w-16 sm:h-16 bg-green-300 rounded-full blur-2xl"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-16 h-16 sm:w-24 sm:h-24 bg-blue-300 rounded-full blur-2xl"
          animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 7 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-8 h-8 sm:w-12 sm:h-12 bg-purple-300 rounded-full blur-2xl"
          animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
        />
      </motion.div>
      
      {/* Global toaster */}
      <Toaster 
        position="top-center"
        reverseOrder={false}
      />
    </div>
  );
}
