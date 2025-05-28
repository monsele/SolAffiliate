import React, { useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { 
  Upload,
  Link as LinkIcon,
  AlertCircle,
  Image as ImageIcon,
  Info,
} from 'lucide-react';
import { PinataSDK } from 'pinata-web3';
import { NFTMetadata } from '../types/nftMetaData';
import { Metaplex, PublicKey, walletAdapterIdentity } from '@metaplex-foundation/js';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
//import { t } from 'pinata/dist/index-CQFQEo3K';

const CreateNFTPage: React.FC = () => {
  const { connection } = useConnection();
  const wallet = useWallet(); // Access the wallet context
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    metadataUrl: '',
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [useMetadataUrl, setUseMetadataUrl] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  

      const metaplex = useMemo(() => {
      if (wallet.connected && wallet.publicKey) {
        return Metaplex.make(connection)
          .use(walletAdapterIdentity(wallet));
      }
      return null;
    }, [connection, wallet.connected, wallet.publicKey]);
  
    const pinata = new PinataSDK({
      pinataJwt: import.meta.env.VITE_PINATA_JWT,
      pinataGateway: import.meta.env.VITE_PUBLIC_GATEWAY_URL,
    });
     const uploadFileToPinata = async (file: File | null): Promise<string> => {
        if (file == null) {
          toast.error("Please select a file to upload");
          //throw new Error("File is null");
          return "";
        }
        const content = new Blob([await file.arrayBuffer()], { type: file.type });
        const fileName = `${Date.now()}-${file.name}`;
        const fileToUpload = new File([content], fileName, { type: file.type });
        const upload = await pinata.upload.file(fileToUpload);
        return upload.IpfsHash;
      };
      const uploadMetaDataToPinata = async (data: NFTMetadata): Promise<string> => {
        const upload = await pinata.upload.json(data);
        return upload.IpfsHash;
      };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
   let finalUri = "";
    try {
      // Here we would implement the NFT creation logic using the Solana web3.js library
      console.log('Creating NFT with:', {
        ...formData,
        file: selectedFile,
      });
      if (!wallet.connected) {
        throw new Error('Wallet not connected');
      }
      if (!formData.name || !formData.symbol || (!selectedFile && !useMetadataUrl)) {
        throw new Error('Please fill in all required fields');
      }
      // Upload file to Pinata if selected
       const IpfsHash = await uploadFileToPinata(selectedFile);
        console.log('Image uploaded to Pinata:', IpfsHash);
        toast.info("Image uploaded to Pinata");
      // Prepare metadata
      
              const metaData: NFTMetadata = {
                name: formData.name,
                symbol: formData.symbol,
                description: formData.description,
                image:  `https://${import.meta.env.VITE_PUBLIC_GATEWAY_URL}/ipfs/${IpfsHash}`,
                attributes: [],
                properties: {
                  files: [
                    {
                      uri: `ipfs://${IpfsHash}`,
                      type: selectedFile?.type || '',
                    },
                  ],
                  category: 'image',
                  creators: [
                    {
                      address: wallet.publicKey ? wallet.publicKey.toBase58() : '',
                      share: 100,
                    },
                  ],
                },
              };
      // Upload metadata to Pinata
      const metadataIpfsHash = await uploadMetaDataToPinata(metaData);
      toast.info("Metadata uploaded to Pinata");
      console.log('Metadata uploaded to Pinata:', metadataIpfsHash);
      finalUri = `ipfs://${metadataIpfsHash}`;
      if (!metaplex) {
        throw new Error('Metaplex instance is not available');
      }
      const { nft } = await metaplex.nfts().create({
        uri: finalUri,
        name: formData.name,
        symbol: formData.symbol,
        sellerFeeBasisPoints: 500, // 5% royalty
        creators: [{ address: wallet.publicKey as PublicKey, share: 100 }],
        isMutable: true, // Set to false if you want to make it immutable after creation
        tokenStandard: 0, // 0 for NonFungible, 1 for Fungible, 2 for NonFungibleEdition
      });
      // Mock success message
      console.log('NFT created successfully!');
      toast.success(`NFT created successfully! View it on Solscan: https://solscan.io/nft/${nft.address.toBase58()}`);
    } catch (error) {
      console.error('Error creating NFT:', error);
      toast.error(`Error creating NFT`);
    } finally {
      setIsSubmitting(false);
      navigate('/dashboard'); // Redirect to dashboard after creation
    }
  };

  if (!wallet.connected) {
    return (
      <div className="card text-center py-10">
        <AlertCircle size={48} className="mx-auto text-yellow-400 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Wallet Not Connected</h2>
        <p className="text-gray-400 mb-6">
          Please connect your Solana wallet to create an NFT.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create NFT</h1>
        <p className="text-gray-400 mt-2">
          Create a new NFT by providing the required information
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                NFT Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input w-full"
                placeholder="e.g. Cosmic Voyager #1"
                required
              />
            </div>

            <div>
              <label htmlFor="symbol" className="block text-sm font-medium text-gray-300 mb-1">
                Symbol
              </label>
              <input
                type="text"
                id="symbol"
                name="symbol"
                value={formData.symbol}
                onChange={handleChange}
                className="input w-full"
                placeholder="e.g. COSMIC"
                required
              />
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
              className="input w-full"
              placeholder="Describe your NFT..."
              required
            />
          </div>

          <div className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              id="useMetadataUrl"
              checked={useMetadataUrl}
              onChange={(e) => setUseMetadataUrl(e.target.checked)}
              className="rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
            />
            <label htmlFor="useMetadataUrl" className="text-gray-300">
              I want to use a metadata URL instead of uploading an image
            </label>
          </div>

          {useMetadataUrl ? (
            <div>
              <label htmlFor="metadataUrl" className="block text-sm font-medium text-gray-300 mb-1">
                Metadata URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  id="metadataUrl"
                  name="metadataUrl"
                  value={formData.metadataUrl}
                  onChange={handleChange}
                  className="input flex-grow"
                  placeholder="https://..."
                  required={useMetadataUrl}
                />
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setUseMetadataUrl(false)}
                >
                  Upload Image Instead
                </button>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                NFT Image
              </label>
              <div
                className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:border-gray-600 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                
                {previewUrl ? (
                  <div className="space-y-4">
                    <img
                      src={previewUrl}
                      alt="NFT Preview"
                      className="max-w-xs mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      <Upload size={48} className="text-gray-500" />
                    </div>
                    <div className="text-gray-400">
                      <p className="font-medium">Drop your image here, or click to browse</p>
                      <p className="text-sm">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Info size={20} className="text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm text-blue-300">
                Your NFT will be minted on the Solana blockchain. Make sure all information is correct before proceeding.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || (!selectedFile && !useMetadataUrl)}
            >
              {isSubmitting ? 'Creating NFT...' : 'Create NFT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNFTPage;