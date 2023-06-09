import Head from "next/head";
import { useAccount } from "wagmi";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { useState, useEffect } from 'react';
import { ethers } from "ethers";

const Marketplace: NextPage = () => {
  const { address } = useAccount()

  const nftAddressA = "0xeD1A25bd06DAb58F30fBbBF2FCA5a2D685157E02";
  const nftAddressB = "0x03cd5a62a28C80961E13391efa9b06505892338c";
  const nftAddressC = "0xaF52c739819e72b5431b1D0Ce7fF26B4280Ec113";
  const tokenId = 0;

  // Add a state to store notification
  const [notification, setNotification] = useState(""); 

  /////////Listings//////////
  const { data:listingA } = useScaffoldContractRead ({
    contractName: "JewelryMarketplace",
    functionName: "getListing",
    args: [nftAddressA, tokenId],
  });

  const { data:listingB } = useScaffoldContractRead ({
    contractName: "JewelryMarketplace",
    functionName: "getListing",
    args: [nftAddressB, tokenId],
  });

  const { data:listingC } = useScaffoldContractRead ({
    contractName: "JewelryMarketplace",
    functionName: "getListing",
    args: [nftAddressC, tokenId],
  });

  //////////////////////TokenURI////////////////////////
  const { data:tokenUriA } = useScaffoldContractRead({
    contractName: "MyPrecious",
    functionName: "tokenURI",
    args: [tokenId],
  });

  const { data:tokenUriB } = useScaffoldContractRead({
    contractName: "MyPreciousB",
    functionName: "tokenURI",
    args: [tokenId],
  });

  const { data:tokenUriC } = useScaffoldContractRead({
    contractName: "MyPreciousC",
    functionName: "tokenURI",
    args: [tokenId],
  });

  const valueInEtherA = listingA ? ethers.utils.formatEther(listingA.price.toString()) : "0";
  const valueInEtherB = listingB ? ethers.utils.formatEther(listingB.price.toString()) : "0";
  const valueInEtherC = listingC ? ethers.utils.formatEther(listingC.price.toString()) : "0";

  ////////////doBuys/////
const { writeAsync:doBuyA } = useScaffoldContractWrite ({
  contractName: "JewelryMarketplace",
  functionName: "buyItem",
  args: [nftAddressA, tokenId],
  value: valueInEtherA
});
const { writeAsync:doBuyB } = useScaffoldContractWrite ({
  contractName: "JewelryMarketplace",
  functionName: "buyItem",
  args: [nftAddressB, tokenId],
  value: valueInEtherB
});

const { writeAsync:doBuyC } = useScaffoldContractWrite ({
  contractName: "JewelryMarketplace",
  functionName: "buyItem",
  args: [nftAddressC, tokenId],
  value: valueInEtherC
});



     // Add a function to handle the notification
  const handleNotification = (distance, tokens) => {
    const notificationMessage = `Delivery to Washington from New York: ${distance} km. ${tokens} BrandToken will be sent.`;
    setNotification(notificationMessage);
  };

  // Add a function to handle the buy event
  const handleBuy = async (doBuy) => {
    await doBuy();
    handleNotification(350, 350);
  };
  

  const [metadataA, setMetadataA] = useState(null);
  const [metadataB, setMetadataB] = useState(null);
  const [metadataC, setMetadataC] = useState(null);

  useEffect(() => {
    if (tokenUriA) {
      fetch(`https://ipfs.io/ipfs/${tokenUriA.split("ipfs://")[1]}`)
        .then(response => response.json())
        .then(data => setMetadataA(data));
    }
    if (tokenUriB) {
      fetch(`https://ipfs.io/ipfs/${tokenUriB.split("ipfs://")[1]}`)
        .then(response => response.json())
        .then(data => setMetadataB(data));
    }
    if (tokenUriC) {
      fetch(`https://ipfs.io/ipfs/${tokenUriC.split("ipfs://")[1]}`)
        .then(response => response.json())
        .then(data => setMetadataC(data));
    }
  }, [tokenUriA, tokenUriB, tokenUriC]);
  function renderNftCard(metadata, doBuy, priceInEther) {
    if (!metadata) return null;

    return (
      <div className="card m-4 bg-white rounded-xl shadow-md flex flex-col overflow-hidden w-64">
        <img className="w-full" src={`https://ipfs.io/ipfs/${metadata.image.split("ipfs://")[1]}`} alt={metadata.name} />
        <div className="p-6">
          <div className="font-bold text-xl mb-2">{metadata.name}</div>
          <p className="text-gray-700 text-base">{metadata.description}</p>
          <p>Weight: {metadata.attributes.find(attr => attr.trait_type === "Weight").value}</p>
          <p>Price: {priceInEther} ETH</p>
          <button
        className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => handleBuy(doBuy)}
      >
        Buy NFT
      </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row flex-wrap justify-center items-center">
      {/* Add a div to render the notification */}
      {notification && 
        <div className="notification px-4 py-2 mb-4 bg-blue-200 text-blue-800 border border-blue-400 rounded">
          {notification}
        </div>
      }
      {metadataA && renderNftCard(metadataA, doBuyA, valueInEtherA)}
      {metadataB && renderNftCard(metadataB, doBuyB, valueInEtherB)}
      {metadataC && renderNftCard(metadataC, doBuyC, valueInEtherC)}
    </div>
  );
  
};

export default Marketplace;
