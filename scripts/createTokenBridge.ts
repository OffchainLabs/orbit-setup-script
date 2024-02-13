import { JsonRpcProvider } from '@ethersproject/providers'
import { L1Network, L2Network, addCustomNetwork } from '@arbitrum/sdk'
import { RollupAdminLogic__factory } from '@arbitrum/sdk/dist/lib/abi/factories/RollupAdminLogic__factory'
import * as fs from 'fs'
import { constants } from 'ethers'
import { defineChain, createPublicClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import {
  createTokenBridgePrepareTransactionRequest,
  createTokenBridgePrepareTransactionReceipt,
} from '@arbitrum/orbit-sdk'

import { L3Config } from './l3ConfigType'

function sanitizePrivateKey(privateKey: string): `0x${string}` {
  if (!privateKey.startsWith('0x')) {
    return `0x${privateKey}`
  }

  return privateKey as `0x${string}`
}

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

export const TOKEN_BRIDGE_CREATOR_Arb_Sepolia =
  '0x56C486D3786fA26cc61473C499A36Eb9CC1FbD8E'

/**
 * Steps:
 * - read network info from local container and register networks
 * - deploy L1 bridge creator and set templates
 * - do single TX deployment of token bridge
 * - populate network objects with new addresses and return it
 *
 * @param l1Deployer
 * @param l2Deployer
 * @param l1Url
 * @param l2Url
 * @returns
 */
export const createNewTokenBridge = async (
  baseChainRpc: string,
  baseChainDeployerKey: string,
  childChainRpc: string,
  rollupAddress: string
) => {
  const deployer = privateKeyToAccount(sanitizePrivateKey(baseChainDeployerKey))

  const l1Provider = new JsonRpcProvider(baseChainRpc)
  const l1EthersNetwork = await l1Provider.getNetwork()
  const l2Provider = new JsonRpcProvider(childChainRpc)
  const l2EthersNetwork = await l2Provider.getNetwork()

  const parentChainPublicClient = createPublicClientFromChainInfo({
    id: l1EthersNetwork.chainId,
    name: l1EthersNetwork.name,
    rpcUrl: baseChainRpc,
  })

  const orbitChainPublicClient = createPublicClientFromChainInfo({
    id: l2EthersNetwork.chainId,
    name: l2EthersNetwork.name,
    rpcUrl: childChainRpc,
  })

  const txRequest = await createTokenBridgePrepareTransactionRequest({
    params: {
      rollup: rollupAddress as `0x${string}`,
      rollupOwner: deployer.address,
    },
    parentChainPublicClient,
    orbitChainPublicClient,
    account: deployer.address,
  })

  // submit tx
  const txHash = await parentChainPublicClient.sendRawTransaction({
    serializedTransaction: await deployer.signTransaction(txRequest),
  })

  // get the transaction receipt after waiting for the transaction to complete
  const txReceipt = createTokenBridgePrepareTransactionReceipt(
    await parentChainPublicClient.waitForTransactionReceipt({ hash: txHash })
  )
  console.log(`Deployed in transaction: ${txReceipt.transactionHash}`)

  console.log(`Waiting for retryables...`)
  // wait for retryables to execute
  const retryables = await txReceipt.waitForRetryables({
    orbitPublicClient: orbitChainPublicClient,
  })
  console.log(`Retryable #1: ${retryables[0].transactionHash}`)
  console.log(`Retryable #2: ${retryables[1].transactionHash}`)

  const { parentChainContracts, orbitChainContracts } =
    await txReceipt.getTokenBridgeContracts({
      parentChainPublicClient,
    })

  const { l1Network, l2Network: corel2Network } = await registerNewNetwork(
    l1Provider,
    l2Provider,
    rollupAddress
  )

  const l2Network = {
    ...corel2Network,
    tokenBridge: {
      l1CustomGateway: parentChainContracts.customGateway,
      l1ERC20Gateway: parentChainContracts.standardGateway,
      l1GatewayRouter: parentChainContracts.router,
      l1MultiCall: parentChainContracts.multicall,
      // todo: fix
      l1ProxyAdmin: constants.AddressZero,
      l1Weth: parentChainContracts.weth,
      l1WethGateway: parentChainContracts.wethGateway,

      l2CustomGateway: orbitChainContracts.customGateway,
      l2ERC20Gateway: orbitChainContracts.standardGateway,
      l2GatewayRouter: orbitChainContracts.router,
      l2Multicall: orbitChainContracts.multicall,
      l2ProxyAdmin: orbitChainContracts.proxyAdmin,
      l2Weth: orbitChainContracts.weth,
      l2WethGateway: orbitChainContracts.wethGateway,
    },
  }

  return {
    l1Network,
    l2Network,
  }
}

const registerNewNetwork = async (
  l1Provider: JsonRpcProvider,
  l2Provider: JsonRpcProvider,
  rollupAddress: string
): Promise<{
  l1Network: L1Network
  l2Network: Omit<L2Network, 'tokenBridge'>
}> => {
  const l1NetworkInfo = await l1Provider.getNetwork()
  const l2NetworkInfo = await l2Provider.getNetwork()

  const l1Network: L1Network = {
    blockTime: 10,
    chainID: l1NetworkInfo.chainId,
    explorerUrl: '',
    isCustom: true,
    name: l1NetworkInfo.name,
    partnerChainIDs: [l2NetworkInfo.chainId],
    isArbitrum: false,
  }

  const rollup = RollupAdminLogic__factory.connect(rollupAddress, l1Provider)
  const l2Network: L2Network = {
    chainID: l2NetworkInfo.chainId,
    confirmPeriodBlocks: (await rollup.confirmPeriodBlocks()).toNumber(),
    ethBridge: {
      bridge: await rollup.bridge(),
      inbox: await rollup.inbox(),
      outbox: await rollup.outbox(),
      rollup: rollup.address,
      sequencerInbox: await rollup.sequencerInbox(),
    },
    explorerUrl: '',
    isArbitrum: true,
    isCustom: true,
    name: 'OrbitChain',
    partnerChainID: l1NetworkInfo.chainId,
    retryableLifetimeSeconds: 7 * 24 * 60 * 60,
    nitroGenesisBlock: 0,
    nitroGenesisL1Block: 0,
    depositTimeout: 900000,
    tokenBridge: {
      l1CustomGateway: '',
      l1ERC20Gateway: '',
      l1GatewayRouter: '',
      l1MultiCall: '',
      l1ProxyAdmin: '',
      l1Weth: '',
      l1WethGateway: '',
      l2CustomGateway: '',
      l2ERC20Gateway: '',
      l2GatewayRouter: '',
      l2Multicall: '',
      l2ProxyAdmin: '',
      l2Weth: '',
      l2WethGateway: '',
    },
  }

  // register - needed for retryables
  addCustomNetwork({
    customL1Network: l1Network,
    customL2Network: l2Network,
  })

  return {
    l1Network,
    l2Network,
  }
}

export const createERC20Bridge = async (
  baseChainRpc: string,
  baseChainDeployerKey: string,
  childChainRpc: string,
  rollupAddress: string
) => {
  console.log('Creating token bridge for rollup', rollupAddress)

  const { l1Network, l2Network } = await createNewTokenBridge(
    baseChainRpc,
    baseChainDeployerKey,
    childChainRpc,
    rollupAddress
  )
  const NETWORK_FILE = 'network.json'
  fs.writeFileSync(
    NETWORK_FILE,
    JSON.stringify({ l1Network, l2Network }, null, 2)
  )
  console.log(NETWORK_FILE + ' updated')

  // Read the JSON configuration
  const configRaw = fs.readFileSync(
    './config/orbitSetupScriptConfig.json',
    'utf-8'
  )
  const config: L3Config = JSON.parse(configRaw)

  const outputInfo = {
    chainInfo: {
      minL2BaseFee: config.minL2BaseFee,
      networkFeeReceiver: config.networkFeeReceiver,
      infrastructureFeeCollector: config.infrastructureFeeCollector,
      batchPoster: config.batchPoster,
      staker: config.staker,
      chainOwner: config.chainOwner,
      chainName: config.chainName,
      chainId: config.chainId,
      parentChainId: config.parentChainId,
      rpcUrl: 'http://localhost:8449',
      explorerUrl: 'http://localhost',
      nativeToken: config.nativeToken,
    },
    coreContracts: {
      rollup: config.rollup,
      inbox: config.inbox,
      outbox: config.outbox,
      adminProxy: config.adminProxy,
      sequencerInbox: config.sequencerInbox,
      bridge: config.bridge,
      utils: config.utils,
      validatorWalletCreator: config.validatorWalletCreator,
    },

    tokenBridgeContracts: {
      l2Contracts: {
        customGateway: l2Network.tokenBridge.l1CustomGateway,
        multicall: l2Network.tokenBridge.l1MultiCall,
        proxyAdmin: l2Network.tokenBridge.l1ProxyAdmin,
        router: l2Network.tokenBridge.l1GatewayRouter,
        standardGateway: l2Network.tokenBridge.l1ERC20Gateway,
        weth: l2Network.tokenBridge.l1Weth,
        wethGateway: l2Network.tokenBridge.l1WethGateway,
      },
      l3Contracts: {
        customGateway: l2Network.tokenBridge.l2CustomGateway,
        multicall: l2Network.tokenBridge.l2Multicall,
        proxyAdmin: l2Network.tokenBridge.l2ProxyAdmin,
        router: l2Network.tokenBridge.l2GatewayRouter,
        standardGateway: l2Network.tokenBridge.l2ERC20Gateway,
        weth: l2Network.tokenBridge.l2Weth,
        wethGateway: l2Network.tokenBridge.l2WethGateway,
      },
    },
  }
  fs.writeFileSync('outputInfo.json', JSON.stringify(outputInfo, null, 2))

  console.log('Done!')
}
