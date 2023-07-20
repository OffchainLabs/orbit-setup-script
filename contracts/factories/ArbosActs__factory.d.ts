import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  ArbosActs,
  ArbosActsInterface,
} from '@arbitrum/sdk/dist/lib/abi/ArbosActs'
export declare class ArbosActs__factory {
  static readonly abi: (
    | {
        inputs: never[]
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
        outputs: never[]
        stateMutability: string
        type: string
      }
  )[]
  static createInterface(): ArbosActsInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ArbosActs
}
