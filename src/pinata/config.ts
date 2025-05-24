
import { PinataSDK } from "pinata-web3"

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.VITE_PINATA_JWT}`,
  pinataGateway: `${process.env.VITE_PUBLIC_GATEWAY_URL}`
})
