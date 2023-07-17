import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  ProxySetter,
  ProxySetterInterface,
} from '@arbitrum/sdk/dist/lib/abi/ProxySetter'
export declare class ProxySetter__factory {
  static readonly abi: {
    inputs: never[]
    name: string
    outputs: {
      internalType: string
      name: string
      type: string
    }[]
    stateMutability: string
    type: string
  }[]
  static createInterface(): ProxySetterInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ProxySetter
}
