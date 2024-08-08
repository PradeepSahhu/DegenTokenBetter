# Degen Token Game

![Avalanche](https://img.shields.io/badge/Avalanche-Fuji_Network-red.svg)
![Status](https://img.shields.io/badge/Website-Running-088395.svg)

In this Project i have implemented the ERC20 (Tokens) and ERC721URIStorage (NFTs) from open Zeppelin.

## There are two Contracts in this

- DegenERC20
- GameAsset

## Through this Project i tried to show the practical implementation of the Tokens and NFTs like

- How Tokens can be used to Buy/Redeem the NFTs.
- How Tokens can be transfered
- How Tokens can be minted (only by owner)

## Explanation of DegenERC20 Contract

```Solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./gameAsset.sol";

contract DegenERC20 is ERC20 {
    modifier onlyOwner() {
        require(owner == msg.sender);
        _;
    }

    address private immutable owner;
    GameAsset immutable gameAsset;

    constructor(uint _tokenToMint) ERC20("Degen", "DGN") {
        owner = msg.sender;
        gameAsset = new GameAsset();
        _mint(msg.sender, _tokenToMint); // very small amount because it takes high gas fees
    }

    ///@notice to reward a certain user by _amount amount only callable by the owner.

    function mintTokenReward(
        address _address,
        uint _amount
    ) external onlyOwner {
        _mint(_address, _amount);
    }

    ///@notice for checking the balance of token of caller account.

    function checkingBalance() external view returns (uint) {
        return balanceOf(msg.sender);
    }

    ///@notice to transfer token to other account(friend)

    function tranferTokens(address _recepient, uint _amount) external {
        require(balanceOf(msg.sender) >= _amount);
        transfer(_recepient, _amount);
    }

    ///@notice redeeming  token for a NFT
    function redeemTokens(string memory _URI, uint _NftPrice) external {
        require(balanceOf(msg.sender) >= _NftPrice);
        _transfer(msg.sender, address(this), _NftPrice);
        gameAsset.gameAssetMint(msg.sender, _URI);
    }

    function getMintedNFT() external view returns (string[] memory) {
        return gameAsset.returnMintedNFT(msg.sender);
    }

    ///@notice burn the _tokenAmount amount of token

    function burnToken(uint _tokenAmount) external {
        require(balanceOf(msg.sender) >= _tokenAmount);
        _burn(msg.sender, _tokenAmount);
    }

    ///@notice to withdraw all tokens
    function withdraw() external onlyOwner {
        _transfer(address(this), owner, balanceOf(address(this)));
    }

    function contractBalance() external view returns (uint) {
        return balanceOf(address(this));
    }

    ///@notice to receive wei/ethers from external sources like other account

    receive() external payable {}
}
```

### Constructor

- Its Initializing the Owner variable to the address of the deployer.
- Its make a new instance of GameAsset Contract and assigning it to gameAsset state variable.
- Its also minting some initial Token for the owner.

### MintTokenReward (onlyOwner)

I made this function such that to reward other accounts however i used is to mint for myself(owner) account.

- This function takes some amount as parameter and mints that amount of tokens (applicable only for owner)

### checkingBalance

- This function is used to check the token balance of the current user.

### transferTokens

- This function is used to transfer some amount of tokens to other account.

### getMintedNFT

- This function calls the `returnMintedNFT` of gameAsset contract which returns the URI of all the minted NFTs for the current account.(caller account)

### burnToken

- As the name suggest this function burns the \_amount of tokens from the current caller account

### withdraw and contractBalance

- These two are the functions which i didnt used but they are used to withdraw the tokens from the contract and check the token balance of the contract. (onlyOwner)

## GameAsset Contract

```Solidity

// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract GameAsset is ERC721URIStorage {
    uint256 private TokenCount;
    mapping(address => string[]) public mintedAssets;

    constructor() ERC721("GameAsset", "GAT") {}

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
```

## gameAssetMint

- This function takes two arguments `to` as address and string `_URI` to mint the NFT to the `to` address.

## returnMintedNFT

- This function return the string of the minted URI of the current User.

Author : Pradeep Sahu

## Website Design

## Initial Web Design (without Metamask connected)

<img width="1469" alt="image" src="https://github.com/PradeepSahhu/DegenGameTokenNFTFullStack/assets/94203408/b26ea8be-1fc0-49b3-8cd9-42f67b7cbf8e">

## Initial Web Design (Metamask Connected)

<img width="1470" alt="image" src="https://github.com/PradeepSahhu/DegenGameTokenNFTFullStack/assets/94203408/4687078e-3cf5-4d10-80b5-293b9d675faf">

## Bought NFT UI

<img width="1470" alt="image" src="https://github.com/PradeepSahhu/DegenGameTokenNFTFullStack/assets/94203408/809d1ffe-bbdb-497e-9b25-72d64c42e992">

## NFT MarketPlace

<img width="1466" alt="image" src="https://github.com/PradeepSahhu/DegenGameTokenNFTFullStack/assets/94203408/6a6b6d9e-96ba-4e0c-b8e9-b0cb6a9776e2">

## Learn In public

LinkedIn Post : https://www.linkedin.com/posts/pradeepsahuu_improved-my-nft-marketplace-where-you-can-activity-7213144087267356672-No52?utm_source=share&utm_medium=member_desktop

Vercel Production / Deployed Link : https://degen-game-token-nft-full-stack-h8fw.vercel.app/
