import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  ArbRetryableTx,
  ArbRetryableTxInterface,
} from '@arbitrum/sdk/dist/lib/abi/ArbRetryableTx'
export declare class ArbRetryableTx__factory {
  static readonly abi: (
    | {
        inputs: never[]
        name: string
        type: string
        anonymous?: undefined
        outputs?: undefined
        stateMutability?: undefined
      }
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
  static createInterface(): ArbRetryableTxInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ArbRetryableTx
}
