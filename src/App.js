import { useState } from "react";

// Dependencies
import Web3 from "web3";
import Web3Modal from "web3modal";

// Config
import {
  // Smart contract
  SMART_CONTRACT_ADDRESS,
  SMART_CONTRACT_ABI,

  // Collection
  PUBLIC_SALE_MINT_PRICE,
  WHITELIST_SALE_MINT_PRICE,
} from "./config";

// App
const App = () => {
  // States
  const [walletConnected, setWalletConnected] = useState(false);

  const [whitelistSale, setWhitelistSale] = useState(false);

  // DAPP - Functions
  const connectWallet = async () => {
    if (Web3.givenProvider) {
      const providerOptions = {};

      const web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
        providerOptions,
      });

      const provider = await web3Modal.connect();
      const web3 = new Web3(provider);

      web3.eth.net.getId();

      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      const { ethereum } = window;

      const networkId = await ethereum.request({
        method: "net_version",
      });

      // if (networkId === 1 || networkId === `${1}`) {
      //   setWalletConnected(true);
      // } else {
      //   alert("Please change your network to Ethereum Mainnet");

      //   await web3.currentProvider.request({
      //     method: "wallet_switchEthereumChain",
      //     params: [{ chainId: Web3.utils.toHex(1) }],
      //   });

      //   setWalletConnected(true);
      // }

      if (networkId === 5 || networkId === `${5}`) {
        setWalletConnected(true);
      } else {
        alert("Please change the network to Goerli Testnet");

        await web3.currentProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: Web3.utils.toHex(5) }],
        });

        setWalletConnected(true);
      }

      const contract = new web3.eth.Contract(
        SMART_CONTRACT_ABI,
        SMART_CONTRACT_ADDRESS
      );

      contract.methods
        .WLpaused()
        .call()
        .then((response) => {
          setWhitelistSale(!response);
        });
    } else {
      window.open(`https://metamask.app.link/dapp/${window.location.href}`);
    }
  };

  const publicSaleMint = async () => {
    if (walletConnected) {
      const web3 = new Web3(Web3.givenProvider);
      await Web3.givenProvider.enable();

      const price = PUBLIC_SALE_MINT_PRICE * 1;
      var tokens = web3.utils.toWei(price.toString(), "ether");
      var bntokens = web3.utils.toBN(tokens);

      const contract = new web3.eth.Contract(
        SMART_CONTRACT_ABI,
        SMART_CONTRACT_ADDRESS
      );

      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      contract.methods
        .Mint(1)
        .send({
          gas: "300000",
          maxPriorityFeePerGas: "35000000000",
          from: account,
          value: bntokens,
        })
        .then(() => {
          alert("Minted successfully");
        });
    }
  };

  const whitelistSaleMint = async () => {
    if (walletConnected) {
      const web3 = new Web3(Web3.givenProvider);
      await Web3.givenProvider.enable();

      const price = WHITELIST_SALE_MINT_PRICE * 1;
      var tokens = web3.utils.toWei(price.toString(), "ether");
      var bntokens = web3.utils.toBN(tokens);

      const contract = new web3.eth.Contract(
        SMART_CONTRACT_ABI,
        SMART_CONTRACT_ADDRESS
      );

      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      contract.methods
        .whitelistMint(1)
        .send({
          gas: "300000",
          maxPriorityFeePerGas: "35000000000",
          from: account,
          value: bntokens,
        })
        .then(() => {
          alert("Minted successfully");
        });
    }
  };

  return (
    <main className="mint-page">
      {/* Hero section */}
      <section className="hero flex flex-col items-center pt-32 bg-[#f3f6f4] text-[#6a50aa] min-h-screen">
        <h1 className="text-3xl font-bold mb-20 mt-12">Mint RiveONE NFT!</h1>

        <button
          onClick={
            walletConnected
              ? whitelistSale
                ? whitelistSaleMint
                : publicSaleMint
              : connectWallet
          }
          className="text-2xl font-bold py-3 px-12 bg-[#f1c232] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out"
        >
          {walletConnected ? "Confirm Mint RiveONE NFT" : "Connect Wallet"}
        </button>

        <a
          href={`https://testnet.rarible.com/collection/${SMART_CONTRACT_ADDRESS}`}
          target="_blank"
          className="text-xl font-semibold mb-20 mt-4"
        >
          <span className="hover:underline hover:underline-offset-8">
            View Collection on Rarible
          </span>
        </a>
      </section>
    </main>
  );
};

// Export
export default App;
