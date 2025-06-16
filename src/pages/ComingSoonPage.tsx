import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Rocket, 
  Clock, 
  Bell,
  Sparkles,
  Zap
} from 'lucide-react';

interface ComingSoonPageProps {
  title?: string;
  description?: string;
  features?: string[];
  showBackButton?: boolean;
  backTo?: string;
  backLabel?: string;
}

const ComingSoonPage: React.FC<ComingSoonPageProps> = ({
  title = "Coming Soon",
  description = "We're working hard to bring you this amazing feature. Stay tuned for updates!",
  features = [
    "Enhanced user experience",
    "Advanced analytics",
    "Real-time notifications",
    "Seamless integration"
  ],
  showBackButton = true,
  backTo = "/",
  backLabel = "Back to Home"
}) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        {/* Animated Icon */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative">
            <motion.div
              className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-sky-500 rounded-full flex items-center justify-center mb-4"
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(139, 92, 246, 0.3)",
                  "0 0 40px rgba(139, 92, 246, 0.5)",
                  "0 0 20px rgba(139, 92, 246, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Rocket size={40} className="text-white" />
            </motion.div>
            
            {/* Floating particles */}
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ 
                y: [-5, 5, -5],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles size={20} className="text-purple-400" />
            </motion.div>
            
            <motion.div
              className="absolute -bottom-2 -left-2"
              animate={{ 
                y: [5, -5, 5],
                rotate: [360, 180, 0]
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <Zap size={16} className="text-sky-400" />
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-sky-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {title}
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-xl text-gray-300 mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {description}
        </motion.p>

        {/* Features Preview */}
        <motion.div
          className="card max-w-md mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
            <Clock size={18} className="text-purple-400" />
            What's Coming
          </h3>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <motion.li
                key={index}
                className="flex items-center gap-3 text-gray-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              >
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-sky-400 rounded-full flex-shrink-0"></div>
                {feature}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Notification Signup */}
        <motion.div
          className="card bg-gradient-to-br from-purple-900/30 to-sky-900/30 border-purple-500/20 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Bell size={18} className="text-purple-400" />
            <h3 className="text-lg font-semibold">Get Notified</h3>
          </div>
          <p className="text-gray-300 mb-4">
            Be the first to know when this feature launches
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="input flex-grow"
            />
            <button className="btn btn-primary whitespace-nowrap">
              Notify Me
            </button>
          </div>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-sm text-gray-400">Development Progress</span>
          </div>
          <div className="w-full max-w-xs mx-auto bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-sky-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "65%" }}
              transition={{ duration: 1.5, delay: 0.9 }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">65% Complete</p>
        </motion.div>

        {/* Back Button */}
        {showBackButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <Link
              to={backTo}
              className="btn btn-ghost inline-flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              {backLabel}
            </Link>
          </motion.div>
        )}
      </motion.div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-sky-500/10 rounded-full blur-xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>
    </div>
  );
};

export default ComingSoonPage;