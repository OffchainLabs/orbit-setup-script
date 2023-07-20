import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  ICloneable,
  ICloneableInterface,
} from '@arbitrum/sdk/dist/lib/abi/ICloneable'
export declare class ICloneable__factory {
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
  static createInterface(): ICloneableInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ICloneable
}
