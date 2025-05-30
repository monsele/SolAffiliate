import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

export interface CampaignType {
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
export interface Campaign {
  name: string;
  mintPrice: string;
  commissionPercentage: string;
  campaignDetails: string;
  nftMint: string;
  active: boolean;
  //created_at: number,
  nftMetadata: {
    uri?: string;
    name: string;
    description: string;
    image: string;
    attributes?: Array<{
      trait_type: string;
      value: string;
    }>;
  };
}
export interface CampaignAccount {
    publicKey: PublicKey;
    account: {
      name: string;
      mintPrice: BN;
      commissionPercentage: BN;
      campaignDetails: string;
      nftMint: PublicKey;
      active: boolean;
      // Add other fields if needed
    };
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