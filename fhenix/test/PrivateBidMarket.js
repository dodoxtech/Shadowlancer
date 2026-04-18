const { expect } = require("chai");
const { ethers } = require("hardhat");

const TASK_MANAGER_ADDRESS = "0xeA30c4B8b44078Bbf8a6ef5b9f1eC1626C7848D9";

// Helper: build a dummy InEuint32 input (mock ignores content, just increments counter)
function inEuint32(value = 0) {
  return {
    ctHash: BigInt(value),
    securityZone: 0,
    utype: 4,
    signature: "0x",
  };
}

async function deployMock() {
  const Mock = await ethers.getContractFactory("MockTaskManager");
  const mock = await Mock.deploy();
  await mock.waitForDeployment();
  const code = await ethers.provider.getCode(await mock.getAddress());
  await ethers.provider.send("hardhat_setCode", [TASK_MANAGER_ADDRESS, code]);
}

describe("PrivateBidMarket", function () {
  let market;
  let client, bidderA, bidderB, bidderC, relayer;
  const DEADLINE_FUTURE = Math.floor(Date.now() / 1000) + 86400; // +1 day

  before(async function () {
    await deployMock();
  });

  beforeEach(async function () {
    [client, bidderA, bidderB, bidderC, relayer] = await ethers.getSigners();
    const Market = await ethers.getContractFactory("PrivateBidMarket");
    market = await Market.deploy(relayer.address);
    await market.waitForDeployment();
  });

  // -------------------------------------------------------------------------
  // createJob
  // -------------------------------------------------------------------------

  describe("createJob", function () {
    it("creates a job and emits JobCreated", async function () {
      const tx = await market
        .connect(client)
        .createJob("Build landing page", "Details...", DEADLINE_FUTURE, inEuint32(700));

      const receipt = await tx.wait();
      const event = receipt.logs.find(
        (l) => l.fragment && l.fragment.name === "JobCreated"
      );

      expect(event).to.not.be.undefined;
      const jobId = event.args.jobId;
      console.log("  jobId:", jobId.toString());

      const job = await market.jobs(jobId);
      expect(job.client).to.equal(client.address);
      expect(job.status).to.equal(0); // Open
      expect(job.bidCount).to.equal(0);
    });
  });

  // -------------------------------------------------------------------------
  // submitBid
  // -------------------------------------------------------------------------

  describe("submitBid", function () {
    let jobId;

    beforeEach(async function () {
      const tx = await market
        .connect(client)
        .createJob("Build app", "Desc", DEADLINE_FUTURE, inEuint32(700));
      const receipt = await tx.wait();
      jobId = receipt.logs.find((l) => l.fragment?.name === "JobCreated").args.jobId;
    });

    it("accepts encrypted bids from multiple freelancers", async function () {
      await market.connect(bidderA).submitBid(jobId, inEuint32(400));
      await market.connect(bidderB).submitBid(jobId, inEuint32(450));
      await market.connect(bidderC).submitBid(jobId, inEuint32(600));

      expect(await market.getBidCount(jobId)).to.equal(3);
      console.log("  3 encrypted bids submitted — no amounts visible on-chain");
    });

    it("rejects duplicate bid from same address", async function () {
      await market.connect(bidderA).submitBid(jobId, inEuint32(400));
      await expect(
        market.connect(bidderA).submitBid(jobId, inEuint32(300))
      ).to.be.revertedWithCustomError(market, "AlreadyBid");
    });
  });

  // -------------------------------------------------------------------------
  // closeBidding
  // -------------------------------------------------------------------------

  describe("closeBidding", function () {
    let jobId;

    beforeEach(async function () {
      const tx = await market
        .connect(client)
        .createJob("Build app", "Desc", DEADLINE_FUTURE, inEuint32(700));
      const receipt = await tx.wait();
      jobId = receipt.logs.find((l) => l.fragment?.name === "JobCreated").args.jobId;

      await market.connect(bidderA).submitBid(jobId, inEuint32(400));
      await market.connect(bidderB).submitBid(jobId, inEuint32(450));
      await market.connect(bidderC).submitBid(jobId, inEuint32(600));
    });

    it("moves status to Evaluating and creates isWinner handles", async function () {
      await market.connect(client).closeBidding(jobId);

      expect(await market.getJobStatus(jobId)).to.equal(1); // Evaluating
      expect(await market.getIsWinnerHandleCount(jobId)).to.equal(3);

      const h0 = await market.getIsWinnerHandle(jobId, 0);
      const h1 = await market.getIsWinnerHandle(jobId, 1);
      const h2 = await market.getIsWinnerHandle(jobId, 2);
      console.log("  isWinner handles:", h0, h1, h2);
      console.log("  (FHE eq results — Fhenix nodes will decrypt these off-chain)");
    });

    it("reverts if called by non-client", async function () {
      await expect(
        market.connect(bidderA).closeBidding(jobId)
      ).to.be.revertedWithCustomError(market, "NotClient");
    });

    it("reverts if no bids", async function () {
      const tx2 = await market
        .connect(client)
        .createJob("Empty job", "Desc", DEADLINE_FUTURE, inEuint32(700));
      const r2 = await tx2.wait();
      const emptyJobId = r2.logs.find((l) => l.fragment?.name === "JobCreated").args.jobId;

      await expect(
        market.connect(client).closeBidding(emptyJobId)
      ).to.be.revertedWithCustomError(market, "NoBidsSubmitted");
    });
  });

  // -------------------------------------------------------------------------
  // Full flow: publishWinner
  // -------------------------------------------------------------------------

  describe("Full flow — winner selection", function () {
    let jobId;

    beforeEach(async function () {
      const tx = await market
        .connect(client)
        .createJob("Build app", "Desc", DEADLINE_FUTURE, inEuint32(700));
      const receipt = await tx.wait();
      jobId = receipt.logs.find((l) => l.fragment?.name === "JobCreated").args.jobId;

      await market.connect(bidderA).submitBid(jobId, inEuint32(400)); // index 0 — lowest
      await market.connect(bidderB).submitBid(jobId, inEuint32(450)); // index 1
      await market.connect(bidderC).submitBid(jobId, inEuint32(600)); // index 2

      await market.connect(client).closeBidding(jobId);
    });

    it("settles with bidderA as winner (index 0 wins)", async function () {
      // Read handles the Fhenix network would decrypt
      const handles = await Promise.all([
        market.getIsWinnerHandle(jobId, 0),
        market.getIsWinnerHandle(jobId, 1),
        market.getIsWinnerHandle(jobId, 2),
      ]);

      const ctHashes = handles.map((h) => BigInt(h));
      const results  = [1n, 0n, 0n]; // simulate: bidderA wins
      const sigs     = ["0x", "0x", "0x"]; // mock accepts anything

      const tx = await market
        .connect(relayer)
        .publishWinner(jobId, ctHashes, results, sigs);
      await tx.wait();

      expect(await market.getJobStatus(jobId)).to.equal(2); // Settled
      expect(await market.getWinner(jobId)).to.equal(bidderA.address);
      console.log("  Winner:", await market.getWinner(jobId));
      console.log("  Bid amounts 400, 450, 600 remain encrypted — never revealed");
    });

    it("settles with bidderB as winner (index 1 wins)", async function () {
      const handles = await Promise.all([
        market.getIsWinnerHandle(jobId, 0),
        market.getIsWinnerHandle(jobId, 1),
        market.getIsWinnerHandle(jobId, 2),
      ]);

      const ctHashes = handles.map((h) => BigInt(h));
      await market
        .connect(relayer)
        .publishWinner(jobId, ctHashes, [0n, 1n, 0n], ["0x", "0x", "0x"]);

      expect(await market.getWinner(jobId)).to.equal(bidderB.address);
    });

    it("emits NoBidsWithinBudget when all results are 0", async function () {
      const handles = await Promise.all([
        market.getIsWinnerHandle(jobId, 0),
        market.getIsWinnerHandle(jobId, 1),
        market.getIsWinnerHandle(jobId, 2),
      ]);

      const ctHashes = handles.map((h) => BigInt(h));
      const tx = await market
        .connect(relayer)
        .publishWinner(jobId, ctHashes, [0n, 0n, 0n], ["0x", "0x", "0x"]);
      const receipt = await tx.wait();

      const event = receipt.logs.find(
        (l) => l.fragment?.name === "NoBidsWithinBudget"
      );
      expect(event).to.not.be.undefined;
      expect(await market.getJobStatus(jobId)).to.equal(3); // NoBids
      expect(await market.getWinner(jobId)).to.equal(ethers.ZeroAddress);
      console.log("  All bids exceeded budget — no winner, no amounts revealed");
    });

    it("reverts if non-relayer calls publishWinner", async function () {
      const handles = await Promise.all([
        market.getIsWinnerHandle(jobId, 0),
        market.getIsWinnerHandle(jobId, 1),
        market.getIsWinnerHandle(jobId, 2),
      ]);
      const ctHashes = handles.map((h) => BigInt(h));

      await expect(
        market
          .connect(bidderA)
          .publishWinner(jobId, ctHashes, [1n, 0n, 0n], ["0x", "0x", "0x"])
      ).to.be.revertedWithCustomError(market, "NotRelayer");
    });

    it("reverts if ctHash does not match stored handle", async function () {
      const handles = await Promise.all([
        market.getIsWinnerHandle(jobId, 0),
        market.getIsWinnerHandle(jobId, 1),
        market.getIsWinnerHandle(jobId, 2),
      ]);

      // Tamper with first hash
      const tampered = [BigInt(handles[0]) + 999n, BigInt(handles[1]), BigInt(handles[2])];
      await expect(
        market
          .connect(relayer)
          .publishWinner(jobId, tampered, [1n, 0n, 0n], ["0x", "0x", "0x"])
      ).to.be.revertedWithCustomError(market, "InvalidDecryptData");
    });
  });
});
