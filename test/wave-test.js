const {expect} = require("chai");

describe("WavePortal Contract", () => {
    let waveContract;
    before(async() => {
        const wavePortalContract = await hre.ethers.getContractFactory("WavePortal");
        waveContract = await wavePortalContract.deploy();
    })
    it("Wave total count should increase and be linked to msg.send", async () => {
        const [owner] = await hre.ethers.getSigners();
        console.log("WavePortal Smart Contract deployed to :" + waveContract.address);
        console.log("WavePortal Smart Contract deployed by :" + owner.address);

        let totalWaves = await waveContract.getTotalWaves();
        expect(totalWaves).to.equal(0);

        const waveTxn = await waveContract.wave("Hello World");
        await waveTxn.wait();
        totalWaves = await waveContract.getTotalWaves();
        expect(totalWaves).to.equal(1);

        const ownerWaves = await waveContract.getWavesByAddr(owner.address);
        expect(ownerWaves).to.equal(1);
    })

    it("Wave from other people should be stored and emit newWave event", async() => {
        const [_, randomPerson] = await hre.ethers.getSigners();
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