import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type { IWETH9, IWETH9Interface } from '@arbitrum/sdk/dist/lib/abi/IWETH9'
export declare class IWETH9__factory {
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
  static createInterface(): IWETH9Interface
  static connect(address: string, signerOrProvider: Signer | Provider): IWETH9
}
