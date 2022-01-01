pragma solidity ^0.8.0;

// SPDX-License-Identifier: UNLICENSED
import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    mapping(address => uint256) mapWaver;

    constructor(){
        console.log("Hey, I'm a smart contract and I am deployed!");
    }

    function wave() public {
        totalWaves += 1;
        mapWaver[msg.sender] += 1;
        console.log("%s has waved!", msg.sender);
    }

    function getWavesByAddr(address id) public view returns (uint256) {
        return mapWaver[id];
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}
