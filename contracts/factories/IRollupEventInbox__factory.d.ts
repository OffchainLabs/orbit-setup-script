import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  IRollupEventInbox,
  IRollupEventInboxInterface,
} from '@arbitrum/sdk/dist/lib/abi/IRollupEventInbox'
export declare class IRollupEventInbox__factory {
  static readonly abi: (
    | {
        inputs: never[]
        name: string
        outputs: {
          internalType: string
          name: string
          type: string
        }[]
        stateMutability: string
        type: string
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
      }
  )[]
  static createInterface(): IRollupEventInboxInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IRollupEventInbox
}
