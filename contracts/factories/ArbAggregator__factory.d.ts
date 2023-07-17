import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  ArbAggregator,
  ArbAggregatorInterface,
} from '@arbitrum/sdk/dist/lib/abi/ArbAggregator'
export declare class ArbAggregator__factory {
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
  static createInterface(): ArbAggregatorInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ArbAggregator
}
