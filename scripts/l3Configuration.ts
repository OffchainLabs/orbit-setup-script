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
  parentChainDeployerKey: string,
  orbitChainRpc: string
) {
  if (!parentChainDeployerKey || !orbitChainRpc) {
    throw new Error('Required environment variable not found')
  }

  // Generation parent chain provider and network
  const l2Provider = new JsonRpcProvider(orbitChainRpc)
  const l2NetworkInfo = await l2Provider.getNetwork()

  //Generating deployer signer
  const deployer = privateKeyToAccount(
    sanitizePrivateKey(parentChainDeployerKey)
  )

  // Creating Orbit chain client with arb owner and arb gas info extension
  const orbitChainPublicClient = createPublicClientFromChainInfo({
    id: l2NetworkInfo.chainId,
    name: l2NetworkInfo.name,
    rpcUrl: orbitChainRpc,
  })
    .extend(arbOwnerPublicActions)
    .extend(arbGasInfoPublicActions)

  // Read the JSON configuration
  const configRaw = fs.readFileSync(
    './config/orbitSetupScriptConfig.json',
    'utf-8'
  )
  const config: L3Config = JSON.parse(configRaw)

  // Reading params for Configuration
  const minOrbitChainBaseFee = config.minL2BaseFee
  const networkFeeReceiver = config.networkFeeReceiver as `0x${string}`
  const infrastructureFeeCollector =
    config.infrastructureFeeCollector as `0x${string}`
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

  // Set the orbit chain base fee
  console.log('Setting the Minimum Base Fee for the Orbit chain')

  const setMinimumBaseFeeTransactionRequest =
    await orbitChainPublicClient.arbOwnerPrepareTransactionRequest({
      functionName: 'setMinimumL2BaseFee',
      args: [BigInt(minOrbitChainBaseFee)],
      upgradeExecutor: false,
      account: deployer.address,
    })
  // submit tx to update minimum child chain base fee
  const setMinimumBaseFeeTransactionHash =
    await orbitChainPublicClient.sendRawTransaction({
      serializedTransaction: await deployer.signTransaction(
        setMinimumBaseFeeTransactionRequest
      ),
    })
  await orbitChainPublicClient.waitForTransactionReceipt({
    hash: setMinimumBaseFeeTransactionHash,
  })
  // Get the updated minimum basefee on orbit chain from arbGasInfo precompile on child chain
  const minOrbitChainBaseFeeRead =
    await orbitChainPublicClient.arbGasInfoReadContract({
      functionName: 'getMinimumGasPrice',
    })
  // Check if minimum basefee param is set correctly on orbit chain
  if (Number(minOrbitChainBaseFeeRead) === minOrbitChainBaseFee) {
    console.log('Minimum L3 base fee is set')
  } else {
    throw new Error('Failed to set Minimum L3 base fee')
  }

  // Set the network fee account
  const setNetworkFeeAccountTransactionRequest =
    await orbitChainPublicClient.arbOwnerPrepareTransactionRequest({
      functionName: 'setNetworkFeeAccount',
      args: [networkFeeReceiver],
      upgradeExecutor: false,
      account: deployer.address,
    })

  // submit tx to update infra fee receiver
  const setNetworkFeeAccountTransactionHash =
    await orbitChainPublicClient.sendRawTransaction({
      serializedTransaction: await deployer.signTransaction(
        setNetworkFeeAccountTransactionRequest
      ),
    })
  await orbitChainPublicClient.waitForTransactionReceipt({
    hash: setNetworkFeeAccountTransactionHash,
  })

  // check if network fee account is updated correctly
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

  // Set the infra fee account
  const setInfraFeeAccountTransactionRequest =
    await orbitChainPublicClient.arbOwnerPrepareTransactionRequest({
      functionName: 'setInfraFeeAccount',
      args: [infrastructureFeeCollector],
      upgradeExecutor: false,
      account: deployer.address,
    })

  // submit tx to update infra fee receiver
  const setInfraFeeAccountTransactionHash =
    await orbitChainPublicClient.sendRawTransaction({
      serializedTransaction: await deployer.signTransaction(
        setInfraFeeAccountTransactionRequest
      ),
    })
  await orbitChainPublicClient.waitForTransactionReceipt({
    hash: setInfraFeeAccountTransactionHash,
  })
  const infraFeeReceiver = await orbitChainPublicClient.arbOwnerReadContract({
    functionName: 'getInfraFeeAccount',
  })

  // check if infra fee account is updated correctly
  if (infraFeeReceiver === infrastructureFeeCollector) {
    console.log('Infra Fee Collector changed successfully')
  } else {
    throw new Error('Infra Fee Collector Setting transaction failed')
  }

  // Setting L1 basefee estimate on L3
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

  const setL1PricePerUnitTransactionRequest =
    await orbitChainPublicClient.arbOwnerPrepareTransactionRequest({
      functionName: 'setL1PricePerUnit',
      args: [BigInt(totalGasPrice.toString())],
      upgradeExecutor: false,
      account: deployer.address,
    })

  // setting setL1PricePerUnit
  const setL1PricePerUnitTransactionHash =
    await orbitChainPublicClient.sendRawTransaction({
      serializedTransaction: await deployer.signTransaction(
        setL1PricePerUnitTransactionRequest
      ),
    })
  await orbitChainPublicClient.waitForTransactionReceipt({
    hash: setL1PricePerUnitTransactionHash,
  })
}
