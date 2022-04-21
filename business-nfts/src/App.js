import './App.css';
import React from "react";
import { ethers } from "ethers";
import { RelayProvider } from "@opengsn/provider";
import ERC721Contract from "./artifacts/contracts/ZenoERC721.sol/ZenoERC721.json";



export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      erc721Address:"0x6bEaaECA1619135c90AbB4D02Ba98033582bbcF0",
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
      paymasterAddress: paymaster,
      loggerConfiguration: {
        logLevel: 'debug',
        // loggerUrl: 'logger.opengsn.org',
      }
    }
    const asyncApprovalData = async function (relayRequest: RelayRequest) {
      relayRequest.relayData.forwarder = ethers.utils.getAddress(this.state.forwarder);
      return Promise.resolve(relayRequest);
    }
    const provider = await RelayProvider.newProvider({ provider: window.ethereum, config, overrideDependencies:{ asyncApprovalData }}).init();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const contract = new ethers.Contract(this.state.erc721Address,ERC721Contract.abi,web3Provider.getSigner());
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

