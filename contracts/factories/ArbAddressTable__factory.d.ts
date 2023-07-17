import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  ArbAddressTable,
  ArbAddressTableInterface,
} from '@arbitrum/sdk/dist/lib/abi/ArbAddressTable'
export declare class ArbAddressTable__factory {
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
  static createInterface(): ArbAddressTableInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ArbAddressTable
}
