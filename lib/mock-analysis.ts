export type DecisionType =
  | "swap"
  | "stake"
  | "bridge"
  | "mint"
  | "lend"
  | "borrow"
  | "transfer"
  | "provide-liquidity";

export interface DecisionIntent {
  type: DecisionType;
  summary: string;
  params: Record<string, string>;
}

export interface LensResult {
  score: number;
  summary: string;
  details: string[];
}

export interface AnalysisResult {
  risk: LensResult;
  fomo: LensResult;
  opportunity: LensResult;
  behavioral: LensResult;
  counterArguments: string[];
  verdict: "PROCEED" | "RECONSIDER";
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

const LENS_LABELS: Record<string, string> = {
  risk: "Risk Analyst",
  fomo: "Market Skeptic",
  opportunity: "Opportunity Cost",
  behavioral: "Behavioral Psych",
};

export { LENS_LABELS };

// ── Parsing ──────────────────────────────────────────────

export function parseIntent(input: string): DecisionIntent | null {
  const s = input.trim();
  if (!s) return null;

  const lower = s.toLowerCase();

  const swapRegex = /(?:swap|trade|exchange|convert)\s+(\d+(?:\.\d+)?)\s*(?:units? of)?\s*(\w+)\s+(?:for|to|into)\s+(\w+)/i;
  const swapMatch = s.match(swapRegex);
  if (swapMatch) {
    return {
      type: "swap",
      summary: `Swap ${swapMatch[1]} ${swapMatch[2].toUpperCase()} → ${swapMatch[3].toUpperCase()}`,
      params: { amount: swapMatch[1], from: swapMatch[2].toUpperCase(), to: swapMatch[3].toUpperCase() },
    };
  }

  const stakeRegex = /(?:stake|delegate|deposit)\s+(\d+(?:\.\d+)?)\s*(?:units? of)?\s*(\w+)(?:\s+(?:with|on|to|via)\s+(\w+))?/i;
  const stakeMatch = s.match(stakeRegex);
  if (stakeMatch && !lower.includes("swap") && !lower.includes("trade")) {
    return {
      type: "stake",
      summary: `Stake ${stakeMatch[1]} ${stakeMatch[2].toUpperCase()}${stakeMatch[3] ? ` via ${stakeMatch[3]}` : ""}`,
      params: { amount: stakeMatch[1], token: stakeMatch[2].toUpperCase(), protocol: (stakeMatch[3] || "").toUpperCase() },
    };
  }

  const bridgeRegex = /(?:bridge|send.*(?:to|across)|move.*(?:to|across))\s+(\d+(?:\.\d+)?)\s*(?:units? of)?\s*(\w+)\s+(?:to|across)\s+(\w+(?:\s+\w+)?)/i;
  const bridgeMatch = s.match(bridgeRegex);
  if (bridgeMatch && !lower.includes("swap")) {
    return {
      type: "bridge",
      summary: `Bridge ${bridgeMatch[1]} ${bridgeMatch[2].toUpperCase()} → ${bridgeMatch[3]}`,
      params: { amount: bridgeMatch[1], token: bridgeMatch[2].toUpperCase(), destination: bridgeMatch[3] },
    };
  }

  const mintRegex = /mint\s+(?:an?\s+)?(?:NFT|token)?\s*(?:from|of)?\s*(.+)/i;
  const mintMatch = s.match(mintRegex);
  if (mintMatch) {
    const collection = mintMatch[1].trim();
    return {
      type: "mint",
      summary: `Mint from ${collection}`,
      params: { collection },
    };
  }

  const lendRegex = /(?:lend|supply|deposit)\s+(\d+(?:\.\d+)?)\s*(?:units? of)?\s*(\w+)(?:\s+(?:on|to|with|via)\s+(\w+))?/i;
  const lendMatch = s.match(lendRegex);
  if (lendMatch && !lower.includes("stake")) {
    return {
      type: "lend",
      summary: `Lend ${lendMatch[1]} ${lendMatch[2].toUpperCase()}${lendMatch[3] ? ` on ${lendMatch[3]}` : ""}`,
      params: { amount: lendMatch[1], token: lendMatch[2].toUpperCase(), protocol: (lendMatch[3] || "").toUpperCase() },
    };
  }

  const borrowRegex = /borrow\s+(\d+(?:\.\d+)?)\s*(?:units? of)?\s*(\w+)(?:\s+(?:against|with)\s+(\w+))?(?:\s+(?:on|from|via)\s+(\w+))?/i;
  const borrowMatch = s.match(borrowRegex);
  if (borrowMatch) {
    return {
      type: "borrow",
      summary: `Borrow ${borrowMatch[1]} ${borrowMatch[2].toUpperCase()}${borrowMatch[3] ? ` against ${borrowMatch[3].toUpperCase()}` : ""}`,
      params: { amount: borrowMatch[1], token: borrowMatch[2].toUpperCase(), collateral: (borrowMatch[3] || "").toUpperCase(), protocol: (borrowMatch[4] || "").toUpperCase() },
    };
  }

  const transferRegex = /(?:send|transfer|pay)\s+(\d+(?:\.\d+)?)\s*(?:units? of)?\s*(\w+)\s+(?:to|address)\s+(\w+)/i;
  const transferMatch = s.match(transferRegex);
  if (transferMatch) {
    return {
      type: "transfer",
      summary: `Send ${transferMatch[1]} ${transferMatch[2].toUpperCase()} to ${transferMatch[3].slice(0, 6)}...`,
      params: { amount: transferMatch[1], token: transferMatch[2].toUpperCase(), recipient: transferMatch[3] },
    };
  }

  const provideLiqRegex = /(?:provide|add)\s+liquidity\s+(\d+(?:\.\d+)?)\s*(?:units? of)?\s*(\w+)\s*(?:\+?\s*(\d+(?:\.\d+)?)\s*(?:units? of)?\s*(\w+))?(?:\s+(?:on|to|via)\s+(\w+))?/i;
  const liqMatch = s.match(provideLiqRegex);
  if (liqMatch) {
    const tokenA = `${liqMatch[1]} ${liqMatch[2].toUpperCase()}`;
    const tokenB = liqMatch[3] ? ` + ${liqMatch[3]} ${liqMatch[4].toUpperCase()}` : "";
    return {
      type: "provide-liquidity",
      summary: `Provide liquidity ${tokenA}${tokenB}${liqMatch[5] ? ` on ${liqMatch[5]}` : ""}`,
      params: { amountA: liqMatch[1], tokenA: liqMatch[2].toUpperCase(), amountB: liqMatch[3] || "", tokenB: (liqMatch[4] || "").toUpperCase(), protocol: (liqMatch[5] || "").toUpperCase() },
    };
  }

  return null;
}

// ── Analysis phrases ─────────────────────────────────────

const riskPhrases: Record<string, Record<string, string[]>> = {
  swap: {
    high: [
      "Liquidity pool depth is below $50K — exit may be costly",
      "Token contract is not verified on-chain",
      "Slippage could exceed 8% at this trade size",
      "Concentrated sell pressure detected in last 2 hours",
      "Smart contract has unaudited proxy pattern",
    ],
    medium: [
      "24h volume declining — momentum may be fading",
      "Holder distribution is moderately concentrated",
      "Cross-chain bridge has a 7-day withdrawal delay",
    ],
    low: [
      "Well-established token with deep liquidity",
      "Diversified holder base across 10k+ wallets",
      "Audited contracts with active bug bounty",
    ],
  },
  stake: {
    high: [
      "Validator has 100% commission — you earn nothing",
      "Liquid staking protocol had a depeg event last month",
      "Unbonding period of 7 days — funds locked during volatility",
      "Validator is oversaturated and may be delisted",
    ],
    medium: [
      "Validator uptime is 96% — below the 99% threshold",
      "Slashing history: 2 minor incidents in past year",
    ],
    low: [
      "Top-10 validator with perfect uptime record",
      "Liquid staking token is fully collateralized on-chain",
    ],
  },
  bridge: {
    high: [
      "Bridge has been exploited twice in the past year",
      "Destination chain has low validator diversity",
      "Message verification takes 30+ minutes — front-running risk",
      "TVL on this bridge dropped 60% in Q4",
    ],
    medium: [
      "Bridge uses external validator set, not native verification",
      "Congestion on destination chain may delay finality",
    ],
    low: [
      "Canonical bridge with battle-tested security",
      "Zero exploits since launch, 2+ years in production",
    ],
  },
  mint: {
    high: [
      "Collection has no verified creator on-chain",
      "Mint price is 3x the current floor price",
      "85% of NFTs in this collection are wash-traded",
      "Metadata is mutable — art could change post-mint",
    ],
    medium: [
      "Royalty enforcement is not guaranteed on all marketplaces",
      "Collection is 2 days old with no secondary volume",
    ],
    low: [
      "Verified collection with creator royalties enforced",
      "Strong secondary market with consistent volume",
    ],
  },
  lend: {
    high: [
      "Protocol has $2M in bad debt from oracle manipulation",
      "Utilization rate is 98% — may be unable to withdraw",
      "Oracle price feed deviation exceeds 5% threshold",
    ],
    medium: [
      "LTV ratio is aggressive — liquidation risk at -15%",
      "Protocol governance is controlled by 3 wallets",
    ],
    low: [
      "Well-audited lending protocol with $500M+ TVL",
      "Conservative LTV ratios with multi-oracle price feeds",
    ],
  },
  borrow: {
    high: [
      "Liquidation threshold is only 5% above current price",
      "Collateral token has 80% correlation with borrowed asset",
      "Protocol has had 2 oracle manipulation incidents",
    ],
    medium: [
      "Interest rate volatility is high — may spike 2x in a day",
      "Your health factor would be 1.2 — very thin margin",
    ],
    low: [
      "Over-collateralized by 3x — very safe position",
      "Collateral asset is stablecoin with minimal drawdown risk",
    ],
  },
  transfer: {
    high: [
      "Recipient address is not in your contact list",
      "Address has been reported in phishing databases",
      "Large transfers to new addresses are a common scam pattern",
    ],
    medium: [
      "Recipient wallet is 3 days old with no transaction history",
      "Network congestion may delay confirmation",
    ],
    low: [
      "Recipient address is verified with on-chain history",
      "Transfer amount is within your normal range",
    ],
  },
  "provide-liquidity": {
    high: [
      "Impermanent loss could exceed 20% at current volatility",
      "Pool has concentrated liquidity — exit may be expensive",
      "Protocol fees are 1% — highest in the sector",
    ],
    medium: [
      "Pool APR dropped 40% in the past week",
      "Whale LP is 60% of the pool — could exit at any time",
    ],
    low: [
      "Stable pair with minimal impermanent loss risk",
      "Protocol is battle-tested with $1B+ lifetime volume",
    ],
  },
};

const fomoPhrases: Record<string, Record<string, string[]>> = {
  swap: {
    high: [
      "Price surged 340% in 24h — classic pump pattern",
      "Twitter mentions spiked 12x in one hour",
      "Influencer with history of pump-and-dump promoted this",
      "You searched this token 14 times today",
      "Three friends mentioned this in the last hour",
    ],
    medium: [
      "Moderate social volume increase — organic or manufactured?",
      "Price above 7-day moving average but volume declining",
    ],
    low: [
      "No unusual social activity detected",
      "Price action is consistent with market trends",
    ],
  },
  stake: {
    high: [
      "Staking APR jumped 3x recently — unsustainable yield?",
      "Crypto Twitter is heavily shilling this staking protocol",
      "You're the 5th person in your group chat to stake here today",
    ],
    medium: ["APR is above market average — might be promotional", "Protocol token incentives are diluting staking rewards"],
    low: ["Staking yield is in line with market benchmarks", "No social media hype detected around this protocol"],
  },
  bridge: {
    high: [
      "Bridge volume spiked 10x after airdrop rumors",
      "Everyone is bridging to this chain for a single NFT mint",
    ],
    medium: ["Airdrop farming is driving bridge activity", "Destination chain TVL is growing but mostly mercenary capital"],
    low: ["Steady bridge usage with organic growth pattern", "No unusual bridging activity detected"],
  },
  mint: {
    high: [
      "Collection floor price dropped 50% in 3 days",
      "You've minted 3 NFTs in the past 24 hours",
      "Everyone in your Discord is minting this",
    ],
    medium: ["Hype cycle is peaking — typical pump pattern", "Secondary volume is dominated by wash trading"],
    low: ["Collection has steady organic growth", "You've done your research over several days"],
  },
  lend: {
    high: [
      "Yield is 80% APY — unsustainable and likely a trap",
      "Protocol launched 2 days ago with no audit",
    ],
    medium: ["High yield is subsidized by protocol token emissions", "Deposit cap is nearly reached — limited upside"],
    low: ["Yield is competitive but sustainable", "No unusual deposit activity detected"],
  },
  borrow: {
    high: [
      "You took a screenshot of the APY — emotional attachment",
      "Leverage degens on Discord are bragging about 5x longs",
    ],
    medium: ["Market sentiment is euphoric — classic top signal", "You're borrowing to chase a rally you already missed"],
    low: ["Borrowing for a well-researched strategy", "Position size is within your risk tolerance"],
  },
  transfer: {
    high: [
      "You're rushing this transfer — why the urgency?",
      "Someone in your DMs asked you to send this",
    ],
    medium: ["First large transfer in 30 days — what changed?", "No on-chain interaction history with this address"],
    low: ["Routine transfer to a known address", "Part of your regular transaction pattern"],
  },
  "provide-liquidity": {
    high: [
      "Yield farming APR is 300% — classic ponzinomics",
      "Protocol token that rewards LPs is down 90% this month",
    ],
    medium: ["High yields are attracting mercenary capital", "LP token has no secondary use case"],
    low: ["Sustainable yield from real trading fees", "Protocol has consistent LP growth over 6 months"],
  },
};

const opportunityPhrases: Record<string, Record<string, string[]>> = {
  swap: {
    high: [
      "ETH/USDC yield farming offers 12% APY with lower risk",
      "GMX provides leveraged exposure with better liquidity",
      "Dollar-cost averaging over 30 days reduces timing risk",
      "Stablecoin lending would yield 8% with zero IL risk",
      "Wait for retracement to support level before entering",
    ],
    medium: ["Consider splitting entry into 3 tranches", "Hedging with a put option could limit downside"],
    low: ["Current entry price is reasonable", "Limited better alternatives for this sector exposure"],
  },
  stake: {
    high: [
      "Liquid staking via Jito offers MEV rewards on top",
      "Restaking on EigenLayer could compound your yield",
      "You could earn 3x by providing liquidity instead",
    ],
    medium: ["Split your stake across 3 validators for diversification", "Consider liquid staking to keep capital fungible"],
    low: ["Staking is the optimal passive strategy here", "Your validator selection is well-researched"],
  },
  bridge: {
    high: [
      "Using a DEX aggregator could save 50% on bridge fees",
      "LayerZero route is cheaper and faster than this bridge",
      "You could buy native assets on the destination chain directly",
    ],
    medium: ["Timing your bridge during low gas hours saves 30%", "Consider using a cross-chain swap instead"],
    low: ["This is the most efficient bridge route available", "Gas costs are within normal range"],
  },
  mint: {
    high: [
      "Secondary market prices are 40% below mint price",
      "You could snipe a rare trait on a marketplace instead",
      "Spending this on BTC would have higher expected return",
    ],
    medium: ["Wait 24h — hype mint prices usually drop post-reveal", "Consider buying floor NFTs instead of minting"],
    low: ["Mint price is at or below floor — good entry", "Collection has strong long-term roadmap"],
  },
  lend: {
    high: [
      "Providing liquidity earns 2x the lending APY",
      "You could stake the same token for 3x the yield",
      "Delta-neutral strategy with same capital would earn more",
    ],
    medium: ["A competing protocol offers better rates with same risk", "Consider splitting between lend and LP"],
    low: ["This is the best risk-adjusted yield available", "Lending rate is competitive across all protocols"],
  },
  borrow: {
    high: [
      "You don't need to borrow — you have idle stablecoins",
      "A flash loan would be cheaper than a collateralized borrow",
      "The interest will eat your profit if trade takes over 2 days",
    ],
    medium: ["Use a different collateral with lower borrow rate", "Consider a smaller borrow to reduce liquidation risk"],
    low: ["Borrowing is capital-efficient for this strategy", "Interest rate is favorable vs. alternatives"],
  },
  transfer: {
    high: [
      "Batch this transfer with others to save on gas",
      "Use a L2 to transfer for 10x cheaper fees",
    ],
    medium: ["Wait for lower gas period — you'll save 60%", "Peer-to-peer transfer would avoid gas entirely"],
    low: ["Gas is low right now — good time to transact", "Transfer amount justifies the gas cost"],
  },
  "provide-liquidity": {
    high: [
      "Concentrated liquidity on a DEX earns 3x more fees",
      "You could lend both tokens separately for higher yield",
      "Delta-neutral LP strategies have better risk/reward",
    ],
    medium: ["A wider range position would reduce IL risk", "Consider single-sided staking if you're bullish on one token"],
    low: ["This pair has the best fee-to-TVl ratio", "Your position is well-ranged for current volatility"],
  },
};

const behavioralPhrases: Record<string, Record<string, string[]>> = {
  swap: {
    high: [
      "You have made 4 similar impulsive trades this week",
      "Decision followed a 2-hour Twitter scrolling session",
      "Your risk allocation for this trade exceeds your own rules",
      "Transaction size is 3x your typical trade",
    ],
    medium: ["Portfolio diversification would benefit from smaller position", "Previous similar pattern resulted in -22% return"],
    low: ["Trade fits your stated strategy and position sizing", "Decision made after multi-source research"],
  },
  stake: {
    high: [
      "You're chasing the highest APR without researching the protocol",
      "This is your 3rd staking position in 2 days — yield hopping?",
    ],
    medium: ["You haven't read the protocol docs or tokenomics", "Staking duration exceeds your typical holding period"],
    low: ["Staking is part of your long-term strategy", "You've researched validator performance thoroughly"],
  },
  bridge: {
    high: [
      "You're bridging for a single airdrop rumor — FOMO driven",
      "You haven't verified the destination chain's security model",
    ],
    medium: ["This is a new chain you have no prior experience with", "Bridging more than you normally risk on a single action"],
    low: ["Bridge amount is within your risk budget", "You're familiar with both chains' security guarantees"],
  },
  mint: {
    high: [
      "You're in a Discord voice channel that's hyping this mint",
      "Your last 3 mints are all underwater — chasing losses?",
    ],
    medium: ["You haven't checked the team's track record", "This would be 30% of your portfolio in NFTs"],
    low: ["Mint budget is pre-planned and within limits", "You've followed this project for months before minting"],
  },
  lend: {
    high: [
      "You're blindly chasing the highest APY without risk assessment",
      "You deposited in a protocol you haven't audited or researched",
    ],
    medium: ["This would concentrate 40% of your portfolio in one protocol", "Protocol is new — less than 30 days of battle-testing"],
    low: ["Lending fits your conservative yield strategy", "Protocol has a long track record and multiple audits"],
  },
  borrow: {
    high: [
      "You're leveraging to recover losses from a previous trade",
      "This is your 2nd borrow in 24 hours — building a leverage spiral",
    ],
    medium: ["Borrowing against a volatile asset — emotional attachment?", "Position size is above your normal risk parameters"],
    low: ["Borrowing is calculated and within your risk framework", "You have a clear exit plan if trade goes against you"],
  },
  transfer: {
    high: [
      "Someone is pressuring you to send this — stop and verify",
      "You're sending to an address you've never interacted with",
    ],
    medium: ["This is an unusually large transfer for you", "No message or memo attached — are you sure?"],
    low: ["Routine transfer within your normal patterns", "Recipient is a known and trusted address"],
  },
  "provide-liquidity": {
    high: [
      "You're chasing APR without understanding impermanent loss",
      "You joined a pool because a friend told you to",
    ],
    medium: ["This is your first LP position — you may not understand the risks", "You're providing liquidity in tokens you don't want to hold"],
    low: ["LP strategy is consistent with your risk profile", "You understand both upside and downside scenarios"],
  },
};

function weightedRandom(weights: number[]): number {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return weights.length - 1;
}

function pickDetails(
  pool: Record<string, string[]>,
  level: "high" | "medium" | "low",
  count: number
): string[] {
  const phrases = pool[level];
  if (!phrases || phrases.length === 0) return [];
  const shuffled = [...phrases].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function scoreFromLevel(level: "high" | "medium" | "low"): number {
  switch (level) {
    case "high":
      return 70 + Math.floor(Math.random() * 25);
    case "medium":
      return 35 + Math.floor(Math.random() * 35);
    case "low":
      return 5 + Math.floor(Math.random() * 30);
  }
}

export async function runLens(
  lens: "risk" | "fomo" | "opportunity" | "behavioral",
  intent: DecisionIntent
): Promise<LensResult> {
  await delay(600 + Math.random() * 800);

  const levelWeights = [0.45, 0.35, 0.2];
  const levelIdx = weightedRandom(levelWeights);
  const level = (["high", "medium", "low"] as const)[levelIdx];

  let pool: Record<string, string[]> = {};

  switch (lens) {
    case "risk":
      pool = riskPhrases[intent.type] || riskPhrases.swap;
      break;
    case "fomo":
      pool = fomoPhrases[intent.type] || fomoPhrases.swap;
      break;
    case "opportunity":
      pool = opportunityPhrases[intent.type] || opportunityPhrases.swap;
      break;
    case "behavioral":
      pool = behavioralPhrases[intent.type] || behavioralPhrases.swap;
      break;
  }

  const summaries: Record<string, Record<string, string>> = {
    risk: {
      high: "Elevated downside risk detected",
      medium: "Moderate risk factors present",
      low: "Risk profile within acceptable range",
    },
    fomo: {
      high: "Strong FOMO indicators — emotional decision likely",
      medium: "Some social pressure detected",
      low: "Decision appears rational, not emotionally driven",
    },
    opportunity: {
      high: "Multiple better alternatives available",
      medium: "Some alternative strategies worth considering",
      low: "Limited better alternatives identified",
    },
    behavioral: {
      high: "Emotional trading patterns detected",
      medium: "Some behavioral concerns",
      low: "Decision aligns with trading discipline",
    },
  };

  return {
    score: scoreFromLevel(level),
    summary: summaries[lens][level],
    details: pickDetails(pool, level, 2 + Math.floor(Math.random() * 2)),
  };
}

export async function runFullAnalysis(
  intent: DecisionIntent
): Promise<AnalysisResult> {
  const [risk, fomo, opportunity, behavioral] = await Promise.all([
    runLens("risk", intent),
    runLens("fomo", intent),
    runLens("opportunity", intent),
    runLens("behavioral", intent),
  ]);

  const avgScore =
    (risk.score + fomo.score + opportunity.score + behavioral.score) / 4;

  const counterArguments = [
    risk.details[0],
    ...fomo.details.slice(0, 1),
    ...opportunity.details.slice(0, 1),
  ].filter(Boolean).slice(0, 3);

  if (counterArguments.length < 3) {
    const remaining = [...risk.details, ...fomo.details, ...opportunity.details]
      .filter((d) => !counterArguments.includes(d));
    for (const d of remaining) {
      if (counterArguments.length >= 3) break;
      counterArguments.push(d);
    }
  }

  return {
    risk,
    fomo,
    opportunity,
    behavioral,
    counterArguments: counterArguments.slice(0, 3),
    verdict: avgScore > 55 ? "RECONSIDER" : "PROCEED",
  };
}
