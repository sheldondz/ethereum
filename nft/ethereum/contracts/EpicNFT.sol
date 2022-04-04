//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract EpicNFT is ERC721URIStorage {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint public totalMinted;
    uint _totalSupply;

    constructor() ERC721("EpicNFT","EPIC") {
        _totalSupply = 100;
        totalMinted = 0;
    }

    event NewEpicNFTMinted(address sender, uint256 tokenId, uint totalSupply);


    function mintNFT(string memory tokenUri) public checkLimit payable {
        uint tokenId = _tokenIds.current();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenUri);
        _tokenIds.increment();
        totalMinted++;
        emit NewEpicNFTMinted(msg.sender, tokenId, totalMinted);
    }

    modifier checkLimit() {
        require(totalMinted <= _totalSupply);
        _;
    }
}
