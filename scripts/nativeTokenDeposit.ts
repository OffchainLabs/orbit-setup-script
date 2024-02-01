import { ethers } from 'ethers'
import { ERC20__factory } from '@arbitrum/sdk/dist/lib/abi/factories/ERC20__factory'
import fs from 'fs'

async function sendEthOrDepositERC20(
  erc20Inbox: ethers.Contract,
  l2Signer: ethers.Wallet
) {
  const configRaw = fs.readFileSync(
    './config/orbitSetupScriptConfig.json',
    'utf-8'
  )
  const config = JSON.parse(configRaw)
  const nativeToken = config.nativeToken
  if (nativeToken === ethers.constants.AddressZero) {
    // Send 0.4 ETH if nativeToken is zero address
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
    const tx = await contract.depositEth({
      value: ethers.utils.parseEther('0.4'),
    })
    console.log('Transaction hash on parent chain: ', tx.hash)
    await tx.wait()
    console.log('0.4 ETHs are deposited to your account')
  } else {
    const nativeTokenContract = ERC20__factory.connect(nativeToken, l2Signer)

    console.log('Approving native token for deposit through inbox')
    const approveTx = await nativeTokenContract.approve(
      erc20Inbox.address,
      ethers.constants.MaxUint256
    )
    const approveTxReceipt = await approveTx.wait()
    console.log(
      'Transaction hash for approval: ',
      approveTxReceipt.transactionHash
    )

    // Call depositERC20 with 2 tokens if nativeToken is not zero address.
    const decimals = await nativeTokenContract.decimals()
    if (decimals !== 18) {
      throw new Error('We currently only support 18 decimals token')
    }
    const amount = ethers.utils.parseUnits('0.4', decimals)
    const tx = await erc20Inbox.depositERC20(amount)
    console.log('Transaction hash for depositERC20: ', tx.hash)
    await tx.wait()
    console.log('Native Token has been Deposited')
  }
}

export async function ethOrERC20Deposit(
  privateKey: string,
  L2_RPC_URL: string
) {
  if (!privateKey || !L2_RPC_URL) {
    throw new Error('Required environment variable not found')
  }

  const l2Provider = new ethers.providers.JsonRpcProvider(L2_RPC_URL)
  const l2Signer = new ethers.Wallet(privateKey).connect(l2Provider)

  const configRaw = fs.readFileSync(
    './config/orbitSetupScriptConfig.json',
    'utf-8'
  )
  const config = JSON.parse(configRaw)
  const ERC20InboxAddress = config.inbox

  const erc20Inbox = new ethers.Contract(
    ERC20InboxAddress,
    ['function depositERC20(uint256) public returns (uint256)'],
    l2Signer
  )

  await sendEthOrDepositERC20(erc20Inbox, l2Signer)
}
