require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x" + "0".repeat(64);
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";
const ARBITRUM_RPC_URL = process.env.ARBITRUM_RPC_URL || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "cancun",
    },
  },
  networks: {
    hardhat: {},
    // Fhenix Nitrogen testnet — FHE operations work here
    fhenixNitrogen: {
      url: "https://api.nitrogen.fhenix.zone",
      accounts: PRIVATE_KEY !== "0x" + "0".repeat(64) ? [PRIVATE_KEY] : [],
      chainId: 8008148,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: PRIVATE_KEY !== "0x" + "0".repeat(64) ? [PRIVATE_KEY] : [],
      chainId: 11155111,
    },
    arbitrumSepolia: {
      url: ARBITRUM_RPC_URL,
      accounts: PRIVATE_KEY !== "0x" + "0".repeat(64) ? [PRIVATE_KEY] : [],
      chainId: 421614,
    },
  },
};
