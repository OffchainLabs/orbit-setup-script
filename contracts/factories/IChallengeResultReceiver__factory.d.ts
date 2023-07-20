import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  IChallengeResultReceiver,
  IChallengeResultReceiverInterface,
} from '@arbitrum/sdk/dist/lib/abi/IChallengeResultReceiver'
export declare class IChallengeResultReceiver__factory {
  static readonly abi: {
    inputs: {
      internalType: string
      name: string
      type: string
    }[]
    name: string
    outputs: never[]
    stateMutability: string
    type: string
  }[]
  static createInterface(): IChallengeResultReceiverInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IChallengeResultReceiver
}
