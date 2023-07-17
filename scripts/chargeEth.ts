import { ethers } from 'ethers'
import fs from 'fs'

// Delay function
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Read the JSON configuration
const configRaw = fs.readFileSync(
  './config/orbitSetupScriptConfig.json',
  'utf-8'
)
const config = JSON.parse(configRaw)
const inboxAddress = config.inbox
const depositEthInterface = new ethers.utils.Interface([
  'function depositEth() public payable',
])

async function main() {
  // Read the environment variables
  const privateKey = process.env.PRIVATE_KEY
  const L2_RPC_URL = process.env.L2_RPC_URL
  const L3_RPC_URL = process.env.L3_RPC_URL
  const amount = process.env.AMOUNT

  if (!privateKey || !L2_RPC_URL || !L3_RPC_URL || !amount) {
    throw new Error('Required environment variable not found')
  }

  // Generating providers from RPCs
  const l2Provider = new ethers.providers.JsonRpcProvider(L2_RPC_URL)
  const L3Provider = new ethers.providers.JsonRpcProvider(L3_RPC_URL)
  // Creating the wallet and signer
  const l2Signer = new ethers.Wallet(privateKey).connect(l2Provider)

  // create contract instance
  const contract = new ethers.Contract(
    inboxAddress,
    depositEthInterface,
    l2Signer
  )

  // deposit ETH to the appchain
  const tx = await contract.depositEth({
    value: ethers.utils.parseEther(amount),
  })

  // Getting the current balance on the appchain
  const oldBalance = await L3Provider.getBalance(config.chainOwner)

  console.log('Transaction hash on Arbitrum Goerli: ', tx.hash)
  await tx.wait()
  console.log('Transaction has been mined')

  // Checking to see if the funds are received on the appchain
  while (true) {
    const newBalance = await L3Provider.getBalance(config.chainOwner)
    if (newBalance.sub(oldBalance).gte(ethers.utils.parseEther(amount))) {
      console.log(
        `LFG! 🚀 Balance of your account on appchain increased by ${amount} Ether.`
      )
      break
    }
    console.log(
      'Balance not changed yet. Waiting for another 30 seconds to receive the funds on the appchain ⏰⏰⏰⏰⏰⏰'
    )
    await delay(30 * 1000)
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
