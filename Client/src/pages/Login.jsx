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
  const navigation = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.phone || !form.password || !form.role) {
      setError("All fields are required!");
      return;
    }
    setError("");
    console.log("Form Submitted:", form);
    login(form)
      .then((response) => {
        if (response) {
          console.log("Response:", response.data);
          console.log("Login successful");
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          setError("");
          toast.success("Login successful!"); // show toast first
          setTimeout(() => {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user.role === "admin") navigation("/admin/dashboard");
            else if (user.role === "worker") navigation("/worker/dashboard");
            else navigation("/user/dashboard"); // redirect after toast is visible
          }, 1200); // small delay so user can see toast
        }
      })
      .catch((error) => {
        setError("Failed to log in");
        toast.error("Failed to log in");
        console.error(error);
      });
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
            Welcome back! Please login to continue
          </motion.p>
        </div>

        {/* Right side: Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Input */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <label className="block text-base font-semibold mb-2 text-green-700">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-lg bg-white shadow-sm"
              />
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              <label className="block text-base font-semibold mb-2 text-green-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-lg bg-white shadow-sm"
              />
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 mt-2 bg-gradient-to-r from-green-500 via-blue-400 to-purple-400 text-white font-bold rounded-xl shadow-lg hover:from-green-600 hover:to-purple-500 transition text-lg tracking-wide"
            >
              Login
            </motion.button>

            {/* Signup Toggle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center text-gray-600 text-sm mt-4"
            >
              Don’t have an account?{" "}
              <span
                onClick={() => navigation('/signup')} // you can manage state to switch form
                className="text-green-600 font-semibold cursor-pointer hover:underline"
              >
                Sign up
              </span>
            </motion.p>
          </form>
        </motion.div>
      </div>

      {/* Floating shapes remain same */}
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
    </div>
  );
}
