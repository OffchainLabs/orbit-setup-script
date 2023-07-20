import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  ITradeableExitReceiver,
  ITradeableExitReceiverInterface,
} from '@arbitrum/sdk/dist/lib/abi/ITradeableExitReceiver'
export declare class ITradeableExitReceiver__factory {
  static readonly abi: {
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
  }[]
  static createInterface(): ITradeableExitReceiverInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ITradeableExitReceiver
}
