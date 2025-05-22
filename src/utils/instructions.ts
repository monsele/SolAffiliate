import { Program, AnchorProvider, setProvider,web3, BN } from "@coral-xyz/anchor";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import type {AffiliateDapp} from "../anchor/idl";
import idl from "../anchor/affiliate_dapp.json"
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";

const customRpcUrl = "https://devnet.helius-rpc.com/?api-key=8eb94de2-b378-4923-a86f-10d7590b4fdd";
const connection = new Connection(customRpcUrl, "confirmed");
const wallet = useAnchorWallet();
console.log(wallet ? wallet.publicKey.toString() : "No wallet connected");

let provider: AnchorProvider | undefined;
if (wallet) {
  provider = new AnchorProvider(connection, wallet, {});
  setProvider(provider);
}
export const program = new Program(idl as AffiliateDapp, {
  connection,
});

const programId = new web3.PublicKey(idl.address);
