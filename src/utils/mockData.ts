import { Campaign, AffiliateLink } from '../types/campaign';

export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Cosmic Voyagers Collection',
    description: 'A limited collection of 1,000 unique space explorers traversing the cosmos. Each NFT grants access to exclusive virtual events and merchandise.',
    imageUrl: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg',
    price: 1.5,
    commissionRate: 12,
    active: true,
    featured: true,
    category: 'art',
    creatorAddress: '5RZLHU7eYNc9ttX3ghPZ7bhwvYgJ7mV7c7qH9BjZ4pMF',
    createdAt: '2025-04-01T12:00:00Z',
    endDate: '2025-07-01T12:00:00Z'
  },
  {
    id: '2',
    name: 'Digital Dreams',
    description: 'Surreal digital landscapes that blur the line between reality and imagination. Each piece is meticulously crafted with thousands of intricate details.',
    imageUrl: 'https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg',
    price: 2.8,
    commissionRate: 15,
    active: true,
    featured: true,
    category: 'art',
    creatorAddress: '5RZLHU7eYNc9ttX3ghPZ7bhwvYgJ7mV7c7qH9BjZ4pMF',
    createdAt: '2025-03-20T12:00:00Z',
    endDate: '2025-06-20T12:00:00Z'
  },
  {
    id: '3',
    name: 'Mystic Creatures',
    description: 'Mythical beings from ancient folklore reimagined for the digital age. Each NFT comes with a detailed lore and history of its creature.',
    imageUrl: 'https://images.pexels.com/photos/6577903/pexels-photo-6577903.jpeg',
    price: 1.2,
    commissionRate: 10,
    active: true,
    featured: false,
    category: 'collectibles',
    creatorAddress: '7H8ye5unxAi8n9P5mpJT1xq7XszxiEuCv7CUY8FFUqsJ',
    createdAt: '2025-04-05T12:00:00Z',
    endDate: '2025-07-05T12:00:00Z'
  },
  {
    id: '4',
    name: 'CryptoKingdoms',
    description: 'Build and expand your virtual kingdom in this play-to-earn NFT strategy game. Own land, resources, and characters all as NFTs.',
    imageUrl: 'https://images.pexels.com/photos/3593865/pexels-photo-3593865.jpeg',
    price: 0.8,
    commissionRate: 20,
    active: true,
    featured: false,
    category: 'gaming',
    creatorAddress: '3RZLHU7eYNc9ttX3ghPZ7bhwvYgJ7mV7c7qH9BjZ4pMF',
    createdAt: '2025-03-15T12:00:00Z',
    endDate: '2025-06-15T12:00:00Z'
  },
  {
    id: '5',
    name: 'MetaVilla Apartments',
    description: 'Own property in the most exclusive metaverse neighborhood. Each apartment comes with customizable interiors and exclusive event access.',
    imageUrl: 'https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg',
    price: 4.5,
    commissionRate: 8,
    active: true,
    featured: true,
    category: 'metaverse',
    creatorAddress: '7H8ye5unxAi8n9P5mpJT1xq7XszxiEuCv7CUY8FFUqsJ',
    createdAt: '2025-04-10T12:00:00Z',
    endDate: '2025-07-10T12:00:00Z'
  },
  {
    id: '6',
    name: 'CryptoAvatars',
    description: 'Unique 3D avatar NFTs that can be used across compatible metaverse platforms. Stand out with rare traits and accessories.',
    imageUrl: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg',
    price: 1.8,
    commissionRate: 15,
    active: true,
    featured: false,
    category: 'pfp',
    creatorAddress: '5RZLHU7eYNc9ttX3ghPZ7bhwvYgJ7mV7c7qH9BjZ4pMF',
    createdAt: '2025-03-25T12:00:00Z',
    endDate: '2025-06-25T12:00:00Z'
  }
];

export const mockAffiliateLinks: AffiliateLink[] = [
  {
    id: '1',
    url: 'https://nexusnft.io/nft/1?ref=7H8ye5unxAi8n9P5mpJT1xq7XszxiEuCv7CUY8FFUqsJ',
    campaignId: '1',
    campaignName: 'Cosmic Voyagers Collection',
    campaignImage: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg',
    affiliateAddress: '7H8ye5unxAi8n9P5mpJT1xq7XszxiEuCv7CUY8FFUqsJ',
    commissionRate: 12,
    nftPrice: 1.5,
    status: 'active',
    clicks: 243,
    conversions: 18,
    earnings: 3.24,
    createdAt: '2025-04-02T08:12:34Z'
  },
  {
    id: '2',
    url: 'https://nexusnft.io/nft/2?ref=7H8ye5unxAi8n9P5mpJT1xq7XszxiEuCv7CUY8FFUqsJ',
    campaignId: '2',
    campaignName: 'Digital Dreams',
    campaignImage: 'https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg',
    affiliateAddress: '7H8ye5unxAi8n9P5mpJT1xq7XszxiEuCv7CUY8FFUqsJ',
    commissionRate: 15,
    nftPrice: 2.8,
    status: 'active',
    clicks: 187,
    conversions: 12,
    earnings: 5.04,
    createdAt: '2025-03-21T14:45:22Z'
  },
  {
    id: '3',
    url: 'https://nexusnft.io/nft/3?ref=7H8ye5unxAi8n9P5mpJT1xq7XszxiEuCv7CUY8FFUqsJ',
    campaignId: '3',
    campaignName: 'Mystic Creatures',
    campaignImage: 'https://images.pexels.com/photos/6577903/pexels-photo-6577903.jpeg',
    affiliateAddress: '7H8ye5unxAi8n9P5mpJT1xq7XszxiEuCv7CUY8FFUqsJ',
    commissionRate: 10,
    nftPrice: 1.2,
    status: 'inactive',
    clicks: 95,
    conversions: 5,
    earnings: 0.6,
    createdAt: '2025-04-06T09:33:17Z'
  },
  {
    id: '4',
    url: 'https://nexusnft.io/nft/5?ref=7H8ye5unxAi8n9P5mpJT1xq7XszxiEuCv7CUY8FFUqsJ',
    campaignId: '5',
    campaignName: 'MetaVilla Apartments',
    campaignImage: 'https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg',
    affiliateAddress: '7H8ye5unxAi8n9P5mpJT1xq7XszxiEuCv7CUY8FFUqsJ',
    commissionRate: 8,
    nftPrice: 4.5,
    status: 'active',
    clicks: 120,
    conversions: 3,
    earnings: 1.08,
    createdAt: '2025-04-11T16:22:05Z'
  },
  {
    id: '5',
    url: 'https://nexusnft.io/nft/6?ref=7H8ye5unxAi8n9P5mpJT1xq7XszxiEuCv7CUY8FFUqsJ',
    campaignId: '6',
    campaignName: 'CryptoAvatars',
    campaignImage: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg',
    affiliateAddress: '7H8ye5unxAi8n9P5mpJT1xq7XszxiEuCv7CUY8FFUqsJ',
    commissionRate: 15,
    nftPrice: 1.8,
    status: 'expired',
    clicks: 75,
    conversions: 2,
    earnings: 0.54,
    createdAt: '2025-03-26T11:15:49Z'
  }
];

//anchor idl parse -f src\anchor\affiliate_dapp.json -o src\anchor\idlType.ts