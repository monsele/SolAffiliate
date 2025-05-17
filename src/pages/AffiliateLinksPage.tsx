import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Link as LinkIcon, 
  Copy, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Trash2,
  Check,
  Info
} from 'lucide-react';
import { mockAffiliateLinks } from '../utils/mockData';

const AffiliateLinksPage: React.FC = () => {
  const [expandedLinkId, setExpandedLinkId] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  const handleCopyLink = (linkId: string, linkUrl: string) => {
    navigator.clipboard.writeText(linkUrl);
    setCopiedLinkId(linkId);
    setTimeout(() => setCopiedLinkId(null), 2000);
  };

  const toggleLinkDetails = (linkId: string) => {
    if (expandedLinkId === linkId) {
      setExpandedLinkId(null);
    } else {
      setExpandedLinkId(linkId);
    }
  };

  const filteredLinks = mockAffiliateLinks.filter(link => {
    if (filter === 'all') return true;
    if (filter === 'active') return link.status === 'active';
    if (filter === 'inactive') return link.status === 'inactive';
    if (filter === 'expired') return link.status === 'expired';
    return true;
  });

  const sortedLinks = [...filteredLinks].sort((a, b) => {
    if (sort === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sort === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sort === 'clicks-high') {
      return b.clicks - a.clicks;
    } else if (sort === 'clicks-low') {
      return a.clicks - b.clicks;
    } else if (sort === 'conversions-high') {
      return b.conversions - a.conversions;
    } else if (sort === 'conversions-low') {
      return a.conversions - b.conversions;
    }
    return 0;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Affiliate Links</h1>
          <p className="text-gray-400 mt-2">Manage your generated affiliate links</p>
        </div>
        
        <button className="btn btn-primary">
          Generate New Link
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Links', value: mockAffiliateLinks.length, color: 'text-purple-400' },
          { label: 'Total Clicks', value: mockAffiliateLinks.reduce((sum, link) => sum + link.clicks, 0), color: 'text-sky-400' },
          { label: 'Total Conversions', value: mockAffiliateLinks.reduce((sum, link) => sum + link.conversions, 0), color: 'text-green-400' },
          { label: 'Avg. Conv. Rate', value: `${((mockAffiliateLinks.reduce((sum, link) => sum + link.conversions, 0) / mockAffiliateLinks.reduce((sum, link) => sum + link.clicks, 0)) * 100).toFixed(2)}%`, color: 'text-orange-400' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters and sorting */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-wrap gap-2">
          {['all', 'active', 'inactive', 'expired'].map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === option
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="clicks-high">Most Clicks</option>
            <option value="clicks-low">Least Clicks</option>
            <option value="conversions-high">Most Conversions</option>
            <option value="conversions-low">Least Conversions</option>
          </select>
        </div>
      </div>

      {/* Info alert */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <Info size={20} className="text-blue-400 flex-shrink-0 mt-1" />
        <div>
          <p className="text-sm text-blue-300">
            Your affiliate links are uniquely tied to your Solana wallet. When someone makes a purchase through your link, you'll automatically receive the commission in your wallet.
          </p>
        </div>
      </div>

      {/* Links list */}
      <div className="space-y-4">
        {sortedLinks.length > 0 ? (
          sortedLinks.map((link) => (
            <motion.div
              key={link.id}
              className="card overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={link.campaignImage} alt={link.campaignName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{link.campaignName}</h3>
                    <div className="flex flex-wrap gap-2 items-center text-sm">
                      <span className={`px-2 py-0.5 rounded-full ${
                        link.status === 'active' ? 'bg-green-500/20 text-green-400' : 
                        link.status === 'inactive' ? 'bg-gray-500/20 text-gray-400' : 
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {link.status.charAt(0).toUpperCase() + link.status.slice(1)}
                      </span>
                      <span className="text-gray-400">
                        Created {new Date(link.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 md:gap-6">
                  <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-400">Clicks</p>
                    <p className="font-medium">{link.clicks}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-400">Conversions</p>
                    <p className="font-medium">{link.conversions}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-400">Rate</p>
                    <p className="font-medium">{((link.conversions / link.clicks) * 100).toFixed(1)}%</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-400">Earnings</p>
                    <p className="font-medium text-green-400">{link.earnings} SOL</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex-grow relative">
                  <div className="bg-gray-800/50 rounded-lg py-2 px-3 flex items-center gap-2 overflow-hidden">
                    <LinkIcon size={16} className="text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300 truncate">{link.url}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyLink(link.id, link.url)}
                    className="btn-sm rounded-lg px-3 py-2 bg-gray-700 hover:bg-gray-600 flex items-center gap-1"
                  >
                    {copiedLinkId === link.id ? <Check size={16} /> : <Copy size={16} />}
                    {copiedLinkId === link.id ? 'Copied' : 'Copy'}
                  </button>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-sm rounded-lg px-3 py-2 bg-purple-600 hover:bg-purple-500 flex items-center gap-1"
                  >
                    <ExternalLink size={16} />
                    Open
                  </a>
                  <button
                    onClick={() => toggleLinkDetails(link.id)}
                    className="btn-sm rounded-lg px-3 py-2 bg-gray-700 hover:bg-gray-600 flex items-center"
                  >
                    {expandedLinkId === link.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {expandedLinkId === link.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-gray-700"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Link Analytics</h4>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-400">Commission Rate</p>
                              <p className="font-medium">{link.commissionRate}%</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">NFT Price</p>
                              <p className="font-medium">{link.nftPrice} SOL</p>
                            </div>
                          </div>
                          <div className="pt-3 border-t border-gray-700">
                            <p className="text-xs text-gray-400 mb-1">Link Performance</p>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-purple-500 h-2 rounded-full"
                                style={{ width: `${Math.min((link.conversions / link.clicks) * 100, 100)}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between mt-1 text-xs">
                              <span>0%</span>
                              <span>{((link.conversions / link.clicks) * 100).toFixed(1)}%</span>
                              <span>100%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Actions</h4>
                      <div className="space-y-2">
                        <button className="w-full btn-sm py-3 border border-gray-700 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800">
                          <Trash2 size={16} className="text-red-400" />
                          Delete Affiliate Link
                        </button>
                        <button className="w-full btn-sm py-3 border border-gray-700 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800">
                          <ExternalLink size={16} />
                          View Campaign Details
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <LinkIcon size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">No affiliate links found</h3>
            <p className="text-gray-400 mb-6">
              You haven't generated any affiliate links yet or none match your current filters.
            </p>
            <button className="btn btn-primary">Generate Your First Link</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AffiliateLinksPage;