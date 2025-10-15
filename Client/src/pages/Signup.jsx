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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
      <img
        src={bgImg}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover opacity-30 z-0 animate-bgMove"
        style={{ pointerEvents: "none" }}
      />

      {/* Main flex container (side by side layout) */}
      <div className="relative z-10 flex w-full max-w-6xl items-center justify-between px-6 gap-12">
        {/* Left side: Logo + Heading */}
        <div className="flex flex-col items-center justify-center md:items-center text-center md:text-left ">
          <motion.img
            src={"/civicEyeLogo.jpg"}
            alt="Civic Eye Logo"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="h-40 w-40 rounded-full shadow-lg mb-4 border-4 border-green-400 bg-white"
          />
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-7xl font-extrabold text-green-700 drop-shadow-lg tracking-wide mb-4"
          >
            Civic Eye
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-2xl text-gray-700 font-medium"
          >
            {step === 1 ? "Join our community! Let's get started" : "Complete your profile to continue"}
          </motion.p>
        </div>

        {/* Right side: Signup Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 p-8"
        >
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl font-bold text-center text-green-700 mb-8"
          >
            {step === 1 ? "Get Started" : "Complete Profile"}
          </motion.h2>

          {/* Step 1 - Phone + OTP */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Phone Input */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                <label className="block text-base font-semibold mb-2 text-green-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-lg bg-white shadow-sm"
                />
              </motion.div>

              {/* OTP Input - Only show when OTP is sent */}
              {otpSent && (
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.7 }}
                >
                  <label className="block text-base font-semibold mb-2 text-green-700">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    name="otp"
                    value={form.otp}
                    onChange={handleChange}
                    placeholder="Enter the 6-digit code"
                    className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-lg bg-white shadow-sm"
                  />
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm font-semibold"
                >
                  {error}
                </motion.p>
              )}

              {/* Action Button */}
              <motion.button
                onClick={!otpSent ? requestOtpHandler : verifyOtpHandler}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 mt-2 bg-gradient-to-r from-green-500 via-blue-400 to-purple-400 text-white font-bold rounded-xl shadow-lg hover:from-green-600 hover:to-purple-500 transition text-lg tracking-wide"
              >
                {!otpSent ? "Send Verification Code" : "Verify Code"}
              </motion.button>
            </div>
          )}

          {/* Step 2 - Signup Details */}
          {step === 2 && (
            <form onSubmit={handleSignup} className="space-y-6">
              {/* Name Input */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                <label className="block text-base font-semibold mb-2 text-green-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-lg bg-white shadow-sm"
                />
              </motion.div>

              {/* Email Input */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.7 }}
              >
                <label className="block text-base font-semibold mb-2 text-green-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-lg bg-white shadow-sm"
                />
              </motion.div>

              {/* Password Input */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.9 }}
              >
                <label className="block text-base font-semibold mb-2 text-green-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-lg bg-white shadow-sm"
                />
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm font-semibold"
                >
                  {error}
                </motion.p>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 mt-2 bg-gradient-to-r from-green-500 via-blue-400 to-purple-400 text-white font-bold rounded-xl shadow-lg hover:from-green-600 hover:to-purple-500 transition text-lg tracking-wide"
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
            className="text-center text-gray-600 text-sm mt-6"
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

      {/* Floating shapes */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute top-10 left-10 w-16 h-16 bg-green-300 rounded-full blur-2xl animate-float"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-24 h-24 bg-blue-300 rounded-full blur-2xl animate-float"
          animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 7 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-12 h-12 bg-purple-300 rounded-full blur-2xl animate-float"
          animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
        />
      </motion.div>
      
      {/* Global toaster */}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
