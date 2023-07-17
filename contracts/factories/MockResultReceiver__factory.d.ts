import { Signer, ContractFactory, Overrides } from 'ethers'
import { Provider, TransactionRequest } from '@ethersproject/providers'
import type {
  MockResultReceiver,
  MockResultReceiverInterface,
} from '@arbitrum/sdk/dist/lib/abi/MockResultReceiver'
declare type MockResultReceiverConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>
export declare class MockResultReceiver__factory extends ContractFactory {
  constructor(...args: MockResultReceiverConstructorParams)
  deploy(
    manager_: string,
    overrides?: Overrides & {
      from?: string | Promise<string>
    }
  ): Promise<MockResultReceiver>
  getDeployTransaction(
    manager_: string,
    overrides?: Overrides & {
      from?: string | Promise<string>
    }
  ): TransactionRequest
  attach(address: string): MockResultReceiver
  connect(signer: Signer): MockResultReceiver__factory
  static readonly contractName: 'MockResultReceiver'
  readonly contractName: 'MockResultReceiver'
  static readonly bytecode =
    '0x608060405234801561001057600080fd5b5060405161050f38038061050f83398101604081905261002f91610054565b600080546001600160a01b0319166001600160a01b0392909216919091179055610084565b60006020828403121561006657600080fd5b81516001600160a01b038116811461007d57600080fd5b9392505050565b61047c806100936000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c80630357aa491461006757806314eab5e71461007c578063481c6a75146100ad578063d6853748146100d8578063dfbf53ae146100ef578063e82898b314610102575b600080fd5b61007a610075366004610235565b610115565b005b61008f61008a36600461028a565b61017b565b60405167ffffffffffffffff90911681526020015b60405180910390f35b6000546100c0906001600160a01b031681565b6040516001600160a01b0390911681526020016100a4565b6100e160035481565b6040519081526020016100a4565b6001546100c0906001600160a01b031681565b6002546100c0906001600160a01b031681565b600180546001600160a01b03199081166001600160a01b0385811691821790935560028054909216928416928317909155600385905560405185907f88cb1f3fe351f3ac338db9c36bff1ece1750423c7ae6dfc427cd194b1c69b12790600090a4505050565b600080546040516314eab5e760e01b81526001600160a01b03909116906314eab5e7906101ba908c908c908c908c908c908c908c908c90600401610395565b602060405180830381600087803b1580156101d457600080fd5b505af11580156101e8573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061020c9190610422565b9998505050505050505050565b80356001600160a01b038116811461023057600080fd5b919050565b60008060006060848603121561024a57600080fd5b8335925061025a60208501610219565b915061026860408501610219565b90509250925092565b67ffffffffffffffff8116811461028757600080fd5b50565b600080600080600080600080610200898b0312156102a757600080fd5b88359750606089018a8111156102bc57600080fd5b60208a0197506101608a018b8111156102d457600080fd5b909650356102e181610271565b94506102f06101808a01610219565b93506102ff6101a08a01610219565b92506101c089013591506101e089013590509295985092959890939650565b806000805b6002808210610332575061038e565b6040808588378681018481529085019084905b8382101561037757823561035881610271565b67ffffffffffffffff1681526020928301926001929092019101610345565b505050608095860195939093019250600101610323565b5050505050565b888152610200810160208083018a6000805b60028110156103d0578235600481106103be578283fd5b845292840192918401916001016103a7565b50505050506103e2606083018961031e565b67ffffffffffffffff969096166101608201526001600160a01b03948516610180820152929093166101a08301526101c08201526101e001529392505050565b60006020828403121561043457600080fd5b815161043f81610271565b939250505056fea2646970667358221220d0e92c4a952b8dde557d4c76e933f2e4804b4fd5620a3ca1a51b46cb33abeb7a64736f6c63430008090033'
  static readonly abi: (
    | {
        inputs: {
          internalType: string
          name: string
          type: string
        }[]
        stateMutability: string
        type: string
        anonymous?: undefined
        name?: undefined
        outputs?: undefined
      }
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
        stateMutability?: undefined
        outputs?: undefined
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
              components: {
                internalType: string
                name: string
                type: string
              }[]
              internalType: string
              name: string
              type: string
            }
        )[]
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
  static createInterface(): MockResultReceiverInterface
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockResultReceiver
}
export {}
