import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  L2ArbitrumGateway,
  L2ArbitrumGatewayInterface,
} from '@arbitrum/sdk/dist/lib/abi/L2ArbitrumGateway'
export declare class L2ArbitrumGateway__factory {
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
  static createInterface(): L2ArbitrumGatewayInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): L2ArbitrumGateway
}
