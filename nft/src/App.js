import logo from './logo.svg';
import './App.css';
import React from "react";
import { ethers } from "ethers";
import EpicNFT from "./artifacts/contracts/EpicNFT.sol/EpicNFT.json"
import { create } from "ipfs-http-client";

export default class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          metadata: "",
          contractAddress:"0x73739313721faDa01fbB4cfdb89294882e7603c6",
          metadataHash: "",
          ipfsBasePath:"https://ipfs.infura.io/ipfs/"
      }
  }

  fetchAccounts = async () => {
      await window.ethereum.request({method:"eth_requestAccounts"});
  }

  uploadMetadata = async () => {
      const client = create({host:"ipfs.infura.io",port:5001,apiPath:"/api/v0"})
      const { cid } = await client.add(this.state.metadata);
      console.log(cid);
      this.setState({metadataHash: this.state.ipfsBasePath+cid.path});
  }

  mintNFT = async () => {
      await this.fetchAccounts();
      await this.uploadMetadata();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(this.state.contractAddress,EpicNFT.abi,signer);
      const transaction = await nftContract.mintNFT(this.state.metadataHash);
      await transaction.wait();
  }

  render() {
    return (
        <div className="App">
          <input type="text" onChange={e=>this.setState({metadata: e.target.value})}/>
          <button onClick={this.mintNFT}>Mint NFT</button>
        </div>
    );
  }
}
