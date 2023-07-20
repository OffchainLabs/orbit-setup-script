import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  IRollupAdmin,
  IRollupAdminInterface,
} from '@arbitrum/sdk/dist/lib/abi/IRollupAdmin'
export declare class IRollupAdmin__factory {
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
        inputs: (
          | {
              internalType: string
              name: string
              type: string
              components?: undefined
            }
          | {
              components: (
                | {
                    components: (
                      | {
                          components: {
                            internalType: string
                            name: string
                            type: string
                          }[]
                          internalType: string
                          name: string
                          type: string
                        }
                      | {
                          internalType: string
                          name: string
                          type: string
                          components?: undefined
                        }
                    )[]
                    internalType: string
                    name: string
                    type: string
                  }
                | {
                    internalType: string
                    name: string
                    type: string
                    components?: undefined
                  }
              )[]
              internalType: string
              name: string
              type: string
            }
        )[]
        name: string
        outputs: never[]
        stateMutability: string
        type: string
        anonymous?: undefined
      }
  )[]
  static createInterface(): IRollupAdminInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IRollupAdmin
}
