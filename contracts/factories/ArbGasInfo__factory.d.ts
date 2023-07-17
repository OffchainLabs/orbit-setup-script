import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  ArbGasInfo,
  ArbGasInfoInterface,
} from '@arbitrum/sdk/dist/lib/abi/ArbGasInfo'
export declare class ArbGasInfo__factory {
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
  static createInterface(): ArbGasInfoInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ArbGasInfo
}
