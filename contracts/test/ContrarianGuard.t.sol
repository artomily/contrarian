// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {ContrarianGuard} from "../src/ContrarianGuard.sol";

contract ContrarianGuardTest is Test {
    ContrarianGuard internal guard;

    address internal owner = makeAddr("owner");
    address internal user = makeAddr("user");

    // attester keypair (agent)
    uint256 internal attesterPk = 0xA11CE;
    address internal attester;

    bytes32 internal constant VERDICT_TYPEHASH = keccak256(
        "Verdict(address user,bytes32 intentHash,uint8 risk,uint8 fomo,uint8 opportunity,uint8 behavioral,uint8 verdict)"
    );

    event DecisionRecorded(
        uint256 indexed id,
        address indexed user,
        bytes32 indexed intentHash,
        uint8 avgScore,
        ContrarianGuard.Verdict verdict,
        ContrarianGuard.Outcome outcome,
        bool attested
    );

    function setUp() public {
        attester = vm.addr(attesterPk);
        guard = new ContrarianGuard(owner, attester);
    }

    function test_Constructor() public view {
        assertEq(guard.owner(), owner);
        assertEq(guard.attester(), attester);
        assertEq(guard.totalDecisions(), 0);
        assertEq(guard.overrideCount(), 0);
    }

    function test_RecordDecision_StoresAndEmits() public {
        bytes32 intentHash = keccak256("swap 100 USDC to SOL");

        vm.expectEmit(true, true, true, true);
        emit DecisionRecorded(
            0,
            user,
            intentHash,
            uint8((93 + 92 + 70 + 17) / 4),
            ContrarianGuard.Verdict.RECONSIDER,
            ContrarianGuard.Outcome.EXECUTED,
            false
        );

        vm.prank(user);
        uint256 id = guard.recordDecision(
            intentHash, 93, 92, 70, 17, ContrarianGuard.Verdict.RECONSIDER, ContrarianGuard.Outcome.EXECUTED
        );

        assertEq(id, 0);
        assertEq(guard.totalDecisions(), 1);

        ContrarianGuard.Decision memory d = guard.getDecision(0);
        assertEq(d.user, user);
        assertEq(d.intentHash, intentHash);
        assertEq(d.risk, 93);
        assertEq(d.avgScore, uint8((93 + 92 + 70 + 17) / 4));
        assertEq(uint8(d.verdict), uint8(ContrarianGuard.Verdict.RECONSIDER));
        assertFalse(d.attested);
    }

    function test_OverrideCount_OnlyOnReconsiderExecuted() public {
        vm.startPrank(user);
        // RECONSIDER + EXECUTED => override
        guard.recordDecision(
            keccak256("a"), 90, 90, 90, 90, ContrarianGuard.Verdict.RECONSIDER, ContrarianGuard.Outcome.EXECUTED
        );
        // RECONSIDER + CANCELLED => not an override
        guard.recordDecision(
            keccak256("b"), 90, 90, 90, 90, ContrarianGuard.Verdict.RECONSIDER, ContrarianGuard.Outcome.CANCELLED
        );
        // PROCEED + EXECUTED => not an override
        guard.recordDecision(
            keccak256("c"), 10, 10, 10, 10, ContrarianGuard.Verdict.PROCEED, ContrarianGuard.Outcome.EXECUTED
        );
        vm.stopPrank();

        assertEq(guard.overrideCount(), 1);
        assertEq(guard.userDecisionCount(user), 3);
        assertEq(guard.getUserDecisionIds(user).length, 3);
    }

    function test_RevertWhen_ScoreOutOfRange() public {
        vm.prank(user);
        vm.expectRevert(ContrarianGuard.InvalidScore.selector);
        guard.recordDecision(
            keccak256("x"), 101, 0, 0, 0, ContrarianGuard.Verdict.PROCEED, ContrarianGuard.Outcome.EXECUTED
        );
    }

    function test_RecordAttestedDecision_ValidSignature() public {
        bytes32 intentHash = keccak256("stake 50 SOL");
        bytes memory sig = _signVerdict(intentHash, 40, 20, 30, 10, ContrarianGuard.Verdict.PROCEED, user);

        vm.prank(user);
        guard.recordAttestedDecision(
            intentHash, 40, 20, 30, 10, ContrarianGuard.Verdict.PROCEED, ContrarianGuard.Outcome.EXECUTED, sig
        );

        ContrarianGuard.Decision memory d = guard.getDecision(0);
        assertTrue(d.attested);
    }

    function test_RevertWhen_AttestationFromWrongSigner() public {
        bytes32 intentHash = keccak256("stake 50 SOL");
        // sign with a non-attester key
        uint256 roguePk = 0xB0B;
        bytes32 structHash = keccak256(
            abi.encode(VERDICT_TYPEHASH, user, intentHash, uint8(40), uint8(20), uint8(30), uint8(10), uint8(0))
        );
        bytes32 digest = _digest(structHash);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(roguePk, digest);
        bytes memory sig = abi.encodePacked(r, s, v);

        vm.prank(user);
        vm.expectRevert(ContrarianGuard.InvalidAttestation.selector);
        guard.recordAttestedDecision(
            intentHash, 40, 20, 30, 10, ContrarianGuard.Verdict.PROCEED, ContrarianGuard.Outcome.EXECUTED, sig
        );
    }

    function test_RevertWhen_AttestationReplayedByAnotherUser() public {
        bytes32 intentHash = keccak256("stake 50 SOL");
        // attester signs binding the verdict to `user`
        bytes memory sig = _signVerdict(intentHash, 40, 20, 30, 10, ContrarianGuard.Verdict.PROCEED, user);

        // a different caller tries to reuse it
        address attacker = makeAddr("attacker");
        vm.prank(attacker);
        vm.expectRevert(ContrarianGuard.InvalidAttestation.selector);
        guard.recordAttestedDecision(
            intentHash, 40, 20, 30, 10, ContrarianGuard.Verdict.PROCEED, ContrarianGuard.Outcome.EXECUTED, sig
        );
    }

    function test_SetAttester_OnlyOwner() public {
        address newAttester = makeAddr("newAttester");

        vm.prank(user);
        vm.expectRevert();
        guard.setAttester(newAttester);

        vm.prank(owner);
        guard.setAttester(newAttester);
        assertEq(guard.attester(), newAttester);
    }

    // ----------------------------------------------------------- helpers --

    function _digest(bytes32 structHash) internal view returns (bytes32) {
        return keccak256(abi.encodePacked("\x19\x01", guard.domainSeparator(), structHash));
    }

    function _signVerdict(
        bytes32 intentHash,
        uint8 risk,
        uint8 fomo,
        uint8 opportunity,
        uint8 behavioral,
        ContrarianGuard.Verdict verdict,
        address forUser
    ) internal view returns (bytes memory) {
        bytes32 structHash = keccak256(
            abi.encode(VERDICT_TYPEHASH, forUser, intentHash, risk, fomo, opportunity, behavioral, uint8(verdict))
        );
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(attesterPk, _digest(structHash));
        return abi.encodePacked(r, s, v);
    }
}
