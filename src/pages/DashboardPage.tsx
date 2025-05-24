import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Megaphone, 
  BarChart3, 
  Users, 
  Wallet,
  DollarSign,
  TrendingUp,
  ChevronRight,
  Link as LinkIcon,
  Plus,
} from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { mockCampaigns, mockAffiliateLinks } from '../utils/mockData';

const DashboardPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { publicKey } = useWallet();
  
  // Get tab from URL or default to 'overview'
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'overview');

  const changeTab = (tab: string) => {
    setActiveTab(tab);
    navigate(`/dashboard?tab=${tab}`);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'campaigns', label: 'My Campaigns', icon: <Megaphone size={18} /> },
    { id: 'earnings', label: 'Earnings', icon: <DollarSign size={18} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
  ];

  // Mock data for dashboard stats
  const stats = [
    { id: 1, label: 'Active Campaigns', value: 3, icon: <Megaphone size={20} className="text-purple-400" />, change: '+2', period: 'from last week' },
    { id: 2, label: 'Total Earnings', value: '45.8 SOL', icon: <Wallet size={20} className="text-green-400" />, change: '+12.4 SOL', period: 'this month' },
    { id: 3, label: 'Affiliate Links', value: 12, icon: <LinkIcon size={20} className="text-sky-400" />, change: '+5', period: 'from last month' },
    { id: 4, label: 'Conversion Rate', value: '8.2%', icon: <TrendingUp size={20} className="text-orange-400" />, change: '+1.4%', period: 'from last month' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400 mt-2">
          {publicKey ? (
            <>
              Connected wallet: <span className="text-purple-400">{publicKey.toString().slice(0, 6)}...{publicKey.toString().slice(-4)}</span>
            </>
          ) : (
            'Connect your wallet to access the dashboard'
          )}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <button 
          onClick={() => navigate('/create-nft')}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Create NFT
        </button>
        <button 
          onClick={() => navigate('/create-campaign')}
          className="btn btn-secondary flex items-center gap-2"
        >
          <Megaphone size={18} />
          Create Campaign
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700">
        <nav className="flex space-x-6 overflow-x-auto pb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => changeTab(tab.id)}
              className={`flex items-center py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              } transition-colors`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Dashboard Content */}
      <div className="py-4">
        {activeTab === 'overview' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <motion.div 
                  key={stat.id}
                  className="card"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.3, delay: stat.id * 0.1 }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-400 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-green-400">
                    {stat.change} {stat.period}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Recent Activity</h2>
                <button className="text-sm text-purple-400 hover:text-purple-300 flex items-center">
                  View All <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Activity items */}
                {[
                  {
                    id: 1,
                    type: 'sale',
                    title: 'NFT Sold through affiliate link',
                    time: '2 hours ago',
                    amount: '+2.4 SOL',
                    status: 'success'
                  },
                  {
                    id: 2,
                    type: 'campaign',
                    title: 'Created new campaign',
                    time: '1 day ago',
                    campaignName: 'Mystic Creatures Collection',
                    status: 'info'
                  },
                  {
                    id: 3,
                    type: 'affiliate',
                    title: 'New affiliate joined your campaign',
                    time: '2 days ago',
                    affiliateName: 'crypto_influencer',
                    status: 'info'
                  },
                ].map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700/30 transition-colors">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-4 ${
                        activity.status === 'success' ? 'bg-green-500/20 text-green-400' : 
                        activity.status === 'info' ? 'bg-sky-500/20 text-sky-400' : 
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {activity.type === 'sale' ? <DollarSign size={18} /> : 
                         activity.type === 'campaign' ? <Megaphone size={18} /> : 
                         <Users size={18} />}
                      </div>
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {activity.amount && (
                        <p className="font-medium text-green-400">{activity.amount}</p>
                      )}
                      {activity.campaignName && (
                        <p className="text-sm">{activity.campaignName}</p>
                      )}
                      {activity.affiliateName && (
                        <p className="text-sm">{activity.affiliateName}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'campaigns' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">My Campaigns</h2>
              <button 
                onClick={() => navigate('/create-campaign')}
                className="btn btn-primary"
              >
                Create New Campaign
              </button>
            </div>

            {/* Campaign list */}
            <div className="space-y-4">
              {mockCampaigns.slice(0, 3).map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  className="card flex flex-col md:flex-row gap-4 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="w-full md:w-48 h-32 md:h-auto flex-shrink-0">
                    <img 
                      src={campaign.imageUrl} 
                      alt={campaign.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold">{campaign.name}</h3>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        campaign.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {campaign.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{campaign.description}</p>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-400">Commission</p>
                        <p className="font-medium">{campaign.commissionRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Price</p>
                        <p className="font-medium">{campaign.price} SOL</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Affiliates</p>
                        <p className="font-medium">{Math.floor(Math.random() * 10) + 1}</p>
                      </div>
                    </div>
                    <div className="mt-auto flex gap-2">
                      <button className="btn-primary btn-sm rounded-md px-4 py-2 text-sm">
                        Edit Campaign
                      </button>
                      <button className="btn-ghost btn-sm rounded-md px-4 py-2 text-sm">
                        View Analytics
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'earnings' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6">
                <h3 className="text-gray-400 text-sm mb-1">Total Earnings</h3>
                <p className="text-3xl font-bold">45.8 SOL</p>
                <div className="mt-4 flex items-center text-green-400 text-sm">
                  <TrendingUp size={16} className="mr-1" />
                  <span>+12.4 SOL this month</span>
                </div>
              </div>
              <div className="card p-6">
                <h3 className="text-gray-400 text-sm mb-1">Pending Earnings</h3>
                <p className="text-3xl font-bold">2.3 SOL</p>
                <div className="mt-4 flex items-center text-gray-400 text-sm">
                  <span>Processing 2 transactions</span>
                </div>
              </div>
              <div className="card p-6">
                <h3 className="text-gray-400 text-sm mb-1">Campaign Revenue</h3>
                <p className="text-3xl font-bold">124.5 SOL</p>
                <div className="mt-4 flex items-center text-green-400 text-sm">
                  <TrendingUp size={16} className="mr-1" />
                  <span>+32.8 SOL this month</span>
                </div>
              </div>
            </div>

            <div className="card overflow-hidden">
              <h2 className="text-xl font-bold mb-6">Recent Transactions</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-400 border-b border-gray-700">
                      <th className="pb-3 pl-4">Type</th>
                      <th className="pb-3">Campaign</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3 pr-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 1, type: 'Affiliate Commission', campaign: 'Cosmic Voyagers', date: '2025-04-12', amount: '1.2 SOL', status: 'completed' },
                      { id: 2, type: 'Campaign Sale', campaign: 'Mystic Creatures', date: '2025-04-10', amount: '0.8 SOL', status: 'completed' },
                      { id: 3, type: 'Affiliate Commission', campaign: 'Digital Dreams', date: '2025-04-08', amount: '2.4 SOL', status: 'completed' },
                      { id: 4, type: 'Campaign Sale', campaign: 'Cosmic Voyagers', date: '2025-04-05', amount: '1.5 SOL', status: 'pending' },
                    ].map((tx) => (
                      <tr key={tx.id} className="border-b border-gray-700/50 hover:bg-gray-800/30">
                        <td className="py-4 pl-4">{tx.type}</td>
                        <td className="py-4">{tx.campaign}</td>
                        <td className="py-4">{tx.date}</td>
                        <td className="py-4 font-medium">{tx.amount}</td>
                        <td className="py-4 pr-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            tx.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="card p-6 mb-6">
              <h2 className="text-xl font-bold mb-6">Analytics Overview</h2>
              <div className="bg-gray-700/30 rounded-lg p-6 flex items-center justify-center h-64">
                <p className="text-gray-400">Interactive analytics charts will be displayed here</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="text-lg font-bold mb-4">Top Performing Campaigns</h3>
                <div className="space-y-4">
                  {mockCampaigns.slice(0, 3).map((campaign, index) => (
                    <div key={campaign.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 mr-3 bg-gray-700 rounded-md overflow-hidden">
                          <img src={campaign.imageUrl} alt={campaign.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-medium">{campaign.name}</p>
                          <p className="text-xs text-gray-400">{campaign.commissionRate}% commission</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{(Math.random() * 10).toFixed(1)} SOL</p>
                        <p className="text-xs text-green-400">+{(Math.random() * 5).toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-bold mb-4">Top Affiliates</h3>
                <div className="space-y-4">
                  {[
                    { id: 1, name: 'crypto_influencer', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg', earnings: '8.5 SOL' },
                    { id: 2, name: 'nft_collector', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg', earnings: '6.2 SOL' },
                    { id: 3, name: 'metaverse_guru', avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg', earnings: '4.8 SOL' },
                  ].map((affiliate) => (
                    <div key={affiliate.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 mr-3 bg-gray-700 rounded-full overflow-hidden">
                          <img src={affiliate.avatar} alt={affiliate.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-medium">@{affiliate.name}</p>
                          <p className="text-xs text-gray-400">{Math.floor(Math.random() * 20) + 5} conversions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{affiliate.earnings}</p>
                        <p className="text-xs text-green-400">+{(Math.random() * 10).toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;