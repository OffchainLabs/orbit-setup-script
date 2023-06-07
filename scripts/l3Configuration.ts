import { ArbOwner__factory} from '../contracts/factories/ArbOwner__factory'
import {ethers} from 'ethers'
import dotenv from 'dotenv';
import { L3Config } from "./l3ConfigType";

dotenv.config();
import fs from 'fs';

async function main() {
    // Read the environment variables
    const privateKey = process.env.PRIVATE_KEY;
    const L2_RPC_URL = process.env.L2_RPC_URL;
    const L3_RPC_URL = process.env.L3_RPC_URL;

    if (!privateKey || !L2_RPC_URL || !L3_RPC_URL) {
        throw new Error('Required environment variable not found');
    }

    // Generating providers from RPCs
   const L2Provider = new ethers.providers.JsonRpcProvider(L2_RPC_URL);
   const L3Provider = new ethers.providers.JsonRpcProvider(L3_RPC_URL);

   // Creating the wallet and signer
    const signer = new ethers.Wallet(privateKey).connect(L3Provider);
    
    // Read the JSON configuration
    const configRaw = fs.readFileSync('./config/config.json', 'utf-8');
    const config: L3Config = JSON.parse(configRaw);
    
    // Reading params for L3 Configuration
    const minL2BaseFee = config.minL2BaseFee;
    const networkFeeReceiver= config.networkFeeReceiver;
    const infrastructureFeeCollector= config.infrastructureFeeCollector;
    const chainOwner= config.chainOwner;

    // Check if the Private Key provided is the chain owner:
    if (signer.address !== chainOwner) {
        throw new Error('The Private Key you have provided is not the chain owner');
    }

    // ArbOwner precompile setup 
    const arbOwnerABI = ArbOwner__factory.abi
    const arbOwnerAddress = "0x0000000000000000000000000000000000000070"
    const ArbOwner = new ethers.Contract(arbOwnerAddress, arbOwnerABI, signer);

    // Call the isChainOwner function and check the response
    const isSignerChainOwner = await ArbOwner.isChainOwner(signer.address);
    if (!isSignerChainOwner) {
        throw new Error('The address you have provided is not the chain owner');
    }
    
        // Set the network fee receiver
    console.log("Going to set the Minimum Base Fee for L3 chain")
    const tx = await ArbOwner.setMinimumL2BaseFee(minL2BaseFee);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    // Check the status of the transaction: 1 is successful, 0 is failure
    if (receipt.status === 0) {
        throw new Error('Transaction failed, could not set the Minimum base fee');
    }

    // Set the network fee receiver
    console.log("Going to set the  network fee receiver for L3 chain")
    const tx2 = await ArbOwner.setNetworkFeeAccount(networkFeeReceiver);

    // Wait for the transaction to be mined
    const receipt2 = await tx2.wait();

    // Check the status of the transaction: 1 is successful, 0 is failure
    if (receipt2.status === 0) {
        throw new Error('Setting network fee receiver transaction failed');
    }

        // Set the infrastructure fee collector
        console.log("Going to set the  Set the infrastructure fee collector address for L3 chain")
        const tx3 = await ArbOwner.setInfraFeeAccount(infrastructureFeeCollector);
    
        // Wait for the transaction to be mined
        const receipt3 = await tx3.wait();
    
        // Check the status of the transaction: 1 is successful, 0 is failure
        if (receipt3.status === 0) {
            throw new Error('Setting Set the infrastructure fee collector transaction failed');
        }
  }

  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });