const { ethers } = require("hardhat");

// Fill this after deployment
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "";

// Helper: build a dummy InEuint32 (real use: encrypt client-side with Fhenix SDK)
function inEuint32(value = 0) {
  return {
    ctHash: BigInt(value),
    securityZone: 0,
    utype: 4,
    signature: "0x",
  };
}

async function main() {
  if (!CONTRACT_ADDRESS) {
    console.error("Set CONTRACT_ADDRESS env var to the deployed contract address");
    process.exit(1);
  }

  const [client, bidderA, bidderB, bidderC] = await ethers.getSigners();
  console.log("Client wallet:", client.address);

  const Market = await ethers.getContractFactory("PrivateBidMarket");
  const market = Market.attach(CONTRACT_ADDRESS);

  const deadline = Math.floor(Date.now() / 1000) + 3600; // +1 hour

  // ── Step 1: Create job ───────────────────────────────────────────────────
  console.log("\n[1] Creating job with encrypted max budget...");
  const createTx = await market
    .connect(client)
    .createJob("Build landing page", "React + Tailwind", deadline, inEuint32(500));
  const createReceipt = await createTx.wait();
  const jobId = createReceipt.logs.find(
    (l) => l.fragment?.name === "JobCreated"
  ).args.jobId;
  console.log("    Job created. ID:", jobId.toString());

  // ── Step 2: Submit 3 encrypted bids ─────────────────────────────────────
  console.log("\n[2] Submitting encrypted bids...");
  await (await market.connect(bidderA).submitBid(jobId, inEuint32(400))).wait();
  console.log("    BidderA submitted Enc(400)");
  await (await market.connect(bidderB).submitBid(jobId, inEuint32(450))).wait();
  console.log("    BidderB submitted Enc(450)");
  await (await market.connect(bidderC).submitBid(jobId, inEuint32(600))).wait();
  console.log("    BidderC submitted Enc(600)");
  console.log("    On-chain: 3 handles — no amounts visible");

  // ── Step 3: Close bidding ────────────────────────────────────────────────
  console.log("\n[3] Closing bidding — FHE selection starts...");
  await (await market.connect(client).closeBidding(jobId)).wait();
  console.log("    Status: Evaluating");
  console.log("    FHE computed encrypted minimum, created isWinner handles");
  console.log("    Waiting for Fhenix network to decrypt isWinner handles...");

  // ── Step 4: Read isWinner handles ───────────────────────────────────────
  const handles = await Promise.all([
    market.getIsWinnerHandle(jobId, 0),
    market.getIsWinnerHandle(jobId, 1),
    market.getIsWinnerHandle(jobId, 2),
  ]);
  console.log("\n    isWinner handles (Fhenix will decrypt these):");
  handles.forEach((h, i) => console.log(`      [${i}]: ${h}`));

  console.log("\n--- In production: Fhenix oracle decrypts handles and calls publishWinner ---");
  console.log("View on Etherscan: https://sepolia.etherscan.io/address/" + CONTRACT_ADDRESS);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
