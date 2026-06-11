"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  type DecisionIntent,
  type AnalysisResult,
  parseIntent,
  runFullAnalysis,
} from "@/lib/mock-analysis";

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

  const execute = useCallback(
    (messageId: string) => {
      const hash = `0x${Math.random().toString(16).slice(2, 42)}`;

      // Pure update: flip the matching message to "executing".
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId &&
          m.role === "contrarian" &&
          m.phase === "complete" &&
          m.result
            ? ({ ...m, phase: "executing", txHash: hash } as ChatMessage)
            : m
        )
      );

      setTimeout(() => {
        // Read the message from fresh state, then issue two independent pure
        // updates so neither one's updater triggers a side effect.
        const msg = messagesRef.current.find((m) => m.id === messageId);
        if (
          !msg ||
          msg.role !== "contrarian" ||
          msg.phase !== "executing" ||
          !msg.result
        )
          return;

        const { intent, result, txHash } = msg;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? ({ ...m, phase: "executed" } as ChatMessage)
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
      }, 2000);
    },
    []
  );

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
