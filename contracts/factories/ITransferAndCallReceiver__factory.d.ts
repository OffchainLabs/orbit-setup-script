import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  ITransferAndCallReceiver,
  ITransferAndCallReceiverInterface,
} from '@arbitrum/sdk/dist/lib/abi/ITransferAndCallReceiver'
export declare class ITransferAndCallReceiver__factory {
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
  static createInterface(): ITransferAndCallReceiverInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ITransferAndCallReceiver
}
