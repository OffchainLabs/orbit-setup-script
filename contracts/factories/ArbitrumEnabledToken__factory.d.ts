import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  ArbitrumEnabledToken,
  ArbitrumEnabledTokenInterface,
} from '@arbitrum/sdk/dist/lib/abi/ArbitrumEnabledToken'
export declare class ArbitrumEnabledToken__factory {
  static readonly abi: {
    inputs: never[]
    name: string
    outputs: {
      internalType: string
      name: string
      type: string
    }[]
    stateMutability: string
    type: string
  }[]
  static createInterface(): ArbitrumEnabledTokenInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ArbitrumEnabledToken
}
