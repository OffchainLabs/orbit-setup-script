import { ethers } from "ethers";
import { L3Config } from "./l3ConfigType";
import dotenv from 'dotenv';
import { execSync } from 'child_process';

dotenv.config();
import fs from 'fs';

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
   
    // Creating the signer
    const signer = new ethers.Wallet(privateKey).connect(L2Provider);
    
    ////////////////////////////////////////////////
    /// Funding batch-poster and staker address ///
    //////////////////////////////////////////////
    console.log("Funding batch-poster and staker addresses")
    const tx1 = await signer.sendTransaction({
        to: config.batchPoster,
        value: ethers.utils.parseEther("0.5")
    });

    console.log(`Transaction hash: ${tx1.hash}`);
    const receipt1 = await tx1.wait();
    console.log(`Transaction was mined in block ${receipt1.blockNumber}`);

    const tx2 = await signer.sendTransaction({
        to: config.staker,
        value: ethers.utils.parseEther("0.5")
    });

    console.log(`Transaction hash: ${tx2.hash}`);
    const receipt2 = await tx2.wait();
    console.log(`Transaction was mined in block ${receipt2.blockNumber}`);


    try {

    ////////////////////////////////
    /// ETH deposit to L3 /////////
    //////////////////////////////        
        console.log("Running ethDeposit.ts... 💰💰💰💰💰💰");
        execSync('ts-node scripts/ethDeposit.ts', { stdio: 'inherit' });
        // Waiting for 1 minute to be sure that ETH deposited is received on L3
        console.log("Waiting for 1 minute to be sure that ETH deposited is received on L3 ⏰⏰⏰⏰⏰⏰");
        await delay(60 * 1000);
    ////////////////////////////////
    /// Token Bridge Deployment ///
    //////////////////////////////
        console.log("Running tokenBridgeDeployment.ts...🌉🌉🌉🌉🌉");
        execSync('ts-node scripts/tokenBridgeDeployment.ts', { stdio: 'inherit' });
    
    ////////////////////////////////
    /// L3 Chain Configuration ///
    //////////////////////////////
        console.log("Running l3Configuration.ts...📝📝📝📝📝");
        execSync('ts-node scripts/l3Configuration.ts', { stdio: 'inherit' });
    } catch (error) {
        console.error('Error occurred:', error);
    }
    }

// Run the script
main().catch((error) => {
    console.error(error);
    process.exit(1);
});
