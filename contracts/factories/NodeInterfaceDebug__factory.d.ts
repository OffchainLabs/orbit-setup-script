import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  NodeInterfaceDebug,
  NodeInterfaceDebugInterface,
} from '@arbitrum/sdk/dist/lib/abi/NodeInterfaceDebug'
export declare class NodeInterfaceDebug__factory {
  static readonly abi: {
    inputs: {
      internalType: string
      name: string
      type: string
    }[]
    name: string
    outputs: {
      components: {
        internalType: string
        name: string
        type: string
      }[]
      internalType: string
      name: string
      type: string
    }[]
    stateMutability: string
    type: string
  }[]
  static createInterface(): NodeInterfaceDebugInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): NodeInterfaceDebug
}
