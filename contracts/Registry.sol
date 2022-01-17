pragma solidity ^0.8.0;
// SPDX-License-Identifier: UNLICENSED

contract Registry {
    bytes32 private constant RANDOM_NUMBER_GENERATOR_CONTRACT = keccak256("RandomNumberGenerator");
    bytes32 private constant WAVE_PORTAL_CONTRACT = keccak256("WavePortal");

    mapping(bytes32 => address) public mapContracts;

    event MapContractUpdated(bytes32 _key, address _oldAddr, address _newAddr);

    function mapContract(bytes32 _key, address _addr) public {
        emit MapContractUpdated(_key, mapContracts[_key], _addr);
        mapContracts[_key] = _addr;
    }

    function getRandomNumberGeneratorContractAddress() public view returns (address) {
        return mapContracts[RANDOM_NUMBER_GENERATOR_CONTRACT];
    }
    
    function getWavePortalContractAddress() public view returns (address) {
        return mapContracts[WAVE_PORTAL_CONTRACT];
    }
}