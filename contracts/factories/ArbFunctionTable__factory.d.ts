import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  ArbFunctionTable,
  ArbFunctionTableInterface,
} from '@arbitrum/sdk/dist/lib/abi/ArbFunctionTable'
export declare class ArbFunctionTable__factory {
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
  static createInterface(): ArbFunctionTableInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ArbFunctionTable
}
