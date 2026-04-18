// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {ITaskManager, FunctionId, EncryptedInput} from "@fhenixprotocol/cofhe-contracts/ICofhe.sol";

/// @dev Minimal mock for local Hardhat testing — returns deterministic handles
contract MockTaskManager is ITaskManager {
    uint256 private _counter;

    function createTask(
        uint8,
        FunctionId,
        uint256[] memory,
        uint256[] memory
    ) external returns (uint256) {
        return ++_counter;
    }

    function createRandomTask(uint8, uint256, int32) external returns (uint256) {
        return ++_counter;
    }

    function createDecryptTask(uint256, address) external {}

    function verifyInput(EncryptedInput memory, address) external returns (uint256) {
        return ++_counter;
    }

    function allow(uint256, address) external {}

    function isAllowed(uint256, address) external pure returns (bool) {
        return true;
    }

    function isPubliclyAllowed(uint256) external pure returns (bool) {
        return false;
    }

    function allowGlobal(uint256) external {}

    function allowTransient(uint256, address) external {}

    function getDecryptResultSafe(uint256) external pure returns (uint256, bool) {
        return (0, false);
    }

    function getDecryptResult(uint256) external pure returns (uint256) {
        return 0;
    }

    function publishDecryptResult(uint256, uint256, bytes calldata) external {}

    function publishDecryptResultBatch(
        uint256[] calldata,
        uint256[] calldata,
        bytes[] calldata
    ) external {}

    function verifyDecryptResult(uint256, uint256, bytes calldata) external pure returns (bool) {
        return true;
    }

    function verifyDecryptResultSafe(
        uint256,
        uint256,
        bytes calldata
    ) external pure returns (bool) {
        return true;
    }

    function verifyDecryptResultBatch(
        uint256[] calldata,
        uint256[] calldata,
        bytes[] calldata
    ) external pure returns (bool) {
        return true;
    }

    function verifyDecryptResultBatchSafe(
        uint256[] calldata,
        uint256[] calldata,
        bytes[] calldata
    ) external pure returns (bool[] memory results) {
        return results;
    }
}
