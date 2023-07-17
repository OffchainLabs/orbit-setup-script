import { Signer, ContractFactory, Overrides } from 'ethers'
import { Provider, TransactionRequest } from '@ethersproject/providers'
import type {
  SimpleProxy,
  SimpleProxyInterface,
} from '@arbitrum/sdk/dist/lib/abi/SimpleProxy'
declare type SimpleProxyConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>
export declare class SimpleProxy__factory extends ContractFactory {
  constructor(...args: SimpleProxyConstructorParams)
  deploy(
    impl_: string,
    overrides?: Overrides & {
      from?: string | Promise<string>
    }
  ): Promise<SimpleProxy>
  getDeployTransaction(
    impl_: string,
    overrides?: Overrides & {
      from?: string | Promise<string>
    }
  ): TransactionRequest
  attach(address: string): SimpleProxy
  connect(signer: Signer): SimpleProxy__factory
  static readonly contractName: 'SimpleProxy'
  readonly contractName: 'SimpleProxy'
  static readonly bytecode =
    '0x60a060405234801561001057600080fd5b5060405161011d38038061011d83398101604081905261002f91610040565b6001600160a01b0316608052610070565b60006020828403121561005257600080fd5b81516001600160a01b038116811461006957600080fd5b9392505050565b608051609561008860003960006017015260956000f3fe608060405236601057600e6013565b005b600e5b603a7f0000000000000000000000000000000000000000000000000000000000000000603c565b565b3660008037600080366000845af43d6000803e808015605a573d6000f35b3d6000fdfea2646970667358221220e43be84fa15ca710e6571e110b5a4d8880a4fb1530e229a8d070890cb041ff6b64736f6c63430008090033'
  static readonly abi: (
    | {
        inputs: {
          internalType: string
          name: string
          type: string
        }[]
        stateMutability: string
        type: string
      }
    | {
        stateMutability: string
        type: string
        inputs?: undefined
      }
  )[]
  static createInterface(): SimpleProxyInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SimpleProxy
}
export {}
