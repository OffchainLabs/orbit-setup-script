import { Signer, ContractFactory, constants } from 'ethers'
import { ethers } from 'ethers'

type NamedFactory = ContractFactory & { contractName: string }
const NamedFactoryInstance = (contractJson: {
  abi: any
  bytecode: string
  contractName: string
}): NamedFactory => {
  const factory = new ContractFactory(
    contractJson.abi,
    contractJson.bytecode
  ) as NamedFactory
  factory['contractName'] = contractJson.contractName
  return factory
}

// import from token-bridge-contracts directly to make sure the bytecode is the same
import L1GatewayRouter from '@arbitrum/token-bridge-contracts/build/contracts/contracts/tokenbridge/ethereum/gateway/L1GatewayRouter.sol/L1GatewayRouter.json'
const L1GatewayRouter__fac = NamedFactoryInstance(L1GatewayRouter)
import L1ERC20Gateway from '@arbitrum/token-bridge-contracts/build/contracts/contracts/tokenbridge/ethereum/gateway/L1ERC20Gateway.sol/L1ERC20Gateway.json'
const L1ERC20Gateway__fac = NamedFactoryInstance(L1ERC20Gateway)
import L1CustomGateway from '@arbitrum/token-bridge-contracts/build/contracts/contracts/tokenbridge/ethereum/gateway/L1CustomGateway.sol/L1CustomGateway.json'
const L1CustomGateway__fac = NamedFactoryInstance(L1CustomGateway)
import L1WethGateway from '@arbitrum/token-bridge-contracts/build/contracts/contracts/tokenbridge/ethereum/gateway/L1WethGateway.sol/L1WethGateway.json'
const L1WethGateway__fac = NamedFactoryInstance(L1WethGateway)
import L2GatewayRouter from '@arbitrum/token-bridge-contracts/build/contracts/contracts/tokenbridge/arbitrum/gateway/L2GatewayRouter.sol/L2GatewayRouter.json'
const L2GatewayRouter__fac = NamedFactoryInstance(L2GatewayRouter)
import L2ERC20Gateway from '@arbitrum/token-bridge-contracts/build/contracts/contracts/tokenbridge/arbitrum/gateway/L2ERC20Gateway.sol/L2ERC20Gateway.json'
const L2ERC20Gateway__fac = NamedFactoryInstance(L2ERC20Gateway)
import L2CustomGateway from '@arbitrum/token-bridge-contracts/build/contracts/contracts/tokenbridge/arbitrum/gateway/L2CustomGateway.sol/L2CustomGateway.json'
const L2CustomGateway__fac = NamedFactoryInstance(L2CustomGateway)
import L2WethGateway from '@arbitrum/token-bridge-contracts/build/contracts/contracts/tokenbridge/arbitrum/gateway/L2WethGateway.sol/L2WethGateway.json'
const L2WethGateway__fac = NamedFactoryInstance(L2WethGateway)
import StandardArbERC20 from '@arbitrum/token-bridge-contracts/build/contracts/contracts/tokenbridge/arbitrum/StandardArbERC20.sol/StandardArbERC20.json'
const StandardArbERC20__fac = NamedFactoryInstance(StandardArbERC20)
import BeaconProxyFactory from '@arbitrum/token-bridge-contracts/build/contracts/contracts/tokenbridge/libraries/ClonableBeaconProxy.sol/BeaconProxyFactory.json'
const BeaconProxyFactory__fac = NamedFactoryInstance(BeaconProxyFactory)
import AeWETH from '@arbitrum/token-bridge-contracts/build/contracts/contracts/tokenbridge/libraries/aeWETH.sol/aeWETH.json'
const AeWETH__fac = NamedFactoryInstance(AeWETH)
import TestWETH9 from '@arbitrum/token-bridge-contracts/build/contracts/contracts/tokenbridge/test/TestWETH9.sol/TestWETH9.json'
const TestWETH9__fac = NamedFactoryInstance(TestWETH9)
import Multicall2 from '@arbitrum/token-bridge-contracts/build/contracts/contracts/rpc-utils/MulticallV2.sol/Multicall2.json'
const Multicall2__fac = NamedFactoryInstance(Multicall2)
import ArbMulticall2 from '@arbitrum/token-bridge-contracts/build/contracts/contracts/rpc-utils/MulticallV2.sol/ArbMulticall2.json'
const ArbMulticall2__fac = NamedFactoryInstance(ArbMulticall2)

// import from nitro-contracts directly to make sure the bytecode is the same
import UpgradeableBeacon from '@arbitrum/nitro-contracts/build/contracts/@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol/UpgradeableBeacon.json'
const UpgradeableBeacon__fac = NamedFactoryInstance(UpgradeableBeacon)
import TransparentUpgradeableProxy from '@arbitrum/nitro-contracts/build/contracts/@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol/TransparentUpgradeableProxy.json'
const TransparentUpgradeableProxy__fac = NamedFactoryInstance(
  TransparentUpgradeableProxy
)
import ProxyAdmin from '@arbitrum/nitro-contracts/build/contracts/@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol/ProxyAdmin.json'
const ProxyAdmin__fac = NamedFactoryInstance(ProxyAdmin)

import { L3Config } from './l3ConfigType'
import fs from 'fs'

import { L2, L3, RuntimeState } from './runTimeState'

export const deployContract = async <
  T extends ContractFactory & { contractName: string }
>(
  deployer: Signer,
  factory: T,
  param?: Array<any>
): Promise<ReturnType<T['deploy']>> => {
  let instance
  if (param) {
    instance = await factory.connect(deployer).deploy(...param)
  } else {
    instance = await factory.connect(deployer).deploy()
  }

  await instance.deployed()
  return instance as ReturnType<T['deploy']>
}

export const deployBehindProxy = async <
  T extends ContractFactory & { contractName: string }
>(
  deployer: Signer,
  factory: T,
  adminAddr: string,
  dataToCallProxy = '0x'
): Promise<ReturnType<T['deploy']>> => {
  const instance = await factory.connect(deployer).deploy()
  await instance.deployed()
  const proxy = await TransparentUpgradeableProxy__fac.connect(deployer).deploy(
    instance.address,
    adminAddr,
    dataToCallProxy
  )
  await proxy.deployed()

  return instance.attach(proxy.address) as ReturnType<T['deploy']>
}

export const deployErc20l2 = async (rs: RuntimeState, deployer: Signer) => {
  const proxyAdmin = rs.l2.proxyAdmin
    ? ProxyAdmin__fac.attach(rs.l2.proxyAdmin).connect(deployer)
    : await deployContract(deployer, ProxyAdmin__fac)
  rs.l2.proxyAdmin = proxyAdmin.address

  const router = rs.l2.router
    ? L1GatewayRouter__fac.attach(rs.l2.router).connect(deployer)
    : await deployBehindProxy(
        deployer,
        L1GatewayRouter__fac,
        proxyAdmin.address
      )
  rs.l2.router = router.address

  const standardGateway = rs.l2.standardGateway
    ? L1ERC20Gateway__fac.attach(rs.l2.standardGateway).connect(deployer)
    : await deployBehindProxy(deployer, L1ERC20Gateway__fac, proxyAdmin.address)
  rs.l2.standardGateway = standardGateway.address

  const customGateway = rs.l2.customGateway
    ? L1CustomGateway__fac.attach(rs.l2.customGateway).connect(deployer)
    : await deployBehindProxy(
        deployer,
        L1CustomGateway__fac,
        proxyAdmin.address
      )
  rs.l2.customGateway = customGateway.address

  const wethGateway = rs.l2.wethGateway
    ? L1WethGateway__fac.attach(rs.l2.wethGateway).connect(deployer)
    : await deployBehindProxy(deployer, L1WethGateway__fac, proxyAdmin.address)
  rs.l2.wethGateway = wethGateway.address

  const weth = rs.l2.weth
    ? AeWETH__fac.attach(rs.l2.weth).connect(deployer)
    : await deployBehindProxy(deployer, AeWETH__fac, proxyAdmin.address)
  rs.l2.weth = weth.address

  const multicall = rs.l2.multicall
    ? Multicall2__fac.attach(rs.l2.multicall).connect(deployer)
    : await deployContract(deployer, Multicall2__fac)
  rs.l2.multicall = multicall.address

  return {
    proxyAdmin,
    router,
    standardGateway,
    customGateway,
    wethGateway,
    weth,
    multicall,
  }
}

export const deployErc20L3 = async (
  rs: RuntimeState,
  deployer: Signer
): Promise<L3> => {
  const proxyAdmin = rs.l3.proxyAdmin
    ? ProxyAdmin__fac.attach(rs.l3.proxyAdmin).connect(deployer)
    : await deployContract(deployer, ProxyAdmin__fac)
  rs.l3.proxyAdmin = proxyAdmin.address

  const router = rs.l3.router
    ? L2GatewayRouter__fac.attach(rs.l3.router).connect(deployer)
    : await deployBehindProxy(
        deployer,
        L2GatewayRouter__fac,
        proxyAdmin.address
      )
  rs.l3.router = router.address

  const standardGateway = rs.l3.standardGateway
    ? L2ERC20Gateway__fac.attach(rs.l3.standardGateway).connect(deployer)
    : await deployBehindProxy(deployer, L2ERC20Gateway__fac, proxyAdmin.address)
  rs.l3.standardGateway = standardGateway.address

  const customGateway = rs.l3.customGateway
    ? L2CustomGateway__fac.attach(rs.l3.customGateway).connect(deployer)
    : await deployBehindProxy(
        deployer,
        L2CustomGateway__fac,
        proxyAdmin.address
      )
  rs.l3.customGateway = customGateway.address

  const wethGateway = rs.l3.wethGateway
    ? L2WethGateway__fac.attach(rs.l3.wethGateway).connect(deployer)
    : await deployBehindProxy(deployer, L2WethGateway__fac, proxyAdmin.address)
  rs.l3.wethGateway = wethGateway.address

  const standardArbERC20 = rs.l3.standardArbERC20
    ? StandardArbERC20__fac.attach(rs.l3.standardArbERC20).connect(deployer)
    : await deployContract(deployer, StandardArbERC20__fac)
  rs.l3.standardArbERC20 = standardArbERC20.address

  const beaconParam = []
  beaconParam.push(rs.l3.standardArbERC20)
  const beacon = rs.l3.beacon
    ? UpgradeableBeacon__fac.attach(rs.l3.beacon).connect(deployer)
    : await deployContract(deployer, UpgradeableBeacon__fac, beaconParam)
  rs.l3.beacon = beacon.address

  const beaconProxyFactory = rs.l3.beaconProxyFactory
    ? BeaconProxyFactory__fac.attach(rs.l3.beaconProxyFactory).connect(deployer)
    : await deployContract(deployer, BeaconProxyFactory__fac)
  rs.l3.beaconProxyFactory = beaconProxyFactory.address

  const weth = rs.l3.weth
    ? AeWETH__fac.attach(rs.l3.weth).connect(deployer)
    : await deployBehindProxy(deployer, AeWETH__fac, proxyAdmin.address)
  rs.l3.weth = weth.address

  const multicall = rs.l3.multicall
    ? ArbMulticall2__fac.attach(rs.l3.multicall).connect(deployer)
    : await deployContract(deployer, ArbMulticall2__fac)
  rs.l3.multicall = multicall.address

  return {
    proxyAdmin,
    router,
    standardArbERC20,
    standardGateway,
    customGateway,
    wethGateway,
    beacon,
    beaconProxyFactory,
    weth,
    multicall,
  }
}

const initializeContract = async (
  l2Signer: Signer,
  inboxAddress: string,
  l2: L2,
  l3: L3,
  rs: RuntimeState
) => {
  console.log('initialising token bridge contracts on the Orbit chain')
  try {
    if (!rs.initializedState.l3_router) {
      await (
        await l3.router!.initialize(
          l2.router!.address,
          l3.standardGateway!.address
        )
      ).wait()

      rs.initializedState.l3_router = true
    }
  } catch (err) {
    const error = err as Error
    const initialized = handleInitailizeError(error)
    if (initialized) {
      rs.initializedState.l3_router = true
    } else {
      throw err
    }
  }

  try {
    if (!rs.initializedState.l3_beaconProxyFactory) {
      await (await l3.beaconProxyFactory!.initialize(l3.beacon!.address)).wait()
      rs.initializedState.l3_beaconProxyFactory = true
    }
  } catch (err) {
    const error = err as Error
    const initialized = handleInitailizeError(error)
    if (initialized) {
      rs.initializedState.l3_beaconProxyFactory = true
    } else {
      throw err
    }
  }

  try {
    if (!rs.initializedState.l3_standardGateway) {
      await (
        await l3.standardGateway!.initialize(
          l2.standardGateway!.address,
          l3.router!.address,
          l3.beaconProxyFactory!.address
        )
      ).wait()
      rs.initializedState.l3_standardGateway = true
    }
  } catch (err) {
    const error = err as Error
    const initialized = handleInitailizeError(error)
    if (initialized) {
      rs.initializedState.l3_standardGateway = true
    } else {
      throw err
    }
  }

  try {
    if (!rs.initializedState.l3_customGateway) {
      await (
        await l3.customGateway!.initialize(
          l2.customGateway!.address,
          l3.router!.address
        )
      ).wait()
      rs.initializedState.l3_customGateway = true
    }
  } catch (err) {
    const error = err as Error
    const initialized = handleInitailizeError(error)
    if (initialized) {
      rs.initializedState.l3_customGateway = true
    } else {
      throw err
    }
  }

  try {
    if (!rs.initializedState.l3_weth) {
      await (
        await l3.weth!.initialize(
          'WETH',
          'WETH',
          18,
          l3.wethGateway!.address,
          l2.weth!.address
        )
      ).wait()
      rs.initializedState.l3_weth = true
    }
  } catch (err) {
    const error = err as Error
    const initialized = handleInitailizeError(error)
    if (initialized) {
      rs.initializedState.l3_weth = true
    } else {
      throw err
    }
  }

  try {
    if (!rs.initializedState.l3_wethGateway) {
      await (
        await l3.wethGateway!.initialize(
          l2.wethGateway!.address,
          l3.router!.address,
          l2.weth!.address,
          l3.weth!.address
        )
      ).wait()
      rs.initializedState.l3_wethGateway = true
    }
  } catch (err) {
    const error = err as Error
    const initialized = handleInitailizeError(error)
    if (initialized) {
      rs.initializedState.l3_wethGateway = true
    } else {
      throw err
    }
  }

  console.log('initialising token bridge contracts on parent chain')
  try {
    if (!rs.initializedState.l2_router) {
      await (
        await l2.router!.initialize(
          await l2Signer.getAddress(),
          l2.standardGateway!.address,
          constants.AddressZero,
          l3.router!.address,
          inboxAddress
        )
      ).wait()
      rs.initializedState.l2_router = true
    }
  } catch (err) {
    const error = err as Error
    const initialized = handleInitailizeError(error)
    if (initialized) {
      rs.initializedState.l2_router = true
    } else {
      throw err
    }
  }

  try {
    if (!rs.initializedState.l2_standardGateway) {
      await (
        await l2.standardGateway!.initialize(
          l3.standardGateway!.address,
          l2.router!.address,
          inboxAddress,
          await l3.beaconProxyFactory!.cloneableProxyHash(),
          l3.beaconProxyFactory!.address
        )
      ).wait()
      rs.initializedState.l2_standardGateway = true
    }
  } catch (err) {
    const error = err as Error
    const initialized = handleInitailizeError(error)
    if (initialized) {
      rs.initializedState.l2_standardGateway = true
    } else {
      throw err
    }
  }

  try {
    if (!rs.initializedState.l2_customGateway) {
      await (
        await l2.customGateway!.initialize(
          l3.customGateway!.address,
          l2.router!.address,
          inboxAddress,
          await l2Signer.getAddress()
        )
      ).wait()
      rs.initializedState.l2_customGateway = true
    }
  } catch (err) {
    const error = err as Error
    const initialized = handleInitailizeError(error)
    if (initialized) {
      rs.initializedState.l2_customGateway = true
    } else {
      throw err
    }
  }

  try {
    if (!rs.initializedState.l2_wethGateway) {
      await (
        await l2.wethGateway!.initialize(
          l3.wethGateway!.address,
          l2.router!.address,
          inboxAddress,
          l2.weth!.address,
          l3.weth!.address
        )
      ).wait()
      rs.initializedState.l2_wethGateway = true
    }
  } catch (err) {
    const error = err as Error
    const initialized = handleInitailizeError(error)
    if (initialized) {
      rs.initializedState.l2_wethGateway = true
    } else {
      throw err
    }
  }
}

const handleInitailizeError = (error: Error) => {
  let initialized = false
  const errMsg = error?.message?.toString()
  if (
    errMsg.includes('Initializable: contract is already initialized') ||
    errMsg.includes('0x0dc149f0') || // Signature of AlreadyInitialized()
    errMsg.includes('Contract instance has already been initialized') ||
    errMsg.includes('ALREADY_INIT')
  ) {
    initialized = true
  }
  return initialized
}

export const deployErc20AndInit = async (
  l2Signer: Signer,
  L3Signer: Signer,
  inboxAddress: string,
  rs: RuntimeState
) => {
  console.log('deploying token bridge contracts on parent chain')
  console.log('it may take a minute ⏰')

  const chainid = await l2Signer.getChainId()
  if (!rs.l2.weth) {
    if (chainid === 42161) {
      rs.l2.weth = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'
    } else if (chainid === 421613) {
      rs.l2.weth = '0xe39Ab88f8A4777030A534146A9Ca3B52bd5D43A3'
    } else if (chainid === 421614) {
      rs.l2.weth = '0x980B62Da83eFf3D4576C647993b0c1D7faf17c73'
    } else {
      throw new Error('Please config rs.l2.weth in resumeState.json')
    }
  }
  if ((await l2Signer.provider?.getCode(rs.l2.weth)) === '0x') {
    throw new Error('rs.l2.weth is not deployed')
  }

  const l2 = await deployErc20l2(rs, l2Signer)

  console.log('deploying token bridge contracts on Orbit chain')
  const l3 = await deployErc20L3(rs, L3Signer)

  await initializeContract(l2Signer, inboxAddress, l2, l3, rs)

  return { l2, l3 }
}

export async function tokenBridgeDeployment(
  privateKey: string,
  L2_RPC_URL: string,
  L3_RPC_URL: string,
  rs: RuntimeState
) {
  if (!privateKey || !L2_RPC_URL || !L3_RPC_URL) {
    throw new Error('Required environment variable not found')
  }

  // Generating providers from RPCs
  const L2Provider = new ethers.providers.JsonRpcProvider(L2_RPC_URL)
  const L3Provider = new ethers.providers.JsonRpcProvider(L3_RPC_URL)

  // To speed up the token bridge deployment
  L2Provider.pollingInterval = 100
  L3Provider.pollingInterval = 100
  // Creating the signer
  const l2Signer = new ethers.Wallet(privateKey).connect(L2Provider)
  const l3Signer = new ethers.Wallet(privateKey).connect(L3Provider)

  // Read the JSON configuration
  const configRaw = fs.readFileSync(
    './config/orbitSetupScriptConfig.json',
    'utf-8'
  )
  const config: L3Config = JSON.parse(configRaw)

  const inboxAddress = config.inbox

  const { l2, l3 } = await deployErc20AndInit(
    l2Signer,
    l3Signer,
    inboxAddress,
    rs
  )

  // Registering L2 WETH gateway on the Router
  console.log('Registering L2 WETH gateway on the Router')
  const l2Router = l2.router.connect(l2Signer)
  const l2WethGateway = l2.wethGateway.address
  const wethAddress = l2.weth.address
  const tx = await l2Router.setGateways(
    [wethAddress],
    [l2WethGateway],
    ethers.BigNumber.from('200000'),
    ethers.utils.parseUnits('0.15', 'gwei'),
    ethers.BigNumber.from('5000000000000000'),
    { value: ethers.utils.parseUnits('0.05', 'ether') }
  )
  const recep = await tx.wait()
  console.log(
    `L2 Weth Gateway registered on parent chain with transaction hash: ${recep.transactionHash}`
  )

  // Printing the addresses
  console.log(
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%'
  )
  console.log(
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%'
  )
  console.log('ERC20 contracts deployed and initialized!')
  console.log('Token bridge contracts on parent chain 📇📇📇:')
  console.log('L2 customGateway address: ', l2.customGateway.address)
  console.log('L2 multicall address: ', l2.multicall.address)
  console.log('L2 proxyAdmin address: ', l2.proxyAdmin.address)
  console.log('L2 router address: ', l2.router.address)
  console.log('L2 standardGateway address: ', l2.standardGateway.address)
  console.log('L2 weth address: ', l2.weth.address)
  console.log('L2 wethGateway address: ', l2.wethGateway.address)

  console.log(
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%'
  )
  console.log(
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%'
  )

  console.log('Token bridge contracts on Orbit chain 📇📇📇:')
  console.log('Orbit chain customGateway address: ', l3.customGateway.address)
  console.log('Orbit chain multicall address: ', l3.multicall.address)
  console.log('Orbit chain proxyAdmin address: ', l3.proxyAdmin.address)
  console.log('Orbit chain router address: ', l3.router.address)
  console.log(
    'Orbit chain standardGateway address: ',
    l3.standardGateway.address
  )
  console.log('Orbit chain weth address: ', l3.weth.address)
  console.log('Orbit chain wethGateway address: ', l3.wethGateway.address)

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
        customGateway: l2.customGateway.address,
        multicall: l2.multicall.address,
        proxyAdmin: l2.proxyAdmin.address,
        router: l2.router.address,
        standardGateway: l2.standardGateway.address,
        weth: l2.weth.address,
        wethGateway: l2.wethGateway.address,
      },
      l3Contracts: {
        customGateway: l3.customGateway.address,
        multicall: l3.multicall.address,
        proxyAdmin: l3.proxyAdmin.address,
        router: l3.router.address,
        standardGateway: l3.standardGateway.address,
        weth: l3.weth.address,
        wethGateway: l3.wethGateway.address,
      },
    },
  }

  fs.writeFileSync('outputInfo.json', JSON.stringify(outputInfo, null, 2))

  console.log(
    'Congrats. Contracts are deployed and initialized! 🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉'
  )
}
