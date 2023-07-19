import { Signer, ContractFactory, Overrides } from 'ethers'
import { Provider, TransactionRequest } from '@ethersproject/providers'
import type {
  InboxMock,
  InboxMockInterface,
} from '@arbitrum/sdk/dist/lib/abi/InboxMock'
declare type InboxMockConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>
export declare class InboxMock__factory extends ContractFactory {
  constructor(...args: InboxMockConstructorParams)
  deploy(
    overrides?: Overrides & {
      from?: string | Promise<string>
    }
  ): Promise<InboxMock>
  getDeployTransaction(
    overrides?: Overrides & {
      from?: string | Promise<string>
    }
  ): TransactionRequest
  attach(address: string): InboxMock
  connect(signer: Signer): InboxMock__factory
  static readonly contractName: 'InboxMock'
  readonly contractName: 'InboxMock'
  static readonly bytecode =
    '0x6080604052600080546001600160a01b031916905534801561002057600080fd5b50610239806100306000396000f3fe60806040526004361061004a5760003560e01c806311b383ac1461004f578063679b6ded1461008457806380648b0214610141578063ab5d894314610172578063e78cea9214610172575b600080fd5b34801561005b57600080fd5b506100826004803603602081101561007257600080fd5b50356001600160a01b0316610187565b005b61012f600480360361010081101561009b57600080fd5b6001600160a01b038235811692602081013592604082013592606083013581169260808101359091169160a08201359160c081013591810190610100810160e08201356401000000008111156100f057600080fd5b82018360208201111561010257600080fd5b8035906020019184600183028401116401000000008311171561012457600080fd5b5090925090506101a9565b60408051918252519081900360200190f35b34801561014d57600080fd5b506101566101f0565b604080516001600160a01b039092168252519081900360200190f35b34801561017e57600080fd5b506101566101ff565b600080546001600160a01b0319166001600160a01b0392909216919091179055565b6040805188815290516000917f7efacbad201ebbc50ec0ce4b474c54b735a31b1bac996acff50df7de0314e8f9919081900360200190a15060009998505050505050505050565b6000546001600160a01b031690565b309056fea2646970667358221220c816adad97075a86ffdd002a3ea1b28a67042219084e144b6b9112816bb7a8ca64736f6c634300060b0033'
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
  static createInterface(): InboxMockInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): InboxMock
}
export {}
