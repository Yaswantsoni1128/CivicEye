import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { login } from "../lib/api";
import toast, { Toaster } from "react-hot-toast";
import bgImg from "../assets/bg.jpg";

export default function LoginPage() {
  const [form, setForm] = useState({
    phone: "",
    password: "",
    role: "citizen",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.phone || !form.password || !form.role) {
      setError("All fields are required!");
      return;
    }
    setError("");
    setLoading(true);
    
    try {
      const response = await login(form);
      if (response && response.data) {
        console.log("Response:", response.data);
        console.log("Login successful");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setError("");
        toast.success("Login successful!");
        setTimeout(() => {
          const user = JSON.parse(localStorage.getItem("user"));
          if(user.role === 'admin') navigation("/admin/dashboard");
          else if(user.role === 'worker') navigation("/worker/dashboard");
          else navigation("/user/dashboard");
        }, 1200);
      }
    } catch (error) {
      const errorMessage = error.message || "Failed to log in";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Login error:", error);
    } finally {
      setLoading(false);
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
            alt="Civic Eye Logo"
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
            Welcome back! Please login to continue
          </motion.p>
        </div>

        {/* Right side: Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full sm:w-full lg:flex-1 lg:max-w-md bg-white/90 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 p-4 sm:p-6 lg:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 lg:space-y-6">
            {/* Phone Input */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <label className="block text-sm sm:text-base font-semibold mb-2 text-green-700">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-green-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-base sm:text-lg bg-white shadow-sm"
              />
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              <label className="block text-sm sm:text-base font-semibold mb-2 text-green-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-green-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-base sm:text-lg bg-white shadow-sm"
              />
            </motion.div>

            {/* Role Selector */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
            >
              <label className="block text-sm sm:text-base font-semibold mb-2 text-green-700">
                Login as
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-green-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-base sm:text-lg bg-white shadow-sm"
              >
                <option value="citizen">Citizen</option>
                <option value="worker">Worker</option>
                <option value="admin">Admin</option>
              </select>
            </motion.div>

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
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`w-full py-2.5 sm:py-3 mt-2 font-bold rounded-lg sm:rounded-xl shadow-lg transition text-base sm:text-lg tracking-wide flex items-center justify-center ${
                loading 
                  ? "bg-green-400 cursor-not-allowed" 
                  : "bg-gradient-to-r from-green-500 via-blue-400 to-purple-400 hover:from-green-600 hover:to-purple-500"
              } text-white`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                  <span className="text-sm sm:text-base">Logging in...</span>
                </>
              ) : (
                "Login"
              )}
            </motion.button>

            {/* Signup Toggle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center text-gray-600 text-xs sm:text-sm mt-3 sm:mt-4"
            >
              Don't have an account?{" "}
              <span
                onClick={() => navigation('/signup')}
                className="text-green-600 font-semibold cursor-pointer hover:underline"
              >
                Sign up
              </span>
            </motion.p>
          </form>
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
