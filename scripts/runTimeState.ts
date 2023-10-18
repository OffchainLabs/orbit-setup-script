export interface RuntimeState {
  etherSent: EtherSent
  nativeTokenDeposit: boolean
  tokenBridgeDeployed: boolean
}

interface EtherSent {
  batchPoster: boolean
  staker: boolean
}

export const defaultRunTimeState: RuntimeState = {
  etherSent: {
    batchPoster: false,
    staker: false,
  },
  nativeTokenDeposit: false,
  tokenBridgeDeployed: false,
}
