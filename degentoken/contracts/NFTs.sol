// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTs is ERC721URIStorage {
    uint256 private TokenCount;
    mapping(address => string[]) public mintedAssets;

    constructor() ERC721("ITEMS", "ITM") {}

    function gameAssetMint(address to, string memory _URI) public {
        _mint(to, TokenCount);
        _setTokenURI(TokenCount, _URI);
        mintedAssets[to].push(_URI);
        TokenCount++;
    }

    function returnMintedNFT(
        address _myAddress
    ) external view returns (string[] memory) {
        return mintedAssets[_myAddress];
    }
}
