// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.10;
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@opengsn/contracts/src/BaseRelayRecipient.sol";


contract ZenoERC721 is ERC721URIStorage, BaseRelayRecipient {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    event BusinessNFTMinted(address previousHolder, address currentHolder, address client, uint itemId);

    constructor(address trustedForwarder) ERC721("ZenoNFT", "ZENO") {
        _setTrustedForwarder(trustedForwarder);
    }

    function mintBusinessNFT(address client, string memory tokenURI) public virtual returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(client, newItemId);
        _setTokenURI(newItemId, tokenURI);
        emit BusinessNFTMinted(msg.sender, _msgSender(), client, newItemId);
        return newItemId;
    }

    function versionRecipient() external view override virtual returns (string memory){
        return "2.2.0+opengsn.vpm.ipaymaster";
    }

    function _msgSender() internal view override(Context, BaseRelayRecipient)
    returns (address sender) {
        sender = BaseRelayRecipient._msgSender();
    }

    function _msgData() internal view override(Context, BaseRelayRecipient)
    returns (bytes memory) {
        return BaseRelayRecipient._msgData();
    }
}