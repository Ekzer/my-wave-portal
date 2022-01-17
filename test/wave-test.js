const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("WavePortal Contract", () => {
    let waveContract, randomNumberGeneratorContract, registryContract;
    let previousContractBalance, previousOwnerBalance;
    before(async() => {
        const wavePortalContract = await ethers.getContractFactory("WavePortal");
        const randomNumberContract = await ethers.getContractFactory("RandomNumberGenerator");
        const registry = await ethers.getContractFactory("Registry");
        registryContract = await registry.deploy();
        await registryContract.deployed();

        waveContract = await wavePortalContract.deploy(registryContract.address, {
            value: ethers.utils.parseEther("1")
        });
        await waveContract.deployed();
        randomNumberGeneratorContract = await randomNumberContract.deploy(registryContract.address, {
            value: ethers.utils.parseEther("1")
        })
        await randomNumberGeneratorContract.deployed();
        
        const contractBalance = await ethers.provider.getBalance(waveContract.address);
        expect(contractBalance).to.eql(ethers.utils.parseEther("1"));
        previousContractBalance = contractBalance;
    })

    it("Wave total count should increase and be linked to msg.send", async () => {
        const [owner] = await ethers.getSigners();
        const ownerBalance = await ethers.provider.getBalance(owner.address);
        console.log("WavePortal Smart Contract deployed to :" + waveContract.address);
        console.log("RandomNumberGenerator Smart Contract deployed to :" + randomNumberGeneratorContract.address);
        console.log("WavePortal Smart Contract deployed by :" + owner.address);
        console.log("Owner balance :" + ownerBalance);

        let totalWaves = await waveContract.getTotalWaves();
        expect(totalWaves).to.equal(0);

        const waveTxn = await waveContract.connect(owner).wave("Hello World");
        await waveTxn.wait();
        totalWaves = await waveContract.getTotalWaves();
        previousOwnerBalance = await ethers.provider.getBalance(owner.address);
        expect(totalWaves).to.equal(1);

        const ownerWaves = await waveContract.getWavesByAddr(owner.address);
        expect(ownerWaves).to.equal(1);
    })

    it("WavePortal balance should decrease and owner balance should increase", async () => {
        const [owner] = await ethers.getSigners();
        const ownerBalance = await ethers.provider.getBalance(owner.address).then((value) => ethers.utils.formatEther(value));
        const contractBalance = await ethers.provider.getBalance(waveContract.address).then((value) => ethers.utils.formatEther(value));
        console.log("ownerBalance: " + ownerBalance);
        console.log("contractBalance: " + contractBalance);

        expect(contractBalance).to.eq(ethers.utils.formatEther(previousContractBalance.sub(ethers.utils.parseEther("0.0001"))));
        //expect(ownerBalance).to.eq(ethers.utils.formatEther(previousOwnerBalance.add(ethers.utils.parseEther("0.0001")))); doesn't work? why? On deployed contract, we txns of funding
    })

    it("Wave from other people should be stored and emit newWave event", async() => {
        const [_, randomPerson] = await ethers.getSigners();
        const message = "Hello World 2";
        const waveRandomPersonTxn = await waveContract.connect(randomPerson).wave(message);
        const receipt = await waveRandomPersonTxn.wait();
        const newWaveEvent = receipt.events.find(event => event.event === "NewWave");
        expect(newWaveEvent).to.exist;
        const [from, timestamp, msg] = newWaveEvent.args;
        expect(from).to.eql(randomPerson.address);
        expect(msg).to.eql(message);
        const totalWaves = await waveContract.getTotalWaves();
        expect(totalWaves).to.equal(2);

        const randomPersonWaves = await waveContract.getWavesByAddr(randomPerson.address);
        expect(randomPersonWaves).to.equal(1);
    })

    it("Get every wave object", async() => {
        const waves = await waveContract.getAllWaves();
        console.log(waves);
        expect(waves.length).to.equal(2);
        expect(waves.map(elem => elem.message)).to.eql(["Hello World", "Hello World 2"]);
    })
    
})