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

// Creating the wallet and signer
const l2Signer = new ethers.Wallet(privateKey).connect(l2Provider);

// Read the JSON configuration
const configRaw = fs.readFileSync('./config/l3Config.json', 'utf-8');
const config = JSON.parse(configRaw);
const inboxAddress = config.inboxAddress;
const depositEthInterface = new ethers.utils.Interface([
  "function depositEth() public payable"
]);

async function main() {
  // create contract instance
  const contract = new ethers.Contract(inboxAddress, depositEthInterface, l2Signer);

  // deposit 0.01 ETH
  const tx = await contract.depositEth({
      value: ethers.utils.parseEther('0.01')
  });

  console.log('Transaction hash: ', tx.hash);
  await tx.wait();
  console.log('Transaction has been mined');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
