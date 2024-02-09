# orbit-setup-script

These scripts will help you fund newly generated batch-poster and validator addresses, configure an Orbit chain, and deploy bridge contracts on both L2 and L3 chains.

## Instructions

Once you’ve downloaded both config files from the [Orbit Deployment UI](https://orbit.arbitrum.io/), please follow the steps below to complete local deployment of your Orbit chain. For more details and step-by-step instructions, check out the [documentation](https://developer.arbitrum.io/launch-orbit-chain/orbit-quickstart).

1. Clone the https://github.com/OffchainLabs/orbit-setup-script repository, and run `yarn install`. Then, move both the `nodeConfig.json` and `orbitSetupScriptConfig.json` files into the `config` directory within the cloned repository
2. Launch Docker, and in the base directory, run `docker-compose up -d`. This will launch the node with a public RPC reachable at http://localhost:8449/  and a corresponding BlockScout explorer instance, viewable at http://localhost/
3. Then, add the private key for the wallet you used to deploy the rollup contracts earlier in the following command, and run it: `PRIVATE_KEY="0xYourPrivateKey" L2_RPC_URL="<https://sepolia-rollup.arbitrum.io/rpc>" L3_RPC_URL="http://localhost:8449" yarn run setup`
4. The Orbit chain is now up. You can find all information about the newly deployed chain in the `outputInfo.json` file which is created in the main directory of script folder
5. Optionally, to track logs, run the following command within the base directory: `docker-compose logs -f nitro`
