import { motion } from "framer-motion";

export default function HomeSection({ setActive }) {
  const sections = [
    { id: "track", label: "Track Complaints" },
    { id: "report", label: "Report Complaint" },
    { id: "my-complaints", label: "My Complaints" },
    { id: "profile", label: "Profile" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <h2 className="text-lg font-semibold text-green-700">Welcome to your Dashboard</h2>
     

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {sections.map((section) => (
          <div
            key={section.id}
            onClick={() => setActive(section.id)}
            className="cursor-pointer bg-green-100 hover:bg-green-200 text-green-800 font-semibold py-4 px-6 rounded-lg shadow text-center transition"
          >
            {section.label}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
