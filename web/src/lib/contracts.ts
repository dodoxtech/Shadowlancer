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

// Builds a plaintext InEuint32 struct.
// In production replace with real Fhenix SDK encryption:
//   import { cofhejs } from "cofhejs"; const enc = await cofhejs.encrypt_uint32(value);
export function buildInEuint32(value: number) {
  return {
    ctHash: BigInt(value),
    securityZone: 0,
    utype: 4, // 4 = uint32 in Fhenix type enum
    signature: "0x" as `0x${string}`,
  };
}
