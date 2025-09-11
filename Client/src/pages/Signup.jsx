import { useState } from "react";
import axios from "../lib/axios.js";
import { useNavigate, useLocation } from "react-router-dom";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [step, setStep] = useState("verify"); // "verify" → OTP step, "signup" → full form

  const navigate = useNavigate();
  const location = useLocation();
  const previousPage = location.state?.from || "/";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Step 1: Send OTP
  const handleSendOtp = async () => {
    try {
      await axios.post("/otp/send-otp", { phone: formData.phone });
      setOtpSent(true);
      alert("OTP sent to your phone!");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  // 🔹 Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    try {
      await axios.post("/otp/verify-otp", { phone: formData.phone, otp });
      setStep("signup"); // move to full signup form
      alert("Phone verified!");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  // 🔹 Step 3: Complete Signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/signup", { ...formData });
      console.log("Signup successful:", res.data);
      navigate(previousPage, { replace: true });
    } catch (err) {
      console.error("Error:", err.response?.data?.message || err.message);
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        {/* STEP 1: Phone + OTP Verification */}
        {step === "verify" && (
          <div className="space-y-4">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={otpSent} // lock phone after sending OTP
            />

            {otpSent && (
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}

            {!otpSent ? (
              <button
                onClick={handleSendOtp}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Send OTP
              </button>
            ) : (
              <button
                onClick={handleVerifyOtp}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                Verify OTP
              </button>
            )}
          </div>
        )}

        {/* STEP 2: Full Signup Form */}
        {step === "signup" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Complete Signup
            </button>
          </form>
        )}

        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
