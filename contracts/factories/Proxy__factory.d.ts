import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type { Proxy, ProxyInterface } from '@arbitrum/sdk/dist/lib/abi/Proxy'
export declare class Proxy__factory {
  static readonly abi: {
    stateMutability: string
    type: string
  }[]
  static createInterface(): ProxyInterface
  static connect(address: string, signerOrProvider: Signer | Provider): Proxy
}
