import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { login } from "../lib/api";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const [form, setForm] = useState({ phone: "", password: "", role: "citizen" });
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
      toast.success("Login successful!");   // show toast first
      setTimeout(() => {
        navigation("/dashboard"); // redirect after toast is visible
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-green-100">
      <Toaster position="top-right" reverseOrder={false} />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-6 relative z-10"
      >
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select role</option>
              <option value="citizen">Citizen</option>
              <option value="worker">Worker</option>
            </select>
          </div> */}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 mt-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>
      </motion.div>
    </div>
  );
}
