import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractWrite, useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const MyPrecious = () => {
  const { address } = useAccount();
  const [tokenURI, setTokenURI] = useState("");

  const { writeAsync:doMint } = useScaffoldContractWrite ({
    contractName: "MyPrecious",
    functionName: "safeMint",
    args: [address, tokenURI],
  });

  const { writeAsync:doSetURI } = useScaffoldContractWrite ({
    contractName: "MyPrecious",
    functionName: "setTokenURI",
    args: ["tokenId", "newURI"],
  });

  const { data:goldPrice } = useScaffoldContractRead ({
    contractName: "MyPrecious",
    functionName: "getGoldPrice",
  });

  useEffect(() => {
    // Call getGoldPrice every 60 seconds to get the latest gold price
    const intervalId = setInterval(() => {
      doSetURI();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [doSetURI]);

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5">
        <h1 className="border-l-red-50"> My Precious</h1>
        <Address address={address} />

        <input type="text" value={tokenURI} onChange={(e) => setTokenURI(e.target.value)} placeholder="Enter token URI" />

        <button className="btn btn-primary" onClick={doMint}>Mint Token</button>
        <button className="btn btn-primary" onClick={doSetURI}>Set Token URI</button>

        <div> Gold Price: {goldPrice?.toString()} </div>
      </div>
    </div>
  );
};

export default MyPrecious;
