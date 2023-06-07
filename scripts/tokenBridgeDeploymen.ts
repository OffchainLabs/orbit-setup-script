import { Signer, ContractFactory, constants } from 'ethers'
import {ethers} from 'ethers'
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
import { TestWETH9__factory } from '../contracts/factories/TestWETH9__factory'
import { Multicall2__factory } from '../contracts/factories/Multicall2__factory'
import { ArbMulticall2__factory } from '../contracts/factories/ArbMulticall2__factory'

import { L3Config } from "./l3ConfigType";
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';

const deployBehindProxy = async <
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
  console.log(factory['contractName'], proxy.address)

  return instance.attach(proxy.address) as ReturnType<T['deploy']>;
}

export const deployErc20l2 = async (deployer: Signer) => {
  const proxyAdmin = await new ProxyAdmin__factory().connect(deployer).deploy()
  await proxyAdmin.deployed()
  console.log('proxyAdmin', proxyAdmin.address)

  const router = await deployBehindProxy(
    deployer,
    new L1GatewayRouter__factory(),
    proxyAdmin
  )
  await router.deployed()

  const standardGateway = await deployBehindProxy(
    deployer,
    new L1ERC20Gateway__factory(),
    proxyAdmin
  )
  await standardGateway.deployed()

  const customGateway = await deployBehindProxy(
    deployer,
    new L1CustomGateway__factory(),
    proxyAdmin
  )
  await customGateway.deployed()

  const wethGateway = await deployBehindProxy(
    deployer,
    new L1WethGateway__factory(),
    proxyAdmin
  )
  await wethGateway.deployed()

  const weth = await new TestWETH9__factory()
    .connect(deployer)
    .deploy('WETH', 'WETH')
  await weth.deployed()
  console.log('weth', weth.address)

  const multicall = await new Multicall2__factory().connect(deployer).deploy()
  await multicall.deployed()
  console.log('multicall', weth.address)

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

export const deployErc20L3 = async (deployer: Signer) => {
  const proxyAdmin = await new ProxyAdmin__factory().connect(deployer).deploy()
  await proxyAdmin.deployed()
  console.log('proxyAdmin', proxyAdmin.address)

  const router = await deployBehindProxy(
    deployer,
    new L2GatewayRouter__factory(),
    proxyAdmin
  )
  await router.deployed()

  const standardGateway = await deployBehindProxy(
    deployer,
    new L2ERC20Gateway__factory(),
    proxyAdmin
  )
  await standardGateway.deployed()

  const customGateway = await deployBehindProxy(
    deployer,
    new L2CustomGateway__factory(),
    proxyAdmin
  )
  await customGateway.deployed()

  const wethGateway = await deployBehindProxy(
    deployer,
    new L2WethGateway__factory(),
    proxyAdmin
  )
  await wethGateway.deployed()

  const standardArbERC20 = await new StandardArbERC20__factory()
    .connect(deployer)
    .deploy()
  await standardArbERC20.deployed()

  const beacon = await new UpgradeableBeacon__factory()
    .connect(deployer)
    .deploy(standardArbERC20.address)
  await beacon.deployed()

  const beaconProxyFactory = await new BeaconProxyFactory__factory()
    .connect(deployer)
    .deploy()
  await beaconProxyFactory.deployed()

  const weth = await deployBehindProxy(
    deployer,
    new AeWETH__factory(),
    proxyAdmin
  )
  console.log('weth', weth.address)

  const multicall = await new ArbMulticall2__factory()
    .connect(deployer)
    .deploy()
  await multicall.deployed()
  console.log('multicall', multicall.address)

  return {
    proxyAdmin,
    router,
    standardGateway,
    customGateway,
    wethGateway,
    beacon,
    beaconProxyFactory,
    weth,
    multicall,
  }
}

export const deployErc20AndInit = async (
  l2Signer: Signer,
  L3Signer: Signer,
  inboxAddress: string
) => {
  console.log('deploying l2')
  const l2 = await deployErc20l2(l2Signer)

  console.log('deploying L3')
  const l3 = await deployErc20L3(L3Signer)

  console.log('initialising L3')
  await l3.router.initialize(l2.router.address, l3.standardGateway.address)
  await l3.beaconProxyFactory.initialize(l3.beacon.address)
  await (
    await l3.standardGateway.initialize(
      l2.standardGateway.address,
      l3.router.address,
      l3.beaconProxyFactory.address
    )
  ).wait()
  await (
    await l3.customGateway.initialize(
      l2.customGateway.address,
      l3.router.address
    )
  ).wait()
  await (
    await l3.weth.initialize(
      'WETH',
      'WETH',
      18,
      l3.wethGateway.address,
      l2.weth.address
    )
  ).wait()
  await (
    await l3.wethGateway.initialize(
      l2.wethGateway.address,
      l3.router.address,
      l2.weth.address,
      l3.weth.address
    )
  ).wait()

  console.log('initialising l2')
  console.log(inboxAddress);
  await (
    await l2.router.initialize(
      await l2Signer.getAddress(),
      l2.standardGateway.address,
      constants.AddressZero,
      l3.router.address,
      inboxAddress
    )
  ).wait()

  await (
    await l2.standardGateway.initialize(
      l3.standardGateway.address,
      l2.router.address,
      inboxAddress,
      await l3.beaconProxyFactory.cloneableProxyHash(),
      l3.beaconProxyFactory.address
    )
  ).wait()
  await (
    await l2.customGateway.initialize(
      l3.customGateway.address,
      l2.router.address,
      inboxAddress,
      await l2Signer.getAddress()
    )
  ).wait()
  await (
    await l2.wethGateway.initialize(
      l3.wethGateway.address,
      l2.router.address,
      inboxAddress,
      l2.weth.address,
      l3.weth.address
    )
  ).wait()

  return { l2, l3 }
}

async function main() {
    // Read the environment variables
    const privateKey = process.env.PRIVATE_KEY;
    const L2_RPC_URL = process.env.L2_RPC_URL;
    const L3_RPC_URL = process.env.L3_RPC_URL;

    if (!privateKey || !L2_RPC_URL || !L3_RPC_URL) {
        throw new Error('Required environment variable not found');
    }

    // Generating providers from RPCs
    const L2Provider = new ethers.providers.JsonRpcProvider(L2_RPC_URL);
    const L3Provider = new ethers.providers.JsonRpcProvider(L3_RPC_URL);
   
    // Creating the signer
    const l2Signer = new ethers.Wallet(privateKey).connect(L2Provider);
    const l3Signer = new ethers.Wallet(privateKey).connect(L3Provider);

    // Read the JSON configuration
    const configRaw = fs.readFileSync('./config/config.json', 'utf-8');
    const config: L3Config = JSON.parse(configRaw);
      
    const inboxAddress = config.inboxAddress;
  
    const { l2, l3 } = await deployErc20AndInit(l2Signer, l3Signer, inboxAddress);
  
    console.log("ERC20 contracts deployed and initialized!");
    console.log("L2 contracts:");
    console.log("L2 customGateway address: ",l2.customGateway.address)
    console.log("L2 multicall address: ",l2.multicall.address)
    console.log("L2 proxyAdmin address: ",l2.proxyAdmin.address)
    console.log("L2 router address: ",l2.router.address)
    console.log("L2 standardGateway address: ",l2.standardGateway.address)
    console.log("L2 weth address: ",l2.weth.address)
    console.log("L2 wethGateway address: ",l2.wethGateway.address)

    console.log("L3 contracts:");
    console.log("L3 customGateway address: ",l3.customGateway.address)
    console.log("L3 multicall address: ",l3.multicall.address)
    console.log("L3 proxyAdmin address: ",l3.proxyAdmin.address)
    console.log("L3 router address: ",l3.router.address)
    console.log("L3 standardGateway address: ",l3.standardGateway.address)
    console.log("L3 weth address: ",l3.weth.address)
    console.log("L3 wethGateway address: ",l3.wethGateway.address)
    console.log("Congrats 🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉");
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });