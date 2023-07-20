import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  L2ArbitrumTestMessenger,
  L2ArbitrumTestMessengerInterface,
} from '@arbitrum/sdk/dist/lib/abi/L2ArbitrumTestMessenger'
export declare class L2ArbitrumTestMessenger__factory {
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
        inputs: never[]
        name: string
        outputs: never[]
        stateMutability: string
        type: string
        anonymous?: undefined
      }
  )[]
  static createInterface(): L2ArbitrumTestMessengerInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): L2ArbitrumTestMessenger
}
