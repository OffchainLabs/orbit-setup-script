import { ethers, Wallet } from 'ethers'
import { JsonRpcProvider } from '@ethersproject/providers'
import UpgradeExecutor from '@arbitrum/nitro-contracts/build/contracts/src/mocks/UpgradeExecutorMock.sol/UpgradeExecutorMock.json'

import ArbOwner from '@arbitrum/nitro-contracts/build/contracts/src/precompiles/ArbOwner.sol/ArbOwner.json'
import fs from 'fs'
import { L3Config } from './l3ConfigType'
import { TOKEN_BRIDGE_CREATOR_Arb_Sepolia } from './createTokenBridge'
import L1AtomicTokenBridgeCreator from '@arbitrum/token-bridge-contracts/build/contracts/contracts/tokenbridge/ethereum/L1AtomicTokenBridgeCreator.sol/L1AtomicTokenBridgeCreator.json'

export const getSigner = (provider: JsonRpcProvider, key?: string) => {
  if (!key && !provider)
    throw new Error('Provide at least one of key or provider.')
  if (key) return new Wallet(key).connect(provider)
  else return provider.getSigner(0)
}

const ARB_OWNER_ADDRESS = '0x0000000000000000000000000000000000000070'
export async function transferOwner(
  privateKey: string,
  l2Provider: ethers.providers.JsonRpcProvider,
  l3Provider: ethers.providers.JsonRpcProvider
) {
  //Generating l2 and l3 deployer signers from privatekey and providers
  const l3Deployer = getSigner(l3Provider, privateKey)
  //fetching chain id of parent chain
  const l2ChainId = (await l2Provider.getNetwork()).chainId

  let TOKEN_BRIDGE_CREATOR
  if (l2ChainId === 421614) {
    TOKEN_BRIDGE_CREATOR = TOKEN_BRIDGE_CREATOR_Arb_Sepolia
  } else {
    throw new Error(
      'The Base Chain you have provided is not supported, please put RPC for Arb Sepolia'
    )
  }

  // Read the JSON configuration
  const configRaw = fs.readFileSync(
    './config/orbitSetupScriptConfig.json',
    'utf-8'
  )
  const config: L3Config = JSON.parse(configRaw)

  const L1AtomicTokenBridgeCreator__factory = new ethers.Contract(
    TOKEN_BRIDGE_CREATOR,
    L1AtomicTokenBridgeCreator.abi,
    l2Provider
  )
  const l1TokenBridgeCreator =
    L1AtomicTokenBridgeCreator__factory.connect(l2Provider)

  //fetching L3 upgrade executor address
  const executorContractAddress = (
    await l1TokenBridgeCreator.inboxToL2Deployment(config.inbox)
  ).upgradeExecutor

  //Defining Arb Owner Precompile
  const ArbOwner__factory = new ethers.Contract(
    ARB_OWNER_ADDRESS,
    ArbOwner.abi,
    l3Deployer
  )
  const ArbOwnerContract = ArbOwner__factory.connect(l3Deployer)
  console.log('Adding Upgrade Executor contract to the chain owners')
  const receipt1 = await (
    await ArbOwnerContract.addChainOwner(executorContractAddress)
  ).wait()
  console.log(
    'Executor has been added to chain owners on TX:',
    receipt1.transactionHash
  )
  //Defining upgrade executor contract
  const executorContract__factory = new ethers.Contract(
    executorContractAddress,
    UpgradeExecutor.abi,
    l3Deployer
  )
  const upgradeExecutor = executorContract__factory.connect(l3Deployer)
  //Constructing call data for removing rollup owner from chain owners on L3
  const arbOwnerInterface = new ethers.utils.Interface(ArbOwner.abi)
  const targetCallData = arbOwnerInterface.encodeFunctionData(
    'removeChainOwner',
    [await l3Deployer.getAddress()]
  )

  console.log('Executing removeChainOwner through the UpgradeExecutor contract')
  const receipt2 = await (
    await upgradeExecutor.executeCall(ARB_OWNER_ADDRESS, targetCallData)
  ).wait()
  console.log(
    'Transaction complete, rollup owner removed from chain owners on TX:',
    receipt2.transactionHash
  )
}
