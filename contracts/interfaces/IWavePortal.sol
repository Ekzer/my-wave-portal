pragma solidity ^0.8.0;
// SPDX-License-Identifier: UNLICENSED

abstract contract IWavePortal {
    function setRandomNumber(uint256 _randomNumber) virtual external;
}