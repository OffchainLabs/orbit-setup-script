import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  ArbOwnerPublic,
  ArbOwnerPublicInterface,
} from '@arbitrum/sdk/dist/lib/abi/ArbOwnerPublic'
export declare class ArbOwnerPublic__factory {
  static readonly abi: {
    inputs: {
      internalType: string
      name: string
      type: string
    }[]
    name: string
    outputs: {
      internalType: string
      name: string
      type: string
    }[]
    stateMutability: string
    type: string
  }[]
  static createInterface(): ArbOwnerPublicInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ArbOwnerPublic
}
