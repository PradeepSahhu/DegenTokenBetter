// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./NFTs.sol";

contract DegenTokenERC20 is ERC20 {
    modifier onlyOwner() {
        require(owner == msg.sender);
        _;
    }

    address private immutable owner;
    NFTs nfts;

    constructor(uint _tokenToMint) ERC20("Degen", "DGN") {
        owner = msg.sender;
        nfts = new NFTs();
        _mint(msg.sender, _tokenToMint);
    }

    function generateToken(address _address, uint _amount) external onlyOwner {
        _mint(_address, _amount);
    }

    function BuyTokens(uint _amount) external payable {
        uint amountToPay = 100 * _amount;
        require(msg.value >= amountToPay, "Not Payed Enough");
        (bool response, ) = payable(msg.sender).call{
            value: msg.value - amountToPay
        }("");
        require(response, "Can't return payment");
        _mint(msg.sender, _amount);
    }

    function checkingTokenBalance() external view returns (uint) {
        return balanceOf(msg.sender);
    }

    function tranferTokens(address _recepient, uint _amount) external {
        require(balanceOf(msg.sender) >= _amount);
        transfer(_recepient, _amount);
    }

    function redeemTokens(string memory _URI, uint _NftPrice) external {
        require(balanceOf(msg.sender) >= _NftPrice);
        _transfer(msg.sender, address(this), _NftPrice);
        nfts.gameAssetMint(msg.sender, _URI);
    }

    function getMintedNFT() external view returns (string[] memory) {
        return nfts.returnMintedNFT(msg.sender);
    }

    function burnToken(uint _tokenAmount) external {
        require(balanceOf(msg.sender) >= _tokenAmount);
        _burn(msg.sender, _tokenAmount);
    }

    receive() external payable {}
}
