import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  ISequencerInbox,
  ISequencerInboxInterface,
} from '@arbitrum/sdk/dist/lib/abi/ISequencerInbox'
export declare class ISequencerInbox__factory {
  static readonly abi: (
    | {
        anonymous: boolean
        inputs: (
          | {
              indexed: boolean
              internalType: string
              name: string
              type: string
              components?: undefined
            }
          | {
              components: {
                internalType: string
                name: string
                type: string
              }[]
              indexed: boolean
              internalType: string
              name: string
              type: string
            }
        )[]
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
    | {
        inputs: (
          | {
              internalType: string
              name: string
              type: string
              components?: undefined
            }
          | {
              components: {
                internalType: string
                name: string
                type: string
              }[]
              internalType: string
              name: string
              type: string
            }
        )[]
        name: string
        outputs: never[]
        stateMutability: string
        type: string
        anonymous?: undefined
      }
  )[]
  static createInterface(): ISequencerInboxInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ISequencerInbox
}
