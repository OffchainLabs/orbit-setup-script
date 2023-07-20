import { Signer, ContractFactory, Overrides } from 'ethers'
import { Provider, TransactionRequest } from '@ethersproject/providers'
import type {
  Cloneable,
  CloneableInterface,
} from '@arbitrum/sdk/dist/lib/abi/Cloneable'
declare type CloneableConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>
export declare class Cloneable__factory extends ContractFactory {
  constructor(...args: CloneableConstructorParams)
  deploy(
    overrides?: Overrides & {
      from?: string | Promise<string>
    }
  ): Promise<Cloneable>
  getDeployTransaction(
    overrides?: Overrides & {
      from?: string | Promise<string>
    }
  ): TransactionRequest
  attach(address: string): Cloneable
  connect(signer: Signer): Cloneable__factory
  static readonly contractName: 'Cloneable'
  readonly contractName: 'Cloneable'
  static readonly bytecode =
    '0x6080604052348015600f57600080fd5b506000805460ff1916600117905560868061002b6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80636f791d2914602d575b600080fd5b60336047565b604080519115158252519081900360200190f35b60005460ff169056fea26469706673582212209c4423140c1c6cef987783aaf0cc62c2e9e3adbb4ceaa2f73a18a5ed247b9bd164736f6c634300060b0033'
  static readonly abi: (
    | {
        inputs: never[]
        stateMutability: string
        type: string
        name?: undefined
        outputs?: undefined
      }
    | {
        inputs: never[]
        name: string
        outputs: {
          internalType: string
          name: string
          type: string
        }[]
        stateMutability: string
        type: string
      }
  )[]
  static createInterface(): CloneableInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Cloneable
}
export {}
