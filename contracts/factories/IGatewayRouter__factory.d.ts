import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  IGatewayRouter,
  IGatewayRouterInterface,
} from '@arbitrum/sdk/dist/lib/abi/IGatewayRouter'
export declare class IGatewayRouter__factory {
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
  static createInterface(): IGatewayRouterInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IGatewayRouter
}
