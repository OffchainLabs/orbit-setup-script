import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  IL1CustomGateway,
  IL1CustomGatewayInterface,
} from '@arbitrum/sdk/dist/lib/abi/IL1CustomGateway'
export declare class IL1CustomGateway__factory {
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
  static createInterface(): IL1CustomGatewayInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IL1CustomGateway
}
