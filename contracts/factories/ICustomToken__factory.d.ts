import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  ICustomToken,
  ICustomTokenInterface,
} from '@arbitrum/sdk/dist/lib/abi/ICustomToken'
export declare class ICustomToken__factory {
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
  static createInterface(): ICustomTokenInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ICustomToken
}
