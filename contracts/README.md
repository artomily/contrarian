# ContrarianGuard — on-chain decision registry

Solidity contract behind Contrarian's **Decision Firewall**. It makes the outcome
of every reviewed action permanent: when a user *Executes Anyway* or *Cancels* a
decision, the verdict, the four adversarial lens scores, and the final outcome are
written on-chain as an immutable record. "Overrides" — proceeding despite a
`RECONSIDER` verdict — are counted separately so the cost of ignoring the firewall
is auditable forever.

- **Chain:** Arbitrum Sepolia (`chainId 421614`)
- **Stack:** Foundry + **OpenZeppelin** (`Ownable`, `EIP712`, `ECDSA`)
- **Contract:** [`src/ContrarianGuard.sol`](src/ContrarianGuard.sol)

## Build & test

```bash
cd contracts
forge build
forge test -vv      # 8 passing tests
```

## Deploy to Arbitrum Sepolia

> The deploy step needs **your** funded private key — run it yourself; never share
> the key. Fund the deployer with testnet ETH first:
> https://www.alchemy.com/faucets/arbitrum-sepolia

```bash
cd contracts
cp .env.example .env        # then edit .env and set PRIVATE_KEY (+ RPC if desired)
source .env

forge script script/Deploy.s.sol \
  --rpc-url "$ARBITRUM_SEPOLIA_RPC_URL" \
  --broadcast

# (optional) verify source on Arbiscan
forge script script/Deploy.s.sol \
  --rpc-url "$ARBITRUM_SEPOLIA_RPC_URL" \
  --broadcast --verify --etherscan-api-key "$ARBISCAN_API_KEY"
```

Copy the printed `ContrarianGuard deployed at: 0x…` address.

## Wire it into the frontend

Add the deployed address to the Next.js app's environment (repo root `.env.local`):

```bash
NEXT_PUBLIC_GUARD_ADDRESS=0xYourDeployedAddress
```

With that set and a wallet connected on Arbitrum Sepolia, clicking **Execute
Anyway** in the dashboard sends a real `recordDecision` transaction (see
`hooks/use-contrarian-analysis.ts`). Without it, the app falls back to a simulated
hash so the demo still runs offline.

## Contract surface

| Function | Purpose |
|----------|---------|
| `recordDecision(intentHash, risk, fomo, opportunity, behavioral, verdict, outcome)` | User-signed decision record |
| `recordAttestedDecision(..., signature)` | Decision co-signed by the Contrarian agent (EIP-712) |
| `setAttester(address)` | Owner-only: rotate the agent attester key |
| `totalDecisions()` / `overrideCount()` | Aggregate stats |
| `getDecision(id)` / `getUserDecisionIds(user)` / `userDecisionCount(user)` | Reads |

Events: `DecisionRecorded(id, user, intentHash, avgScore, verdict, outcome, attested)`.
