import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  IOneStepProver,
  IOneStepProverInterface,
} from '@arbitrum/sdk/dist/lib/abi/IOneStepProver'
export declare class IOneStepProver__factory {
  static readonly abi: {
    inputs: (
      | {
          components: (
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
    outputs: {
      components: (
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
      internalType: string
      name: string
      type: string
    }[]
    stateMutability: string
    type: string
  }[]
  static createInterface(): IOneStepProverInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IOneStepProver
}
