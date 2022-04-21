// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract ZenoToken is ERC20, Ownable {

    function mintBusinessNFT(uint memory businessId, address client, string memory tokenURI) public virtual returns (uint256);
}