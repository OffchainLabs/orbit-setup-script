import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  ICustomGateway,
  ICustomGatewayInterface,
} from '@arbitrum/sdk/dist/lib/abi/ICustomGateway'
export declare class ICustomGateway__factory {
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
  static createInterface(): ICustomGatewayInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ICustomGateway
}
