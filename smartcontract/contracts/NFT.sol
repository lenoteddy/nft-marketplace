// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTFactory {
    NFT[] public nft;

    function createNFT(
        string memory _uri,
        string memory _name,
        string memory _symbol
    ) external {
        NFT _nft = new NFT(_uri, _name, _symbol);
        nft.push(_nft);
    }

    function getNFTLength() public view returns (uint256) {
        return nft.length;
    }
}

contract NFT is ERC721 {
    string public uri;
    uint256 public tokenSupply = 0;

    constructor(
        string memory _uri,
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        uri = _uri;
    }

    function mint() external payable {
        _mint(msg.sender, tokenSupply);
        tokenSupply++;
    }

    function _baseURI() internal view override returns (string memory) {
        return uri;
    }
}
