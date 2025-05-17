import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { 
  User, 
  Copy, 
  Check, 
  Edit3, 
  LogOut, 
  Shield, 
  Bell, 
  DollarSign, 
  Save,
  AlertCircle,
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { connected, publicKey, disconnect } = useWallet();
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: 'CryptoInfluencer',
    displayName: 'Crypto Influencer',
    bio: 'NFT enthusiast and crypto content creator. I help projects reach their audience through authentic content.',
    email: 'crypto@example.com',
    twitter: '@crypto_influencer',
    website: 'https://cryptoinfluencer.example',
    notificationsEnabled: true,
    emailNotifications: true,
  });

  const handleCopyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setProfileData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveProfile = () => {
    // In a real app, we would save the profile data to a database
    setIsEditing(false);
  };

  if (!connected) {
    return (
      <div className="card text-center py-10">
        <AlertCircle size={48} className="mx-auto text-yellow-400 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Wallet Not Connected</h2>
        <p className="text-gray-400 mb-6">
          Please connect your Solana wallet to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <div className="flex gap-2">
          {isEditing ? (
            <button 
              onClick={handleSaveProfile}
              className="btn btn-primary flex items-center gap-2"
            >
              <Save size={18} />
              Save Changes
            </button>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="btn btn-ghost flex items-center gap-2"
            >
              <Edit3 size={18} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-sky-500 flex items-center justify-center text-2xl font-bold mb-4">
                {profileData.name.charAt(0)}
              </div>
              
              <h2 className="text-xl font-bold mb-1">{profileData.displayName}</h2>
              <p className="text-gray-400 text-sm">@{profileData.name}</p>
              
              <div className="w-full mt-4">
                <div className="flex items-center justify-between bg-gray-800/50 rounded-lg py-2 px-3 text-sm">
                  <span className="text-gray-400 truncate">
                    {publicKey ? `${publicKey.toString().slice(0, 8)}...${publicKey.toString().slice(-8)}` : ''}
                  </span>
                  <button 
                    onClick={handleCopyAddress}
                    className="text-gray-300 hover:text-white p-1"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 w-full mt-6">
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-400">Campaigns</p>
                  <p className="font-bold text-xl">12</p>
                </div>
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-400">Earnings</p>
                  <p className="font-bold text-xl">48.6 SOL</p>
                </div>
              </div>
              
              <button 
                onClick={() => disconnect()}
                className="w-full mt-6 flex items-center justify-center gap-2 btn btn-ghost text-red-400 hover:text-red-300"
              >
                <LogOut size={18} />
                Disconnect Wallet
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Shield size={18} className="text-purple-400" />
              Account Security
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <p className="text-sm">Two-Factor Authentication</p>
                <button className="text-xs px-2 py-1 bg-gray-700 rounded text-gray-300 hover:bg-gray-600">
                  Enable
                </button>
              </div>
              <div className="flex items-center justify-between py-2">
                <p className="text-sm">Transaction Signing</p>
                <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
                  Enabled
                </span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Profile Content */}
        <div className="md:col-span-2 space-y-6">
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-bold mb-6">Personal Information</h3>
            
            <div className="space-y-6">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-1">
                        Display Name
                      </label>
                      <input
                        type="text"
                        id="displayName"
                        name="displayName"
                        className="input w-full"
                        value={profileData.displayName}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="input w-full"
                        value={profileData.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      className="input w-full"
                      value={profileData.bio}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="input w-full"
                        value={profileData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="twitter" className="block text-sm font-medium text-gray-300 mb-1">
                        Twitter
                      </label>
                      <input
                        type="text"
                        id="twitter"
                        name="twitter"
                        className="input w-full"
                        value={profileData.twitter}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      className="input w-full"
                      value={profileData.website}
                      onChange={handleChange}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400">Display Name</p>
                      <p className="font-medium">{profileData.displayName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Username</p>
                      <p className="font-medium">@{profileData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Bio</p>
                      <p className="font-medium">{profileData.bio}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Email</p>
                        <p className="font-medium">{profileData.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Twitter</p>
                        <p className="font-medium">{profileData.twitter}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Website</p>
                      <p className="font-medium">{profileData.website}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
          
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Bell size={18} className="text-sky-400" />
              Notification Settings
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-400">Receive notifications about activity on your campaigns</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="notificationsEnabled"
                    checked={profileData.notificationsEnabled} 
                    onChange={handleChange}
                    className="sr-only peer" 
                    disabled={!isEditing}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-400">Receive email updates about your campaigns and earnings</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="emailNotifications"
                    checked={profileData.emailNotifications} 
                    onChange={handleChange}
                    className="sr-only peer" 
                    disabled={!isEditing}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <DollarSign size={18} className="text-green-400" />
              Payment Information
            </h3>
            
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-300 mb-4">
                All payments are automatically sent to your connected Solana wallet address:
              </p>
              <div className="bg-gray-700/50 rounded-lg py-2 px-3">
                <p className="font-mono text-sm">
                  {publicKey ? publicKey.toString() : 'No wallet connected'}
                </p>
              </div>
              <p className="text-sm text-gray-400 mt-4">
                Note: To change your payment address, disconnect your current wallet and connect a new one.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;