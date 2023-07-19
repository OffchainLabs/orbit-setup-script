import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  ArbInfo,
  ArbInfoInterface,
} from '@arbitrum/sdk/dist/lib/abi/ArbInfo'
export declare class ArbInfo__factory {
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
  static createInterface(): ArbInfoInterface
  static connect(address: string, signerOrProvider: Signer | Provider): ArbInfo
}
