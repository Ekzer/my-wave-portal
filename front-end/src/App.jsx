import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import wavePortal from './smart-contract/WavePortal.js';

const wavePortalContract = wavePortal.instance();

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [totalWave, setTotalWave] = useState(0);
  const [message, setMessage] = useState("");
  const [waves, setWaves] = useState([]);

  
  const buildUrl = (address) => {
    return `https://rinkeby.etherscan.io/address/${address}`;
  };

  const getAllWaves = async() => {
    try {
        const allWaves = await wavePortalContract.getAllWaves();
        const wavesCleaned = allWaves.map(w => {
          return {
            address: w.waver,
            timestamp: new Date(w.timestamp * 1000),
            message: w.message
          }});
        setWaves(wavesCleaned);
    } catch (error) {
      console.error(error);
    }
  }

  
  const checkIfWalletIsConnected = async () => {
    try {
        const count = await wavePortalContract.getTotalWaves();
        setTotalWave(count.toNumber());
      // ask metamask authorization to consult eth accounts
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length > 0) {
        const account = accounts[0];
        console.log("Found authorized account + ", account);
        setCurrentAccount(account);
        await getAllWaves();
        return true;
      } else {
        console.error("No authorized account found, please allow one");
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  const wave = async () => {
      try {
        const waveTxn = await wavePortalContract.wave(message);
        await waveTxn.wait();
        const newCount = await wavePortalContract.getTotalWaves();
        setTotalWave(newCount.toNumber());
      } catch(error) {
        console.log(error);
      }
  }

  useEffect(async () => {
    await checkIfWalletIsConnected();
  }, [])

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>

        <div className="bio">
          <p>Network: Rinkeby</p>
          {totalWave} waves 👋
          <br/>
          Connect your MetaMask and wave at me!
        </div>

        {wavePortalContract && 
        <div className="bio">
          <div align="left">Contract address: <a href={buildUrl(wavePortalContract.address)} target="_blank">{wavePortalContract.address}</a></div>
          
          {currentAccount && 
          <p align="left">Connected! <a href={buildUrl(currentAccount)} target="_blank">{currentAccount}</a>
          </p>}
        </div>}

        {!currentAccount && 
          <button className="connectButton" onClick={() => checkIfWalletIsConnected()}>Connect Wallet</button>
        }
        
        <div style={{marginBottom: "5px", color: "grey"}}>Message:</div>
        <input type="text" name="message" onChange={(event) => setMessage(event.target.value)}></input>
        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {waves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}

export default App;