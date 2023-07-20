import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  IGasRefunder,
  IGasRefunderInterface,
} from '@arbitrum/sdk/dist/lib/abi/IGasRefunder'
export declare class IGasRefunder__factory {
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
  static createInterface(): IGasRefunderInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IGasRefunder
}
