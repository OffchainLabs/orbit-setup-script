import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  L2ArbitrumMessenger,
  L2ArbitrumMessengerInterface,
} from '@arbitrum/sdk/dist/lib/abi/L2ArbitrumMessenger'
export declare class L2ArbitrumMessenger__factory {
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
  static createInterface(): L2ArbitrumMessengerInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): L2ArbitrumMessenger
}
