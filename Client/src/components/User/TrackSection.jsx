import { motion } from "framer-motion";

export default function TrackSection() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-lg font-semibold text-green-700">Updating soon...</h2>
    </motion.div>
  );
}
