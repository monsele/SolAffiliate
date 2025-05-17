export interface Campaign {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  commissionRate: number;
  active: boolean;
  featured: boolean;
  category: string;
  creatorAddress: string;
  createdAt: string;
  endDate: string;
}

export interface AffiliateLink {
  id: string;
  url: string;
  campaignId: string;
  campaignName: string;
  campaignImage: string;
  affiliateAddress: string;
  commissionRate: number;
  nftPrice: number;
  status: 'active' | 'inactive' | 'expired';
  clicks: number;
  conversions: number;
  earnings: number;
  createdAt: string;
}