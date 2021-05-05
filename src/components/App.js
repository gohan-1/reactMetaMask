import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import nftToken from '../abis/nftToken.json'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()
    const networkData = nftToken.networks[networkId]
    if(networkData) {
      const abi = nftToken.abi
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)
      this.setState({ contract })

      /// this will return array of  token id 
      const arrayTokens = await contract.methods.tokensOfOwner(this.state.account).call()
     
      // Load nftTokens
      for (var i = 1; i <= arrayTokens; i++) {
        const nftToken = await contract.methods.tokenURI(arrayTokens[i]).call()
        this.setState({
          nftTokens: [...this.state.nftTokens, nftToken]
        })
      }
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }


  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0,
      nftTokens: []
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
            nftToken Tokens
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white"><span id="account">{this.state.account}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          
          <hr/>
          <div className="row text-center">
            { this.state.nftTokens.map((nftToken, key) => {
              return(
                <div key={key} className="col-md-3 mb-3">
                  <div className="token" style={{ backgroundnftToken: nftToken }}></div>
                  <div>{nftToken}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
