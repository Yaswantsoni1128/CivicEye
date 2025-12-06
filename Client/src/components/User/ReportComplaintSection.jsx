import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { reportComplaint } from "../../lib/api.js";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function ReportComplaintSection() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [useCamera, setUseCamera] = useState(false);
  const [location, setLocation] = useState({ type: "Point", coordinates: [] });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Address details from reverse geocoding
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [loadingAddress, setLoadingAddress] = useState(false);

  // Function to fetch address details using reverse geocoding
  const fetchAddressDetails = async (latitude, longitude) => {
    setLoadingAddress(true);

    try {
      let addressData = {};
      let displayName = "";

      // Using OpenStreetMap Nominatim API (No API key needed)
      // Note: User-Agent header is blocked by browsers, so we skip it
      try {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=18&accept-language=en`
        );

        addressData = res.data.address || {};
        displayName = res.data.display_name || "";
        
        console.log("Nominatim Response:", {
          address: addressData,
          displayName: displayName
        });
      } catch (err) {
        console.error("Nominatim API error:", err);
        toast.error("Unable to fetch location details. Please try again.");
        setLoadingAddress(false);
        return;
      }

      // Extract State and District
      // STATE
      const stateValue =
        addressData.state ||
        addressData.region ||
        addressData.province ||
        "State not available";
      setState(stateValue);

      // DISTRICT
      const districtValue =
        addressData.city_district ||
        addressData.district ||
        addressData.county ||
        addressData.city ||
        addressData.town ||
        addressData.municipality ||
        "District not available";
      setDistrict(districtValue);

      console.log("FINAL ADDRESS:", {
        state: stateValue,
        district: districtValue,
        raw: addressData,
      });
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      setState("State not available");
      setDistrict("District not available");
      toast.error("Unable to fetch address details. Please check your location permissions.");
    } finally {
      setLoadingAddress(false);
    }
  };


  // 📍 Auto-fetch location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ type: "Point", coordinates: [longitude, latitude] });
          setLoadingLocation(false);
          // Fetch address details after getting coordinates
          fetchAddressDetails(latitude, longitude);
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

  // Handle file selection (both camera and file upload)
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

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
          state,
          district,
        });
      })
      .then(() => {
        toast.success("Complaint submitted successfully!");
        setFile(null);
        setPreview(null);
        setTitle("");
        setDescription("");
        setState("");
        setDistrict("");
        // Reset file inputs
        const fileInput = document.getElementById("photo-upload");
        const cameraInput = document.getElementById("photo-camera");
        if (fileInput) fileInput.value = "";
        if (cameraInput) cameraInput.value = "";
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
              
              {/* Mode Toggle Buttons */}
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setUseCamera(false)}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
                    !useCamera
                      ? "bg-green-500 text-white shadow-md hover:bg-green-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload from Device
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setUseCamera(true)}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
                    useCamera
                      ? "bg-blue-500 text-white shadow-md hover:bg-blue-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Take Photo
                  </div>
                </button>
              </div>

              {/* File Upload Input (Hidden) */}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="photo-upload"
                onChange={handleFileChange}
                required={!file}
              />

              {/* Camera Input (Hidden) */}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                id="photo-camera"
                onChange={handleFileChange}
                required={!file}
              />

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors duration-300">
                {preview ? (
                  <div className="space-y-3">
                    <div className="relative inline-block">
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setPreview(null);
                          const fileInput = document.getElementById("photo-upload");
                          const cameraInput = document.getElementById("photo-camera");
                          if (fileInput) fileInput.value = "";
                          if (cameraInput) cameraInput.value = "";
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                        title="Remove photo"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">{file?.name || "Photo captured"}</p>
                    <button
                      type="button"
                      onClick={() => {
                        if (useCamera) {
                          document.getElementById("photo-camera")?.click();
                        } else {
                          document.getElementById("photo-upload")?.click();
                        }
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium underline"
                    >
                      {useCamera ? "Retake Photo" : "Change Photo"}
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor={useCamera ? "photo-camera" : "photo-upload"}
                    className="cursor-pointer block"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 hover:bg-gray-200 transition-colors">
                      {useCamera ? (
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      ) : (
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {useCamera ? "Click to take a photo" : "Click to upload photo"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {useCamera ? "Use your device camera to capture the issue" : "Upload a clear photo of the issue"}
                    </p>
                  </label>
                )}
              </div>
            </motion.div>

            {/* Location Coordinates Display */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                GPS Coordinates (Auto-detected)
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
            </motion.div>

            {/* Address Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* State */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.75 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  State *
                </label>
                <div className="relative">
                  <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                    value={loadingAddress ? "Fetching..." : state}
                    readOnly
                  />
                </div>
              </motion.div>

              {/* District */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  District *
                </label>
                <div className="relative">
                  <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                    value={loadingAddress ? "Fetching..." : district}
                    readOnly
                  />
                </div>
              </motion.div>
            </div>
            
            <p className="text-xs text-gray-500 -mt-2">
              Location details are automatically fetched from your GPS location
            </p>

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
