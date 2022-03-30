import logo from './logo.svg';
import './App.css';
import React from "react"
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";


export default class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {}
  }
  connectWallet = async () => {
      const providerOptions = {
          walletconnect: {
              package: WalletConnectProvider,
              options: {
                  infuraId: process.env.INFURA
              }
          }
      };
      const web3Modal = new Web3Modal({
          cacheProvider: true, // optional
          disableInjectedProvider: false,
          providerOptions // required
      });
      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();
      console.log(signer.getAddress());
  }
  render() {
    return (
        <div className="App">
            <button onClick={this.connectWallet}>CONNECT WALLET</button>
        </div>
    );
  }
}

