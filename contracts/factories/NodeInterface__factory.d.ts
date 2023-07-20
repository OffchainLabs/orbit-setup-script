import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  NodeInterface,
  NodeInterfaceInterface,
} from '@arbitrum/sdk/dist/lib/abi/NodeInterface'
export declare class NodeInterface__factory {
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
  static createInterface(): NodeInterfaceInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): NodeInterface
}
