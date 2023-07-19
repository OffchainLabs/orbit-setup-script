import { Signer, ContractFactory, Overrides } from 'ethers'
import { Provider, TransactionRequest } from '@ethersproject/providers'
import type {
  AddressMappingTest,
  AddressMappingTestInterface,
} from '@arbitrum/sdk/dist/lib/abi/AddressMappingTest'
declare type AddressMappingTestConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>
export declare class AddressMappingTest__factory extends ContractFactory {
  constructor(...args: AddressMappingTestConstructorParams)
  deploy(
    overrides?: Overrides & {
      from?: string | Promise<string>
    }
  ): Promise<AddressMappingTest>
  getDeployTransaction(
    overrides?: Overrides & {
      from?: string | Promise<string>
    }
  ): TransactionRequest
  attach(address: string): AddressMappingTest
  connect(signer: Signer): AddressMappingTest__factory
  static readonly contractName: 'AddressMappingTest'
  readonly contractName: 'AddressMappingTest'
  static readonly bytecode =
    '0x608060405234801561001057600080fd5b5060c08061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063dac3dea914602d575b600080fd5b605060048036036020811015604157600080fd5b50356001600160a01b0316606c565b604080516001600160a01b039092168252519081900360200190f35b6000607582607b565b92915050565b61111061111160901b0119019056fea264697066735822122033cd793f1c604ce7fdedd902345f6505eceec7e58a07cd353c64d0211e50775364736f6c634300060b0033'
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
  static createInterface(): AddressMappingTestInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): AddressMappingTest
}
export {}
