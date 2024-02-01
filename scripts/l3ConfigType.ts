export interface L3Config {
  chainOwner: string
  rollup: string
  inbox: string
  outbox: string
  adminProxy: string
  sequencerInbox: string
  bridge: string
  utils: string
  validatorWalletCreator: string
  deployedAtBlockNumber: number
  minL2BaseFee: number
  networkFeeReceiver: string
  infrastructureFeeCollector: string
  batchPoster: string
  staker: string
  chainId: number
  chainName: string
  parentChainId: number
  'parent-chain-node-url': string
  nativeToken: string
}
