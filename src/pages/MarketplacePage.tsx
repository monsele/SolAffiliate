import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Zap } from 'lucide-react';
import NFTCampaignCard from '../components/campaigns/NFTCampaignCard';
import { mockCampaigns } from '../utils/mockData';

const MarketplacePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'art', name: 'Art' },
    { id: 'collectibles', name: 'Collectibles' },
    { id: 'gaming', name: 'Gaming' },
    { id: 'metaverse', name: 'Metaverse' },
    { id: 'pfp', name: 'Profile Pictures' },
  ];

  const filteredCampaigns = mockCampaigns.filter(campaign => {
    // Filter by search
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === 'all' || campaign.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Sort campaigns
  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortBy === 'highest-commission') {
      return b.commissionRate - a.commissionRate;
    } else if (sortBy === 'lowest-price') {
      return a.price - b.price;
    }
    return 0;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-8">
        <div>
          <h1 className="text-3xl font-bold">NFT Affiliate Marketplace</h1>
          <p className="text-gray-400 mt-2">Browse and join NFT affiliate campaigns</p>
        </div>
        
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search campaigns..."
            className="input pl-10 pr-4 py-2 w-full md:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filters and sorting */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <div className="bg-gray-800 rounded-full text-sm flex items-center">
            <Filter size={16} className="ml-3 text-gray-400" />
            <select
              className="bg-transparent px-2 py-2 pr-8 appearance-none focus:outline-none cursor-pointer"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Sort by:</span>
          <select
            className="bg-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest-commission">Highest Commission</option>
            <option value="lowest-price">Lowest Price</option>
          </select>
        </div>
      </div>

      {/* Featured section */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={18} className="text-yellow-400" />
          <h2 className="text-xl font-semibold">Featured Campaigns</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCampaigns
            .filter(campaign => campaign.featured)
            .slice(0, 3)
            .map((campaign, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <NFTCampaignCard campaign={campaign} featured />
              </motion.div>
            ))}
        </div>
      </div>

      {/* All campaigns */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">All Campaigns</h2>
        {sortedCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCampaigns.map((campaign, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <NFTCampaignCard campaign={campaign} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No campaigns found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplacePage;