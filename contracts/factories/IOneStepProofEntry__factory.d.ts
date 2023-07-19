import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  IOneStepProofEntry,
  IOneStepProofEntryInterface,
} from '@arbitrum/sdk/dist/lib/abi/IOneStepProofEntry'
export declare class IOneStepProofEntry__factory {
  static readonly abi: {
    inputs: (
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
      | {
          internalType: string
          name: string
          type: string
          components?: undefined
        }
    )[]
    name: string
    outputs: {
      internalType: string
      name: string
      type: string
    }[]
    stateMutability: string
    type: string
  }[]
  static createInterface(): IOneStepProofEntryInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IOneStepProofEntry
}
