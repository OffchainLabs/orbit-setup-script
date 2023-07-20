import { Signer, ContractFactory, Overrides } from 'ethers'
import { Provider, TransactionRequest } from '@ethersproject/providers'
import type {
  MessageTester,
  MessageTesterInterface,
} from '@arbitrum/sdk/dist/lib/abi/MessageTester'
declare type MessageTesterConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>
export declare class MessageTester__factory extends ContractFactory {
  constructor(...args: MessageTesterConstructorParams)
  deploy(
    overrides?: Overrides & {
      from?: string | Promise<string>
    }
  ): Promise<MessageTester>
  getDeployTransaction(
    overrides?: Overrides & {
      from?: string | Promise<string>
    }
  ): TransactionRequest
  attach(address: string): MessageTester
  connect(signer: Signer): MessageTester__factory
  static readonly contractName: 'MessageTester'
  readonly contractName: 'MessageTester'
  static readonly bytecode =
    '0x608060405234801561001057600080fd5b50610217806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80638f3c79c01461003b578063bf00905214610087575b600080fd5b61007561004936600461011d565b604080516020808201949094528082019290925280518083038201815260609092019052805191012090565b60405190815260200160405180910390f35b61007561009536600461015c565b6040805160f89890981b6001600160f81b0319166020808a019190915260609790971b6bffffffffffffffffffffffff1916602189015260c095861b6001600160c01b031990811660358a01529490951b909316603d870152604586019190915260658501526085808501919091528151808503909101815260a59093019052815191012090565b6000806040838503121561013057600080fd5b50508035926020909101359150565b803567ffffffffffffffff8116811461015757600080fd5b919050565b600080600080600080600060e0888a03121561017757600080fd5b873560ff8116811461018857600080fd5b965060208801356001600160a01b03811681146101a457600080fd5b95506101b26040890161013f565b94506101c06060890161013f565b9699959850939660808101359560a0820135955060c090910135935091505056fea26469706673582212201f326e85216f160979765212a34c175424b39bc70537172dd8c568ab6f2dc32064736f6c63430008090033'
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
  static createInterface(): MessageTesterInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MessageTester
}
export {}
