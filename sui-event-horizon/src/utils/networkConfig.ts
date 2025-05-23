import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";
import { testnetEventPackageId } from "./constants";


const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
      variables: {
        eventPackageId: testnetEventPackageId,
      },
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        eventPackageId: testnetEventPackageId,
      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      variables: {
        eventPackageId: testnetEventPackageId
      },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };