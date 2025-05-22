// IMPORTANT: For this component to compile and run, ensure the following npm packages are installed
// in your project's environment:
// - @solana/wallet-adapter-react
// - @solana/wallet-adapter-react-ui
// - @solana/wallet-adapter-wallets
// - @solana/web3.js
// - @metaplex-foundation/js
// - framer-motion
// - lucide-react

import React, { useState, useMemo } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Metaplex, walletAdapterIdentity, irysStorage, toMetaplexFileFromBrowser } from '@metaplex-foundation/js';
import { PublicKey, clusterApiUrl } from '@solana/web3.js';
import { motion } from 'framer-motion';
import { LinkIcon } from 'lucide-react';

const CreateTestNFTPage: React.FC = () => {
  const { connection } = useConnection();
  const wallet = useWallet(); // Access the wallet context

  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uri, setUri] = useState(''); // State for external URI if no image is uploaded
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Initialize Metaplex instance only when the wallet is connected and ready
  const metaplex = useMemo(() => {
    if (wallet.connected && wallet.publicKey) {
      // Use Irys (formerly Arweave) for storage. Ensure you have some SOL for storage fees.
      // For devnet, you might need to fund your Irys account.
      // Alternatively, you can use 'bundlrStorage()' or 'awsStorage()' if configured.
      return Metaplex.make(connection)
        .use(walletAdapterIdentity(wallet))
        .use(irysStorage({ address: 'https://devnet.irys.xyz', providerUrl: clusterApiUrl('devnet') }));
    }
    return null; // Return null if wallet is not connected, so metaplex is undefined
  }, [connection, wallet.connected, wallet.publicKey]); // Depend on wallet.connected and wallet.publicKey

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleCreateNFT = async () => {
    // Explicitly check if wallet is connected and metaplex instance is available
    if (!wallet.connected || !wallet.publicKey || !metaplex) {
      setMessage({ type: 'error', text: 'Please connect your wallet first.' });
      return;
    }

    if (!name || !symbol || (!imageFile && !uri)) {
      setMessage({ type: 'error', text: 'Please fill in NFT Name, Symbol, and either upload an Image or provide an External URI.' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      let finalUri = uri;

      if (imageFile) {
        setMessage({ type: 'info', text: 'Uploading image and metadata...' });
        const metaplexFile = await toMetaplexFileFromBrowser(imageFile);
        const uploadedUri = await metaplex.storage().upload({
          fileName:name,
          displayName:symbol,
          description,
          image: metaplexFile,
          // You can add more attributes here if needed
          attributes: [
            { trait_type: "Creator", value: wallet.publicKey.toBase58() },
          ],
        });
        finalUri = uploadedUri;
      } else if (!finalUri) {
        // Fallback if no image and no URI provided
        setMessage({ type: 'error', text: 'An image or external URI is required.' });
        setIsLoading(false);
        return;
      }

      setMessage({ type: 'info', text: `Minting NFT with URI: ${finalUri}...` });

      const { nft } = await metaplex.nfts().create({
        uri: finalUri,
        name: name,
        symbol: symbol,
        sellerFeeBasisPoints: 500, // 5% royalty
        creators: [{ address: wallet.publicKey, share: 100 }],
        isMutable: true, // Set to false if you want to make it immutable after creation
        tokenStandard: 0, // 0 for NonFungible, 1 for Fungible, 2 for NonFungibleEdition
      });

      setMessage({
        type: 'success',
        text: `NFT minted successfully! Mint Address: ${nft.address.toBase58()}. View on Explorer: https://explorer.solana.com/address/${nft.address.toBase58()}?cluster=devnet`,
      });
      console.log('Minted NFT:', nft);

      // Optionally, make the NFT immutable after creation
      // if (nft.metadataAddress && nft.tokenStandard === 0) { // Only for NonFungible
      //   setMessage({ type: 'info', text: 'Making NFT metadata immutable...' });
      //   await metaplex.nfts().update({
      //     nftOrSft: nft,
      //     isMutable: false,
      //   });
      //   setMessage(prev => prev ? { ...prev, text: prev.text + ' Metadata is now immutable.' } : null);
      // }

    } catch (error: any) {
      console.error('Error creating NFT:', error);
      setMessage({ type: 'error', text: `Failed to create NFT: ${error.message || error.toString()}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-6 bg-gray-900 text-white rounded-lg shadow-xl max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center">Create Test NFT on Devnet</h1>
      <p className="text-gray-400 text-center">
        {wallet.connected ? (
          <>
            Connected wallet: <span className="text-purple-400">{wallet.publicKey?.toBase58().slice(0, 6)}...{wallet.publicKey?.toBase58().slice(-4)}</span>
            <br />
            Ensure you have enough Devnet SOL for transaction fees and storage.
          </>
        ) : (
          'Please connect your wallet to mint NFTs.'
        )}
      </p>

      {!wallet.connected && (
        <div className="text-center">
          <p className="text-yellow-400">
            Please connect your wallet using the "Select Wallet" button at the top of the page.
          </p>
        </div>
      )}

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg text-sm ${
            message.type === 'success' ? 'bg-green-500/20 text-green-400' :
            message.type === 'error' ? 'bg-red-500/20 text-red-400' :
            'bg-blue-500/20 text-blue-400'
          }`}
        >
          {message.text}
          {message.type === 'success' && message.text.includes('View on Explorer') && (
              <a
                href={message.text.substring(message.text.indexOf('https://explorer.solana.com'))}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2 text-purple-300 hover:underline"
              >
                Open in Solana Explorer
              </a>
          )}
        </motion.div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">NFT Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:ring-purple-500 focus:border-purple-500"
            placeholder="e.g., My Awesome NFT"
            disabled={isLoading || !wallet.connected}
          />
        </div>

        <div>
          <label htmlFor="symbol" className="block text-sm font-medium text-gray-300 mb-1">Symbol</label>
          <input
            type="text"
            id="symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:ring-purple-500 focus:border-purple-500"
            placeholder="e.g., MANFT"
            disabled={isLoading || !wallet.connected}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:ring-purple-500 focus:border-purple-500"
            placeholder="A brief description of your NFT"
            disabled={isLoading || !wallet.connected}
          ></textarea>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-1">NFT Image (optional)</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600 cursor-pointer"
            disabled={isLoading || !wallet.connected}
          />
          {imageFile && <p className="text-xs text-gray-400 mt-1">Selected: {imageFile.name}</p>}
        </div>

        <div className="flex items-center space-x-2 text-gray-400">
          <hr className="flex-grow border-gray-700" />
          <span>OR</span>
          <hr className="flex-grow border-gray-700" />
        </div>

        <div>
          <label htmlFor="uri" className="block text-sm font-medium text-gray-300 mb-1">External Metadata URI (optional, if no image)</label>
          <input
            type="url"
            id="uri"
            value={uri}
            onChange={(e) => setUri(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:ring-purple-500 focus:border-purple-500"
            placeholder="e.g., https://arweave.net/your-metadata-uri"
            disabled={isLoading || !wallet.connected || imageFile !== null} // Disable if image is selected
          />
          {imageFile && <p className="text-xs text-yellow-400 mt-1">Image upload will override this URI.</p>}
        </div>

        <button
          onClick={handleCreateNFT}
          className="w-full btn btn-primary py-3 text-lg font-semibold rounded-md transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !wallet.connected || (!name || !symbol || (!imageFile && !uri))}
        >
          {isLoading ? 'Minting NFT...' : 'Mint NFT'}
        </button>
      </div>
    </div>
  );
};

export default CreateTestNFTPage;