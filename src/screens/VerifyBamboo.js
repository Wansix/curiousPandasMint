import React from "react";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import WalletConnect from "../components/WalletConnect";
import { ethers } from "ethers";
import * as readContract from "../contracts/index.js";
import Caver from "caver-js";
import * as Crypto from "crypto";
import axios from "axios";
import dotenv from "dotenv";
import Swal from "sweetalert2";

dotenv.config();
axios.defaults.withCredentials = true;

const headers = { withCredentials: true };
const bambooApiURL = "http://localhost:8080";
const bambooURL = "https://pioneerlabs.gabia.io";

const endPoint = process.env.REACT_APP_MAINNET_ENDPOINT4;
const caver = new Caver(endPoint);

const validateSignedMessage = async (message, signedMessage, address) => {
  const v = "0x" + signedMessage.substring(2).substring(128, 130);
  const r = "0x" + signedMessage.substring(2).substring(0, 64);
  const s = "0x" + signedMessage.substring(2).substring(64, 128);
  return await caver.validator.validateSignedMessage(
    message,
    [v, r, s],
    address,
    false
  );
};

const verifyMessage = ({ message, address, signature }) => {
  const signerAddr = ethers.utils.verifyMessage(message, signature);
  const _address = ethers.utils.getAddress(address);
  const _signerAddr = ethers.utils.getAddress(signerAddr);

  // console.log("_address : ", _address);
  // console.log("_signerAddr : ", _signerAddr);

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

export const VerifyBamboo = () => {
  const [account, setAccount] = useState();
  const [provider, setProvider] = useState();
  const [walletName, setWalletName] = useState("");
  const [signature, setSignature] = useState("");
  const [userData, setUserData] = useState();
  const [registeredAddress, setRegisteredAddress] = useState("");

  const handleSign = async (e) => {
    e.preventDefault();

    if (!account) {
      Swal.fire({
        icon: "error",
        title: "connect wallet",
        text: "지갑 연결 해주세요",
      });
      // alert("지갑 연결 해주세요");
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
    return sig;
  };

  const onClickRegisterWallet = async (e) => {
    try {
      const sig = await handleSign(e);

      if (sig) {
        const message = "bambooSoop verify";

        await registerWallet(userData, message, sig, account, walletName);
      }

      // const _balanceNFT = Number(await readContract.balanceOf(account));
      // console.log("balance ", _balanceNFT);

      // console.log("w:", walletName);
    } catch (e) {
      // alert("지갑 등록에 실패하였습니다.");
      Swal.fire({
        icon: "error",
        title: "register fail",
        text: "지갑 등록에 실패하였습니다.",
      });

      // console.log("checkRegister error", e);
    }
  };

  const onClickSend = async () => {
    console.log("send!");
    console.log("userData:", userData);
    console.log("registerdAddress:", registeredAddress);

    // registerWallet(userData);
  };

  const registerWallet = async (
    _userData,
    _message,
    _signature,
    _address,
    _walletName
  ) => {
    const url = `${bambooApiURL}/api/wallet/register`;

    const send_param = {
      headers,
      userData: _userData,
      message: _message,
      signature: _signature,
      address: _address,
      walletName: _walletName,
    };

    axios.post(url, send_param).then((result) => {
      // alert(result.data.message);

      const message = result.data.message;
      const isSuccess = result.data.isSuccess;

      if (isSuccess) {
        Swal.fire({
          icon: "success",
          title: "success",
          text: message,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "지갑 등록 실패",
          text: message,
        });
      }

      // console.log(result.data);

      setRegisteredAddress(account);
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

  useEffect(() => {
    readContract.initNode();
  }, [account]);

  useEffect(() => {
    //receive iframe message
    window.addEventListener("message", async function (e) {
      if (e.origin === bambooURL) {
        const receivedData = e.data;

        // console.log("receivedData: ", receivedData);

        const _userData = {
          encryptedData: receivedData.encryptedData,
          iv: receivedData.iv,
        };

        setUserData(_userData);
        if (receivedData.walletAddress) {
          setRegisteredAddress(receivedData.walletAddress);
        }

        // console.log("data : ", receivedData);
      }
    });
  }, []);

  return (
    <div className="verifyBamboo-main-container">
      <div className="verifyBamboo-container">
        <div className="verifyBamboo-container_title">
          <span>지갑 등록하기</span>
        </div>
      </div>
      <div className="verifyBamboo-container">
        <div className="verifyBamboo-container_description-container">
          <div className="verifyBamboo-container_description">
            <span>1. 지갑 연결하기를 눌러 지갑을 연결 합니다.</span>
          </div>
          <div className="verifyBamboo-container_description">
            <span>2. 지갑 등록 버튼을 눌러 지갑을 밤부숲에 등록합니다.</span>
          </div>
        </div>
      </div>
      <div className="verifyBamboo-container">
        <div className="verifyBamboo-container_button-container">
          <div>
            <WalletConnect
              getAccount={getAccount}
              getProvider={getProvider}
              getWalletName={getWalletName}
            ></WalletConnect>
          </div>
          <div>
            <Button
              className="verifyBamboo-registerWalletButton"
              onClick={onClickRegisterWallet}
              variant="success"
            >
              지갑 등록
            </Button>
          </div>
        </div>
      </div>

      {/* <div>
        <Button onClick={handleSign}>Sign</Button>
      </div> */}

      {/* <div>{signature}</div> */}

      {/* <div className="verifyBamboo-container">
        <Button
          className="verifyBamboo-registerWalletButton"
          onClick={onClickRegisterWallet}
          variant="success"
        >
          지갑 등록
        </Button>
      </div> */}
      <div className="verifyBamboo-container">
        <div className="verifyBamboo-container_registeredAddress-container">
          <span>등록된 지갑 : {registeredAddress}</span>
        </div>
      </div>
      {/* <div>
        <Button onClick={onClickSend}>send</Button>
      </div> */}
    </div>
  );
};

export default VerifyBamboo;
