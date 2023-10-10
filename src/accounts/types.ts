import { type Signer } from "@unique-nft/sdk";
import { type SignerResult } from "@unique-nft/utils/extension";
import { type Signer as EthersSigner } from "ethers";

export enum SignerTypeEnum {
  Local = 'Local',
  Polkadot = 'Polkadot',
  Metamask = 'Metamask'
}

export interface Account {
  name: string;
  address: string;
  signerType: SignerTypeEnum; 
  signer: (Signer | EthersSigner) & { signMessage?(message: string): Promise<string | SignerResult> } ;
  balance?: number;
}
