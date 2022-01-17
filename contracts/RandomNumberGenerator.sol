pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol"; //https://github.com/smartcontractkit/chainlink/issues/5663
import './Registry.sol';
import './interfaces/IWavePortal.sol';
import "hardhat/console.sol";

// SPDX-License-Identifier: UNLICENSED

contract RandomNumberGenerator is VRFConsumerBase {
    bytes32 internal keyHash;
    uint256 internal fee;
    address internal registry;
    bytes32 internal constant name = keccak256("RandomNumberGenerator");
    
    constructor(address _registry) VRFConsumerBase(
        0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B, // VRF Coordinator rinkeby network
        0x01BE23585060835E02B77ef475b0Cc51aA1e0709  // LINK Token rinkeby network
    ) payable {
        keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
        fee = 0.1 * 10 ** 18; // 0.1 LINK
        registry = _registry;
        Registry registryContract = Registry(registry);
        registryContract.mapContract(name, address(this));
    }

    modifier onlyWavePortal() {
        address wavePortalContract = Registry(registry).getWavePortalContractAddress();
        require(msg.sender == wavePortalContract, "Only WavePortalContract can make this call");
        _;
    }

    /** 
    * Requests randomness from a user-provided seed
    */
    function getRandomNumber() public onlyWavePortal returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) > fee, "Not enough LINK - fill contract with faucet");
        return requestRandomness(keyHash, fee);
    }

    /**
    * Callback function used by VRF Coordinator
    */ 
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        address wavePortalContract = Registry(registry).getWavePortalContractAddress();
        console.log("je suis dans fulfillRandomness %s", randomness);
        IWavePortal(wavePortalContract).setRandomNumber(randomness);
    }
}