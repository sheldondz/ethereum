// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.10;

import "./ZenoToken.sol";


contract Vendor {

    uint public constant tokensPerEth = 100;
    ZenoToken public zenoToken;

    constructor(address tokenAddress) {
        zenoToken = ZenoToken(tokenAddress);
    }

    event BuyTokens(address buyer, uint256 amountOfEth, uint256 amountOfTokens);
    event SellTokens(address from, address to, uint amount);

    receive() external payable {}

    function buyTokens() public payable {
        uint tokens = msg.value/ 1 ether * tokensPerEth;
        zenoToken.transfer(msg.sender, tokens);
        emit BuyTokens(msg.sender, tokensPerEth, tokens);
    }

    function sellTokens(uint256 tokens) public payable {
        zenoToken.transferFrom(msg.sender,address(this),tokens);
        emit SellTokens(msg.sender,address(this), tokens);
    }
}