import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  IRollupUser,
  IRollupUserInterface,
} from '@arbitrum/sdk/dist/lib/abi/IRollupUser'
export declare class IRollupUser__factory {
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
          | {
              internalType: string
              name: string
              type: string
              components?: undefined
            }
        )[]
        name: string
        outputs: never[]
        stateMutability: string
        type: string
        anonymous?: undefined
      }
  )[]
  static createInterface(): IRollupUserInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IRollupUser
}
