import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  TokenGateway,
  TokenGatewayInterface,
} from '@arbitrum/sdk/dist/lib/abi/TokenGateway'
export declare class TokenGateway__factory {
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
  static createInterface(): TokenGatewayInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TokenGateway
}
