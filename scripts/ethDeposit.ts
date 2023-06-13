import {ethers} from 'ethers';
import fs from 'fs';


// Read the environment variables
const privateKey = process.argv[2];
const L2_RPC_URL = process.argv[3];
const L3_RPC_URL = process.argv[4];

if (!privateKey || !L2_RPC_URL || !L3_RPC_URL) {
    throw new Error('Required environment variable not found');
}

// Generating providers from RPCs
const l2Provider = new ethers.providers.JsonRpcProvider(L2_RPC_URL);

// Creating the wallet and signer
const l2Signer = new ethers.Wallet(privateKey).connect(l2Provider);

// Read the JSON configuration
const configRaw = fs.readFileSync('./config/orbitSetupScriptConfig.json', 'utf-8');
const config = JSON.parse(configRaw);
const inboxAddress = config.inboxAddress;
const depositEthInterface = new ethers.utils.Interface([
  "function depositEth() public payable"
]);

async function main() {
  // create contract instance
  const contract = new ethers.Contract(inboxAddress, depositEthInterface, l2Signer);

  // deposit 0.4 ETH
  const tx = await contract.depositEth({
      value: ethers.utils.parseEther('0.4')
  });

  console.log('Transaction hash on Arbitrum Goerli: ', tx.hash);
  await tx.wait();
  console.log('Transaction has been mined');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
