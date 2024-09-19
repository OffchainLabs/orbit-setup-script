import { ethers } from 'ethers'
import * as fs from 'fs'
import { L3Config } from './l3ConfigType'

async function refundWallets(targetAddress: string) {
  const L2_RPC_URL = process.env.L2_RPC_URL

  if (!L2_RPC_URL) {
    throw new Error('L2_RPC_URL environment variable not found')
  }

  const provider = new ethers.providers.JsonRpcProvider(L2_RPC_URL)

  const configRaw = fs.readFileSync(
    './config/orbitSetupScriptConfig.json',
    'utf-8'
  )
  const config: L3Config = JSON.parse(configRaw)
  const batchPoster = config.batchPoster
  const staker = config.staker

  const nodeConfigRaw = fs.readFileSync('./config/nodeConfig.json', 'utf-8')
  const nodeConfig = JSON.parse(nodeConfigRaw)
  const batchPosterPrivateKey =
    nodeConfig.node['batch-poster']['parent-chain-wallet']['private-key']

  const stakerPrivateKey =
    nodeConfig.node.staker['parent-chain-wallet']['private-key']

  const wallets = [
    { address: batchPoster, privateKey: batchPosterPrivateKey },
    { address: staker, privateKey: stakerPrivateKey },
  ]

  for (const wallet of wallets) {
    if (wallet.address.toLowerCase() === targetAddress.toLowerCase()) {
      console.log(`Skipping ${wallet.address} as it's the refund target`)
      continue
    }

    const signer = new ethers.Wallet(wallet.privateKey).connect(provider)
    const balance = await provider.getBalance(wallet.address)

    if (balance.gt(0)) {
      const gasPrice = await provider.getGasPrice()

      try {
        const estimatedGas = await provider.estimateGas({
          to: targetAddress,
          from: wallet.address,
          value: balance,
        })

        const gasLimit = estimatedGas.mul(120).div(100)

        const txCost = gasPrice.mul(gasLimit)

        if (balance.gt(txCost)) {
          const amountToSend = balance.sub(txCost)
          const tx = await signer.sendTransaction({
            to: targetAddress,
            value: amountToSend,
            gasLimit: gasLimit,
            gasPrice: gasPrice,
          })
          console.log(
            `Refunding ${ethers.utils.formatEther(amountToSend)} ETH from ${
              wallet.address
            } to ${targetAddress}`
          )
          await tx.wait()
          console.log(`Transaction confirmed: ${tx.hash}`)
        } else {
          console.log(
            `Insufficient balance in ${wallet.address} to cover transaction costs`
          )
        }
      } catch (error: any) {
        console.error(`Error processing refund from ${wallet.address}:`, error)
        if (error.error && error.error.message) {
          console.error('Error message:', error.error.message)
        }
      }
    } else {
      console.log(`No balance to refund from ${wallet.address}`)
    }
  }
}

async function main() {
  const targetAddress = process.env.TARGET_ADDRESS
  if (!targetAddress) {
    throw new Error('TARGET_ADDRESS environment variable not set')
  }
  await refundWallets(targetAddress)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
