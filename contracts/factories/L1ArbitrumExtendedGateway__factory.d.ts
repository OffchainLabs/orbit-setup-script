import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  L1ArbitrumExtendedGateway,
  L1ArbitrumExtendedGatewayInterface,
} from '@arbitrum/sdk/dist/lib/abi/L1ArbitrumExtendedGateway'
export declare class L1ArbitrumExtendedGateway__factory {
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
  static createInterface(): L1ArbitrumExtendedGatewayInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): L1ArbitrumExtendedGateway
}
