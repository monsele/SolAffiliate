import { Program, AnchorProvider, web3, utils, Idl } from "@project-serum/anchor";
import {IDL} from "../anchor/affiliate_dapp"
import { AffiliateDapp } from "../anchor/idl";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";

const programId = new web3.PublicKey(IDL.address);

/**
 * Returns an Anchor Program instance for the AffiliateDapp.
 */
export function getAffiliateProgram(provider: AnchorProvider): Program<AffiliateDapp> {
  return new Program<AffiliateDapp>(IDL, programId, provider);
}

/**
 * createAffiliateLink: initializes a new affiliate link PDA for an influencer and campaign.
 */
export async function createAffiliateLink(
  provider: AnchorProvider,
  campaignName: string
): Promise<web3.TransactionSignature> {
  const program = getAffiliateProgram(provider);
  const influencer = provider.wallet.publicKey;

  const [campaignPda] = await web3.PublicKey.findProgramAddress(
    [Buffer.from("nft_campaign"), Buffer.from(campaignName)],
    programId
  );

  const [affiliateLinkPda] = await web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("affiliate_link"),
      influencer.toBuffer(),
      Buffer.from(campaignName),
    ],
    programId
  );

  return await program.methods
    .createAffiliateLink(campaignName)
    .accounts({
      affiliateLink: affiliateLinkPda,
      campaign: campaignPda,
      influencer,
      systemProgram: web3.SystemProgram.programId,
    })
    .rpc();
}

/**
 * createNftCampaign: initializes a new NFT campaign and escrow accounts.
 */
export async function createNftCampaign(
  provider: AnchorProvider,
  name: string,
  mintPrice: bigint,
  commissionPercentage: number,
  campaignDetails: string,
  nftMint: web3.PublicKey
): Promise<web3.TransactionSignature> {
  const program = getAffiliateProgram(provider);
  const company = provider.wallet.publicKey;

  const [campaignPda] = await web3.PublicKey.findProgramAddress(
    [Buffer.from("nft_campaign"), Buffer.from(name)],
    programId
  );

  const projectTokenAccount = await getAssociatedTokenAddress(
    nftMint,
    company
  );

  const [nftEscrow] = await web3.PublicKey.findProgramAddress(
    [Buffer.from("nft_escrow"), campaignPda.toBuffer()],
    programId
  );

  const escrowPdaNftTokenAccount = await getAssociatedTokenAddress(
    nftMint,
    nftEscrow
  );

  return await program.methods
    .createNftCampaign(name, mintPrice, commissionPercentage, campaignDetails)
    .accounts({
      company,
      campaign: campaignPda,
      nftMint,
      projectTokenAccount,
      nftEscrow,
      escrowPdaNftTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: web3.SystemProgram.programId,
    })
    .rpc();
}

/**
 * processAffiliateMint: handles affiliate mint flow, transferring NFTs and distributing commission.
 */
export async function processAffiliateMint(
  provider: AnchorProvider,
  campaignName: string,
  influencer: web3.PublicKey,
  owner: web3.PublicKey,
  nftMint: web3.PublicKey
): Promise<web3.TransactionSignature> {
  const program = getAffiliateProgram(provider);
  const buyer = provider.wallet.publicKey;

  const [campaignPda] = await web3.PublicKey.findProgramAddress(
    [Buffer.from("nft_campaign"), Buffer.from(campaignName)],
    programId
  );

  const [affiliateLinkPda] = await web3.PublicKey.findProgramAddress(
    [
      Buffer.from("affiliate_link"),
      influencer.toBuffer(),
      Buffer.from(campaignName),
    ],
    programId
  );

  const nftEscrowPda = (
    await web3.PublicKey.findProgramAddress(
      [Buffer.from("nft_escrow"), campaignPda.toBuffer()],
      programId
    )
  )[0];

  const buyerTokenAccount = await getAssociatedTokenAddress(
    nftMint,
    buyer
  );

  const ownerTokenAccount = await getAssociatedTokenAddress(
    nftMint,
    owner
  );

  const escrowPdaNftTokenAccount = await getAssociatedTokenAddress(
    nftMint,
    nftEscrowPda
  );

  const [marketplaceAuthority] = await web3.PublicKey.findProgramAddress(
    [Buffer.from("marketplace_authority")],
    programId
  );

  return await program.methods
    .processAffiliateMint(campaignName, influencer)
    .accounts({
      campaign: campaignPda,
      affiliateLink: affiliateLinkPda,
      buyer,
      owner,
      influencer,
      nftMint,
      nftEscrow: nftEscrowPda,
      buyerTokenAccount,
      ownerTokenAccount,
      escrowPdaNftTokenAccount,
      marketplaceAuthority,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: web3.SystemProgram.programId,
    })
    .rpc();
}
