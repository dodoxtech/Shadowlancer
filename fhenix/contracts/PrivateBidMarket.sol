// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@fhenixprotocol/cofhe-contracts/FHE.sol";
import {InEuint32} from "@fhenixprotocol/cofhe-contracts/ICofhe.sol";

contract PrivateBidMarket {

    // -------------------------------------------------------------------------
    // Types
    // -------------------------------------------------------------------------

    enum JobStatus { Open, Evaluating, Settled, NoBids }

    struct Bid {
        address bidder;
        euint32 encryptedPrice;
    }

    struct Job {
        uint256   id;
        address   client;
        string    title;
        string    description;
        uint256   biddingDeadline;
        euint32   encryptedMaxBudget;  // encrypted — nobody knows the value
        JobStatus status;
        address   winner;              // revealed only after settlement
        euint32   encryptedMin;        // encrypted winning bid
        uint256   bidCount;
    }

    // -------------------------------------------------------------------------
    // State
    // -------------------------------------------------------------------------

    uint256 private _jobCounter;
    address public relayer;

    mapping(uint256 => Job)                         public  jobs;
    mapping(uint256 => Bid[])                       private _bids;
    mapping(uint256 => mapping(address => bool))    private _hasBid;
    mapping(uint256 => ebool[])                     private _isWinnerHandles;

    // -------------------------------------------------------------------------
    // Events
    // -------------------------------------------------------------------------

    event JobCreated(uint256 indexed jobId, address indexed client);
    event BidSubmitted(uint256 indexed jobId, address indexed bidder);
    event BiddingClosed(uint256 indexed jobId, uint256 bidCount);
    event WinnerSelected(uint256 indexed jobId, address indexed winner);
    event NoBidsWithinBudget(uint256 indexed jobId);

    // -------------------------------------------------------------------------
    // Errors
    // -------------------------------------------------------------------------

    error NotClient();
    error NotRelayer();
    error JobNotOpen();
    error JobNotEvaluating();
    error AlreadyBid();
    error NoBidsSubmitted();
    error InvalidDecryptData();

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(address _relayer) {
        relayer = _relayer;
    }

    // -------------------------------------------------------------------------
    // Modifiers
    // -------------------------------------------------------------------------

    modifier onlyClient(uint256 jobId) {
        if (jobs[jobId].client != msg.sender) revert NotClient();
        _;
    }

    modifier onlyRelayer() {
        if (msg.sender != relayer) revert NotRelayer();
        _;
    }

    // -------------------------------------------------------------------------
    // Step 1 — Client creates a job with encrypted max budget
    // -------------------------------------------------------------------------

    function createJob(
        string    calldata title,
        string    calldata description,
        uint256            biddingDeadline,
        InEuint32 calldata encryptedMaxBudget
    ) external returns (uint256 jobId) {
        jobId = ++_jobCounter;

        // Verify & store the encrypted budget — value stays hidden
        euint32 maxBudget = FHE.asEuint32(encryptedMaxBudget);
        FHE.allowThis(maxBudget);

        jobs[jobId] = Job({
            id:                 jobId,
            client:             msg.sender,
            title:              title,
            description:        description,
            biddingDeadline:    biddingDeadline,
            encryptedMaxBudget: maxBudget,
            status:             JobStatus.Open,
            winner:             address(0),
            encryptedMin:       euint32.wrap(0),
            bidCount:           0
        });

        emit JobCreated(jobId, msg.sender);
    }

    // -------------------------------------------------------------------------
    // Step 2 — Freelancer submits an encrypted bid
    // -------------------------------------------------------------------------

    function submitBid(uint256 jobId, InEuint32 calldata encryptedPrice) external {
        Job storage job = jobs[jobId];

        if (job.status != JobStatus.Open) revert JobNotOpen();
        if (_hasBid[jobId][msg.sender])   revert AlreadyBid();

        // Verify & store encrypted bid — amount is never revealed on-chain
        euint32 price = FHE.asEuint32(encryptedPrice);
        FHE.allowThis(price);
        FHE.allowSender(price);   // bidder retains access to their own ciphertext

        _bids[jobId].push(Bid({ bidder: msg.sender, encryptedPrice: price }));
        _hasBid[jobId][msg.sender] = true;
        job.bidCount++;

        emit BidSubmitted(jobId, msg.sender);
    }

    // -------------------------------------------------------------------------
    // Step 3 — Client closes bidding, triggers FHE selection
    // -------------------------------------------------------------------------

    function closeBidding(uint256 jobId) external onlyClient(jobId) {
        Job storage job = jobs[jobId];

        if (job.status != JobStatus.Open) revert JobNotOpen();
        if (job.bidCount == 0)            revert NoBidsSubmitted();

        job.status = JobStatus.Evaluating;

        Bid[] storage bids = _bids[jobId];
        uint256 n = bids.length;

        // ------------------------------------------------------------------
        // Phase A: find encrypted minimum among bids within budget
        //
        // Start with Enc(MAX_UINT32) as the running minimum.
        // For each bid:
        //   isWithinBudget  = FHE.lte(bid, maxBudget)       → ebool
        //   isLower         = FHE.lt(bid, currentMin)        → ebool
        //   isValidAndLower = FHE.and(within, lower)         → ebool
        //   currentMin      = FHE.select(valid, bid, current) → euint32
        //
        // Nothing is decrypted — pure encrypted computation.
        // ------------------------------------------------------------------

        euint32 encryptedMin = FHE.asEuint32(type(uint32).max);
        FHE.allowThis(encryptedMin);

        for (uint256 i = 0; i < n; i++) {
            ebool isWithinBudget  = FHE.lte(bids[i].encryptedPrice, job.encryptedMaxBudget);
            ebool isLower         = FHE.lt(bids[i].encryptedPrice, encryptedMin);
            ebool isValidAndLower = FHE.and(isWithinBudget, isLower);

            encryptedMin = FHE.select(isValidAndLower, bids[i].encryptedPrice, encryptedMin);
            FHE.allowThis(encryptedMin);
        }

        job.encryptedMin = encryptedMin;

        // ------------------------------------------------------------------
        // Phase B: compute an isWinner ebool handle for each bidder
        //
        // FHE.eq(bid[i], encryptedMin) → ebool handle
        //
        // These handles are sent to Fhenix FHE nodes for async decryption.
        // Each handle reveals only true/false — not any bid amount.
        // ------------------------------------------------------------------

        for (uint256 i = 0; i < n; i++) {
            ebool isWinner = FHE.eq(bids[i].encryptedPrice, encryptedMin);
            FHE.allowThis(isWinner);
            _isWinnerHandles[jobId].push(isWinner);
        }

        emit BiddingClosed(jobId, n);
    }

    // -------------------------------------------------------------------------
    // Step 4 — Fhenix relayer posts decrypted results & confirms winner
    // -------------------------------------------------------------------------

    function publishWinner(
        uint256   jobId,
        uint256[] calldata ctHashes,   // ebool ciphertext hashes (one per bidder)
        uint256[] calldata results,    // decrypted values: 1 = winner, 0 = not winner
        bytes[]   calldata signatures  // Fhenix network signatures
    ) external onlyRelayer {
        Job storage job = jobs[jobId];

        if (job.status != JobStatus.Evaluating)   revert JobNotEvaluating();
        if (ctHashes.length != _bids[jobId].length) revert InvalidDecryptData();

        // Verify batch decrypt signatures from Fhenix network
        if (!Impl.verifyDecryptResultBatch(ctHashes, results, signatures)) {
            revert InvalidDecryptData();
        }

        // Match each ctHash to the stored handle and find first winner
        bool found = false;
        for (uint256 i = 0; i < _bids[jobId].length; i++) {
            uint256 storedHash = uint256(ebool.unwrap(_isWinnerHandles[jobId][i]));
            if (storedHash != ctHashes[i]) revert InvalidDecryptData();

            if (!found && results[i] == 1) {
                job.winner = _bids[jobId][i].bidder;
                job.status = JobStatus.Settled;
                found = true;
                emit WinnerSelected(jobId, _bids[jobId][i].bidder);
            }
        }

        if (!found) {
            job.status = JobStatus.NoBids;
            emit NoBidsWithinBudget(jobId);
        }
    }

    // -------------------------------------------------------------------------
    // Views
    // -------------------------------------------------------------------------

    function getWinner(uint256 jobId) external view returns (address) {
        return jobs[jobId].winner;
    }

    function getJobStatus(uint256 jobId) external view returns (JobStatus) {
        return jobs[jobId].status;
    }

    function getBidCount(uint256 jobId) external view returns (uint256) {
        return jobs[jobId].bidCount;
    }

    function getIsWinnerHandle(uint256 jobId, uint256 index) external view returns (ebool) {
        return _isWinnerHandles[jobId][index];
    }

    function getIsWinnerHandleCount(uint256 jobId) external view returns (uint256) {
        return _isWinnerHandles[jobId].length;
    }
}
