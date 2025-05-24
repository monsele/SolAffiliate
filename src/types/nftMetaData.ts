export interface NFTMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string; // e.g., ipfs://...
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  properties: {
    files: Array<{
      uri: string;
      type: string;
    }>;
    category: string;
    creators: Array<{
      address: string;
      share: number;
    }>;
  };
}

// const exampleNFTMetadata: NFTMetadata = {
//   name: "Cool NFT",
//   symbol: "CNFT",
//   description: "This is an awesome NFT.",
//   image: "ipfs://Qm.../image.png",
//   attributes: [
//     { trait_type: "Background", value: "Blue" },
//     { trait_type: "Eyes", value: "Laser" },
//   ],
//   properties: {
//     files: [{ uri: "image.png", type: "image/png" }],
//     category: "image",
//     creators: [
//       {
//         address: "USER_WALLET_ADDRESS",
//         share: 100,
//       },
//     ],
//   },
// };
