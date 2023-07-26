import { L1GatewayRouter } from '@arbitrum/sdk/dist/lib/abi/L1GatewayRouter'
import { L1ERC20Gateway } from '@arbitrum/sdk/dist/lib/abi/L1ERC20Gateway'
import { L1CustomGateway } from '@arbitrum/sdk/dist/lib/abi/L1CustomGateway'
import { L1WethGateway } from '@arbitrum/sdk/dist/lib/abi/L1WethGateway'
import { Multicall2 } from '@arbitrum/sdk/dist/lib/abi/Multicall2'
import { L2GatewayRouter } from '@arbitrum/sdk/dist/lib/abi/L2GatewayRouter'
import { L2ERC20Gateway } from '@arbitrum/sdk/dist/lib/abi/L2ERC20Gateway'
import { L2CustomGateway } from '@arbitrum/sdk/dist/lib/abi/L2CustomGateway'
import { L2WethGateway } from '@arbitrum/sdk/dist/lib/abi/L2WethGateway'
import { UpgradeableBeacon } from '@arbitrum/sdk/dist/lib/abi/UpgradeableBeacon'
import { BeaconProxyFactory } from '@arbitrum/sdk/dist/lib/abi/BeaconProxyFactory'
import { AeWETH } from '@arbitrum/sdk/dist/lib/abi/AeWETH'
import { ArbMulticall2 } from '@arbitrum/sdk/dist/lib/abi/ArbMulticall2'
import { StandardArbERC20 } from '@arbitrum/sdk/dist/lib/abi/StandardArbERC20'
import { ProxyAdmin } from '../contracts/ProxyAdmin'

export interface RuntimeState {
  l2: L2_Address
  l3: L3_Address
  initializedState: InitializedState
  etherSent: EtherSent
}

interface EtherSent {
  batchPoster: boolean
  staker: boolean
  deposit: boolean
}

interface InitializedState {
  l3_router: boolean
  l3_beaconProxyFactory: boolean
  l3_standardGateway: boolean
  l3_customGateway: boolean
  l3_weth: boolean
  l3_wethGateway: boolean
  l2_router: boolean
  l2_standardGateway: boolean
  l2_customGateway: boolean
  l2_wethGateway: boolean
}

export const defaultRunTimeState: RuntimeState = {
  l2: {
    proxyAdmin: null,
    router: null,
    standardGateway: null,
    customGateway: null,
    wethGateway: null,
    weth: null,
    multicall: null,
  },
  l3: {
    proxyAdmin: null,
    router: null,
    standardGateway: null,
    customGateway: null,
    wethGateway: null,
    standardArbERC20: null,
    beacon: null,
    beaconProxyFactory: null,
    weth: null,
    multicall: null,
  },
  initializedState: {
    l3_router: false,
    l3_beaconProxyFactory: false,
    l3_standardGateway: false,
    l3_customGateway: false,
    l3_weth: false,
    l3_wethGateway: false,
    l2_router: false,
    l2_standardGateway: false,
    l2_customGateway: false,
    l2_wethGateway: false,
  },
  etherSent: {
    batchPoster: false,
    staker: false,
    deposit: false,
  },
}
export interface L2_Address {
  proxyAdmin: string | null
  router: string | null
  standardGateway: string | null
  customGateway: string | null
  wethGateway: string | null
  weth: string | null
  multicall: string | null
}
export interface L2 {
  proxyAdmin: ProxyAdmin
  router: L1GatewayRouter
  standardGateway: L1ERC20Gateway
  customGateway: L1CustomGateway
  wethGateway: L1WethGateway
  weth: string
  multicall: Multicall2
}
export interface L3_Address {
  proxyAdmin: string | null
  router: string | null
  standardGateway: string | null
  customGateway: string | null
  wethGateway: string | null
  standardArbERC20: string | null
  beacon: string | null
  beaconProxyFactory: string | null
  weth: string | null
  multicall: string | null
}
export interface L3 {
  proxyAdmin: ProxyAdmin
  router: L2GatewayRouter
  standardGateway: L2ERC20Gateway
  customGateway: L2CustomGateway
  wethGateway: L2WethGateway
  standardArbERC20: StandardArbERC20
  beacon: UpgradeableBeacon
  beaconProxyFactory: BeaconProxyFactory
  weth: AeWETH
  multicall: ArbMulticall2
}
