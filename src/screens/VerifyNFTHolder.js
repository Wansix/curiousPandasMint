import React from "react";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import WalletConnect from "../components/WalletConnect";
import { ethers } from "ethers";
import * as readContract from "../contracts/index.js";
import Caver from "caver-js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
axios.defaults.withCredentials = true;

const headers = { withCredentials: true };
const bambooApiURL = process.env.REACT_APP_BAMBOO_API;

const CLIENT_ID = process.env.REACT_APP_DISCORD_CLIENT_ID; // discord bot ID
const CLIENT_SECRET = process.env.REACT_APP_DISCORD_CLIENT_SECRET; //bot secret
const REDIRECT_URL = process.env.REACT_APP_DISCORD_REDIRECT_URL;

const messageString = "curiousPandas verify";

const signMessage = async (walletName, message) => {
  if (walletName === "metamask") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(message);
    const address = await signer.getAddress();

    // console.log("address : ", address);

    // console.log("signature:", signature);

    return signature;
  } else if (walletName === "kaikas") {
    const caver = new Caver(window.klaytn);
    const account = window.klaytn.selectedAddress;
    const signature = await caver.klay.sign(message, account);

    // console.log("account : ", account);
    // console.log("sig : ", signature);

    return signature;
  }
};

export const VerifyNFTHolder = () => {
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState();
  const [walletName, setWalletName] = useState("");
  const [signature, setSignature] = useState("");
  const [discordUser, setDiscordUser] = useState();

  const handleSign = async (e) => {
    e.preventDefault();

    const sig = await signMessage(walletName, messageString);
    if (sig) {
      setSignature(sig);
    }
    return sig;
  };

  const onClickVerifyNFTHolder = async (e) => {
    if (!account) {
      alert("지갑 연결 해주세요");
      return;
    }
    if (!provider) {
      return;
    }
    const _signature = await handleSign(e);
    // console.log("discordUser : ", discordUser);
    await registerDiscordNFTHolder(
      discordUser,
      messageString,
      _signature,
      account,
      walletName
    );
  };

  const registerDiscordNFTHolder = async (
    _discordUser,
    _message,
    _signature,
    _address,
    _walletName
  ) => {
    const url = `${bambooApiURL}/api/wallet/register/discord/nftHolder`;

    const send_param = {
      headers,
      discordUser: _discordUser,
      message: _message,
      signature: _signature,
      address: _address,
      walletName: _walletName,
    };

    axios.post(url, send_param).then((result) => {
      // console.log("result : ", result.data);
      // console.log(result.data.message);
      if (result.data.success) {
        alert(result.data.message);
      } else {
        alert(result.data.message); // 실패
      }
    });
  };

  const getWalletName = (_walletName) => {
    setWalletName(_walletName);
  };

  const getAccount = (_address) => {
    setAccount(_address);
  };

  const getProvider = (_provider) => {
    setProvider(_provider);
  };

  const getDiscordUserId = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code === null) return;

    const url = "https://discord.com/api/oauth2/token";
    const oauthResult = await fetch(url, {
      method: "POST",
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URL,
        scope: "identify",
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const oauthData = await oauthResult.json();

    // discord user data 얻기
    const userResult = await fetch("https://discord.com/api/users/@me", {
      headers: {
        authorization: `${oauthData.token_type} ${oauthData.access_token}`,
      },
    });

    const userData = await userResult.json();
    setDiscordUser(userData);
  };

  useEffect(() => {
    readContract.initNode();
  }, [account]);

  useEffect(() => {
    getDiscordUserId();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        margin: "100px 200px",
        flexDirection: "column",
        backgroundColor: "beige",
      }}
    >
      <a href="https://discord.com/api/oauth2/authorize?client_id=1161267960661409832&redirect_uri=https%3A%2F%2Fcuriouspandasnft.com%2Fverify_NFT_holder&response_type=code&scope=identify">
        ss
      </a>
      <WalletConnect
        getAccount={getAccount}
        getProvider={getProvider}
        getWalletName={getWalletName}
      ></WalletConnect>
      {/* <div>
        <Button onClick={handleSign}>Sign</Button>
      </div> */}
      {/* <div>{signature}</div> */}
      <div>
        <Button onClick={onClickVerifyNFTHolder}>NFT 홀더 인증</Button>
      </div>
    </div>
  );
};

export default VerifyNFTHolder;
