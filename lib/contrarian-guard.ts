import { keccak256, toHex, type Hex } from "viem";
import { arbitrumSepolia } from "wagmi/chains";

/**
 * ContrarianGuard — on-chain decision registry (Arbitrum Sepolia).
 *
 * Set the deployed address via `NEXT_PUBLIC_GUARD_ADDRESS` in `.env.local`.
 * When unset, the app falls back to simulated execution (see
 * `hooks/use-contrarian-analysis.ts`), so the demo still works with no wallet.
 */
export const GUARD_CHAIN = arbitrumSepolia;

export const GUARD_ADDRESS = (process.env.NEXT_PUBLIC_GUARD_ADDRESS ?? "") as
  | Hex
  | "";

export const guardIsConfigured = (): boolean =>
  /^0x[0-9a-fA-F]{40}$/.test(GUARD_ADDRESS);

// Verdict / Outcome enums mirror the Solidity contract (uint8).
export const Verdict = { PROCEED: 0, RECONSIDER: 1 } as const;
export const Outcome = { EXECUTED: 0, CANCELLED: 1 } as const;

/** keccak256 of the human-readable intent summary, stored on-chain. */
export const intentHash = (summary: string): Hex => keccak256(toHex(summary));

/** Clamp a 0–100 score to a uint8 the contract will accept. */
export const toScore = (n: number): number =>
  Math.max(0, Math.min(100, Math.round(n)));

export const CONTRARIAN_GUARD_ABI = [
  {
    type: "function",
    name: "recordDecision",
    stateMutability: "nonpayable",
    inputs: [
      { name: "intentHash", type: "bytes32" },
      { name: "risk", type: "uint8" },
      { name: "fomo", type: "uint8" },
      { name: "opportunity", type: "uint8" },
      { name: "behavioral", type: "uint8" },
      { name: "verdict", type: "uint8" },
      { name: "outcome", type: "uint8" },
    ],
    outputs: [{ name: "id", type: "uint256" }],
  },
  {
    type: "function",
    name: "totalDecisions",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "overrideCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "userDecisionCount",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "event",
    name: "DecisionRecorded",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "user", type: "address", indexed: true },
      { name: "intentHash", type: "bytes32", indexed: true },
      { name: "avgScore", type: "uint8", indexed: false },
      { name: "verdict", type: "uint8", indexed: false },
      { name: "outcome", type: "uint8", indexed: false },
      { name: "attested", type: "bool", indexed: false },
    ],
    anonymous: false,
  },
] as const;
