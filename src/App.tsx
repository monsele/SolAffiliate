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
import CreateNftPage from './pages/CreateNftPage'; // Import the new page

function App() {
  const { connected } = useWallet();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/campaign/:id" element={<CampaignDetailsPage />} />
        <Route path="/create-nft" element={<CreateNftPage />} /> {/* Add the new route */}
        
        {/* Protected routes */}
        {connected && (
          <>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/create-campaign" element={<CreateCampaignPage />} />
            <Route path="/affiliate-links" element={<AffiliateLinksPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </>
        )}
        
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}

export default App;