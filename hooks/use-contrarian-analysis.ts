"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { Hex } from "viem";
import {
  getAccount,
  switchChain,
  waitForTransactionReceipt,
  writeContract,
} from "wagmi/actions";
import {
  type DecisionIntent,
  type AnalysisResult,
  parseIntent,
  runFullAnalysis,
} from "@/lib/mock-analysis";
import { config } from "@/lib/wagmi";
import {
  CONTRARIAN_GUARD_ABI,
  GUARD_ADDRESS,
  GUARD_CHAIN,
  guardIsConfigured,
  intentHash,
  Outcome,
  toScore,
  Verdict,
} from "@/lib/contrarian-guard";

/**
 * Record an executed decision on-chain via ContrarianGuard. Returns the real tx
 * hash. Throws if the guard isn't configured or no wallet is connected — callers
 * fall back to a simulated hash so the demo still works offline.
 */
async function recordExecutionOnChain(
  intent: DecisionIntent,
  result: AnalysisResult,
): Promise<Hex> {
  if (!guardIsConfigured()) throw new Error("guard-not-configured");

  const account = getAccount(config);
  if (!account.isConnected) throw new Error("wallet-not-connected");

  if (account.chainId !== GUARD_CHAIN.id) {
    await switchChain(config, { chainId: GUARD_CHAIN.id });
  }

  const hash = await writeContract(config, {
    address: GUARD_ADDRESS as Hex,
    abi: CONTRARIAN_GUARD_ABI,
    functionName: "recordDecision",
    chainId: GUARD_CHAIN.id,
    args: [
      intentHash(intent.summary),
      toScore(result.risk.score),
      toScore(result.fomo.score),
      toScore(result.opportunity.score),
      toScore(result.behavioral.score),
      result.verdict === "RECONSIDER" ? Verdict.RECONSIDER : Verdict.PROCEED,
      Outcome.EXECUTED,
    ],
  });

  await waitForTransactionReceipt(config, { hash, chainId: GUARD_CHAIN.id });
  return hash;
}

type ChatMessage =
  | {
      id: string;
      role: "user";
      content: string;
      intent: DecisionIntent;
    }
  | {
      id: string;
      role: "contrarian";
      phase: "analyzing" | "complete" | "executing" | "executed" | "error";
      result?: AnalysisResult;
      txHash?: string;
      intent: DecisionIntent;
    };

interface ReviewEntry {
  id: string;
  intent: DecisionIntent;
  result: AnalysisResult;
  decision: "EXECUTED" | "CANCELLED";
  txHash?: string;
  timestamp: number;
}

export function useContrarianAnalysis() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [history, setHistory] = useState<ReviewEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Keep a ref to the latest messages so async/event callbacks can read fresh
  // state without depending on it (and without reading state inside a setState
  // updater, which StrictMode double-invokes).
  const messagesRef = useRef<ChatMessage[]>(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const submitForReview = useCallback(async (input: string) => {
    const intent = parseIntent(input);
    if (!intent) {
      const errorId = Math.random().toString(36).slice(2, 9);
      setMessages((prev) => [
        ...prev,
        {
          id: errorId,
          role: "contrarian",
          phase: "error",
          intent: { type: "swap", summary: input, params: {} },
        },
      ]);
      return;
    }

    const userMsgId = Math.random().toString(36).slice(2, 9);
    const botMsgId = Math.random().toString(36).slice(2, 9);

    const userMsg: ChatMessage = {
      id: userMsgId,
      role: "user",
      content: input,
      intent,
    };

    const analyzingMsg: ChatMessage = {
      id: botMsgId,
      role: "contrarian",
      phase: "analyzing",
      intent,
    };

    setMessages((prev) => [...prev, userMsg, analyzingMsg]);
    setIsProcessing(true);

    try {
      const result = await runFullAnalysis(intent);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMsgId
            ? { ...m, phase: "complete", result } as ChatMessage
            : m
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMsgId
            ? { ...m, phase: "error" } as ChatMessage
            : m
        )
      );
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const execute = useCallback((messageId: string) => {
    const msg = messagesRef.current.find((m) => m.id === messageId);
    if (
      !msg ||
      msg.role !== "contrarian" ||
      msg.phase !== "complete" ||
      !msg.result
    )
      return;

    const { intent, result } = msg;

    // Flip to "executing" while the transaction is in flight.
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? ({ ...m, phase: "executing" } as ChatMessage)
          : m
      )
    );

    const finish = (txHash: string) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? ({ ...m, phase: "executed", txHash } as ChatMessage)
            : m
        )
      );
      setHistory((hist) => [
        {
          id: Math.random().toString(36).slice(2, 9),
          intent,
          result,
          decision: "EXECUTED",
          txHash,
          timestamp: Date.now(),
        },
        ...hist,
      ]);
    };

    // Try the real on-chain record; fall back to a simulated hash so the demo
    // works with no contract deployed / no wallet connected.
    recordExecutionOnChain(intent, result)
      .then(finish)
      .catch((err) => {
        const reason = err instanceof Error ? err.message : String(err);
        const simulable =
          reason === "guard-not-configured" || reason === "wallet-not-connected";

        if (simulable) {
          const fakeHash = `0x${Array.from({ length: 64 }, () =>
            Math.floor(Math.random() * 16).toString(16)
          ).join("")}`;
          setTimeout(() => finish(fakeHash), 1500);
          return;
        }

        // A real failure (user rejected the signature, tx reverted, wrong
        // network, etc.) — revert to "complete" so the user can decide again.
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId && m.role === "contrarian"
              ? ({ ...m, phase: "complete" } as ChatMessage)
              : m
          )
        );
      });
  }, []);

  const cancel = useCallback(
    (messageId: string) => {
      // Read the message from fresh state first, then issue two independent
      // pure updates instead of calling setHistory inside the setMessages
      // updater (which StrictMode double-invokes).
      const msg = messagesRef.current.find((m) => m.id === messageId);
      if (
        !msg ||
        msg.role !== "contrarian" ||
        msg.phase !== "complete" ||
        !msg.result
      )
        return;

      const { intent, result } = msg;

      setMessages((prev) => prev.filter((m) => m.id !== messageId));

      setHistory((hist) => [
        {
          id: Math.random().toString(36).slice(2, 9),
          intent,
          result,
          decision: "CANCELLED",
          timestamp: Date.now(),
        },
        ...hist,
      ]);
    },
    []
  );

  const reset = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    history,
    isProcessing,
    submitForReview,
    execute,
    cancel,
    reset,
  };
}
