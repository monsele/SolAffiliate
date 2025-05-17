import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, BarChart3, Users } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="py-10 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-sky-500">
              NFT Affiliate Marketing <br />on Solana
            </h1>
            <p className="mt-6 text-xl text-gray-300">
              Connect NFT creators with social media influencers through decentralized affiliate marketing. Earn commissions automatically with every sale.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/marketplace" className="btn btn-primary">
                Explore Campaigns
              </Link>
              <Link to="/create-campaign" className="btn btn-ghost">
                Create Campaign
              </Link>
            </div>
            <div className="mt-8 py-3 px-4 rounded-lg bg-gray-800/50 border border-gray-700 inline-flex items-center">
              <span className="h-2 w-2 bg-green-400 rounded-full mr-2"></span>
              <span className="text-sm text-gray-300">Currently integrated with Solana Devnet</span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative glow">
              <div className="w-full h-[400px] rounded-2xl overflow-hidden relative bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src="https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg" 
                    alt="NFT Artwork" 
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="font-medium text-lg">Featured Campaign</p>
                    <h3 className="text-2xl font-bold mb-2">Cosmic Voyagers Collection</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">12% Commission</span>
                      <button className="btn btn-sm btn-primary">Generate Link</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-xl">
              <p className="text-sm font-medium">Marketplace Activity</p>
              <p className="text-xl font-bold">152 SOL</p>
              <p className="text-xs text-gray-400">Total commissions paid</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
            Our platform connects NFT creators with influencers through a seamless, decentralized process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Create Campaign',
              description: 'NFT creators connect their wallet, select NFTs they own, and create affiliate campaigns with customized commission rates.',
              color: 'from-purple-600 to-purple-400',
            },
            {
              step: '02',
              title: 'Generate Links',
              description: 'Influencers browse available campaigns, select ones that match their audience, and generate unique Solana-based affiliate links.',
              color: 'from-sky-600 to-sky-400',
            },
            {
              step: '03',
              title: 'Earn Rewards',
              description: 'When followers purchase NFTs through affiliate links, commissions are automatically sent to influencers through smart contracts.',
              color: 'from-orange-600 to-orange-400',
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="card relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={`absolute top-0 left-0 h-2 w-full bg-gradient-to-r ${item.color}`}></div>
              <span className="text-5xl font-bold text-gray-800">{item.step}</span>
              <h3 className="text-xl font-bold mt-6 mb-3">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Platform Features</h2>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
            Built on Solana for lightning-fast transactions and minimal fees
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              icon: <Zap className="h-6 w-6 text-purple-400" />,
              title: 'Instant Payouts',
              description: 'Commission payments are processed instantly on the Solana blockchain when a sale is completed.'
            },
            {
              icon: <Shield className="h-6 w-6 text-sky-400" />,
              title: 'Secure Smart Contracts',
              description: 'All transactions and commission distributions are handled by secure, audited smart contracts.'
            },
            {
              icon: <BarChart3 className="h-6 w-6 text-green-400" />,
              title: 'Real-time Analytics',
              description: 'Track campaign performance, link clicks, conversions, and earnings in real-time.'
            },
            {
              icon: <Users className="h-6 w-6 text-orange-400" />,
              title: 'Influencer Marketplace',
              description: 'Browse and connect with influencers or NFT projects to create mutually beneficial partnerships.'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="card flex space-x-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="mt-1 bg-gray-700/50 p-3 rounded-lg">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <motion.div 
          className="card bg-gradient-to-br from-purple-900/50 to-sky-900/50 border-0 text-center px-8 py-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start earning?</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Join our platform today and start creating campaigns or generating affiliate links to earn commissions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/marketplace" className="btn btn-primary">
              Explore Marketplace
            </Link>
            <Link to="/create-campaign" className="btn btn-secondary">
              Create Campaign <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;