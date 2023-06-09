import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
 

///////////////////////Escrow////////////////////////
/////TODO//////////////////
// const escrowDeployment = await deploy("Escrow", {
//   from: deployer,
//   log: true,
//   autoMine: true,
// });

//PriceFeedAddress = "0xC5981F461d74c46eB4b0CF3f4Ec79f025573B0Ea"/////
  const preciousDeploymentA = await deploy("MyPrecious", {
    args: [deployer], 
    from: deployer,
    log: true,
    autoMine: true,
  });
  
  const preciousDeploymentB = await deploy("MyPreciousB", {
    args: [deployer], 
    from: deployer,
    log: true,
    autoMine: true,
  });

  const preciousDeploymentC = await deploy("MyPreciousC", {
    args: [deployer], 
    from: deployer,
    log: true,
    autoMine: true,
  });

  const marketplaceDeployment = await deploy("JewelryMarketplace", {
    from: deployer,
    log: true,
    autoMine: true,
  });
  ////////////NFTs/////////////////////
  const preciousContractA = await ethers.getContractAt("MyPrecious", preciousDeploymentA.address);
  const preciousContractB = await ethers.getContractAt("MyPreciousB", preciousDeploymentB.address);
  const preciousContractC = await ethers.getContractAt("MyPreciousC", preciousDeploymentC.address);
  //////// Marketplace //////
  const marketplaceContract = await ethers.getContractAt("JewelryMarketplace", marketplaceDeployment.address);

  const ipfsURI1 = "ipfs://Qmf6oY7Am6Vc7ExrQiNaonHL9xfspSDpc1LwmdgJha8mna?filename=Rana-stlNft.json";
  const mintTx1 = await preciousContractA.safeMint(deployer, ipfsURI1);
  await mintTx1.wait();

  const ipfsURI2 = "ipfs://Qmf6oY7Am6Vc7ExrQiNaonHL9xfspSDpc1LwmdgJha8mna?filename=Rana-stlNft.json";
  const mintTx2 = await preciousContractB.safeMint(deployer, ipfsURI2);
  await mintTx2.wait();

  const ipfsURI3 = "ipfs://Qmf6oY7Am6Vc7ExrQiNaonHL9xfspSDpc1LwmdgJha8mna?filename=Rana-stlNft.json";
  const mintTx3 = await preciousContractC.safeMint(deployer, ipfsURI3);
  await mintTx3.wait();

  console.log(`Three NFTs minted with tokenIds: 0`);

  const tokenId1 = 0;
  const approveTx1 = await preciousContractA.approve(marketplaceContract.address, tokenId1);
  await approveTx1.wait();

  const price1 = ethers.utils.parseEther("0.01");
  const listTx1 = await marketplaceContract.listItem(preciousContractA.address, tokenId1, price1);
  await listTx1.wait();

  console.log(`NFT with tokenId: ${tokenId1} listed for sale at price: ${price1.toString()}`);

  const tokenId2 = 0;
  const approveTx2 = await preciousContractB.approve(marketplaceContract.address, tokenId2);
  await approveTx2.wait();

  const price2 = ethers.utils.parseEther("0.01");  // Assuming you want a different price for the second NFT
  const listTx2 = await marketplaceContract.listItem(preciousContractB.address, tokenId2, price2);
  await listTx2.wait();

  console.log(`NFT with tokenId: ${tokenId2} listed for sale at price: ${price2.toString()}`);

  const tokenId3 = 0;
  const approveTx3 = await preciousContractC.approve(marketplaceContract.address, tokenId3);
  await approveTx3.wait();

  const price3 = ethers.utils.parseEther("0.01");  // Assuming you want a different price for the second NFT
  const listTx3 = await marketplaceContract.listItem(preciousContractC.address, tokenId3, price3);
  await listTx3.wait();

  console.log(`NFT with tokenId: ${tokenId3} listed for sale at price: ${price3.toString()}`);

};

export default deployYourContract;
