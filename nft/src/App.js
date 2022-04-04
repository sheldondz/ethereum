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
          contractAddress:"0x7D03d5bAeF809cB588b3A365de92f8EF03a4B8F3",
          metadataHash: "",
          ipfsBasePath:"https://ipfs.infura.io/ipfs/",
          totalSupply: 0
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
      nftContract.on("NewEpicNFTMinted", (from, tokenId, totalSupply) => {
          console.log(from, tokenId.toNumber())
          console.log(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${this.state.contractAddress}/${tokenId.toNumber()}`);
          console.log("Total minted",totalSupply);
          this.setState({totalSupply: totalSupply.toNumber()});
      });
      const transaction = await nftContract.mintNFT(this.state.metadataHash);
      await transaction.wait();
  }

  render() {
    return (
        <div className="App">
          <input type="text" onChange={e=>this.setState({metadata: e.target.value})}/>
          <button onClick={this.mintNFT}>Mint NFT</button>
          <div>
              <h2>Total supply: 100</h2>
              <h2>Total minted: {this.state.totalSupply}</h2>
          </div>
        </div>
    );
  }
}
