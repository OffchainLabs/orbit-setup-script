import {ethers} from 'ethers';
import fs from 'fs';
require('dotenv').config();


const privateKey = process.env.PRIVATE_KEY;
const L2_RPC_URL = process.env.L2_RPC_URL;
const L3_RPC_URL = process.env.L3_RPC_URL;

if (!privateKey || !L2_RPC_URL || !L3_RPC_URL) {
    throw new Error('Required environment variable not found');
}

// Generating providers from RPCs
const l2Provider = new ethers.providers.JsonRpcProvider(L2_RPC_URL);
const l3Provider = new ethers.providers.JsonRpcProvider(L3_RPC_URL);

// Creating the wallet and signer
const l2Signer = new ethers.Wallet(privateKey).connect(l2Provider);

// Read the JSON configuration
const configRaw = fs.readFileSync('./config/config.json', 'utf-8');
const config = JSON.parse(configRaw);
const inboxAddress = config.inboxAddress;
const inboxABI = require('../contracts/factories/Inbox__factory').Inbox__factory.abi;

// Set the amount to be deposited in L2 (in wei)
const ethToL2DepositAmount = ethers.utils.parseEther('0.01');

const main = async () => {
    // Create instance of the Inbox contract
    const inboxContract = new ethers.Contract("0x350781eD2997583e6E298F4630D8d975bB46Ea2B", inboxABI, l2Signer);

    // Define transaction options
    const txOptions = {
      value: ethToL2DepositAmount, // Include the deposit amount in the transaction
    };
    console.log(inboxContract.depositEth);
    // Call the depositEth function
    const depositTx = await inboxContract.functions.depositEth(txOptions);

    // Wait for the transaction to be mined
    const receipt = await depositTx.wait();

    // Log the transaction receipt
    console.log(`Transaction mined! ${receipt.transactionHash}`);
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
