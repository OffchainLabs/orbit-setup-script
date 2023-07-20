import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  ArbosTest,
  ArbosTestInterface,
} from '@arbitrum/sdk/dist/lib/abi/ArbosTest'
export declare class ArbosTest__factory {
  static readonly abi: {
    inputs: {
      internalType: string
      name: string
      type: string
    }[]
    name: string
    outputs: never[]
    stateMutability: string
    type: string
  }[]
  static createInterface(): ArbosTestInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ArbosTest
}
