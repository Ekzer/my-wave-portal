pragma solidity ^0.8.0;

// SPDX-License-Identifier: UNLICENSED
import "hardhat/console.sol";
import "./interfaces/IRandomNumberGenerator.sol";
import "./Registry.sol";

contract WavePortal {
    uint256 totalWaves;
    uint256 seed; // To help generate random number
    uint256 private randomNumber;
    address private registry;
    bytes32 internal constant name = keccak256("WavePortal");

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }
    event NewWave(address _sender, uint256 _timestamp, string _message);

    Wave[] waves;
    constructor(address _registry) payable {
        console.log("Hey, I'm a smart contract and I am deployed!");
        seed = (block.timestamp + block.difficulty);
        registry = _registry;
        
        Registry registryContract = Registry(registry);
        registryContract.mapContract(name, address(this));

        console.log("Random # generated: %d", seed);
    }

    modifier onlyRandomNumberGenerator() {
        address randomGenerator = Registry(registry).getRandomNumberGeneratorContractAddress();
        require(msg.sender == randomGenerator, "Only random number generator can call this");
        _;
    }

    function setRandomNumber(uint256 _randomNumber) external onlyRandomNumberGenerator {
        randomNumber = _randomNumber;
    }

    function wave(string memory _message) public {
        totalWaves += 1;
        waves.push(Wave(msg.sender, _message, block.timestamp));
        
        address randomNumberGeneratorAddr = Registry(registry).getRandomNumberGeneratorContractAddress();
        console.log(randomNumberGeneratorAddr);
        IRandomNumberGenerator(randomNumberGeneratorAddr).getRandomNumber();
        console.log("randomNumber %s", randomNumber);
        if (randomNumber <= 50) {
            console.log("%s won!", msg.sender);
            uint256 prizeAmount = 0.0001 ether;
            require(prizeAmount <= address(this).balance, "No more enough funds in contract to give prize");

            (bool success, ) = msg.sender.call{value: prizeAmount}(""); // send eth from contract fund to sender
            require(success, "Failed to withdraw money from contract.");
        } else {
            console.log("%s lost!", msg.sender);
        }
        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}
