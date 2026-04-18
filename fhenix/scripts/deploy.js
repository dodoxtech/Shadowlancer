const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // In production the relayer is a trusted Fhenix oracle address.
  // For testnet demos, set RELAYER_ADDRESS in .env or deployer is used.
  const relayerAddress = process.env.RELAYER_ADDRESS || deployer.address;
  console.log("Relayer address:", relayerAddress);

  const Market = await ethers.getContractFactory("PrivateBidMarket");
  const market = await Market.deploy(relayerAddress);
  await market.waitForDeployment();

  const address = await market.getAddress();
  console.log("PrivateBidMarket deployed to:", address);
  console.log("Network:", (await ethers.provider.getNetwork()).name);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
