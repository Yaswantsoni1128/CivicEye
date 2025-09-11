import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchUserComplaints } from "../../lib/api.js"; // your API function
import toast, { Toaster } from "react-hot-toast";

export default function MyComplaintsSection() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserComplaints()
      .then((res) => {
        console.log(res.data);
        setComplaints(res.data.complaints || []);
      })
      .catch((err) => {
        console.error("Failed to fetch complaints:", err);
        toast.error("Failed to load your complaints.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-lg font-semibold text-green-700">My Complaints</h2>

        {loading ? (
          <p className="mt-4 text-gray-500">Loading complaints...</p>
        ) : complaints.length === 0 ? (
          <p className="mt-4 text-gray-500">You have not submitted any complaints yet.</p>
        ) : (
          <ul className="mt-4 space-y-4 max-w-3xl">
            {complaints.map((c) => (
              <li
                key={c._id}
                className="p-4 bg-white shadow rounded-lg border flex flex-col md:flex-row gap-4 items-start md:items-center"
              >
                {/* Image */}
                {c.photoUrl && (
                  <img
                    src={c.photoUrl}
                    alt="Complaint"
                    className="w-full md:w-32 h-32 object-cover rounded-lg border"
                  />
                )}

                {/* Details */}
                <div className="flex-1">
                  <div className="font-semibold text-lg">{c.type || "Untitled Complaint"}</div>
                  <div className="text-sm text-gray-600 mt-1">Status: {c.status || "Pending"}</div>
                  {c.description && <div className="text-sm text-gray-700 mt-1">"{c.description}"</div>}
                  {c.type && <div className="text-sm text-gray-500 mt-1">Type: {c.type}</div>}
                  {c.priority !== undefined && (
                    <div className="text-sm text-gray-500 mt-1">Priority: {c.priority}</div>
                  )}
                  {c.assignedTo && (
                    <div className="text-sm text-gray-500 mt-1">
                      Assigned to: {c.assignedTo.name} ({c.assignedTo.phone})
                    </div>
                  )}
                  {c.createdAt && (
                    <div className="text-sm text-gray-400 mt-1">
                      Submitted: {new Date(c.createdAt).toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Complaint ID */}
                <div className="text-sm text-gray-500 mt-2 md:mt-0">
                  #{c._id?.slice(-5).toUpperCase()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </>
  );
}
