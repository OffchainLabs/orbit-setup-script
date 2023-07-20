import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  RetryableTicketCreator,
  RetryableTicketCreatorInterface,
} from '@arbitrum/sdk/dist/lib/abi/RetryableTicketCreator'
export declare class RetryableTicketCreator__factory {
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
  static createInterface(): RetryableTicketCreatorInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): RetryableTicketCreator
}
