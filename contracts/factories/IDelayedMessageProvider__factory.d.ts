import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  IDelayedMessageProvider,
  IDelayedMessageProviderInterface,
} from '@arbitrum/sdk/dist/lib/abi/IDelayedMessageProvider'
export declare class IDelayedMessageProvider__factory {
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
  static createInterface(): IDelayedMessageProviderInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IDelayedMessageProvider
}
