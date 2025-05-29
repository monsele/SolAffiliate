Create a new page where a user can create an NFT.
This page will include a form where users enter 
Name, Symbol, description, upload a image file and an option to add the metadata url if the user does not have an image
A button to then create the NFT



{
    "name": "Preme",
    "symbol": "SLMAO",
    "description": "Jusysyss",
    "metadataUrl": "",
    "file": {}
}


This is a page in my solana app where a user can see all the NFTs and then select one that will be used to later create what I call a campaign.
Can you help build out the feature where I can see the NFTS in my wallet. The app is a solana dapp. its a react vite project. At the moment we are just working with dummy data


import { Metaplex } from "@metaplex-foundation/js";

// Update the Campaign interface to include metadata
interface Campaign {
  name: string;
  mintPrice: string;
  commissionPercentage: string;
  campaignDetails: string;
  nftMint: string;
  nftMetadata: {
    name: string;
    description: string;
    image: string;
    attributes?: Array<{
      trait_type: string;
      value: string;
    }>;
  };
}

export async function getCampaigns(provider: AnchorProvider) {
  const program = new Program(idl as AffiliateDapp, provider);
  const metaplex = new Metaplex(provider.connection);
  const campaignAccounts = await program.account.nftCampaign.all();

  const campaigns: Campaign[] = await Promise.all(
    (campaignAccounts as CampaignAccount[]).map(async (campaign) => {
      // Fetch NFT metadata using Metaplex
      const nft = await metaplex
        .nfts()
        .findByMint({ mintAddress: campaign.account.nftMint });

      return {
        name: campaign.account.name,
        mintPrice: campaign.account.mintPrice.toString(),
        commissionPercentage: campaign.account.commissionPercentage.toString(),
        campaignDetails: campaign.account.campaignDetails,
        nftMint: campaign.account.nftMint.toString(),
        nftMetadata: {
          name: nft.name,
          description: nft.json?.description || '',
          image: nft.json?.image || '',
          attributes: nft.json?.attributes || []
        }
      };
    })
  );

  return campaigns;
}