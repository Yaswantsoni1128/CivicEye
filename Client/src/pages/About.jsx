import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Users, MapPin, Clock } from 'lucide-react'

const About = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Secure Platform",
      description: "Your complaints are handled with the highest level of security and privacy."
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: "Community Driven",
      description: "Join thousands of citizens working together to improve our city."
    },
    {
      icon: <MapPin className="w-8 h-8 text-green-600" />,
      title: "Location Based",
      description: "Report issues with precise GPS location for faster resolution."
    },
    {
      icon: <Clock className="w-8 h-8 text-green-600" />,
      title: "Real-time Tracking",
      description: "Track the status of your complaints in real-time."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-green-700 mb-6">
            About Fix My Locality
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Fix My Locality is a citizen-centric platform that empowers communities to report and track civic issues, 
            fostering transparency and accountability in local governance.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
            Our Mission
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-4xl mx-auto">
            Fix My Locality bridges the gap between citizens and local government by providing a 
            transparent, efficient, and user-friendly platform for reporting civic issues. 
            We believe that every citizen has the right to a clean, safe, and well-maintained 
            community, and we're here to make that vision a reality.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default About
