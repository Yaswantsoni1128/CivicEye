import { useState } from "react";
import { motion } from "framer-motion";
import { requestOtp, verifyOtp, signup } from "../lib/api";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

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

  const requestOtpHandler = () => {
    if (!form.phone) {
      setError("Please enter phone number");
      toast.error("Please enter phone number");
      return;
    }

    requestOtp({ phone: form.phone })
      .then((response) => {
        if (response) {
          setOtpSent(true);
          setError("");
          toast.success("OTP sent successfully");
          console.log("OTP requested for:", form.phone);
        }
      })
      .catch((error) => {
        setError("Failed to send OTP");
        toast.error("Failed to send OTP");
        console.error(error);
      });
  };

  const verifyOtpHandler = () => {
    if (!form.otp) {
      setError("Please enter OTP");
      toast.error("Please enter OTP");
      return;
    }
    verifyOtp({ phone: form.phone, otp: form.otp })
      .then((response) => {
        if (response) {
          setVerified(true);
          setStep(2);
          setError("");
          toast.success("OTP verified successfully");
          console.log("OTP verified");
        }
      })
      .catch((error) => {
        setError("Failed to verify OTP");
        toast.error("Failed to verify OTP");
        console.error(error);
      });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required!");
      toast.error("All fields are required!");
      return;
    }
    setError("");
    console.log("Signup data:", form);
    signup(form)
      .then((response) => {
        if (response) {
          console.log("Signup successful");
          toast.success("Signup successful!");
          navigation("/login"); // redirect to login page
        }
      })
      .catch((error) => {
        setError("Failed to sign up");
        toast.error("Failed to sign up");
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
          Sign Up
        </h2>

        {step === 1 && (
          <div className="space-y-4">
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

            {otpSent && (
              <div>
                <label className="block text-sm font-medium mb-1">OTP</label>
                <input
                  type="text"
                  name="otp"
                  value={form.otp}
                  onChange={handleChange}
                  placeholder="Enter OTP"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {!otpSent ? (
              <button
                onClick={requestOtpHandler}
                className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
              >
                Request OTP
              </button>
            ) : (
              <button
                onClick={verifyOtpHandler}
                className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
              >
                Verify OTP
              </button>
            )}
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter name"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
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

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              Sign Up
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
