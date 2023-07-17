import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type { ArbBLS, ArbBLSInterface } from '@arbitrum/sdk/dist/lib/abi/ArbBLS'
export declare class ArbBLS__factory {
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
  static createInterface(): ArbBLSInterface
  static connect(address: string, signerOrProvider: Signer | Provider): ArbBLS
}
