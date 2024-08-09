"use client";
import Image from "next/image";
import Item from "./components/Item";
import BoughtItem from "./components/BoughtItem";
import { useState, useEffect } from "react";
import fetchMultipleData from "./Functionality/ifpsFetch";
import { ethers } from "ethers";
// import DegenABI from "../artifacts/contracts/DegenTokenGame.sol/DegenERC20.json";
import IpfsToArray from "./Functionality/resIPFS";
import MintAndBurnInput from "./components/MintAndBurnInput";
import TransferFriend from "./components/TransferFriend";
import BurnToken from "./components/BurnToken";
import NavigationBar from "./components/NavigationBar";
import BuyTok from "./components/BuyTok";
// bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600
export default function Home() {
  const [connected, setConnected] = useState(false);
  const [showMarket, setShowMarket] = useState(false);
  const [mintAndBurnCondition, setmintAndBurnCondition] = useState(false);
  const [transferFriendCondition, setTransferFriendCondition] = useState(false);
  const [boughtCondition, setBoughtCondition] = useState(false);
  const [burnCondition, setBurnCondition] = useState(false);
  const [nftCollection, setNftCollection] = useState([]);
  const [redeemNFT, setRedeemNFT] = useState(false);
  const [boughtNFT, setBoughtNFT] = useState([]);

  // -------------------------------
  const [ethWindow, setEthWindow] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [degenContract, setDegenContract] = useState(null);
  const [bal, setBal] = useState();
  const [amount, setAmount] = useState();
  const [transferAddress, setTransferAddress] = useState();
  const [transAmount, setTransAmount] = useState();
  const [burnAmount, setBurnAmount] = useState();

  //Buy Wei
  const [buyAmount, setBuyAmount] = useState();
  const [weiAmount, setWeiAmount] = useState();
  const [buytok, setBuyTok] = useState(false);

  const urls = [
    "https://ipfs.io/ipfs/QmRqo6JsyPTXTKtiJQu65b6mGxjDriSZ8TXJycWTtHLi6D", // diamond Medal
    "https://ipfs.io/ipfs/QmdRhk7rZFdfpj5nNUPPd3EfSrb5Kzze1GDTumLtvj8bYq", // gold medal
    "https://ipfs.io/ipfs/QmSQrrVdND7GmiG83H9AGYg8kDcw4m1QqbcR6G5FvExANN", // silver medal
    // "https://ipfs.io/ipfs/QmdFxabWHiWWKdbUNg8Ca61mdgCZtRRHuttosWWsra32Ys",
    // "https://ipfs.io/ipfs/QmdFxabWHiWWKdbUNg8Ca61mdgCZtRRHuttosWWsra32Ys",
    "https://ipfs.io/ipfs/QmZGCbF46zPx6FadEo6PoLxijMgMrC5daNTtHbYAjfFxPE",
    "https://ipfs.io/ipfs/QmcxXkeEp1RtcUSQxtNLLRrTKFJQnPUKW5tqUV6Khrck9z",
    "https://ipfs.io/ipfs/QmP52JDE2gdL3Rc8E83aEmD7SUnhcb5Jjhoy5YoSx4TPRZ", //lambo
    "https://ipfs.io/ipfs/QmcWWFLLWf4fUwHPbqhJJupvPXUW4p6iS3jUivKiG7H27B", //robot
  ];

  // function fetchingData() {
  //   fetch("https://ipfs.io/ipfs/QmQ6wwxiZdH1pnWXpTBzPYspaL2mD3EYFAuSvwTk6xWjL5")
  //     .then((response) => response.json())
  //     .then((data) => console.log(data));
  // }

  const contractAddress = "0x4D192c8b6A8F757f4379edd7198Df8B642493d16";
  const DegenABI = process.env.abi;
  // const contractAddress = "0xFF8C97cC9B8c03Fc402e7C8231Da8ac711Dbd65e";

  const initialize = async () => {
    if (window.ethereum) {
      console.log("Metamask is installed");
      setEthWindow(window.ethereum);
    }

    if (ethWindow) {
      const accountsArray = await ethWindow.request({ method: "eth_accounts" });
      setAccounts(accountsArray);
    }
    ConnectToMetamask();
  };

  const ConnectToMetamask = async () => {
    if (ethWindow) {
      const accounts = await ethWindow.request({
        method: "eth_requestAccounts",
      });
      setAccounts(accounts);
      setConnected(true);
    }

    ConnectToContract();
  };

  const ConnectToContract = async () => {
    try {
      console.log("The Degen Abi is : " + DegenABI.abi);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const degenContract = new ethers.Contract(
        contractAddress,
        DegenABI,
        signer
      );
      console.log(degenContract);
      setDegenContract(degenContract);
      getTokenBalance();
      boughtItems();
      console.log(degenContract);
    } catch (error) {
      console.log("can't connect with the contract");
    }
  };

  const getTokenBalance = async () => {
    try {
      if (degenContract) {
        const bal = await degenContract.checkingTokenBalance();
        setBal(parseInt(bal));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const mintTokens = async () => {
    try {
      console.log(accounts[0]);
      if (degenContract) {
        const res = await degenContract.mintTokenReward(
          accounts[0],
          parseInt(amount)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const buyTokensWei = () => {
    setBuyTok(!buytok);
  };

  const buyTok = async () => {
    try {
      if (degenContract) {
        const res = await degenContract.BuyTokens(parseInt(buyAmount), {
          value: parseInt(weiAmount),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const transFriend = async () => {
    try {
      console.log(accounts[0]);
      if (degenContract) {
        const res = await degenContract.tranferTokens(
          transferAddress,
          parseInt(transAmount)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const burnMyToken = async () => {
    try {
      if (degenContract) {
        const res = await degenContract.burnToken(burnAmount);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getImage = (ipfsURL) => {
    const hash = ipfsURL.split("ipfs://")[1];
    return `https://ipfs.io/ipfs/${hash}`;
  };

  function BoughtItems() {
    return (
      <div className="mt-10 col-start-1 col-end-4 bg-opacity-90 p-10 justify-center space-x-8 space-y-5">
        <hr className="col-start-1 col-end-4 w-full h-1 mx-auto bg-gray-100 border-0 rounded  dark:bg-gray-700" />
        <div className="flex justify-center mb-5">
          <p className="text-4xl font-bold bg-gradient-to-r from-lime-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
            Bought Medals
          </p>
        </div>
        {/* <hr className="col-start-1 col-end-4 w-full h-1 mx-auto bg-gray-100 border-0 rounded  dark:bg-gray-700" /> */}
        {boughtNFT.map((eachItem, index) => (
          <BoughtItem
            key={index}
            itemName={eachItem.name}
            itemDescription={eachItem.description}
            itemSrc={getImage(eachItem.image)}
            itemPrice={eachItem.price}
          />
        ))}
        {/* <BoughtItem
          itemSrc={`https://ipfs.io/ipfs/QmRiSc9erN8aFsUQu26aiJ7heb42YEx8V7SmNco3ZLV14e`}
        />
        <BoughtItem
          itemSrc={`https://ipfs.io/ipfs/QmRiSc9erN8aFsUQu26aiJ7heb42YEx8V7SmNco3ZLV14e`}
        /> */}
      </div>
    );
  }

  const setFunc = async (data) => {
    setNftCollection(data);
  };

  const mintAndBurnTokens = async () => {
    setTransferFriendCondition(false);
    setBoughtCondition(false);

    setmintAndBurnCondition(!mintAndBurnCondition);
  };

  const transferToFriend = async () => {
    setmintAndBurnCondition(false);
    setBurnCondition(false);
    setTransferFriendCondition(!transferFriendCondition);
  };

  const displayBoughtNFTs = async () => {
    setBoughtCondition(!boughtCondition);
  };

  const burntokenFunc = async () => {
    setTransferFriendCondition(false);
    setmintAndBurnCondition(false);
    setBurnCondition(!burnCondition);
  };

  const boughtItems = async () => {
    try {
      if (degenContract) {
        const res = await degenContract.getMintedNFT();
        const boughtNFTs = await IpfsToArray(res);
        console.log(boughtNFTs);
        setBoughtNFT(boughtNFTs);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const mintNFTs = async (URI, price) => {
    console.log(`URI is ${URI} and ${price}`);
    try {
      if (degenContract) {
        const res = await degenContract.redeemTokens(URI, price);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showMarketPlace = () => {
    setRedeemNFT(true);
    setShowMarket(true);
  };

  useEffect(() => {
    async function Operation() {
      await initialize();
      await ConnectToContract();
      await boughtItems();
      await fetchMultipleData(urls, setFunc);
      await getTokenBalance();
    }
    Operation();
  }, []);
  // FEFAE0
  return (
    <div className="bg-white">
      <NavigationBar
        ConnectToMetamask={ConnectToMetamask}
        accounts={accounts ? accounts[0] : "No Account Conne"}
        connected={connected}
        balance={bal}
      />
      <div className="grid grid-cols-3">
        <div className="grid col-start-1 col-end-4">
          {/* <div className="col-span-4 flex flex-col items-center my-10">
            <button
              className="rounded-2xl p-5 pt-3 pb-3.5 bg-rose-800 shadow-xl shadow-zinc-800"
              onClick={ConnectToMetamask}
            >
              {connected ? "Connected" : "Connect To metamask"}
            </button>
          </div>
          <div className="text-2xl col-start-1 col-end-1 justify-start ml-5">
            <p>
              {" "}
              Account Address :{" "}
              {accounts ? accounts[0] : "No Account Connected"}
            </p>
          </div>
          <div className="text-xl col-span-3 flex justify-end mr-5">
            Balance : {bal !== undefined ? bal : "xxx"} DGN Tokens
          </div> */}
        </div>
      </div>
      <div className="w-full grid items-center my-10">
        <div className="grid grid-cols-5 gap-5">
          <div className="flex justify-center">
            <button
              onClick={() => buyTokensWei()}
              className="bg-gradient-to-r from-yellow-400 to-lime-500 px-8 pb-2.5 pt-3 text-xs font-medium uppercase leading-normal rounded-2xl hover:bg-gradient-to-r hover:from-emerald-300 hover:to-sky-400 hover:scale-110"
            >
              Buy DGN Tokens
            </button>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => mintAndBurnTokens()}
              className="bg-gradient-to-r from-yellow-400 to-lime-500 px-8 pb-2.5 pt-3 text-xs font-medium uppercase leading-normal rounded-2xl hover:bg-gradient-to-r hover:from-emerald-300 hover:to-sky-400 hover:scale-110"
            >
              Mint DGN Tokens
            </button>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => transferToFriend()}
              className="bg-gradient-to-r from-yellow-400 to-lime-500 px-8 pb-2.5 pt-3 text-xs font-medium uppercase leading-normal rounded-2xl hover:bg-gradient-to-r hover:from-emerald-300 hover:to-sky-400 hover:scale-110"
            >
              Transfer DGN Tokens
            </button>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => burntokenFunc()}
              className="bg-gradient-to-r from-yellow-400 to-lime-500 px-8 pb-2.5 pt-3 text-xs font-medium uppercase leading-normal rounded-2xl hover:bg-gradient-to-r hover:from-emerald-300 hover:to-sky-400 hover:scale-110"
            >
              Burn DGN Tokens
            </button>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => displayBoughtNFTs()}
              className="bg-gradient-to-r from-yellow-400 to-lime-500 px-8 pb-2.5 pt-3 text-xs font-medium uppercase leading-normal rounded-2xl hover:bg-gradient-to-r hover:from-emerald-300 hover:to-sky-400 hover:scale-110"
            >
              View Bought NFTs
            </button>
          </div>
        </div>
      </div>
      {mintAndBurnCondition && (
        <MintAndBurnInput setAmount={setAmount} mintTokens={mintTokens} />
      )}
      {transferFriendCondition && (
        <TransferFriend
          setTransAmount={setTransAmount}
          setTransferAddress={setTransferAddress}
          transFriend={transFriend}
        />
      )}
      {burnCondition && (
        <BurnToken setBurnAmount={setBurnAmount} burnMyToken={burnMyToken} />
      )}
      {boughtCondition && <BoughtItems />}

      <hr className="col-start-1 col-end-4 w-full h-1 mx-auto bg-gray-100 border-0 rounded  dark:bg-gray-700" />

      {buytok && (
        <BuyTok
          buyTok={buyTok}
          setWeiAmount={setWeiAmount}
          setBuyAmount={setBuyAmount}
        />
      )}

      {!redeemNFT && (
        <div className="">
          <div className="flex justify-center p-5">
            <button
              onClick={() => showMarketPlace()}
              className="bg-gradient-to-r from-red-600 via-blue-600 to-indigo-600 px-8 pb-3 pt-4 text-xs font-medium uppercase leading-normal rounded-2xl"
            >
              Olympics Medal Store
            </button>
          </div>
          <hr className="col-start-1 col-end-4 w-full h-1 mx-auto bg-gray-100 border-0 rounded  dark:bg-gray-700" />
        </div>
      )}

      {redeemNFT && (
        <div className="mt-10 col-start-1 col-end-4 bg-opacity-90 p-10 justify-center space-x-8 space-y-5">
          <div className="text-2xl bolder flex justify-center mb-10 ">
            <p className="bg-gradient-to-r from-red-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent px-10 text-5xl">
              Olympics Store
            </p>
          </div>
          {showMarket &&
            nftCollection.map((eachItem, index) => (
              <Item
                key={index}
                itemName={eachItem.name}
                itemDescription={eachItem.description}
                itemSrc={getImage(eachItem.image)}
                itemPrice={eachItem.price}
                mintNFTFunction={mintNFTs}
                URI={urls[index]}
              />
            ))}
          ;
        </div>
      )}
    </div>
  );
}
