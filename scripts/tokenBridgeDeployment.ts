import { Signer, ContractFactory, constants } from 'ethers'
import { ethers } from 'ethers'
import { L1GatewayRouter__factory } from '../contracts/factories/L1GatewayRouter__factory'
import { L1ERC20Gateway__factory } from '../contracts/factories/L1ERC20Gateway__factory'
import { L1CustomGateway__factory } from '../contracts/factories/L1CustomGateway__factory'
import { L1WethGateway__factory } from '../contracts/factories/L1WethGateway__factory'
import { L2GatewayRouter__factory } from '../contracts/factories/L2GatewayRouter__factory'
import { L2ERC20Gateway__factory } from '../contracts/factories/L2ERC20Gateway__factory'
import { L2CustomGateway__factory } from '../contracts/factories/L2CustomGateway__factory'
import { L2WethGateway__factory } from '../contracts/factories/L2WethGateway__factory'
import { StandardArbERC20__factory } from '../contracts/factories/StandardArbERC20__factory'
import { UpgradeableBeacon__factory } from '../contracts/factories/UpgradeableBeacon__factory'
import { BeaconProxyFactory__factory } from '../contracts/factories/BeaconProxyFactory__factory'
import { TransparentUpgradeableProxy__factory } from '../contracts/factories/TransparentUpgradeableProxy__factory'
import { ProxyAdmin } from '../contracts/ProxyAdmin'
import { ProxyAdmin__factory } from '../contracts/factories/ProxyAdmin__factory'
import { AeWETH__factory } from '../contracts/factories/AeWETH__factory'
import { Multicall2__factory } from '../contracts/factories/Multicall2__factory'
import { ArbMulticall2__factory } from '../contracts/factories/ArbMulticall2__factory'

import { L3Config } from './l3ConfigType'
import fs from 'fs'

import { defaultRunTimeState, L2, L3, RuntimeState } from './runTimeState'

// WETH address already deployed on L2
// It's Arb Goerli currently. Need to change this when moving to Arb one
const wethAddress = '0xe39Ab88f8A4777030A534146A9Ca3B52bd5D43A3'

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
  admin: ProxyAdmin,
  dataToCallProxy = '0x'
): Promise<ReturnType<T['deploy']>> => {
  const instance = await factory.connect(deployer).deploy()
  await instance.deployed()
  const proxy = await new TransparentUpgradeableProxy__factory()
    .connect(deployer)
    .deploy(instance.address, admin.address, dataToCallProxy)
  await proxy.deployed()

  return instance.attach(proxy.address) as ReturnType<T['deploy']>
}

export const deployErc20l2 = async (rs: RuntimeState, deployer: Signer) => {
  const proxyAdmin = rs.l2.proxyAdmin
    ? ProxyAdmin__factory.connect(rs.l2.proxyAdmin, deployer)
    : await deployContract(deployer, new ProxyAdmin__factory())
  rs.l2.proxyAdmin = proxyAdmin.address

  const router = rs.l2.router
    ? L1GatewayRouter__factory.connect(rs.l2.router, deployer)
    : await deployBehindProxy(
        deployer,
        new L1GatewayRouter__factory(),
        proxyAdmin
      )
  rs.l2.router = router.address

  const standardGateway = rs.l2.standardGateway
    ? L1ERC20Gateway__factory.connect(rs.l2.standardGateway, deployer)
    : await deployBehindProxy(
        deployer,
        new L1ERC20Gateway__factory(),
        proxyAdmin
      )
  rs.l2.standardGateway = standardGateway.address

  const customGateway = rs.l2.customGateway
    ? L1CustomGateway__factory.connect(rs.l2.customGateway, deployer)
    : await deployBehindProxy(
        deployer,
        new L1CustomGateway__factory(),
        proxyAdmin
      )
  rs.l2.customGateway = customGateway.address

  const wethGateway = rs.l2.wethGateway
    ? L1WethGateway__factory.connect(rs.l2.wethGateway, deployer)
    : await deployBehindProxy(
        deployer,
        new L1WethGateway__factory(),
        proxyAdmin
      )
  rs.l2.wethGateway = wethGateway.address

  const weth = wethAddress
  rs.l2.weth = weth

  const multicall = rs.l2.multicall
    ? Multicall2__factory.connect(rs.l2.multicall, deployer)
    : await deployContract(deployer, new Multicall2__factory())
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
    ? ProxyAdmin__factory.connect(rs.l3.proxyAdmin, deployer)
    : await deployContract(deployer, new ProxyAdmin__factory())
  rs.l3.proxyAdmin = proxyAdmin.address

  const router = rs.l3.router
    ? L2GatewayRouter__factory.connect(rs.l3.router, deployer)
    : await deployBehindProxy(
        deployer,
        new L2GatewayRouter__factory(),
        proxyAdmin
      )
  rs.l3.router = router.address

  const standardGateway = rs.l3.standardGateway
    ? L2ERC20Gateway__factory.connect(rs.l3.standardGateway, deployer)
    : await deployBehindProxy(
        deployer,
        new L2ERC20Gateway__factory(),
        proxyAdmin
      )
  rs.l3.standardGateway = standardGateway.address

  const customGateway = rs.l3.customGateway
    ? L2CustomGateway__factory.connect(rs.l3.customGateway, deployer)
    : await deployBehindProxy(
        deployer,
        new L2CustomGateway__factory(),
        proxyAdmin
      )
  rs.l3.customGateway = customGateway.address

  const wethGateway = rs.l3.wethGateway
    ? L2WethGateway__factory.connect(rs.l3.wethGateway, deployer)
    : await deployBehindProxy(
        deployer,
        new L2WethGateway__factory(),
        proxyAdmin
      )
  rs.l3.wethGateway = wethGateway.address

  const standardArbERC20 = rs.l3.standardArbERC20
    ? StandardArbERC20__factory.connect(rs.l3.standardArbERC20, deployer)
    : await deployContract(deployer, new StandardArbERC20__factory())
  rs.l3.standardArbERC20 = standardArbERC20.address

  const beaconParam = []
  beaconParam.push(rs.l3.standardArbERC20)
  const beacon = rs.l3.beacon
    ? UpgradeableBeacon__factory.connect(rs.l3.beacon, deployer)
    : await deployContract(
        deployer,
        new UpgradeableBeacon__factory(),
        beaconParam
      )
  rs.l3.beacon = beacon.address

  const beaconProxyFactory = rs.l3.beaconProxyFactory
    ? BeaconProxyFactory__factory.connect(rs.l3.beaconProxyFactory, deployer)
    : await deployContract(deployer, new BeaconProxyFactory__factory())
  rs.l3.beaconProxyFactory = beaconProxyFactory.address

  const weth = rs.l3.weth
    ? AeWETH__factory.connect(rs.l3.weth, deployer)
    : await deployBehindProxy(deployer, new AeWETH__factory(), proxyAdmin)
  rs.l3.weth = weth.address

  const multicall = rs.l3.multicall
    ? ArbMulticall2__factory.connect(rs.l3.multicall, deployer)
    : await deployContract(deployer, new ArbMulticall2__factory())
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
  console.log('initialising token bridge contracts on the appchain')
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
          l2.weth!
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
          l2.weth!,
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

  console.log('initialising token bridge contracts on Arbitrum Goerli chain')
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
          l2.weth!,
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
  console.log('deploying token bridge contracts on Arbitrum Goerli chain')
  console.log('it may take a minute ⏰')
  const l2 = await deployErc20l2(rs, l2Signer)

  console.log('deploying token bridge contracts on appchain')
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
    `L2 Weth Gateway registered on Arb Goerli with transaction hash: ${recep.transactionHash}`
  )

  // Printing the addresses
  console.log(
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%'
  )
  console.log(
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%'
  )
  console.log('ERC20 contracts deployed and initialized!')
  console.log('Token bridge contracts on Arbitrum Goerli 📇📇📇:')
  console.log('L2 customGateway address: ', l2.customGateway.address)
  console.log('L2 multicall address: ', l2.multicall.address)
  console.log('L2 proxyAdmin address: ', l2.proxyAdmin.address)
  console.log('L2 router address: ', l2.router.address)
  console.log('L2 standardGateway address: ', l2.standardGateway.address)
  console.log('L2 weth address: ', l2.weth)
  console.log('L2 wethGateway address: ', l2.wethGateway.address)

  console.log(
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%'
  )
  console.log(
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%'
  )

  console.log('Token bridge contracts on appchain 📇📇📇:')
  console.log('appchain customGateway address: ', l3.customGateway.address)
  console.log('appchain multicall address: ', l3.multicall.address)
  console.log('appchain proxyAdmin address: ', l3.proxyAdmin.address)
  console.log('appchain router address: ', l3.router.address)
  console.log('appchain standardGateway address: ', l3.standardGateway.address)
  console.log('appchain weth address: ', l3.weth.address)
  console.log('appchain wethGateway address: ', l3.wethGateway.address)

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
        weth: l2.weth,
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
