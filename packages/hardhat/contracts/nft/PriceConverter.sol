// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getGoldPrice(AggregatorV3Interface goldPriceFeed)
        internal
        view
        returns (uint256)
    {
        (, int256 answer, , , ) = goldPriceFeed.latestRoundData();
        // Gold/USD rate with appropriate scaling
        return uint256(answer);
    }

    function getConversionRate(uint256 goldAmountGrams, AggregatorV3Interface goldPriceFeed)
        internal
        view
        returns (uint256)
    {
        uint256 goldPricePerGram = getGoldPrice(goldPriceFeed);
        uint256 goldAmountInUsd = goldPricePerGram * goldAmountGrams;
        return goldAmountInUsd;
    }
}
