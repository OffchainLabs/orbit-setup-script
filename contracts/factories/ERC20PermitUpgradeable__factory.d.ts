import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  ERC20PermitUpgradeable,
  ERC20PermitUpgradeableInterface,
} from '@arbitrum/sdk/dist/lib/abi/ERC20PermitUpgradeable'
export declare class ERC20PermitUpgradeable__factory {
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
  static createInterface(): ERC20PermitUpgradeableInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC20PermitUpgradeable
}
