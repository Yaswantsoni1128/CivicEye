import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { reportComplaint } from "../../lib/api.js";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function ReportComplaintSection() {
  const [file, setFile] = useState(null);
  const [location, setLocation] = useState({ type: "Point", coordinates: [] });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 📍 Auto-fetch location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ type: "Point", coordinates: [longitude, latitude] });
          setLoadingLocation(false);
        },
        (err) => {
          console.error("Location error:", err);
          setLoadingLocation(false);
          toast.error("Unable to fetch location");
        }
      );
    } else {
      console.warn("Geolocation not supported");
      setLoadingLocation(false);
      toast.error("Geolocation not supported in your browser");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please upload a photo.");
      return;
    }
    if (!location.coordinates.length) {
      toast.error("Unable to fetch GPS location.");
      return;
    }

    setSubmitting(true);

    // Step 1: Upload image to Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "civicEye_uploads");

    axios
      .post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
        formData
      )
      .then((uploadRes) => {
        const photoUrl = uploadRes.data.secure_url;

        // Step 2: Send to backend
        return reportComplaint({
          title,
          description,
          photoUrl,
          location,
        });
      })
      .then(() => {
        toast.success("Complaint submitted successfully!");
        setFile(null);
        setTitle("");
        setDescription("");
      })
      .catch((err) => {
        console.error("Error:", err);
        toast.error("Failed to submit complaint. Try again!");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Header Section */}
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-gray-900 mb-2"
          >
            Report an Issue
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-gray-600 max-w-xl mx-auto"
          >
            Help us make your community better by reporting civic issues and problems
          </motion.p>
        </div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4">
            <h2 className="text-lg font-bold text-white">Issue Details</h2>
            <p className="text-green-100 text-sm">Provide as much detail as possible to help us address the issue</p>
          </div>

          <form className="p-6 space-y-4" onSubmit={handleSubmit}>
            {/* Title Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Issue Title *
              </label>
              <input
                type="text"
                placeholder="Brief description of the issue (e.g., 'Broken street light on Main St')"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </motion.div>

            {/* Description Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Detailed Description *
              </label>
              <textarea
                placeholder="Provide detailed information about the issue, including when you noticed it, any safety concerns, etc."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[80px] resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </motion.div>

            {/* Photo Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Photo Evidence *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors duration-300">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="photo-upload"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    {file ? file.name : "Click to upload photo"}
                  </p>
                  <p className="text-xs text-gray-500">Upload a clear photo of the issue</p>
                </label>
              </div>
            </motion.div>

            {/* Location Display */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location (Auto-detected)
              </label>
              <div className="relative">
                <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                  value={
                    location.coordinates.length
                      ? `${location.coordinates[1].toFixed(6)}, ${location.coordinates[0].toFixed(6)}`
                      : loadingLocation
                      ? "Fetching your location..."
                      : "Location not available"
                  }
                  readOnly
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Your location is automatically detected for accurate issue reporting
              </p>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="pt-2"
            >
              <button
                type="submit"
                disabled={loadingLocation || submitting}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting Issue...</span>
                  </div>
                ) : loadingLocation ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Getting Location...</span>
                  </div>
                ) : (
                  "Submit Issue Report"
                )}
              </button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </>
  );
}
