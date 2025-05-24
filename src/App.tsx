import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';

// Layout components
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import MarketplacePage from './pages/MarketplacePage';
import CampaignDetailsPage from './pages/CampaignDetailsPage';
import CreateCampaignPage from './pages/CreateCampaignPage';
import AffiliateLinksPage from './pages/AffiliateLinksPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import CreateCampChatGpt from './pages/CreateCampChatGpt';
import CreateNFTPage from './pages/CreateNFTPage';

function App() {
  const { connected } = useWallet();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/campaign/:id" element={<CampaignDetailsPage />} />
        
        {/* Protected routes */}
        {connected && (
          <>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/create-campaign" element={<CreateCampaignPage />} />
            <Route path="/affiliate-links" element={<AffiliateLinksPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/create-nft" element={<CreateNFTPage />} />
            <Route path="/create-campgpt" element={<CreateCampChatGpt />} />
          </>
        )}
        
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}

export default App;