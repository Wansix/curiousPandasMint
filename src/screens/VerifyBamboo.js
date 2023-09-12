import React from "react";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import WalletConnect from "../components/WalletConnect";
import { ethers } from "ethers";
import * as readContract from "../contracts/index.js";
import Caver from "caver-js";
import { useSearchParams } from "react-router-dom";

const verifyMessage = ({ message, address, signature }) => {
  const signerAddr = ethers.utils.verifyMessage(message, signature);
  const _address = ethers.utils.getAddress(address);
  const _signerAddr = ethers.utils.getAddress(signerAddr);

  if (_signerAddr !== _address) {
    return false;
  }

  return true;
};

const signMessage = async (walletName, message) => {
  if (walletName === "metamask") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(message);
    const address = await signer.getAddress();

    console.log("address : ", address);

    console.log("signature:", signature);

    return signature;
  } else if (walletName === "kaikas") {
    const caver = new Caver(window.klaytn);
    const account = window.klaytn.selectedAddress;
    const signature = await caver.klay.sign(message, account);

    return signature;
  }
};

export const VerifyBamboo = () => {
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState();
  const [walletName, setWalletName] = useState("");
  const [signature, setSignature] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSign = async (e) => {
    e.preventDefault();

    if (!account) {
      alert("지갑 연결 해주세요");
      return;
    }
    if (!provider) {
      return;
    }
    const message = "bambooSoop verify";
    const sig = await signMessage(walletName, message);
    if (sig) {
      setSignature(sig);
    }
  };

  const onClickCheck = async () => {
    const _balanceNFT = Number(await readContract.balanceOf(account));
    console.log("balance ", _balanceNFT);

    const message = "bambooSoop verify";

    const isValid = verifyMessage({
      message: message,
      address: account,
      signature: signature,
    });

    console.log("isValid : ", isValid);
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

  useEffect(() => {
    readContract.initNode();
  }, [account]);

  return (
    <div
      style={{
        display: "flex",
        margin: "100px 200px",
        flexDirection: "column",
        backgroundColor: "beige",
      }}
    >
      <WalletConnect
        getAccount={getAccount}
        getProvider={getProvider}
        getWalletName={getWalletName}
      ></WalletConnect>
      <div>
        <Button onClick={handleSign}>Sign</Button>
      </div>
      <div>{signature}</div>
      <div>
        <Button onClick={onClickCheck}>check</Button>
      </div>
    </div>
  );
};

export default VerifyBamboo;
