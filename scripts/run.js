const main = async() => {
    const [owner] = await hre.ethers.getSigners();
    const balance = await owner.getBalance();
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal"); // get contract
    const waveContract = await waveContractFactory.deploy(); // create a local ethereum network, fresh blockchain, deploy on it
    await waveContract.deployed(); //
    console.log("WavePortal Smart Contract deployed to :" + waveContract.address);
    console.log("WavePortal Smart Contract deployed by :" + owner.address);
    console.log("Owner balance: " + balance);

}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();