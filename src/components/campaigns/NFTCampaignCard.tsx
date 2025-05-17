import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Clock, DollarSign } from 'lucide-react';
import { Campaign } from '../../types/campaign';

interface NFTCampaignCardProps {
  campaign: Campaign;
  featured?: boolean;
}

const NFTCampaignCard: React.FC<NFTCampaignCardProps> = ({ campaign, featured = false }) => {
  const { connected } = useWallet();

  return (
    <motion.div
      className={`card overflow-hidden h-full flex flex-col ${
        featured ? 'border-purple-700/50' : ''
      }`}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      {/* Image container */}
      <div className="relative">
        <img
          src={campaign.imageUrl}
          alt={campaign.name}
          className="w-full h-48 object-cover"
        />
        {featured && (
          <div className="absolute top-3 left-3 bg-purple-500 text-white text-xs py-1 px-3 rounded-full flex items-center">
            <Star size={12} className="mr-1" /> Featured
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent h-20"></div>
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="mb-3 flex justify-between items-start">
          <h3 className="text-lg font-bold">{campaign.name}</h3>
          <span className="text-sm bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
            {campaign.commissionRate}% Commission
          </span>
        </div>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{campaign.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>{new Date(campaign.endDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <DollarSign size={16} className="mr-1" />
            <span>{campaign.price} SOL</span>
          </div>
        </div>

        <div className="mt-auto">
          {connected ? (
            <Link
              to={`/campaign/${campaign.id}`}
              className="w-full btn btn-primary flex justify-center items-center"
            >
              View Campaign <ChevronRight size={18} className="ml-1" />
            </Link>
          ) : (
            <button className="w-full btn btn-ghost text-gray-400 cursor-not-allowed">
              Connect wallet to join
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NFTCampaignCard;