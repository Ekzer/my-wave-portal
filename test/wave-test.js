const {expect} = require("chai");

describe("WavePortal Contract", () => {
    it("Wave total count should increase and be linked to msg.send", async () => {
        const wavePortalContract = await hre.ethers.getContractFactory("WavePortal");
        const waveContract = await wavePortalContract.deploy();

        const [owner] = await hre.ethers.getSigners();
        console.log("WavePortal Smart Contract deployed to :" + waveContract.address);
        console.log("WavePortal Smart Contract deployed by :" + owner.address);

        let totalWaves = await waveContract.getTotalWaves();
        expect(totalWaves).to.equal(0);

        const waveTxn = await waveContract.wave();
        totalWaves = await waveContract.getTotalWaves();
        expect(totalWaves).to.equal(1);

        const ownerWaves = await waveContract.getWavesByAddr(owner.address);
        expect(ownerWaves).to.equal(1);
    })

    it("Wave from other people should be stored", async() => {
        const wavePortalContract = await hre.ethers.getContractFactory("WavePortal");
        const waveContract = await wavePortalContract.deploy();

        const [owner, randomPerson] = await hre.ethers.getSigners();

        const waveRandomPersonTxn = await waveContract.connect(randomPerson).wave();
        const totalWaves = await waveContract.getTotalWaves();
        expect(totalWaves).to.equal(1);

        const randomPersonWaves = await waveContract.getWavesByAddr(randomPerson.address);
        expect(randomPersonWaves).to.equal(1);
    })
})