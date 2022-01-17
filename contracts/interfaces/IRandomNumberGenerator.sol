pragma solidity ^0.8.0;
// SPDX-License-Identifier: UNLICENSED

abstract contract IRandomNumberGenerator {
    function getRandomNumber() public virtual returns (bytes32 requestId);
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal virtual;
}