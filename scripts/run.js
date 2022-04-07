const { ethers } = require("hardhat");
const main = async () => {
    const nftContractFactory = await ethers.getContractFactory("NFTMinter");
    const nftContract = await nftContractFactory.deploy();
    await nftContract.deployed();
    console.log("Contract deployed to: ", nftContract.address);

    // Mint NFT
    let txn = await nftContract.mintNFT();
    // wait for transaction to be mined
    await txn.wait();

    txn = await nftContract.mintNFT();
    // wait for transaction to be mined
    await txn.wait();
}

main()
    .then(() => {
        process.exit(0);
    })
    .catch((e) => {
        console.log(e);
        process.exit(1);
    })
