import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Share2, 
  Calendar, 
  Wallet, 
  Clock, 
  BarChart3, 
  Copy, 
  Check,
  AlertCircle
} from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { mockCampaigns } from '../utils/mockData';

const CampaignDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { connected } = useWallet();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [affiliateLink, setAffiliateLink] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [affiliateCreated, setAffiliateCreated] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch campaign details
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        // In a real app, we would make an API call to fetch the campaign
        const foundCampaign = mockCampaigns.find(c => c.id === id);
        
        if (foundCampaign) {
          setCampaign(foundCampaign);
        }
      } catch (error) {
        console.error('Error fetching campaign:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  const handleGenerateAffiliateLink = () => {
    // In a real app, we would make an API call to the Solana blockchain
    // to generate a unique affiliate link
    setAffiliateLink(`https://nexusnft.io/nft/${id}?ref=7H8ye5unxAi8n9P5mpJT1xq7XszxiEuCv7CUY8FFUqsJ`);
    setAffiliateCreated(true);
  };

  const handleCopyLink = () => {
    if (affiliateLink) {
      navigator.clipboard.writeText(affiliateLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <AlertCircle size={48} className="mx-auto text-yellow-400 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Campaign Not Found</h2>
        <p className="text-gray-400 mb-6">
          The campaign you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/marketplace" className="btn btn-primary">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Campaign Header */}
      <div className="flex flex-col md:flex-row gap-8">
        <motion.div 
          className="w-full md:w-1/3 rounded-xl overflow-hidden glow"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img 
            src={campaign.imageUrl} 
            alt={campaign.name} 
            className="w-full h-64 md:h-80 object-cover"
          />
        </motion.div>
        
        <motion.div 
          className="w-full md:w-2/3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{campaign.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-sm px-2 py-1 rounded-full ${
                  campaign.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {campaign.active ? 'Active' : 'Inactive'}
                </span>
                <span className="text-sm text-gray-400">
                  Category: <span className="text-gray-300 capitalize">{campaign.category}</span>
                </span>
              </div>
            </div>
            <span className="text-lg font-bold bg-green-500/20 text-green-400 px-3 py-1 rounded-lg">
              {campaign.commissionRate}% Commission
            </span>
          </div>

          <p className="mt-4 text-gray-300">{campaign.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="flex items-center gap-2">
              <Wallet size={18} className="text-purple-400" />
              <div>
                <p className="text-xs text-gray-400">Price</p>
                <p className="font-medium">{campaign.price} SOL</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-sky-400" />
              <div>
                <p className="text-xs text-gray-400">Created</p>
                <p className="font-medium">{new Date(campaign.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-orange-400" />
              <div>
                <p className="text-xs text-gray-400">Ends</p>
                <p className="font-medium">{new Date(campaign.endDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-green-400" />
              <div>
                <p className="text-xs text-gray-400">Affiliates</p>
                <p className="font-medium">{Math.floor(Math.random() * 50) + 5}</p>
              </div>
            </div>
          </div>

          {connected ? (
            <div className="mt-8">
              {!affiliateCreated ? (
                <button 
                  onClick={handleGenerateAffiliateLink}
                  className="btn btn-primary w-full md:w-auto flex items-center justify-center gap-2"
                >
                  <Share2 size={18} />
                  Generate Affiliate Link
                </button>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Your Affiliate Link</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex-grow bg-gray-800/50 rounded-lg py-3 px-4">
                      <p className="text-sm text-gray-300 break-all">{affiliateLink}</p>
                    </div>
                    <button 
                      onClick={handleCopyLink}
                      className="btn btn-ghost flex items-center gap-2"
                    >
                      {linkCopied ? <Check size={18} /> : <Copy size={18} />}
                      {linkCopied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <p className="text-sm text-purple-300">
                      Share this link with your audience. You'll earn {campaign.commissionRate}% ({(campaign.price * campaign.commissionRate / 100).toFixed(2)} SOL) for each successful sale through your link.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-8 p-4 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
              <p className="text-gray-300 mb-3">
                Connect your wallet to generate an affiliate link for this campaign
              </p>
              <button className="btn btn-primary" disabled>
                Connect Wallet
              </button>
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Campaign Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2">
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-bold mb-4">Campaign Details</h2>
            
            <p className="mb-6">
              This campaign allows you to earn commission by promoting the {campaign.name} NFT to your audience. 
              When someone purchases the NFT through your unique affiliate link, you'll automatically receive {campaign.commissionRate}% 
              of the sale price directly to your Solana wallet.
            </p>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">How It Works</h3>
              <ol className="list-decimal list-inside space-y-2 pl-4">
                <li className="text-gray-300">Generate your unique affiliate link (requires connecting your Solana wallet)</li>
                <li className="text-gray-300">Share the link with your audience on social media, blog, newsletter, etc.</li>
                <li className="text-gray-300">When someone clicks your link and purchases the NFT, the smart contract automatically tracks the referral</li>
                <li className="text-gray-300">Your commission is instantly sent to your connected wallet</li>
              </ol>
              
              <div className="mt-6 bg-gray-800/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Commission Calculation</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-400">NFT Price</p>
                    <p className="font-medium">{campaign.price} SOL</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Commission Rate</p>
                    <p className="font-medium">{campaign.commissionRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">You Earn Per Sale</p>
                    <p className="font-medium text-green-400">{(campaign.price * campaign.commissionRate / 100).toFixed(2)} SOL</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Payout Method</p>
                    <p className="font-medium">Instant to wallet</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div>
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-lg font-bold mb-4">Campaign Owner</h2>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-700">
                <img 
                  src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg" 
                  alt="Creator Avatar" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <p className="font-medium">CryptoCreator</p>
                <p className="text-xs text-gray-400">
                  {campaign.creatorAddress?.slice(0, 6)}...{campaign.creatorAddress?.slice(-4)}
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-700">
              <h3 className="text-sm font-medium mb-2">Other Campaigns by Creator</h3>
              <div className="space-y-3">
                {mockCampaigns.slice(0, 3).map((c) => (
                  <Link key={c.id} to={`/campaign/${c.id}`} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-800/50 transition-colors">
                    <div className="w-10 h-10 rounded-md overflow-hidden">
                      <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-green-400">{c.commissionRate}% Commission</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailsPage;