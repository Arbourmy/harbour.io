import { PublicKey } from "@solana/web3.js"
import dotenv from 'dotenv'
import path from "path"

dotenv.config({
	path: path.resolve(__dirname, '../.env')

})
export const shopAddress = new PublicKey(process.env.SOLANA_WALLET_ADDRESS as string) 