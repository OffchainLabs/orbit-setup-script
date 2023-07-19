import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  PausableUpgradeable,
  PausableUpgradeableInterface,
} from '@arbitrum/sdk/dist/lib/abi/PausableUpgradeable'
export declare class PausableUpgradeable__factory {
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
        inputs: never[]
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
  static createInterface(): PausableUpgradeableInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PausableUpgradeable
}
