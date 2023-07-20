import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  L1ArbitrumMessenger,
  L1ArbitrumMessengerInterface,
} from '@arbitrum/sdk/dist/lib/abi/L1ArbitrumMessenger'
export declare class L1ArbitrumMessenger__factory {
  static readonly abi: {
    anonymous: boolean
    inputs: {
      indexed: boolean
      internalType: string
      name: string
      type: string
    }[]
    name: string
    type: string
  }[]
  static createInterface(): L1ArbitrumMessengerInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): L1ArbitrumMessenger
}
