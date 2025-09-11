
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="text-center mt-16">
      <h2 className="text-3xl font-bold mb-4">Welcome to Smart Complaint System</h2>
      <p className="mb-6">Report and track complaints easily.</p>
      <Link
        to="/reportComplain"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Report Complaint
      </Link>
    </div>
  );
}
