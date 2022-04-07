import React, {useEffect, useState} from 'react';
import { ethers } from "ethers";
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = 'kaliberpoziomka';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TOTAL_MINT_COUNT = 50;
const CONTRACT_ADDRESS = "0xF7940b57666E90C7ab02b2A078dFC743317A7127";
const nftABI = ["function mintNFT() public"];

const RARIBLE_LINK = `https://rinkeby.rarible.com/collection/${CONTRACT_ADDRESS}/items`;



const App = () => {
  // HOOKS
  const [currentAccount, setCurrentAccount] = useState("");
  const [currentNftId, setCurrentNftId] = useState("");
  
  // CHECK IS USER IS CONNECTED
  const checkIfWalletIsConnected = async () => {
    const {ethereum} = window;
    // Check if user has metamask installed as a browser plugin
    if(!ethereum) {
      console.log("Make sure you have metamas!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    let chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log("Connected to chain " + chainId);

    // String, hex code of the chainId of the Rinkebey test network
    const rinkebyChainId = "0x4"; 
    if (chainId !== rinkebyChainId) {
    	alert("You are not connected to the Rinkeby Test Network!");
      return;
    }

  // Get user authorized accounts
  // const accounts = await ethereum.request({ method: 'eth_accounts' });
    const accounts = await ethereum.request({ method: 'eth_accounts' });
  // Grab first authorized account that user has
  if (accounts.length !== 0) {
    const account = accounts[0];
    console.log("Found an authorized account: ", account);
    setCurrentAccount(account);

  } else {
    console.log("No authorized account found");
  }
}
  // CONNECT WALLET (IF USER NOT CONNECTED)
  const connectWallet = async () => {
    try {
      const {ethereum} = window;
      // assert that there is a metatamsk still
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      // Request access to account
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

    } catch (e) {
      console.log(e);
    }
  }

  const mintNFT = async () => {
    try {
      const {ethereum} = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, nftABI, signer);

        let nftTxn = await connectedContract.mintNFT();
        console.log("Minig... please wait");
        await nftTxn.wait();
        console.log(`Mined, see transaction at Etherscan: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
        
        connectedContract.on("NewTochaNFT", (sender, tokenId) => {
          setCurrentNftId(`${tokenId.toNumber()}`)
          console.log(sender, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch(e) {
      console.log(e);
    }
  }

  
  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">
            <a className="letter-color1">T</a>
            <a className="letter-color2">o</a>
            <a className="letter-color3">c</a>
            <a className="letter-color4">h</a>
            <a className="letter-color5">a</a>
             NFT Collection</p>
          <p className="sub-text">
            <a className="letter-color1">T</a>
            <a className="letter-color2">o</a>
            <a className="letter-color3">c</a>
            <a className="letter-color4">h</a>
            <a className="letter-color5">a</a>
            <a className="letter-color5"> </a>
             is an unique creature. Get your one unique Tocha as NFT today. 
          </p>
          {currentAccount === "" ? renderNotConnectedContainer()
          : (
            <button onClick={mintNFT} className="cta-button connect-wallet-button">
            Mint <a className="letter-color1">T</a>
            <a className="letter-color2">o</a>
            <a className="letter-color3">c</a>
            <a className="letter-color4">h</a>
            <a className="letter-color5">a</a>NFT
            </button>
          )}
            <a href={RARIBLE_LINK}>
              <button onClick={connectWallet} className="cta-button connect-wallet-button">
                See collection
              </button>
            </a>
          
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >
            {`built by @${TWITTER_HANDLE}`}
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;