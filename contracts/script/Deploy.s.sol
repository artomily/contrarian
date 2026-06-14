// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {ContrarianGuard} from "../src/ContrarianGuard.sol";

/// @notice Deploys ContrarianGuard. Owner & attester default to the deployer.
contract Deploy is Script {
    function run() external returns (ContrarianGuard guard) {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(pk);
        address owner = vm.envOr("OWNER", deployer);
        address attester = vm.envOr("ATTESTER", deployer);

        vm.startBroadcast(pk);
        guard = new ContrarianGuard(owner, attester);
        vm.stopBroadcast();

        console.log("ContrarianGuard deployed at:", address(guard));
        console.log("owner   :", owner);
        console.log("attester:", attester);
    }
}
