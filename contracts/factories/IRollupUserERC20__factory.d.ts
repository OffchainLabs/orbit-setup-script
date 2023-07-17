import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  IRollupUserERC20,
  IRollupUserERC20Interface,
} from '@arbitrum/sdk/dist/lib/abi/IRollupUserERC20'
export declare class IRollupUserERC20__factory {
  static readonly abi: (
    | {
        anonymous: boolean
        inputs: (
          | {
              indexed: boolean
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
              indexed: boolean
              internalType: string
              name: string
              type: string
            }
        )[]
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
    | {
        inputs: {
          internalType: string
          name: string
          type: string
        }[]
        name: string
        outputs: {
          components: {
            internalType: string
            name: string
            type: string
          }[]
          internalType: string
          name: string
          type: string
        }[]
        stateMutability: string
        type: string
        anonymous?: undefined
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
  static createInterface(): IRollupUserERC20Interface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IRollupUserERC20
}
