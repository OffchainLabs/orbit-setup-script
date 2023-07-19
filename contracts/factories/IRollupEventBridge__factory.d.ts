import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  IRollupEventBridge,
  IRollupEventBridgeInterface,
} from '@arbitrum/sdk/dist/lib/abi/IRollupEventBridge'
export declare class IRollupEventBridge__factory {
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
  static createInterface(): IRollupEventBridgeInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IRollupEventBridge
}
