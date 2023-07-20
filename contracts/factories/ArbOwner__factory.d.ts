import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  ArbOwner,
  ArbOwnerInterface,
} from '@arbitrum/sdk/dist/lib/abi/ArbOwner'
export declare class ArbOwner__factory {
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
  static createInterface(): ArbOwnerInterface
  static connect(address: string, signerOrProvider: Signer | Provider): ArbOwner
}
