import { ethers } from "ethers";
import { L3Config } from "./l3ConfigType";
import { execSync } from 'child_process';
import fs from 'fs';
import { ethDeposit } from './ethDeposit'; 
import {l3Configuration } from './l3Configuration';
import {tokenBridgeDeployment} from './tokenBridgeDeployment'

// Delay function
function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

async function main() {
    // Read the environment variables
    const privateKey = process.env.PRIVATE_KEY;
    const L2_RPC_URL = process.env.L2_RPC_URL;
    const L3_RPC_URL = process.env.L3_RPC_URL;

    if (!privateKey || !L2_RPC_URL || !L3_RPC_URL) {
        throw new Error('Required environment variable not found');
    }

    // Read the JSON configuration
    const configRaw = fs.readFileSync('./config/orbitSetupScriptConfig.json', 'utf-8');
    const config: L3Config = JSON.parse(configRaw);

    // Generating providers from RPCs
    const L2Provider = new ethers.providers.JsonRpcProvider(L2_RPC_URL);
    const L3Provider = new ethers.providers.JsonRpcProvider(L3_RPC_URL);
   
    // Checking if the L2 network is Arb Goerli
    if (((await L2Provider.getNetwork()).chainId) !== 421613) {
        throw new Error('The L2 RPC URL you have provided is not for Arbitrum Goerli');
    }

    // Creating the signer
    const signer = new ethers.Wallet(privateKey).connect(L2Provider);
    
    ////////////////////////////////////////////////
    /// Funding batch-poster and staker address ///
    //////////////////////////////////////////////
    console.log("Funding batch-poster and staker accounts on Arbitrum Goerli each with 0.3 ETH")
    const tx1 = await signer.sendTransaction({
        to: config.batchPoster,
        value: ethers.utils.parseEther("0.3")
    });

    console.log(`Transaction hash on Arbitrum Goerli: ${tx1.hash}`);
    const receipt1 = await tx1.wait();
    console.log(`Transaction was mined in block ${receipt1.blockNumber} on Arbitrum Goerli`);

    const tx2 = await signer.sendTransaction({
        to: config.staker,
        value: ethers.utils.parseEther("0.3")
    });

    console.log(`Transaction hash on Arbitrum Goerli: ${tx2.hash}`);
    const receipt2 = await tx2.wait();
    console.log(`Transaction was mined in block ${receipt2.blockNumber} on Arbitrum Goerli`);


    try {
        ////////////////////////////////
        /// ETH deposit to L3 /////////
        //////////////////////////////        
        console.log("Running ethDeposit Script to Deposit ETH from Arbitrum Goerli to your account on appchain ... 💰💰💰💰💰💰");
        let oldBalance = await L3Provider.getBalance(config.chainOwner);
        await ethDeposit(privateKey, L2_RPC_URL, L3_RPC_URL);

        // Waiting for 30 secs to be sure that ETH deposited is received on L3
        // Repeatedly check the balance until it changes by 1 Ether
        while (true) {
            let newBalance = await L3Provider.getBalance(config.chainOwner);
            if (newBalance.sub(oldBalance).gte(ethers.utils.parseEther("0.4"))) {
                console.log("Balance of your account on appchain increased by 0.4 Ether.");
                break;
            }
            console.log("Balance not changed yet. Waiting for another 30 seconds ⏰⏰⏰⏰⏰⏰");
            await delay(30 * 1000);
        }

        ////////////////////////////////
        /// Token Bridge Deployment ///
        //////////////////////////////
        console.log("Running tokenBridgeDeployment script to deploy token bridge contracts on Arbitrum Goerli and your appchain 🌉🌉🌉🌉🌉");
        await tokenBridgeDeployment(privateKey, L2_RPC_URL, L3_RPC_URL);
    
        ////////////////////////////////
        /// L3 Chain Configuration ///
        //////////////////////////////
        console.log("Running l3Configuration script to configure your appchain 📝📝📝📝📝");
        await l3Configuration(privateKey, L2_RPC_URL, L3_RPC_URL);
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

// Run the script
main().catch((error) => {
    console.error(error);
    process.exit(1);
});
