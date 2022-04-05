// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;
import "hardhat/console.sol";

contract Wave {

    uint public totalWaves;
    uint waveId;
    address owner;
    uint constant rewardAmount = 0.001 ether;

    struct Message {
        uint id;
        address from;
        string message;
        uint timestamp;
    }
    event NewWave(address indexed from, uint256 timestamp, string message);
    event NewReward(address indexed to);
    Message [] waves;

    constructor() payable {
        console.log("Starting with the wave contract");
        owner = msg.sender;
    }

    function wave(string memory message) public  {
        Message memory item =  Message(waveId++, msg.sender, message, block.timestamp);
        waves.push(item);
        totalWaves++;
        emit NewWave(msg.sender, block.timestamp, message);
    }

    function reward() public payable  {
        require(msg.sender == owner, "Only manager can process reward");
        require(address(this).balance > rewardAmount, "insufficient balance");
        uint256 randomIndex = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % waves.length;
        Message storage user = waves[randomIndex];
        (bool success,) = (user.from).call{value: rewardAmount}("");
        require(success, "Failed to withdraw money from contract.");
        emit NewReward(user.from);
    }

    function getMessages() public view returns (Message[] memory) {
        return waves;
    }
}