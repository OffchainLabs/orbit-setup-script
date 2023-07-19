import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  IERC20PermitUpgradeable,
  IERC20PermitUpgradeableInterface,
} from '@arbitrum/sdk/dist/lib/abi/IERC20PermitUpgradeable'
export declare class IERC20PermitUpgradeable__factory {
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
  static createInterface(): IERC20PermitUpgradeableInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IERC20PermitUpgradeable
}
