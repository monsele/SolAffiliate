import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { connected } = useWallet();

  return (
    <div className="flex flex-col min-h-screen bg-animate">
      {/* Background decoration elements */}
      <div className="fixed -z-10 top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-purple-600/10 rounded-full blur-[100px] transform -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-sky-500/10 rounded-full blur-[100px] transform translate-y-1/2"></div>
      </div>

      <Header />

      <main className="flex-grow container mx-auto px-4 py-6 md:py-12 mt-16 md:mt-20">
        {/* Show a hint if wallet is not connected */}
        {!connected && (
          <motion.div 
            className="mb-8 p-4 rounded-lg bg-gray-800/50 border border-gray-700 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-300">
              Connect your Solana wallet to access all features
            </p>
          </motion.div>
        )}

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;