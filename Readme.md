# Project Plan: Shadowlancer
Private Freelance Marketplace powered by Fhenix (FHE)
---
# 1. Problem Statement
Current freelance marketplaces (both Web2 and Web3) have fundamental issues around transparency and trust.

## 1.1 Undercutting and Unfair Competition
In most systems:
- Freelancers can see or infer competing bids
- This leads to continuous underbidding

Result:
- Race to the bottom on pricing
- Reduced quality of work
- Unfair competition
---
## 1.2 Data Leakage
Sensitive information is exposed:
- Bid prices
- Deal terms
- Payment amounts
- Freelancer earnings

Result:
- Freelancers lose pricing power
- Clients expose budget strategies
---
## 1.3 Lack of Privacy in Web3
In current blockchain-based marketplaces:
- All transactions are public
- All smart contract states are visible

Result:
- No confidentiality for business operations
- Not suitable for professional or enterprise use
---
## 1.4 Trust Depends on Centralized Platforms
In Web2 platforms (e.g. Upwork):
- Bid privacy is enforced by the platform
- Reputation is controlled centrally

Result:
- Users must trust the platform  
- No transparency in how decisions are made  
---
## 1.5 Identity vs Skill Trade-off
Users want:
- Privacy (anonymous participation)  
- Trust (proof of skill and experience)  
But current systems cannot provide both at the same time.

Result:
- Either full exposure of identity  
- Or no reliable way to evaluate freelancers  
---
# 2. Solution Overview
Shadowlancer introduces a new model:

- Encrypted bidding  
- Private computation (via Fhenix)  
- Selective data disclosure  
- Cryptographic trust instead of platform trust  

# 3. Vision
Shadownlander is designed as a **private, trustless freelance marketplace** where:

- Freelancers cannot see each other's bids  
- The system can still select the best candidate automatically  
- Trust is enforced by cryptography, not by a centralized platform  

- Encrypted data (no one sees raw values)  
- Private computation (selection happens without revealing data)  
- Selective disclosure (only necessary information is revealed)  

How Bidding Works
## Step 1 — Job Creation
Client creates a job:
- Title, description (can be public)  
- Budget (optional: encrypted range or max budget)  
Example:
Job: Build a landing page
Budget range: $300–$700 (optional public)
Max budget (encrypted): 700
---
## Step 2 — Freelancers Submit Bids
Each freelancer submits:
- Price  
- Proposal (optional encrypted or off-chain)  
Before sending:
- Data is encrypted locally (frontend using Fhenix tools)
On-chain:
Bid A → Enc(500)
Bid B → Enc(450)
Bid C → Enc(600)

No one knows:
- Who bid what  
- Who is cheaper  
---
## Step 3 — Private Evaluation
The system evaluates bids using encrypted computation:

Example rule:
Select bidder with some strategies

- price ≤ max_budget
- lowest price
- (optional) reputation ≥ threshold

This is executed by CoFHE:
- Comparison happens on encrypted values  
- No raw data is revealed  
---
## Step 4 — Winner Selection
Result:
- The system determines the winner  
- Only the result is revealed  
Client sees:

Winner: 0x879......

Client does NOT see:
- Losing bids  
- Full ranking  
- Competitor data  
---
## Step 5 — Payment
Client funds escrow:
- Amount can remain encrypted  

Workflow:
Fund escrow → Work completed → Release payment

Only involved parties can decrypt:
- Payment amount  
- Deal terms  
---
## Step 6 — Completion
Freelancer receives payment:
- Decrypts locally  
- No public exposure of earnings  

---
# 4. Strategy Overview
Development phases:

| Phase | Focus |
|------|------|
| Wave 1–2 | Prove FHE works |
| Wave 3 | Build real product |
| Wave 4 | Add differentiation |
| Wave 5 | Deliver strong final impression |

---
# Wave 1+2 — Private Selection Logic

Goal:  
Show computation on encrypted data  
Features:

- Create job  
- Submit bid (encrypted using Fhenix)  
- Multiple bids  
- CoFHE selects the lowest bid  
- Client only sees the winner  

Demo:
Submit 3 encrypted bids  
System automatically selects the winner  
Only the winner is revealed  

---
# Wave 3 — Full Product Flow

Goal:  
Turn the concept into a usable product  
Features:

1. Job marketplace UI  
   - Browse jobs  
   - Apply to jobs  

2. Encrypted bidding  
   - Price encrypted  
   - Proposal stored as hash or encrypted  

3. Basic reputation system  
   - Public rating (temporary)  

4. Escrow system  
   - Lock funds  
   - Manual release  

Demo flow:

Client posts job  
Freelancers submit encrypted bids  
Client selects winner  
Funds are locked in escrow  
Payment is released after completion  

---
# Wave 4 — Differentiation
Goal:  
Demonstrate features only possible with FHE  

Features:

Encrypted reputation filtering  
- Only accept freelancers with rating above a threshold  
- Without revealing the actual rating  

Selective disclosure  
- Client sees only the winner price  
- Losing bids remain hidden  

Basic stealth identity  
- Each bid uses a different address  

Demo:
System selects the best freelancer  
Client does not see full data  
Still able to trust the result  

Judge takeaway:  
This introduces a new trust model  
---
# Wave 5 — Final Stage
Goal:  
Deliver a strong and memorable demo  

— Fully private deals  
- Hide price and identity  
- Only client and freelancer can decrypt  

— Sealed-bid auction mode  
- Time-based bidding  
- Automatic winner selection  

— Anonymous talent  
- Freelancer proves skill level  
- Without revealing identity or full history  

Demo:
Sensitive data is never revealed  
System still functions correctly  

Judge takeaway:  
This represents a new direction for Web3 marketplaces  

---
# 5. Positioning
Shadowlancer is a private freelance marketplace built on Fhenix  

---
# 6. Key Points
- Clear problem: undercutting and data leakage  
- Clear solution: encrypted bidding and private computation  
- Clear demonstration: visible difference from existing systems  