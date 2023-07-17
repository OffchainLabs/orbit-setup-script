import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  IOwnable,
  IOwnableInterface,
} from '@arbitrum/sdk/dist/lib/abi/IOwnable'
export declare class IOwnable__factory {
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
  static createInterface(): IOwnableInterface
  static connect(address: string, signerOrProvider: Signer | Provider): IOwnable
}
