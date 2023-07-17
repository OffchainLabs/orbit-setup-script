import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  L2GatewayToken,
  L2GatewayTokenInterface,
} from '@arbitrum/sdk/dist/lib/abi/L2GatewayToken'
export declare class L2GatewayToken__factory {
  static readonly abi: (
    | {
        anonymous: boolean
        inputs: {
          indexed: boolean
          internalType: string
          name: string
          type: string
        }[]
        name: string
        type: string
        outputs?: undefined
        stateMutability?: undefined
      }
    | {
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
        anonymous?: undefined
      }
  )[]
  static createInterface(): L2GatewayTokenInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): L2GatewayToken
}
