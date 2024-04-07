import { L3Config } from './l3ConfigType'
import fs from 'fs'
import { JsonRpcProvider } from '@ethersproject/providers'

import { createPublicClient, defineChain, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

import { arbOwnerPublicActions } from '@arbitrum/orbit-sdk'
import { arbGasInfoPublicActions } from '@arbitrum/orbit-sdk'

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

export async function l3Configuration(
  baseChainDeployerKey: string,
  childChainRpc: string
) {
  if (!baseChainDeployerKey || !childChainRpc) {
    throw new Error('Required environment variable not found')
  }

  const l2Provider = new JsonRpcProvider(childChainRpc)
  const l2NetworkInfo = await l2Provider.getNetwork()

  const deployer = privateKeyToAccount(sanitizePrivateKey(baseChainDeployerKey))

  const orbitChainPublicClient = createPublicClientFromChainInfo({
    id: l2NetworkInfo.chainId,
    name: l2NetworkInfo.name,
    rpcUrl: childChainRpc,
  })
    .extend(arbOwnerPublicActions)
    .extend(arbGasInfoPublicActions)

  // Read the JSON configuration
  const configRaw = fs.readFileSync(
    './config/orbitSetupScriptConfig.json',
    'utf-8'
  )
  const config: L3Config = JSON.parse(configRaw)

  // Reading params for L3 Configuration
  const minL2BaseFee = config.minL2BaseFee
  const networkFeeReceiver = config.networkFeeReceiver
  const infrastructureFeeCollector = config.infrastructureFeeCollector
  const chainOwner = config.chainOwner

  // Check if the Private Key provided is the chain owner:
  if (deployer.address !== chainOwner) {
    throw new Error('The Private Key you have provided is not the chain owner')
  }

  // Call the isChainOwner function and check the response
  const isOwnerInitially = await orbitChainPublicClient.arbOwnerReadContract({
    functionName: 'isChainOwner',
    args: [deployer.address],
  })

  // assert account is not already an owner
  if (!isOwnerInitially) {
    throw new Error('The address you have provided is not the chain owner')
  }

  // Set the network base fee
  console.log('Setting the Minimum Base Fee for the Orbit chain')

  const transactionRequest1 =
    await orbitChainPublicClient.arbOwnerPrepareTransactionRequest({
      functionName: 'setMinimumL2BaseFee',
      args: [BigInt(minL2BaseFee)],
      upgradeExecutor: false,
      account: deployer.address,
    })
  // submit tx to update infra fee receiver
  const txHash1 = await orbitChainPublicClient.sendRawTransaction({
    serializedTransaction: await deployer.signTransaction(transactionRequest1),
  })
  await orbitChainPublicClient.waitForTransactionReceipt({
    hash: txHash1,
  })
  const minL3BaseFee = await orbitChainPublicClient.arbGasInfoReadContract({
    functionName: 'getMinimumGasPrice',
  })
  if (Number(minL3BaseFee) === minL2BaseFee) {
    console.log('Minimum L3 base fee is set')
  } else {
    throw new Error('Failed to set Minimum L3 base fee')
  }

  const networkFeeAccount = await orbitChainPublicClient.arbOwnerReadContract({
    functionName: 'getNetworkFeeAccount',
  })

  if (networkFeeAccount === infrastructureFeeCollector) {
    console.log('network fee receiver is set')
  } else {
    throw new Error(
      'network fee receiver Setting network fee receiver transaction failed'
    )
  }

  // Set the network fee receiver
  const initialNetworkFeeReceiver =
    await orbitChainPublicClient.arbOwnerReadContract({
      functionName: 'getInfraFeeAccount',
    })

  // assert account is not already infra fee receiver
  if (initialNetworkFeeReceiver !== networkFeeReceiver) {
    throw new Error('The network fee receiver is set before')
  }

  const transactionRequest2 =
    await orbitChainPublicClient.arbOwnerPrepareTransactionRequest({
      functionName: 'setNetworkFeeAccount',
      args: [networkFeeReceiver],
      upgradeExecutor: false,
      account: deployer.address,
    })

  // submit tx to update infra fee receiver
  const txHash2 = await orbitChainPublicClient.sendRawTransaction({
    serializedTransaction: await deployer.signTransaction(transactionRequest2),
  })
  await orbitChainPublicClient.waitForTransactionReceipt({
    hash: txHash2,
  })
  const networkFeeRecieverAccount =
    await orbitChainPublicClient.arbOwnerReadContract({
      functionName: 'getNetworkFeeAccount',
    })

  if (networkFeeRecieverAccount === networkFeeReceiver) {
    console.log('network fee receiver is set')
  } else {
    throw new Error(
      'network fee receiver Setting network fee receiver transaction failed'
    )
  }

  // Set the infrastructure fee collector
  const initialInfraFeeReceiver =
    await orbitChainPublicClient.arbOwnerReadContract({
      functionName: 'getInfraFeeAccount',
    })

  // assert account is not already infra fee receiver
  if (initialInfraFeeReceiver !== infrastructureFeeCollector) {
    throw new Error(
      'Setting Set the infrastructure fee collector is set before'
    )
  }

  const transactionRequest3 =
    await orbitChainPublicClient.arbOwnerPrepareTransactionRequest({
      functionName: 'setInfraFeeAccount',
      args: [infrastructureFeeCollector],
      upgradeExecutor: false,
      account: deployer.address,
    })

  // submit tx to update infra fee receiver
  const txHash3 = await orbitChainPublicClient.sendRawTransaction({
    serializedTransaction: await deployer.signTransaction(transactionRequest3),
  })
  await orbitChainPublicClient.waitForTransactionReceipt({
    hash: txHash3,
  })
  const infraFeeReceiver = await orbitChainPublicClient.arbOwnerReadContract({
    functionName: 'getInfraFeeAccount',
  })

  // Check the status of the transaction: 1 is successful, 0 is failure
  if (infraFeeReceiver === infrastructureFeeCollector) {
    console.log('Infra Fee Collector changed successfully')
  } else {
    throw new Error('Infra Fee Collector Setting transaction failed')
  }

  // Setting L1 basefee on L3
  console.log('Getting L1 base fee estimate')
  const l1BaseFeeEstimate = await orbitChainPublicClient.arbGasInfoReadContract(
    {
      functionName: 'getL1BaseFeeEstimate',
    }
  )
  console.log(`L1 Base Fee estimate on L2 is ${Number(l1BaseFeeEstimate)}`)
  const l2Basefee = await l2Provider.getGasPrice()
  const totalGasPrice = l2Basefee.add(l1BaseFeeEstimate)
  console.log(`Setting L1 base fee estimate on L3 to ${totalGasPrice}`)

  const transactionRequest4 =
    await orbitChainPublicClient.arbOwnerPrepareTransactionRequest({
      functionName: 'setL1PricePerUnit',
      args: [BigInt(totalGasPrice.toString())],
      upgradeExecutor: false,
      account: deployer.address,
    })

  // setting setL1PricePerUnit
  const txHash4 = await orbitChainPublicClient.sendRawTransaction({
    serializedTransaction: await deployer.signTransaction(transactionRequest4),
  })
  await orbitChainPublicClient.waitForTransactionReceipt({
    hash: txHash4,
  })
  console.log('All things done! Enjoy your Orbit chain. LFG 🚀🚀🚀🚀')
}
