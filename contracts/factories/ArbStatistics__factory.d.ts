import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  ArbStatistics,
  ArbStatisticsInterface,
} from '@arbitrum/sdk/dist/lib/abi/ArbStatistics'
export declare class ArbStatistics__factory {
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
  static createInterface(): ArbStatisticsInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ArbStatistics
}
