import { JsonRpcProvider } from '@ethersproject/providers'
import { L1Network, L2Network, addCustomNetwork } from '@arbitrum/sdk'
import { RollupAdminLogic__factory } from '@arbitrum/sdk/dist/lib/abi/factories/RollupAdminLogic__factory'
import { createTokenBridge, getSigner } from './erc20TokenBridgeDeployment'
import L1AtomicTokenBridgeCreator from '@arbitrum/token-bridge-contracts/build/contracts/contracts/tokenbridge/ethereum/L1AtomicTokenBridgeCreator.sol/L1AtomicTokenBridgeCreator.json'
import * as fs from 'fs'
import { ethers } from 'ethers'
import { L3Config } from './l3ConfigType'

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
  const l1Provider = new JsonRpcProvider(baseChainRpc)
  const l1Deployer = getSigner(l1Provider, baseChainDeployerKey)
  const l2Provider = new JsonRpcProvider(childChainRpc)

  const { l1Network, l2Network: corel2Network } = await registerNewNetwork(
    l1Provider,
    l2Provider,
    rollupAddress
  )

  let TOKEN_BRIDGE_CREATOR: string
  if ((await l1Provider.getNetwork()).chainId === 421614) {
    TOKEN_BRIDGE_CREATOR = TOKEN_BRIDGE_CREATOR_Arb_Sepolia
  } else {
    throw new Error(
      'The Base Chain you have provided is not supported, please put RPC for Arb Goerli or Arb Sepolia'
    )
  }

  const L1AtomicTokenBridgeCreator__factory = new ethers.Contract(
    TOKEN_BRIDGE_CREATOR,
    L1AtomicTokenBridgeCreator.abi,
    l1Deployer
  )
  const l1TokenBridgeCreator =
    L1AtomicTokenBridgeCreator__factory.connect(l1Deployer)

  // create token bridge
  const deployedContracts = await createTokenBridge(
    l1Deployer,
    l2Provider,
    l1TokenBridgeCreator,
    rollupAddress
  )

  const l2Network = {
    ...corel2Network,
    tokenBridge: {
      l1CustomGateway: deployedContracts.l1CustomGateway,
      l1ERC20Gateway: deployedContracts.l1StandardGateway,
      l1GatewayRouter: deployedContracts.l1Router,
      l1MultiCall: deployedContracts.l1MultiCall,
      l1ProxyAdmin: deployedContracts.l1ProxyAdmin,
      l1Weth: deployedContracts.l1Weth,
      l1WethGateway: deployedContracts.l1WethGateway,

      l2CustomGateway: deployedContracts.l2CustomGateway,
      l2ERC20Gateway: deployedContracts.l2StandardGateway,
      l2GatewayRouter: deployedContracts.l2Router,
      l2Multicall: deployedContracts.l2Multicall,
      l2ProxyAdmin: deployedContracts.l2ProxyAdmin,
      l2Weth: deployedContracts.l2Weth,
      l2WethGateway: deployedContracts.l2WethGateway,
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
      explorerUrl: 'http://localhost:4000',
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
