import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  L1ArbitrumGateway,
  L1ArbitrumGatewayInterface,
} from '@arbitrum/sdk/dist/lib/abi/L1ArbitrumGateway'
export declare class L1ArbitrumGateway__factory {
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
  static createInterface(): L1ArbitrumGatewayInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): L1ArbitrumGateway
}
