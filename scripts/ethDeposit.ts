import { ethers } from 'ethers'
import fs from 'fs'

// Exporting the main function for use in other scripts
export async function ethDeposit(
  privateKey: string,
  L2_RPC_URL: string,
  L3_RPC_URL: string
) {
  if (!privateKey || !L2_RPC_URL || !L3_RPC_URL) {
    throw new Error('Required environment variable not found')
  }

  // Generating providers from RPCs
  const l2Provider = new ethers.providers.JsonRpcProvider(L2_RPC_URL)

  // Creating the wallet and signer
  const l2Signer = new ethers.Wallet(privateKey).connect(l2Provider)

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

  // create contract instance
  const contract = new ethers.Contract(
    inboxAddress,
    depositEthInterface,
    l2Signer
  )

  // deposit 0.4 ETH
  const tx = await contract.depositEth({
    value: ethers.utils.parseEther('0.4'),
  })

  console.log('Transaction hash on Arbitrum Goerli: ', tx.hash)
  await tx.wait()
  console.log('Transaction has been mined')
}
