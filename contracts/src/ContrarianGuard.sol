// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title ContrarianGuard
 * @notice On-chain decision registry for the Contrarian "Decision Firewall".
 *
 * Contrarian challenges every onchain action with four adversarial review lenses
 * before it executes. This contract makes the outcome of that challenge
 * permanent: whenever a user proceeds with (or cancels) a reviewed action, the
 * verdict, the four lens scores, and the final outcome are written on-chain as
 * an immutable record.
 *
 * Of particular interest is the "override" — when a user clicks *Execute Anyway*
 * on a decision the firewall flagged as RECONSIDER. Those are tracked separately
 * so the cost of ignoring the firewall is auditable forever.
 *
 * Two write paths:
 *  - {recordDecision}: the user records their own decision (msg.sender signs).
 *  - {recordAttestedDecision}: the record is co-signed by the Contrarian agent
 *    via an EIP-712 signature, proving the scores came from the firewall and
 *    were not fabricated by the caller.
 *
 * Uses OpenZeppelin {Ownable} (admin / attester management), {EIP712} and
 * {ECDSA} (agent attestation verification).
 */
contract ContrarianGuard is Ownable, EIP712 {
    enum Verdict {
        PROCEED,
        RECONSIDER
    }

    enum Outcome {
        EXECUTED,
        CANCELLED
    }

    struct Decision {
        address user;
        bytes32 intentHash; // keccak256 of the human-readable intent summary
        uint8 risk; // Risk Analyst score        0-100
        uint8 fomo; // Market Skeptic score      0-100
        uint8 opportunity; // Opportunity Cost score    0-100
        uint8 behavioral; // Behavioral Psych score    0-100
        uint8 avgScore; // mean of the four lenses   0-100
        Verdict verdict;
        Outcome outcome;
        bool attested; // signed by the Contrarian agent?
        uint64 timestamp;
    }

    /// @dev EIP-712 typehash for an agent-signed verdict.
    bytes32 private constant VERDICT_TYPEHASH = keccak256(
        "Verdict(address user,bytes32 intentHash,uint8 risk,uint8 fomo,uint8 opportunity,uint8 behavioral,uint8 verdict)"
    );

    Decision[] private _decisions;
    mapping(address => uint256[]) private _byUser;

    /// @notice Number of records where a RECONSIDER verdict was overridden (executed anyway).
    uint256 public overrideCount;

    /// @notice The Contrarian agent address authorized to attest verdicts.
    address public attester;

    event DecisionRecorded(
        uint256 indexed id,
        address indexed user,
        bytes32 indexed intentHash,
        uint8 avgScore,
        Verdict verdict,
        Outcome outcome,
        bool attested
    );
    event AttesterUpdated(address indexed previousAttester, address indexed newAttester);

    error InvalidScore();
    error InvalidAttestation();

    constructor(address initialOwner, address initialAttester)
        Ownable(initialOwner)
        EIP712("ContrarianGuard", "1")
    {
        attester = initialAttester;
        emit AttesterUpdated(address(0), initialAttester);
    }

    /// @notice Update the authorized Contrarian agent attester.
    function setAttester(address newAttester) external onlyOwner {
        emit AttesterUpdated(attester, newAttester);
        attester = newAttester;
    }

    /// @notice Record a reviewed decision, signed by the acting user.
    function recordDecision(
        bytes32 intentHash,
        uint8 risk,
        uint8 fomo,
        uint8 opportunity,
        uint8 behavioral,
        Verdict verdict,
        Outcome outcome
    ) external returns (uint256 id) {
        return _record(msg.sender, intentHash, risk, fomo, opportunity, behavioral, verdict, outcome, false);
    }

    /// @notice Record a reviewed decision co-signed by the Contrarian agent (EIP-712).
    /// @dev The signature binds the scores to {msg.sender} so an attestation cannot be replayed by another user.
    function recordAttestedDecision(
        bytes32 intentHash,
        uint8 risk,
        uint8 fomo,
        uint8 opportunity,
        uint8 behavioral,
        Verdict verdict,
        Outcome outcome,
        bytes calldata signature
    ) external returns (uint256 id) {
        bytes32 structHash = keccak256(
            abi.encode(VERDICT_TYPEHASH, msg.sender, intentHash, risk, fomo, opportunity, behavioral, uint8(verdict))
        );
        address signer = ECDSA.recover(_hashTypedDataV4(structHash), signature);
        if (signer == address(0) || signer != attester) revert InvalidAttestation();
        return _record(msg.sender, intentHash, risk, fomo, opportunity, behavioral, verdict, outcome, true);
    }

    function _record(
        address user,
        bytes32 intentHash,
        uint8 risk,
        uint8 fomo,
        uint8 opportunity,
        uint8 behavioral,
        Verdict verdict,
        Outcome outcome,
        bool attested
    ) internal returns (uint256 id) {
        if (risk > 100 || fomo > 100 || opportunity > 100 || behavioral > 100) {
            revert InvalidScore();
        }

        uint8 avgScore = uint8((uint256(risk) + fomo + opportunity + behavioral) / 4);

        id = _decisions.length;
        _decisions.push(
            Decision({
                user: user,
                intentHash: intentHash,
                risk: risk,
                fomo: fomo,
                opportunity: opportunity,
                behavioral: behavioral,
                avgScore: avgScore,
                verdict: verdict,
                outcome: outcome,
                attested: attested,
                timestamp: uint64(block.timestamp)
            })
        );
        _byUser[user].push(id);

        if (verdict == Verdict.RECONSIDER && outcome == Outcome.EXECUTED) {
            overrideCount++;
        }

        emit DecisionRecorded(id, user, intentHash, avgScore, verdict, outcome, attested);
    }

    // ---------------------------------------------------------------- views --

    /// @notice Total number of decisions ever recorded.
    function totalDecisions() external view returns (uint256) {
        return _decisions.length;
    }

    /// @notice Fetch a single decision by id.
    function getDecision(uint256 id) external view returns (Decision memory) {
        return _decisions[id];
    }

    /// @notice All decision ids recorded by a given user.
    function getUserDecisionIds(address user) external view returns (uint256[] memory) {
        return _byUser[user];
    }

    /// @notice How many decisions a given user has recorded.
    function userDecisionCount(address user) external view returns (uint256) {
        return _byUser[user].length;
    }

    /// @notice The EIP-712 domain separator (useful for off-chain agent signing).
    function domainSeparator() external view returns (bytes32) {
        return _domainSeparatorV4();
    }
}
