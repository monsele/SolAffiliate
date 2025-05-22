// export async function getCampaigns() {
//   const campaignAccounts = await program.account.nftCampaign.all();
//   interface CampaignAccount {
//     publicKey: PublicKey;
//     account: {
//       name: string;
//       mintPrice: BN;
//       commissionPercentage: BN;
//       campaignDetails: string;
//       nftMint: PublicKey;
//       // Add other fields if needed
//     };
//   }

//   interface Campaign {
//     name: string;
//     mintPrice: string;
//     commissionPercentage: string;
//     campaignDetails: string;
//     nftMint: string;
//   }

//   const campaigns: Campaign[] = (campaignAccounts as CampaignAccount[]).map((campaign) => ({
//     name: campaign.account.name,
//     mintPrice: campaign.account.mintPrice.toString(),
//     commissionPercentage: campaign.account.commissionPercentage.toString(),
//     campaignDetails: campaign.account.campaignDetails,
//     nftMint: campaign.account.nftMint.toString(),
//   }));
//   return campaigns;
// }



// /**
//  * createAffiliateLink: initializes a new affiliate link PDA for an influencer and campaign.
//  */
// export async function createAffiliateLink(
//   //provider: AnchorProvider,
//   campaignName: string
// ): Promise<web3.TransactionSignature> {
  
//   const influencer = provider?.wallet.publicKey as web3.PublicKey;
// 2
//   const [campaignPda] = await web3.PublicKey.findProgramAddress(
//     [Buffer.from("nft_campaign"), Buffer.from(campaignName)],
//     programId
//   );

//   const [affiliateLinkPda] = await web3.PublicKey.findProgramAddressSync(
//     [
//       Buffer.from("affiliate_link"),
//       influencer.toBuffer(),
//       Buffer.from(campaignName),
//     ],
//     programId
//   );

//   return await program.methods
//     .createAffiliateLink(campaignName)
//     .accounts({
//       //affiliateLink: affiliateLinkPda,
//      // campaign: campaignPda,
//       influencer,
//       //systemProgram: web3.SystemProgram.programId,
//     })
//     .rpc();
// }

// /**
//  * createNftCampaign: initializes a new NFT campaign and escrow accounts.
//  */
// export async function createNftCampaign(
//   provider: AnchorProvider,
//   name: string,
//   mintPrice: bigint,
//   commissionPercentage: number,
//   campaignDetails: string,
//   nftMint: web3.PublicKey
// ): Promise<web3.TransactionSignature> {
//   const company = provider.wallet.publicKey;

//   const [campaignPda] = await web3.PublicKey.findProgramAddress(
//     [Buffer.from("nft_campaign"), Buffer.from(name)],
//     programId
//   );

//   const projectTokenAccount = await getAssociatedTokenAddress(
//     nftMint,
//     company
//   );

//   const [nftEscrow] = await web3.PublicKey.findProgramAddress(
//     [Buffer.from("nft_escrow"), campaignPda.toBuffer()],
//     programId
//   );

//   const escrowPdaNftTokenAccount = await getAssociatedTokenAddress(
//     nftMint,
//     nftEscrow
//   );

//   return await program.methods
//     .createNftCampaign(name, mintPrice, commissionPercentage, campaignDetails)
//     .accounts({
//       company,
//       //campaign: campaignPda,
//       nftMint,
//       //projectTokenAccount,
//       //nftEscrow,
//       //escrowPdaNftTokenAccount,
//       //tokenProgram: TOKEN_PROGRAM_ID,
//       //associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
//       //systemProgram: web3.SystemProgram.programId,
//     })
//     .rpc();
// }

// /**
//  * processAffiliateMint: handles affiliate mint flow, transferring NFTs and distributing commission.
//  */
// export async function processAffiliateMint(
//   provider: AnchorProvider,
//   campaignName: string,
//   influencer: web3.PublicKey,
//   owner: web3.PublicKey,
//   nftMint: web3.PublicKey
// ): Promise<web3.TransactionSignature> {
//   const buyer = provider.wallet.publicKey;

//   const [campaignPda] = await web3.PublicKey.findProgramAddressSync(
//     [Buffer.from("nft_campaign"), Buffer.from(campaignName)],
//     programId
//   );

//   const [affiliateLinkPda] = await web3.PublicKey.findProgramAddressSync(
//     [
//       Buffer.from("affiliate_link"),
//       influencer.toBuffer(),
//       Buffer.from(campaignName),
//     ],
//     programId
//   );

//   const nftEscrowPda = (
//     await web3.PublicKey.findProgramAddressSync(
//       [Buffer.from("nft_escrow"), campaignPda.toBuffer()],
//       programId
//     )
//   )[0];

//   const buyerTokenAccount = await getAssociatedTokenAddress(
//     nftMint,
//     buyer
//   );

//   const ownerTokenAccount = await getAssociatedTokenAddress(
//     nftMint,
//     owner
//   );

//   const escrowPdaNftTokenAccount = await getAssociatedTokenAddress(
//     nftMint,
//     nftEscrowPda
//   );

//   const [marketplaceAuthority] = await web3.PublicKey.findProgramAddressSync(
//     [Buffer.from("marketplace_authority")],
//     programId
//   );

//   return await program.methods
//     .processAffiliateMint(campaignName, influencer)
//     .accounts({
//       //campaign: campaignPda,
//       //affiliateLink: affiliateLinkPda,
//       buyer,
//       owner,
//       influencer,
//       nftMint,
//       //nftEscrow: nftEscrowPda,
//       //buyerTokenAccount,
//       //ownerTokenAccount,
//       //escrowPdaNftTokenAccount,
//       //marketplaceAuthority,
//       //tokenProgram: TOKEN_PROGRAM_ID,
//       //associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
//       //systemProgram: web3.SystemProgram.programId,
//     })
//     .rpc();
// }
