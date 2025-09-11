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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-lg font-semibold text-green-700">Report a Complaint</h2>
        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          {/* Complaint Title */}
          <input
            type="text"
            placeholder="Complaint Title"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Complaint Description */}
          <textarea
            placeholder="Complaint Details"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 min-h-[120px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Upload Image */}
          <input
            type="file"
            accept="image/*"
            className="w-full border px-3 py-2 rounded-lg"
            onChange={(e) => setFile(e.target.files[0])}
          />

          {/* Show auto-fetched location */}
          <input
            type="text"
            className="w-full border px-3 py-2 rounded-lg"
            value={
              location.coordinates.length
                ? `${location.coordinates[1]}, ${location.coordinates[0]}`
                : loadingLocation
                ? "Fetching location..."
                : "Location not available"
            }
            readOnly
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 w-full disabled:opacity-50"
            disabled={loadingLocation || submitting}
          >
            {submitting
              ? "Submitting..."
              : loadingLocation
              ? "Fetching location..."
              : "Submit Complaint"}
          </button>
        </form>
      </motion.div>
    </>
  );
}
