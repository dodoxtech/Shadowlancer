# PrivateBidMarket — Contract Design
## Wave 1+2: Private Selection Logic

---

## 1. Goal

Demonstrate fully private sealed-bid selection on-chain using Fhenix CoFHE.

- Bid amounts are **always encrypted** — no one ever sees raw values on-chain
- Client sets an **encrypted max budget** — even the ceiling is private
- The system selects the **lowest bid that fits the budget** using FHE computation
- **Only the winner's address** is revealed — not the amount
- Losing bids are **permanently hidden**

---

## 2. Key Privacy Properties

| Data                  | Visible to whom?            |
|-----------------------|-----------------------------|
| Bid amounts           | Nobody (encrypted euint32)  |
| Max budget            | Nobody (encrypted euint32)  |
| Number of bids        | Public (count only)         |
| Winner address        | Public (by design)          |
| Winner's bid amount   | Hidden (still encrypted)    |
| Losing bid amounts    | Nobody, ever                |
| Whether a bid was over budget | Nobody, ever       |

---

## 3. Core FHE Operations Used

| Operation              | Purpose                                           |
|------------------------|---------------------------------------------------|
| `FHE.asEuint32(input)` | Convert client-encrypted value to on-chain type   |
| `FHE.lte(a, b)`        | Check bid ≤ maxBudget → returns `ebool`           |
| `FHE.lt(a, b)`         | Compare two encrypted bids → returns `ebool`      |
| `FHE.and(a, b)`        | Combine: within budget AND lower than current min |
| `FHE.select(c, a, b)`  | Pick lower valid bid, stay encrypted              |
| `FHE.eq(a, b)`         | Check if a bid equals the stored minimum          |
| `FHE.allowThis(v)`     | Let contract keep access to ciphertext            |
| `FHE.allowSender(v)`   | Let bidder access their own ciphertext            |
| `getDecryptResult(h)`  | Read async FHE decrypt result (ebool only)        |

---

## 4. Data Structures

```solidity
enum JobStatus {
    Open,        // accepting bids
    Evaluating,  // winner selection in progress
    Settled,     // winner confirmed
    NoBids       // no valid bid within budget
}

struct Bid {
    address bidder;
    euint32 encryptedPrice;   // FHE ciphertext handle
    bool    submitted;
}

struct Job {
    uint256   id;
    address   client;
    string    title;
    string    description;
    uint256   biddingDeadline;
    euint32   encryptedMaxBudget;  // ← NEW: client's private budget ceiling
    JobStatus status;
    address   winner;              // revealed after settlement
    euint32   encryptedMin;        // encrypted winning bid (for client seal-read)
    uint256   bidCount;
}
```

---

## 5. Functions

### 5.1 `createJob`

```
createJob(
    string    title,
    string    description,
    uint256   biddingDeadline,
    InEuint32 encryptedMaxBudget   ← NEW
) → returns jobId
```

- Client encrypts `maxBudget` locally before sending (e.g. `Enc(700)`)
- Contract stores as `euint32` — nobody on-chain can read the value
- `FHE.allowThis` is called so the contract can use it during selection
- Emits `JobCreated(jobId, client)`

---

### 5.2 `submitBid`

```
submitBid(uint256 jobId, InEuint32 encryptedPrice)
```

- Called by freelancer with a **client-side encrypted** bid
- `InEuint32` is the Fhenix input type: encrypted in the browser before sending
- Contract calls `FHE.asEuint32(encryptedPrice)` to verify and store
- Each address can only submit **one bid** per job
- Only allowed while `status == Open` and `block.timestamp < deadline`
- Calls `FHE.allowThis` to retain contract access
- Emits `BidSubmitted(jobId, bidder)` — amount is NOT emitted

---

### 5.3 `closeBidding`

```
closeBidding(uint256 jobId)
```

- Only callable by the **job's client**
- Requires `block.timestamp >= biddingDeadline` OR manual close
- Changes status to `Evaluating`
- Triggers encrypted selection algorithm (see Section 6)
- Emits `BiddingClosed(jobId, bidCount)`

---

### 5.4 `publishWinner` _(called by Fhenix oracle/relayer)_

```
publishWinner(
    uint256   jobId,
    address   winner,
    uint256[] ctHashes,     // ebool ciphertext handles
    uint256[] results,      // decrypted values (0 or 1)
    bytes[]   signatures    // Fhenix network signatures
)
```

- Verifies decrypted `ebool` results using `FHE.verifyDecryptResultBatch`
- The first bidder whose `isWinner` ebool decrypts to `1` is set as winner
- If all results are `0` → no valid bid within budget → status = `NoBids`
- Sets `job.winner` and status to `Settled`
- Emits `WinnerSelected(jobId, winner)` or `NoBidsWithinBudget(jobId)`

---

### 5.5 `getWinner`

```
getWinner(uint256 jobId) → address
```

- Public — returns winner address after `Settled`
- Returns `address(0)` if not yet settled or no valid bids

---

## 6. Selection Algorithm (FHE Logic)

The core of Wave 1+2. Runs **entirely over encrypted values** — no amounts are ever decrypted.

### Phase A — Find Encrypted Minimum Within Budget

```
// Start with "infinity" as current minimum
encryptedMin = FHE.asEuint32(type(uint32).max)   // Enc(4294967295)
hasValidBid  = false

for i = 0 to N-1:
    isWithinBudget = FHE.lte(bids[i].price, job.encryptedMaxBudget)
    isLower        = FHE.lt(bids[i].price, encryptedMin)
    isValidAndLower = FHE.and(isWithinBudget, isLower)      ← FHE.and(ebool, ebool)

    encryptedMin = FHE.select(isValidAndLower, bids[i].price, encryptedMin)

job.encryptedMin = encryptedMin
FHE.allowThis(encryptedMin)
```

**Nothing is decrypted.** The encrypted minimum is stored — it reflects only bids that fit the budget. Bids over budget are silently excluded by FHE logic.

---

### Phase B — Identify Winner

```
for i = 0 to N-1:
    isWinner[i] = FHE.eq(bids[i].price, encryptedMin)
    FHE.allowThis(isWinner[i])
    // request decrypt of isWinner[i] → Fhenix processes off-chain
```

Each `isWinner[i]` is an `ebool` handle. Fhenix FHE nodes decrypt them and post results on-chain.

**What is leaked:** Only `true/false` per bidder — "did you win?" — no amounts, no budget info.

**Edge case:** If all bids exceeded `encryptedMaxBudget`, `encryptedMin` stays at `type(uint32).max`. All `FHE.eq` results are `false` → `publishWinner` detects this → status = `NoBids`.

---

### Phase C — Confirm Winner

```
for i = 0 to N-1:
    if verifyDecryptResult(isWinner[i], result=1, sig) → winner = bids[i].bidder; break

if no winner found → status = NoBids
```

---

## 7. State Machine

```
         createJob(title, deadline, Enc(maxBudget))
                      │
                  [ Open ]
                      │   submitBid(Enc(price)) × N
                      │
               closeBidding()
                      │
                      ├── FHE: min of valid bids (within Enc(maxBudget))
                      │
               [ Evaluating ]
                      │   Fhenix FHE nodes decrypt isWinner[] off-chain
                      │
               publishWinner()
                      │
              ┌───────┴────────┐
         [ Settled ]      [ NoBids ]
              │
          getWinner() → address
```

---

## 8. Events

```solidity
event JobCreated(uint256 indexed jobId, address indexed client);
event BidSubmitted(uint256 indexed jobId, address indexed bidder);
event BiddingClosed(uint256 indexed jobId, uint256 bidCount);
event WinnerSelected(uint256 indexed jobId, address indexed winner);
event NoBidsWithinBudget(uint256 indexed jobId);
```

---

## 9. Access Control

| Function         | Who can call           |
|------------------|------------------------|
| `createJob`      | Anyone                 |
| `submitBid`      | Anyone (once per job)  |
| `closeBidding`   | Job client only        |
| `publishWinner`  | Authorized relayer     |
| `getWinner`      | Anyone                 |

---

## 10. Privacy Guarantees Summary

```
Job creation:
  ✅ Max budget is encrypted — nobody knows the ceiling

Bidding:
  ✅ No one knows any bid amount
  ✅ Bidders cannot see each other's bids

Selection:
  ✅ FHE.lte(bid, maxBudget) → budget check is fully encrypted
  ✅ FHE.and(ebool, ebool) → combines conditions with zero leakage
  ✅ FHE.lt + FHE.select → finds minimum with zero leakage
  ✅ FHE.eq → identifies winner without revealing amounts

After settlement:
  ✅ Winner address is public (by design)
  ✅ Winner's bid amount remains encrypted
  ✅ All losing bid amounts remain encrypted forever
  ✅ Whether a bid was rejected for exceeding budget is never revealed
  ✅ The max budget itself is never revealed
```

---

## 11. Demo Flow (Wave 1+2)

```
1. Client calls createJob("Build landing page", deadline, Enc(500))
   → maxBudget = Enc(500), hidden from everyone

2. Freelancer A calls submitBid(1, Enc(400))   ← within budget
3. Freelancer B calls submitBid(1, Enc(450))   ← within budget
4. Freelancer C calls submitBid(1, Enc(600))   ← over budget (nobody knows)

   On-chain: 3 encrypted handles. Nobody knows 400, 450, 600 or that 500 is the limit.

5. Client calls closeBidding(1)
   → FHE: lte(400, 500)=true, lte(450, 500)=true, lte(600, 500)=false
   → FHE: min of valid = min(400, 450) = Enc(400)
   → FHE.eq: [true, false, false] as ebool handles

6. Fhenix network decrypts the 3 ebool handles
   → results: [1, 0, 0] with signatures

7. Relayer calls publishWinner(1, freelancerA, ...)
   → job.winner = freelancerA

8. Anyone calls getWinner(1) → 0xFreelancerA_address

   Revealed: only freelancerA's address
   Hidden:   400, 450, 600, 500 — all amounts, forever
             C was over budget — nobody knows
```

---

## 12. File Structure

```
contracts/
  PrivateBidMarket.sol      ← main contract
  mocks/
    MockTaskManager.sol     ← existing mock (local tests)

scripts/
  deploy.js
  interact.js

test/
  PrivateBidMarket.js       ← unit tests with mock FHE
```
