import { Program, AnchorProvider, setProvider, web3, BN } from "@coral-xyz/anchor";
import type { AffiliateDapp } from "../anchor/idl";
import idl from "../anchor/affiliate_dapp.json"
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, getAccount, createAssociatedTokenAccountInstruction, getMint, getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { CreateTokenAccountResponse } from "@/types/response";
import { Metaplex } from "@metaplex-foundation/js";
import { Campaign, CampaignAccount } from "@/types/campaign";
//import { token } from "@metaplex-foundation/js";

// const customRpcUrl = "https://devnet.helius-rpc.com/?api-key=8eb94de2-b378-4923-a86f-10d7590b4fdd";
// const connection = new Connection(customRpcUrl, "confirmed");
// const wallet = useAnchorWallet();
// console.log(wallet ? wallet.publicKey.toString() : "No wallet connected");

// let provider: AnchorProvider | undefined;
// if (wallet) {
//   provider = new AnchorProvider(connection, wallet, {});
//   setProvider(provider);
// }
// export const program = new Program(idl as AffiliateDapp, {
//   connection,
// });

// const programId = new web3.PublicKey(idl.address);


export async function getCampaign(provider: AnchorProvider, nftMint?: PublicKey): Promise<Campaign> {
  const program = new Program(idl as AffiliateDapp, provider);
   const metaplex = new Metaplex(provider.connection);
  const campaignAccounts = await program.account.nftCampaign.all();
  const specificCampaign = campaignAccounts.find(c => c.account.nftMint == nftMint) as CampaignAccount;
  console.log(provider, "provider");
  console.log(specificCampaign.account.nftMint, "scamp");
  
   const nft = await metaplex
        .nfts()
        .findByMint({ mintAddress: specificCampaign.account.nftMint });
console.log("Got here to fetch the NFT metadata");

      const uri = nft.uri.startsWith('ipfs://')
                  ? nft.uri.replace('ipfs://', 'https://ipfs.io/ipfs/')
                  : nft.uri;
          let metaData = await fetch(uri || '');
          let metaDataJson = await metaData.json();         
  const campaign: Campaign = {
    name: specificCampaign.account.name,
    mintPrice: specificCampaign.account.mintPrice.toString(),
    commissionPercentage: specificCampaign.account.commissionPercentage.toString(),
    campaignDetails: specificCampaign.account.campaignDetails,
    nftMint: specificCampaign.account.nftMint.toString(),
    active: specificCampaign.account.active,
    
    nftMetadata: {
      name: "",
      description: metaDataJson.description,
      image:  metaDataJson.image || '',
      attributes: [],
      uri: uri,
    },
  };
  return campaign;
}




export async function getFullCampaigns(provider: AnchorProvider) {
  const program = new Program(idl as AffiliateDapp, provider);
  const metaplex = new Metaplex(provider.connection);
  const campaignAccounts = await program.account.nftCampaign.all();
  const links = await program.account.affiliateLink.all();
  console.log("affiliate links", links);
  
  const campaigns: Campaign[] = await Promise.all(
    (campaignAccounts as CampaignAccount[]).map(async (campaign) => {
      // Fetch NFT metadata using Metaplex
      const nft = await metaplex
        .nfts()
        .findByMint({ mintAddress: campaign.account.nftMint });

      const uri = nft.uri.startsWith('ipfs://')
                  ? nft.uri.replace('ipfs://', 'https://ipfs.io/ipfs/')
                  : nft.uri;
      return {
        name: campaign.account.name,
        mintPrice: campaign.account.mintPrice.toString(),
        commissionPercentage: campaign.account.commissionPercentage.toString(),
        campaignDetails: campaign.account.campaignDetails,
        nftMint: campaign.account.nftMint.toString(),
        active: campaign.account.active,
        nftMetadata: {
          uri: uri,
          name: nft.name,
          description: nft.json?.description || '',
          image: nft.json?.image || '',
          attributes: Array.isArray(nft.json?.attributes)
            ? nft.json.attributes
                .filter(
                  (attr: any) =>
                    typeof attr.trait_type === "string" &&
                    typeof attr.value === "string"
                )
                .map(
                  (attr: any) =>
                    ({
                      trait_type: attr.trait_type,
                      value: attr.value,
                    } as { trait_type: string; value: string })
                )
            : [],
        },
      };
    })
  );

  return campaigns;
}













/**
 * createAffiliateLink: initializes a new affiliate link PDA for an influencer and campaign.
 */
export async function createAffiliateLink(
  provider: AnchorProvider,
  campaignName: string,
  nftMint: PublicKey
): Promise<web3.TransactionSignature> {
  try {
    const program = new Program(idl as AffiliateDapp, provider);
    const programId = new web3.PublicKey(idl.address);
    const influencer = provider?.wallet.publicKey as web3.PublicKey;
    
    // const [campaignPda] = await web3.PublicKey.findProgramAddress(
    //   [Buffer.from("nft_campaign"), Buffer.from(campaignName)],
    //   programId
    // );
    const [campaignPda] = await web3.PublicKey.findProgramAddressSync(
      [Buffer.from("nft_campaign"), Buffer.from(campaignName), nftMint.toBuffer()],
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
      .createAffiliateLink(campaignName,nftMint)
      .accounts({
        affiliateLink: affiliateLinkPda,
        campaign: campaignPda,
        influencer,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();
  } catch (error) {
    console.log(error, "Error creating affiliate link");
    
  }
}

async function CreateToken2022Account(provider: AnchorProvider, mint: PublicKey) {
  try {
    const associatedTokenAccount = getAssociatedTokenAddressSync(
    mint,
    provider.wallet.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID
  );
    await getAccount(provider.connection, associatedTokenAccount, 'confirmed', TOKEN_2022_PROGRAM_ID);
    let response: CreateTokenAccountResponse = {
      tokenAccountAddress: associatedTokenAccount,
      success: true,
      message: 'Company ATA already exists'
    }
    return response;
  } catch (error) {
    try {
      console.log('Creating company Token 2022 ATA...');
 const associatedTokenAccount = getAssociatedTokenAddressSync(
    mint,
    provider.wallet.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID
  );
      const createATAInstruction = createAssociatedTokenAccountInstruction(
        provider.wallet.publicKey,
        associatedTokenAccount,
        provider.wallet.publicKey,
        mint,
        TOKEN_2022_PROGRAM_ID
      );
      await provider.sendAndConfirm(new anchor.web3.Transaction().add(createATAInstruction));
      console.log('Company ATA created successfully');
      const response: CreateTokenAccountResponse = {
        tokenAccountAddress: associatedTokenAccount,
        success: true,
        message: 'Company ATA created successfully'
      }
      return response;
    } catch (error) {
      console.log('Error creating company ATA:', error);
       const associatedTokenAccount = getAssociatedTokenAddressSync(
    mint,
    provider.wallet.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID
  );
      const response: CreateTokenAccountResponse = {
        tokenAccountAddress: associatedTokenAccount,
        success: false,
        message: `Error creating company ATA: ${error}`
      }
      return response;
    }
  }
}




async function CreateTokenAccount(provider: AnchorProvider, mint: PublicKey, owner: PublicKey) {
  console.log(`Creating company SPL Token ATA for mint: ${mint.toString()} and owner: ${owner.toString()}`);
  
  try {
     const associatedTokenAccount = getAssociatedTokenAddressSync(
    mint,
    provider.wallet.publicKey,
    false,
    TOKEN_PROGRAM_ID,
  );
    console.log(`Checking if associated token account exists: ${associatedTokenAccount.toString()}`);
    const accRes=await getAccount(provider.connection, associatedTokenAccount, 'confirmed', TOKEN_PROGRAM_ID);
    console.log(`Associated token account exists: ${accRes.toString()}`);
    
    let response: CreateTokenAccountResponse = {
      tokenAccountAddress: associatedTokenAccount,
      success: true,
      message: 'Company ATA already exists'
    }
    return response;
  } catch (error) {
    try {
    console.log('Creating company SPL Token ATA...');
    const associatedTokenAccount = getAssociatedTokenAddressSync(
    mint,
    provider.wallet.publicKey,
    false,
    TOKEN_PROGRAM_ID
  );
      const createATAInstruction = createAssociatedTokenAccountInstruction(
        provider.wallet.publicKey,
        associatedTokenAccount,
        provider.wallet.publicKey,
        mint,
        TOKEN_PROGRAM_ID
      );
      await provider.sendAndConfirm(new anchor.web3.Transaction().add(createATAInstruction));
      console.log('Company ATA created successfully');
      const response: CreateTokenAccountResponse = {
        tokenAccountAddress: associatedTokenAccount,
        success: true,
        message: 'Company ATA created successfully'
      }
      return response;
    } catch (error) {
      console.log('Error creating company ATA:', error);
       const associatedTokenAccount = getAssociatedTokenAddressSync(
    mint,
    provider.wallet.publicKey,
    false,
    TOKEN_PROGRAM_ID
  );
      const response: CreateTokenAccountResponse = {
        tokenAccountAddress: associatedTokenAccount,
        success: false,
        message: `Error creating company ATA: ${error}`
      }
      return response;
    }
  }
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
  nftMint: web3.PublicKey,
  tokenProgram: string
): Promise<web3.TransactionSignature> {
  const company = provider.wallet.publicKey;
  const program = new Program(idl as AffiliateDapp, provider);
  const programId = new web3.PublicKey(idl.address);
  const mintPriceBN = new BN(mintPrice.toString());
  const [campaignPda] = await web3.PublicKey.findProgramAddressSync(
    [Buffer.from("nft_campaign"), Buffer.from(name), nftMint.toBuffer()],
    programId
  );
  let projectTokenAccount: PublicKey;

  //Check the mint info program Id
  if (tokenProgram == "spl-token") {
    const accountResp = await CreateTokenAccount(provider, nftMint, company);
    if (!accountResp?.success) {
      return Promise.reject(new Error(accountResp.message));
    }
    projectTokenAccount = accountResp.tokenAccountAddress;
  } 
  else 
  {
    const accountResp = await CreateToken2022Account(provider, nftMint);
    if (!accountResp?.success) {
      throw new Error(accountResp.message);
    }
    projectTokenAccount = accountResp.tokenAccountAddress;
  }

  const [nftEscrow] = await web3.PublicKey.findProgramAddressSync(
    [Buffer.from("nft_escrow"), Buffer.from(name),nftMint.toBuffer()],
    programId
  );

  const escrowPdaNftTokenAccount = await getAssociatedTokenAddressSync(
    nftMint,
    nftEscrow,
    true, // allowOwnerOffCurve = true for PDA
    tokenProgram == "spl-token" ? TOKEN_PROGRAM_ID : TOKEN_2022_PROGRAM_ID,
  );

 console.log("Got here to call the instruction");
 
  return await program.methods
    .createNftCampaign(name, mintPriceBN, commissionPercentage, campaignDetails)
    .accounts({
      company,
      campaign: campaignPda,
      nftMint,
      projectTokenAccount,
      nftEscrow,
      escrowPdaNftTokenAccount,
      tokenProgram: tokenProgram == "spl-token" ? TOKEN_PROGRAM_ID : TOKEN_2022_PROGRAM_ID,
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
  const program = new Program(idl as AffiliateDapp, provider);
  const programId = new web3.PublicKey(idl.address);
  const buyer = provider.wallet.publicKey;

  const [campaignPda] = await web3.PublicKey.findProgramAddressSync(
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

  const nftEscrowPda = (
    await web3.PublicKey.findProgramAddressSync(
      [Buffer.from("nft_escrow"), campaignPda.toBuffer()],
      programId
    )
  )[0];

  const buyerTokenAccount = await getAssociatedTokenAddressSync(
    nftMint,
    buyer
  );

  const ownerTokenAccount = await getAssociatedTokenAddressSync(
    nftMint,
    owner
  );

  const escrowPdaNftTokenAccount = await getAssociatedTokenAddressSync(
    nftMint,
    nftEscrowPda
  );

  const [marketplaceAuthority] = await web3.PublicKey.findProgramAddressSync(
    [Buffer.from("marketplace_authority")],
    programId
  );

  return await program.methods
    .processAffiliateMint(campaignName, influencer,nftMint)
    .accounts({
      //campaign: campaignPda,
      //affiliateLink: affiliateLinkPda,
      buyer,
      owner,
      influencer,
      nftMint,
      //nftEscrow: nftEscrowPda,
      //buyerTokenAccount,
      //ownerTokenAccount,
      //escrowPdaNftTokenAccount,
      //marketplaceAuthority,
      //tokenProgram: TOKEN_PROGRAM_ID,
      //associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      //systemProgram: web3.SystemProgram.programId,
    })
    .rpc();
}

