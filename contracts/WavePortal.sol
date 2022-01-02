pragma solidity ^0.8.0;

// SPDX-License-Identifier: UNLICENSED
import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    mapping(address => uint256) mapWaver;

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }
    event NewWave(address _sender, uint256 _timestamp, string _message);

    Wave[] waves;
    constructor(){
        console.log("Hey, I'm a smart contract and I am deployed!");
    }

    function wave(string memory _message) public {
        totalWaves += 1;
        mapWaver[msg.sender] += 1;

        waves.push(Wave(msg.sender, _message, block.timestamp));

        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getWavesByAddr(address id) public view returns (uint256) {
        return mapWaver[id];
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}
