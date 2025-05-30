import React, { useState, useEffect } from 'react';
import {PublicKey } from '@solana/web3.js';
import { Metaplex, token, walletAdapterIdentity } from '@metaplex-foundation/js';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Info,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';
import { AnchorProvider, setProvider } from '@coral-xyz/anchor';
import { createNftCampaign } from '@/utils/instructions';


// Mock NFT data
const mockNFTs = [
  { id: 1, name: 'Cosmic Voyager #1', image: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg' },
  { id: 2, name: 'Cosmic Voyager #2', image: 'https://images.pexels.com/photos/3593865/pexels-photo-3593865.jpeg' },
  { id: 3, name: 'Mystic Creature #5', image: 'https://images.pexels.com/photos/6577903/pexels-photo-6577903.jpeg' },
  { id: 4, name: 'Digital Dream #8', image: 'https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg' },
];

const CreateCampaignPage: React.FC = () => {
  const { connected, publicKey, wallet } = useWallet();
  const { connection } = useConnection();

  const anchorWallet = useAnchorWallet();
  useEffect(() => {
    if (anchorWallet) {
      console.log(anchorWallet.publicKey.toString());
      const provider = new AnchorProvider(
        connection,
        anchorWallet, // Use anchorWallet if available, otherwise the readOnlyWallet
        AnchorProvider.defaultOptions()
      );
      // Set the global provider (optional, but common for Anchor)
      setProvider(provider);
    } else {
      console.log("No wallet connected");
    }
  }, [anchorWallet, connection]);
  const [nfts, setNfts] = useState<{ id: string; name: string; image: string; nft_mint: PublicKey, tokenProgram:string }[]>([]);
  useEffect(() => {
    const fetchNFTs = async () => {
      if (!publicKey) return;

      // const connection = new Connection(clusterApiUrl('mainnet-beta'));
      if (!wallet?.adapter) return;
      const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet.adapter));

      try {
        const allNFTs = await metaplex.nfts().findAllByOwner({ owner: publicKey });
        const metadata = await Promise.all(
          allNFTs
            .filter((nft) => nft.model === 'metadata' && nft.uri)
            .slice(0, 20) // limit for performance; adjust as needed
            .map(async (nft) => {
              try {
                const uri = nft.uri.startsWith('ipfs://')
                  ? nft.uri.replace('ipfs://', 'https://ipfs.io/ipfs/')
                  : nft.uri;

                const res = await fetch(uri);
                const data = await res.json();
                const mintParsedInfo = await connection.getParsedAccountInfo(nft.mintAddress);  
                let tokenProgram = '';
                if (
                  mintParsedInfo.value?.data &&
                  typeof mintParsedInfo.value.data === 'object' &&
                  'program' in mintParsedInfo.value.data
                ) {
                  tokenProgram = mintParsedInfo.value.data.program;
                }
                console.log('mint info:', mintParsedInfo);
                return {
                  id: nft.address.toBase58(),
                  name: data.name || 'Unnamed NFT',
                  image: data.image || '',
                  nft_mint: nft.mintAddress,
                  tokenProgram,
                };
              } catch (err) {
                toast.error(`Failed to fetch NFT metadata for ${nft.address.toBase58()}: ${err}`);
                console.error(`Failed to fetch NFT metadata for ${nft.address.toBase58()}:`, err);
                return null;
              }
            })
        );

        setNfts(metadata.filter((nft) => nft !== null) as any);
        console.log('Fetched NFTs:', metadata);
        // for (const nft of metadata) {
        //   if (nft) {
        //     console.log(`NFT mint address: ${nft.nft_mint}, Name: ${nft.name}, Image: ${nft.image}, Token Program: ${nft.tokenProgram}`); 
        //   }
        // }

      } catch (error) {
        console.error('Failed to fetch NFTs:', error);
      }
    };

    fetchNFTs();
  }, [publicKey]);

  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedNFT, setSelectedNFT] = useState<{ id: string; name: string; image: string; nft_mint: PublicKey, tokenProgram:string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    commissionRate: '',
    endDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!anchorWallet) {
      toast.error('Wallet not connected');
      return;
    }
    if (!selectedNFT || !selectedNFT.nft_mint) {
      toast.error('No NFT selected');
      return;
    }
    const provider = new AnchorProvider(
      connection,
      anchorWallet,
      AnchorProvider.defaultOptions()
    );
    console.log(provider);

    const result =await createNftCampaign(
      provider,
      formData.name,
      BigInt(Math.round(parseFloat(formData.price) * 1_000_000_000)),
      parseFloat(formData.commissionRate),
      formData.description,
      selectedNFT.nft_mint,
      selectedNFT.tokenProgram,
    );

    // In a real application, we would send the form data to the Solana blockchain
    // For now, just navigate to the dashboard
    console.log(selectedNFT);
    console.log('Form Data:', formData);
    console.log('Transaction Signature:', result);


    toast.success('Campaign created successfully!');
    navigate('/dashboard?tab=campaigns');
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  if (!connected) {
    return (
      <div className="card text-center py-10">
        <AlertCircle size={48} className="mx-auto text-yellow-400 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Wallet Not Connected</h2>
        <p className="text-gray-400 mb-6">
          Please connect your Solana wallet to create a campaign.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create Affiliate Campaign</h1>
        <p className="text-gray-400 mt-2">
          Set up a new campaign for your NFT project
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center">
          {[
            { num: 1, title: 'Select NFT' },
            { num: 2, title: 'Campaign Details' },
            { num: 3, title: 'Review & Deploy' },
          ].map((s, i) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step === s.num
                      ? 'bg-purple-600 text-white'
                      : step > s.num
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                >
                  {step > s.num ? <CheckCircle2 size={20} /> : s.num}
                </div>
                <span className={`text-sm mt-2 ${step === s.num ? 'text-purple-500 font-medium' : 'text-gray-400'}`}>
                  {s.title}
                </span>
              </div>
              {i < 2 && (
                <div className={`flex-1 h-1 mx-2 ${step > i + 1 ? 'bg-green-500' : 'bg-gray-700'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step 1: Select NFT */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="card mb-6">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-6">
              <Info size={20} className="text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-blue-300">
                  Select an NFT from your wallet to create an affiliate campaign. Only NFTs that you own will be displayed.
                </p>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-4">Your NFTs</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {nfts.map((nft) => (
                <div
                  key={nft.id}
                  onClick={() => setSelectedNFT(nft)}
                  className={`rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${selectedNFT?.id === nft.id
                      ? 'border-purple-500 ring-2 ring-purple-500/30'
                      : 'border-gray-700 hover:border-gray-600'
                    }`}
                >
                  <div className="relative">
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="w-full h-40 object-cover"
                    />
                    {selectedNFT?.id === nft.id && (
                      <div className="absolute top-2 right-2 bg-purple-500 rounded-full p-1">
                        <CheckCircle2 size={16} />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-medium truncate">{nft.name}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                disabled={!selectedNFT}
                className={`btn btn-primary flex items-center ${!selectedNFT ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                Continue <ChevronRight size={18} className="ml-1" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 2: Campaign Details */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="card mb-6">
            <h2 className="text-xl font-bold mb-6">Campaign Details</h2>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Cosmic Voyagers Collection"
                    className="input w-full"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input w-full"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="art">Art</option>
                    <option value="collectibles">Collectibles</option>
                    <option value="gaming">Gaming</option>
                    <option value="metaverse">Metaverse</option>
                    <option value="pfp">Profile Pictures</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your NFT campaign..."
                  className="input w-full"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">
                    NFT Price (SOL)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g. 1.5"
                    className="input w-full"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="commissionRate" className="block text-sm font-medium text-gray-300 mb-1">
                    Commission Rate (%)
                  </label>
                  <input
                    type="number"
                    id="commissionRate"
                    name="commissionRate"
                    value={formData.commissionRate}
                    onChange={handleChange}
                    placeholder="e.g. 10"
                    className="input w-full"
                    min="1"
                    max="50"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="input w-full"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="btn btn-ghost"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn btn-primary"
                  disabled={!formData.name || !formData.description || !formData.category || !formData.price || !formData.commissionRate || !formData.endDate}
                >
                  Review Campaign
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      {/* Step 3: Review & Deploy */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="card mb-6">
            <h2 className="text-xl font-bold mb-6">Review Your Campaign</h2>

            <div className="mb-6">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mb-6">
                <AlertCircle size={20} className="text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-yellow-300">
                    Please review all information carefully. Once deployed to the Solana blockchain, some details cannot be modified.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Campaign Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400">Campaign Name</p>
                      <p className="font-medium">{formData.name || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Category</p>
                      <p className="font-medium capitalize">{formData.category || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Description</p>
                      <p className="font-medium">{formData.description || 'Not specified'}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Price</p>
                        <p className="font-medium">{formData.price} SOL</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Commission</p>
                        <p className="font-medium">{formData.commissionRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">End Date</p>
                        <p className="font-medium">{formData.endDate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Selected NFT</h3>
                  {selectedNFT && (
                    <div className="rounded-lg overflow-hidden border border-gray-700">
                      <img
                        src={nfts.find(nft => nft.id === selectedNFT.id)?.image}
                        alt={nfts.find(nft => nft.id === selectedNFT.id)?.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <p className="font-medium text-lg">
                          {nfts.find(nft => nft.id === selectedNFT.id)?.name}
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                          Owned by: {publicKey?.toString().slice(0, 6)}...{publicKey?.toString().slice(-4)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-700">
              <button
                type="button"
                onClick={handlePrev}
                className="btn btn-ghost"
              >
                Back
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="btn btn-primary"
              >
                Deploy Campaign
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CreateCampaignPage;