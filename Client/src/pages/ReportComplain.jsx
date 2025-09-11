import { useState, useEffect } from "react";
import axios from "axios";
import api from "../lib/axios";

export default function ReportComplain() {
  const [file, setFile] = useState(null);
  const [location, setLocation] = useState({ type: "Point", coordinates: [] });
  const [description, setDescription] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(true);

  // 📍 Auto-fetch location when page loads
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({
            type: "Point",
            coordinates: [longitude, latitude], // GeoJSON format
          });
          setLoadingLocation(false);
        },
        (err) => {
          console.error("Location error:", err);
          setLoadingLocation(false);
        }
      );
    } else {
      console.warn("Geolocation not supported");
      setLoadingLocation(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!file) {
        alert("Please upload a photo.");
        return;
      }
      if (!location.coordinates.length) {
        alert("Unable to fetch GPS location.");
        return;
      }

      // ✅ Step 1: Upload image to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "civicEye_uploads");

      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
        formData
      );

      const photoUrl = uploadRes.data.secure_url;

      // ✅ Step 2: Send to backend
      await api.post(`${import.meta.env.VITE_BACKEND_URL}/complain`, {
        photoUrl,
        description,
        location,
      });

      alert("Complaint submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Upload failed!");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Report a Complaint</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
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

        {/* Complaint Description */}
        <textarea
          placeholder="Optional description"
          className="w-full border px-3 py-2 rounded-lg"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          disabled={loadingLocation}
        >
          {loadingLocation ? "Fetching location..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
}
