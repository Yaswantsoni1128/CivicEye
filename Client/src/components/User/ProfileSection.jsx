import { motion } from "framer-motion";

export default function ProfileSection() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-lg font-semibold text-green-700">Profile</h2>
      <p className="mt-2 text-gray-700">Updating soon...</p>
    </motion.div>
  );
}
