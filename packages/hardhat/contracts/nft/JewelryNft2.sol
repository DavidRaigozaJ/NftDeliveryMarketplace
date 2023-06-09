// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

// Import Chainlink's AggregatorV3Interface for price feed

contract MyPreciousB is ERC721, ERC721URIStorage, Ownable {
  using Counters for Counters.Counter;
 
  // Token ID counter
  Counters.Counter private _tokenIdCounter;

  // Mapping from token ID to IPFS hash
  mapping(uint256 => string) private _tokenURIs;

constructor(address _owner) ERC721("WeightNft", "PMP") {
    transferOwnership(_owner);
}
function setTokenURI(uint256 tokenId, string memory _tokenURI) public onlyOwner {
    _tokenURIs[tokenId] = _tokenURI;
  }
function safeMint(address to, string memory _tokenURI) public onlyOwner {
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
    setTokenURI(tokenId, _tokenURI);
    console.log(
        "DONE!!! minted token ",
        tokenId,
        " and assigned token url: ",
        _tokenURI
    );
    // Get the conversion rate of Gold in USD
     //uint256 priceInUSD = goldAmountGrams.getConversionRate();
}
  // The following functions are overrides required by Solidity.
  // Override tokenURI function
  function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return _tokenURIs[tokenId];
  }

  function getOwner() public view returns (address) {
    return owner();
}

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
    // Clear metadata (if any) when token gets burned
    if (bytes(_tokenURIs[tokenId]).length != 0) {
      delete _tokenURIs[tokenId];
    }
  }
}
