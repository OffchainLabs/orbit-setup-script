import { ethers } from 'ethers'
import { L3Config } from './l3ConfigType'
import fs from 'fs'
import { ethDeposit } from './ethDeposit'
import { l3Configuration } from './l3Configuration'
import { tokenBridgeDeployment } from './tokenBridgeDeployment'
import { defaultRunTimeState, RuntimeState } from './runTimeState'

// Delay function
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function checkRuntimeStateIntegrity(rs: RuntimeState) {
  if (!rs.l3) {
    rs.l3 = defaultRunTimeState.l3
  }
  if (!rs.l2) {
    rs.l2 = defaultRunTimeState.l2
  }
  if (!rs.etherSent) {
    rs.etherSent = defaultRunTimeState.etherSent
  }
  if (!rs.initializedState) {
    rs.initializedState = defaultRunTimeState.initializedState
  }
}

async function main() {
  // Read the environment variables
  const privateKey = process.env.PRIVATE_KEY
  const L2_RPC_URL = process.env.L2_RPC_URL
  const L3_RPC_URL = process.env.L3_RPC_URL

  if (!privateKey || !L2_RPC_URL || !L3_RPC_URL) {
    throw new Error('Required environment variable not found')
  }

  // Read the JSON configuration
  const configRaw = fs.readFileSync(
    './config/orbitSetupScriptConfig.json',
    'utf-8'
  )
  const config: L3Config = JSON.parse(configRaw)
  let rs: RuntimeState
  if (fs.existsSync('./config/resumeState.json')) {
    const stateRaw = fs.readFileSync('./config/resumeState.json', 'utf-8')
    rs = JSON.parse(stateRaw)
    //check integrity
    checkRuntimeStateIntegrity(rs)
    console.log(
      'resumeState file found, will restart from where it failed last time.'
    )
  } else {
    rs = defaultRunTimeState
  }

  // Generating providers from RPCs
  const L2Provider = new ethers.providers.JsonRpcProvider(L2_RPC_URL)
  const L3Provider = new ethers.providers.JsonRpcProvider(L3_RPC_URL)

  // Checking if the L2 network is the expected parent chain
  if ((await L2Provider.getNetwork()).chainId !== config.parentChainId) {
    throw new Error(
      'The L2 RPC URL you have provided is not for the correct parent chain'
    )
  }

  // Creating the signer
  const signer = new ethers.Wallet(privateKey).connect(L2Provider)

  try {
    ////////////////////////////////////////////////
    /// Funding batch-poster and staker address ///
    //////////////////////////////////////////////
    if (!rs.etherSent.batchPoster) {
      console.log('Funding batch-poster accounts on parent chain with 0.3 ETH')
      const tx1 = await signer.sendTransaction({
        to: config.batchPoster,
        value: ethers.utils.parseEther('0.3'),
      })
      console.log(`Transaction hash on parent chain: ${tx1.hash}`)
      const receipt1 = await tx1.wait()
      console.log(
        `Transaction was mined in block ${receipt1.blockNumber} on parent chain`
      )
      rs.etherSent.batchPoster = true
    }

    if (!rs.etherSent.staker) {
      console.log('Funding staker accounts on parent chain with 0.3 ETH')
      const tx2 = await signer.sendTransaction({
        to: config.staker,
        value: ethers.utils.parseEther('0.3'),
      })
      console.log(`Transaction hash on parent chain: ${tx2.hash}`)
      const receipt2 = await tx2.wait()
      console.log(
        `Transaction was mined in block ${receipt2.blockNumber} on parent chain`
      )
      rs.etherSent.staker = true
    }

    if (!rs.etherSent.deposit) {
      ////////////////////////////////
      /// ETH deposit to L3 /////////
      //////////////////////////////
      console.log(
        'Running ethDeposit Script to Deposit ETH from parent chain to your account on Orbit chain ... 💰💰💰💰💰💰'
      )
      const oldBalance = await L3Provider.getBalance(config.chainOwner)
      await ethDeposit(privateKey, L2_RPC_URL, L3_RPC_URL)
      let depositCheckTime = 0

      // Waiting for 30 secs to be sure that ETH deposited is received on L3
      // Repeatedly check the balance until it changes by 1 Ether
      while (true) {
        depositCheckTime++
        const newBalance = await L3Provider.getBalance(config.chainOwner)
        if (newBalance.sub(oldBalance).gte(ethers.utils.parseEther('0.4'))) {
          console.log(
            'Balance of your account on Orbit chain increased by 0.4 Ether.'
          )
          break
        }
        let tooLongNotification = ''
        if (depositCheckTime >= 6) {
          tooLongNotification =
            "(It is taking a long time. Did you change the config files? If you did, you will need to delete ./config/My Arbitrum L3 Chain, since this chain data is for your last config file. If you didn't change the file, please ignore this message.)"
        }
        console.log(
          `Balance not changed yet. Waiting for another 30 seconds ⏰⏰⏰⏰⏰⏰ ${tooLongNotification}`
        )
        await delay(30 * 1000)
      }
      rs.etherSent.deposit = true
    }

    ////////////////////////////////
    /// Token Bridge Deployment ///
    //////////////////////////////
    console.log(
      'Running tokenBridgeDeployment script to deploy token bridge contracts on parent chain and your Orbit chain 🌉🌉🌉🌉🌉'
    )
    await tokenBridgeDeployment(privateKey, L2_RPC_URL, L3_RPC_URL, rs)

    ////////////////////////////////
    /// L3 Chain Configuration ///
    //////////////////////////////
    console.log(
      'Running l3Configuration script to configure your Orbit chain 📝📝📝📝📝'
    )
    await l3Configuration(privateKey, L2_RPC_URL, L3_RPC_URL)
  } catch (error) {
    console.error('Error occurred:', error)
    const runtimeString = JSON.stringify(rs)
    fs.writeFileSync('./config/resumeState.json', runtimeString)
    console.log(
      "Seems something went wrong during this process, but don't worry, we have recorded the deployed and initialized contracts into ./config/resumeState.json, next time you rerun the script, it will restart from where it failed "
    )
  }
}

// Run the script
main().catch(error => {
  console.error(error)
  process.exit(1)
})
