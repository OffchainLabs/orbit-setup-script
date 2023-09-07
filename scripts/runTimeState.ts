import { Contract } from 'ethers'

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
  proxyAdmin: Contract
  router: Contract
  standardGateway: Contract
  customGateway: Contract
  wethGateway: Contract
  weth: Contract
  multicall: Contract
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
  proxyAdmin: Contract
  router: Contract
  standardGateway: Contract
  customGateway: Contract
  wethGateway: Contract
  standardArbERC20: Contract
  beacon: Contract
  beaconProxyFactory: Contract
  weth: Contract
  multicall: Contract
}
