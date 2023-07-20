import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  ITokenGateway,
  ITokenGatewayInterface,
} from '@arbitrum/sdk/dist/lib/abi/ITokenGateway'
export declare class ITokenGateway__factory {
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
  static createInterface(): ITokenGatewayInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ITokenGateway
}
