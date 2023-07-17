#!/bin/bash

# Read sequencerInbox address from the JSON file
SEQUENCER_INBOX_ADDRESS=$(jq -r '.sequencerInbox' /home/user/.arbitrum/orbitSetupScriptConfig.json)

# Check if the "data-availability" key exists
if jq -e '.node | has("data-availability")' /home/user/.arbitrum/nodeConfig.json >/dev/null; then
    # Start daserver with the new command
    /usr/local/bin/daserver --data-availability.parent-chain-node-url https://goerli-rollup.arbitrum.io/rpc --enable-rpc --rpc-addr '0.0.0.0' --enable-rest --rest-addr '0.0.0.0' --log-level 3 --data-availability.local-db-storage.enable --data-availability.local-db-storage.data-dir /home/user/data/badgerdb --data-availability.local-db-storage.discard-after-timeout --data-availability.key.key-dir /home/user/.arbitrum/keys --data-availability.local-cache.enable --data-availability.sequencer-inbox-address $SEQUENCER_INBOX_ADDRESS
else
    # Log a message and exit if "data-availability" key doesn't exist
    echo "You're running in Rollup mode. No need for das-server, so exiting the container ..."
    exit
fi
