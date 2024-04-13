import { ethers, Wallet } from 'ethers'
import { JsonRpcProvider } from '@ethersproject/providers'

import fs from 'fs'
import { L3Config } from './l3ConfigType'
import { TOKEN_BRIDGE_CREATOR_Arb_Sepolia } from './createTokenBridge'
import L1AtomicTokenBridgeCreator from '@arbitrum/token-bridge-contracts/build/contracts/contracts/tokenbridge/ethereum/L1AtomicTokenBridgeCreator.sol/L1AtomicTokenBridgeCreator.json'
import { arbOwnerPublicActions } from '@arbitrum/orbit-sdk'
import { createPublicClient, defineChain, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sanitizePrivateKey } from '@arbitrum/orbit-sdk/utils'

function createPublicClientFromChainInfo({
  id,
  name,
  rpcUrl,
}: {
  id: number
  name: string
  rpcUrl: string
}) {
  const chain = defineChain({
    id: id,
    network: name,
    name: name,
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: {
        http: [rpcUrl],
      },
      public: {
        http: [rpcUrl],
      },
    },
    testnet: true,
  })
  return createPublicClient({ chain, transport: http() })
}

export const getSigner = (provider: JsonRpcProvider, key?: string) => {
  if (!key && !provider)
    throw new Error('Provide at least one of key or provider.')
  if (key) return new Wallet(key).connect(provider)
  else return provider.getSigner(0)
}

export async function transferOwner(
  privateKey: string,
  l2Provider: ethers.providers.JsonRpcProvider,
  l3Provider: ethers.providers.JsonRpcProvider,
  orbitChainRpc: string
) {
  //Generating deployer signer
  const deployer = privateKeyToAccount(sanitizePrivateKey(privateKey))

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
  const l3NetworkInfo = await l3Provider.getNetwork()
  // Creating Orbit chain client
  const orbitChainPublicClient = createPublicClientFromChainInfo({
    id: l3NetworkInfo.chainId,
    name: l3NetworkInfo.name,
    rpcUrl: orbitChainRpc,
  }).extend(arbOwnerPublicActions)
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

  console.log('Adding Upgrade Executor contract to the chain owners')
  const transactionRequest1 =
    await orbitChainPublicClient.arbOwnerPrepareTransactionRequest({
      functionName: 'addChainOwner',
      args: [executorContractAddress],
      upgradeExecutor: false,
      account: deployer.address,
    })
  // submit tx to add chain owner
  const txHash1 = await orbitChainPublicClient.sendRawTransaction({
    serializedTransaction: await deployer.signTransaction(transactionRequest1),
  })
  const txReceipt1 = await orbitChainPublicClient.waitForTransactionReceipt({
    hash: txHash1,
  })
  console.log(
    `UpgradeExecutor account has been added to chain owners in ${txReceipt1.transactionHash}`
  )

  // Removing deployer as chain owner
  const transactionRequest2 =
    await orbitChainPublicClient.arbOwnerPrepareTransactionRequest({
      functionName: 'removeChainOwner',
      args: [deployer.address],
      upgradeExecutor: executorContractAddress,
      account: deployer.address,
    })

  // submit tx to remove chain owner
  const txHash2 = await orbitChainPublicClient.sendRawTransaction({
    serializedTransaction: await deployer.signTransaction(transactionRequest2),
  })
  const txReceipt2 = await orbitChainPublicClient.waitForTransactionReceipt({
    hash: txHash2,
  })
  console.log(
    `Deployer account removed from chain owners in ${txReceipt2.transactionHash}`
  )

  // Checking chain onwers to see if deployer account is removed
  const isOwner2 = await orbitChainPublicClient.arbOwnerReadContract({
    functionName: 'isChainOwner',
    args: [deployer.address],
  })
  if (!isOwner2) {
    console.log(
      'UpgradeExecutor contract has been added to chain owners successfully'
    )
  }
}
