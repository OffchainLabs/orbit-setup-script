import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  IArbToken,
  IArbTokenInterface,
} from '@arbitrum/sdk/dist/lib/abi/IArbToken'
export declare class IArbToken__factory {
  static readonly abi: (
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
  )[]
  static createInterface(): IArbTokenInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IArbToken
}
