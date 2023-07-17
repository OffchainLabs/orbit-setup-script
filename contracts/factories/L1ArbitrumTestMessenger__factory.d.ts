import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  L1ArbitrumTestMessenger,
  L1ArbitrumTestMessengerInterface,
} from '@arbitrum/sdk/dist/lib/abi/L1ArbitrumTestMessenger'
export declare class L1ArbitrumTestMessenger__factory {
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
        outputs: never[]
        stateMutability: string
        type: string
        anonymous?: undefined
      }
  )[]
  static createInterface(): L1ArbitrumTestMessengerInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): L1ArbitrumTestMessenger
}
