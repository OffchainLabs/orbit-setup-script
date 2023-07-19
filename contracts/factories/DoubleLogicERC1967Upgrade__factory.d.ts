import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  DoubleLogicERC1967Upgrade,
  DoubleLogicERC1967UpgradeInterface,
} from '@arbitrum/sdk/dist/lib/abi/DoubleLogicERC1967Upgrade'
export declare class DoubleLogicERC1967Upgrade__factory {
  static readonly abi: {
    anonymous: boolean
    inputs: {
      indexed: boolean
      internalType: string
      name: string
      type: string
    }[]
    name: string
    type: string
  }[]
  static createInterface(): DoubleLogicERC1967UpgradeInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DoubleLogicERC1967Upgrade
}
