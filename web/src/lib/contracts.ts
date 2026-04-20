import { cofhejs, Encryptable } from "cofhejs/web";

export const CONTRACT_ADDRESS = (
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? ""
) as `0x${string}`;

export const PRIVATE_BID_MARKET_ABI = [
  {
    type: "function",
    name: "createJob",
    inputs: [
      { name: "title", type: "string" },
      { name: "description", type: "string" },
      { name: "biddingDeadline", type: "uint256" },
      {
        name: "encryptedMaxBudget",
        type: "tuple",
        components: [
          { name: "ctHash", type: "uint256" },
          { name: "securityZone", type: "uint8" },
          { name: "utype", type: "uint8" },
          { name: "signature", type: "bytes" },
        ],
      },
    ],
    outputs: [{ name: "jobId", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "submitBid",
    inputs: [
      { name: "jobId", type: "uint256" },
      {
        name: "encryptedPrice",
        type: "tuple",
        components: [
          { name: "ctHash", type: "uint256" },
          { name: "securityZone", type: "uint8" },
          { name: "utype", type: "uint8" },
          { name: "signature", type: "bytes" },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "closeBidding",
    inputs: [{ name: "jobId", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getJobStatus",
    inputs: [{ name: "jobId", type: "uint256" }],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBidCount",
    inputs: [{ name: "jobId", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "JobCreated",
    inputs: [
      { name: "jobId", type: "uint256", indexed: true },
      { name: "client", type: "address", indexed: true },
    ],
  },
] as const;

// Shape of an encrypted input accepted by the contract (matches InEuint32 in Solidity)
export type InEuint32 = {
  ctHash: bigint;
  securityZone: number;
  utype: number;
  signature: `0x${string}`;
};

// Encrypt a uint32 value with the Fhenix cofhejs SDK.
//
// cofhejs must be initialised once after wallet connects:
//   await cofhejs.initialize({ provider, signer });
//
// The returned InEuint32 has a valid ZK-proof signature that
// the on-chain TASK_MANAGER verifies — the raw value stays private.
//
// Docs: https://cofhe-docs.fhenix.zone
export async function encryptUint32(value: number): Promise<InEuint32> {
  const result = await cofhejs.encrypt([Encryptable.uint32(BigInt(value))]);
  if (!result.success) throw new Error(result.error?.message ?? "Encryption failed");
  return result.data[0] as unknown as InEuint32;
}

// ── Mock helper (Hardhat local only) ─────────────────────────────────────────
// MockTaskManager accepts any input so no real encryption needed.
// Will REVERT on Fhenix network — use encryptUint32() there.
export function buildInEuint32Mock(value: number): InEuint32 {
  return {
    ctHash: BigInt(value),
    securityZone: 0,
    utype: 4,
    signature: "0x" as `0x${string}`,
  };
}
