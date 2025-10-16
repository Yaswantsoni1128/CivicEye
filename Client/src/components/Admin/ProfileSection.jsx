import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, X } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminProfileSection() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || ""
      });
    }
  }, []);




  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!user) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading profile...</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Profile</h2>
                <p className="text-green-100">Manage your account information</p>
              </div>
            </div>
            
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ) : (
                <div className="flex items-center space-x-2 text-gray-900">
                  <User className="w-4 h-4" />
                  <span>{user.name || "Not provided"}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ) : (
                <div className="flex items-center space-x-2 text-gray-900">
                  <Mail className="w-4 h-4" />
                  <span>{user.email || "Not provided"}</span>
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ) : (
                <div className="flex items-center space-x-2 text-gray-900">
                  <Phone className="w-4 h-4" />
                  <span>{user.phone || "Not provided"}</span>
                </div>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <div className="flex items-center space-x-2 text-gray-900">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {user.role || "Citizen"}
                </span>
              </div>
            </div>
          </div>

         
        </div>
      </div>
    </motion.div>
  );
}
