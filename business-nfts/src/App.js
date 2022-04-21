import './App.css';
import React from "react";
import { ethers } from "ethers";
import { RelayProvider } from "@opengsn/provider";
import ERC721Contract from "./artifacts/contracts/ZenoERC721.sol/ZenoERC721.json";



export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      originalERC721: "0x8385431F79590AF5a6d89A832236cA925DE6df04",
      erc721Address:"0xB62a211a0C83bbC85487d70C81e8c4bf55a0e4dd",
      paymaster: "0xA6e10aA9B038c9Cddea24D2ae77eC3cE38a0c016",
      forwarder: "0x83A54884bE4657706785D7309cf46B58FE5f6e8a",
    }
  }

  fetchAccounts = async() =>{
     await window.ethereum.request({method: "eth_requestAccounts"});
  }

  mintNft = async () => {
    await this.fetchAccounts();
    const paymaster = ethers.utils.getAddress(this.state.paymaster);
    const config = {
      relayLookupWindowBlocks: 1e5,
      relayRegistrationLookupBlocks: 1e5,
      pastEventsQueryMaxPageSize: 2e4,
      paymasterAddress: paymaster,
      loggerConfiguration: {
        logLevel: 'debug',
        // loggerUrl: 'logger.opengsn.org',
      }
    }
    const provider = await RelayProvider.newProvider({ provider: window.ethereum,config}).init();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const contract = new ethers.Contract(this.state.originalERC721,ERC721Contract.abi,web3Provider.getSigner());
    const mintTx = await contract.mintBusinessNFT(web3Provider.getSigner().getAddress(),"https://ipfs.io/ipfs/QmTpRhDrzQJ5X2yRSo3NfqsabaRV16DHanwYXd2HTjdfQR?filename=Frame%201%20(8).png",{gasLimit:600000});
    await mintTx.wait();
  }

  render() {
    return (
        <div className="App">
          <button onClick={this.mintNft}>Mint NFT without Gas</button>
        </div>
    )
  }
}

