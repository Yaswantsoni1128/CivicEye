import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../lib/axios.js";

export default function Complain() {
  const { id } = useParams(); // get complaint id from URL
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await api.get(`/complain/${id}`);
        setComplaint(res.data.complaint);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch complaint");
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  if (loading) return <p className="text-center">Loading complaint...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!complaint) return <p className="text-center">No complaint found</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Complaint Details
      </h2>

      {/* Complaint Image */}
      {complaint.photoUrl && (
        <img
          src={complaint.photoUrl}
          alt="Complaint"
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
      )}

      {/* Complaint Info */}
      <div className="space-y-2 text-gray-700">
        <p>
          <span className="font-semibold">Description:</span>{" "}
          {complaint.description || "No description provided"}
        </p>
        <p>
          <span className="font-semibold">Type:</span> {complaint.type}
        </p>
        <p>
          <span className="font-semibold">Priority:</span>{" "}
          <span
            className={`px-2 py-1 rounded ${
              complaint.priority === "high"
                ? "bg-red-100 text-red-700"
                : complaint.priority === "medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {complaint.priority}
          </span>
        </p>
        <p>
          <span className="font-semibold">Status:</span> {complaint.status}
        </p>
        <p>
          <span className="font-semibold">Location:</span>{" "}
          {complaint.location?.coordinates?.length
            ? `${complaint.location.coordinates[1]}, ${complaint.location.coordinates[0]}`
            : "Not available"}
        </p>
        <p>
          <span className="font-semibold">Assigned To:</span>{" "}
          {complaint.assignedTo
            ? `${complaint.assignedTo.name} (${complaint.assignedTo.phone})`
            : "Not yet assigned"}
        </p>
        <p>
          <span className="font-semibold">Feedback:</span>{" "}
          {complaint.feedback || "No feedback yet"}
        </p>
      </div>

      <div className="mt-6">
        <Link
          to="/my-complaints"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Back to My Complaints
        </Link>
      </div>
    </div>
  );
}
