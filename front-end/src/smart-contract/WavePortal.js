import abi from './config/WavePortalConfig.json';
import { ethers } from "ethers";

const WAVE_PORTAL_CONTRACT_CONSTANTS = {
  address: "0x26EFaEd01e8db26A604039E59d1A69cB2f151Ca4",abi: abi.abi,
};

export default {
  ...WAVE_PORTAL_CONTRACT_CONSTANTS,
  instance: () => {
    try {
        const { ethereum } = window;
        if (ethereum) {
          console.log("MetaMask is available");
        } else {
          console.error("MetaMask is unavailable. Please install it!")
          return null;
        }

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(WAVE_PORTAL_CONTRACT_CONSTANTS.address, WAVE_PORTAL_CONTRACT_CONSTANTS.abi, signer);
        console.log(contract);
        return contract;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
};