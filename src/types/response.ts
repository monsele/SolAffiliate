import { PublicKey } from "@solana/web3.js";

export interface CreateTokenAccountResponse {
    tokenAccountAddress:PublicKey,
    success: boolean,
    message: string,
}

export interface Response {
    success: boolean,
    message: string,
}