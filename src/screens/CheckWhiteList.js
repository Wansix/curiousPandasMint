import React from "react";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import WalletConnect from "../components/WalletConnect";
import * as readContract from "../contracts/index.js";
import Swal from "sweetalert2";

export const CheckWhiteList = () => {
  const [account, setAccount] = useState("");
  // const [provider, setProvider] = useState();
  const [checkAddress, setCheckAddress] = useState("");
  // const [whitelist1, setWhitelist1] = useState("");
  // const [whitelist2, setWhitelist2] = useState("");
  const [whitelist1CheckBox, setWhitelist1CheckBox] = useState(false);
  const [whitelist2CheckBox, setWhitelist2CheckBox] = useState(false);

  const getWalletName = (_walletName) => {
    // setWalletName(_walletName);
  };

  const getAccount = (_address) => {
    setAccount(_address);
  };

  const getProvider = (_provider) => {
    // setProvider(_provider);
  };

  const onChangeAddress = (e) => {
    setCheckAddress(e.target.value);
    setAccount(e.target.value);
  };

  const onClickChecking = async () => {
    setWhitelist1CheckBox(false);
    setWhitelist2CheckBox(false);
    try {
      const isWhitelist1 = await readContract.checkWhitelist(0, account);
      const isWhitelist2 = await readContract.checkWhitelist(1, account);

      if (isWhitelist1) setWhitelist1CheckBox(true);
      else setWhitelist1CheckBox(false);

      if (isWhitelist2) setWhitelist2CheckBox(true);
      else setWhitelist2CheckBox(false);

      Swal.fire({
        // icon: "error",
        title: "whitelist check",
        text: "확인 완료",
      });
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "invaild address",
        text: "올바른 주소를 확인해 주세요.",
      });
    }
  };
  useEffect(() => {
    const init = async () => {
      readContract.initNode();
    };

    init();
  }, []);

  useEffect(() => {
    setCheckAddress(account);
    // getContract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return (
    <div className="mintPage_main-container">
      {" "}
      <div className="mintPage_main-header">
        <div className="mintPage_main-header-container">
          <div className="mintPage_main-header-content">
            <div className="mintPage_main-header-logo">
              <img
                src="https://lh3.googleusercontent.com/N539sLqOcoGSs0qy9gvfwXiOF2rro3a4L03djiMGiq5No8Sf8QK1yf4K0TRjYxmuHBHhRGCAYnKC80pqau5335gdrhoGXq4SRaAbxtsifjhUNsBpY-k6=s0"
                alt="logo"
              ></img>
            </div>
          </div>
          <div className="mintPage_main-header-content">
            <WalletConnect
              getAccount={getAccount}
              getProvider={getProvider}
              getWalletName={getWalletName}
            ></WalletConnect>
          </div>
        </div>
      </div>
      <div className="mintPage_main-body">
        <div className="mintPage_main_left-container">
          <div className="mintPage_main_left-content">
            <img
              src="https://lh3.googleusercontent.com/RV0mMHqAGw1gUJXOFZxueJtlaesy5KX8yPd2cEvhglV8UCI8eePMLm3Ja_sI7aPj8j3ezVfUcWZgHiHu4Q70adhGINcrh02p4zENZxX9E7gsa9pY_0DkUA=s0"
              alt="img1"
            ></img>
          </div>
          <div className="mintPage_main_left-content">
            <div className="mintPage_main_left-content_description-box">
              <div className="mintPage_main_left-content_description-text">
                확정 WL라운드 - 트랜잭션당 2개, 지갑당 2개
              </div>
              <div className="mintPage_main_left-content_description-text">
                경쟁 WL라운드 - 트랜잭션당 1개, 지갑당 1개
              </div>
              <div className="mintPage_main_left-content_description-text">
                퍼블릭 라운드 - 트랙잭션당 1개, 지갑당 1개
              </div>
              <div className="mintPage_main_left-content_description-text">
                1st 물량은 500개. 팀물량 500개이며 남은 2000개의 물량은 마케팅,
                민팅용으로 사용될 수 있습니다.
              </div>
            </div>
          </div>
        </div>
        <div className="mintPage_main">
          <div className="mintPage_main-content mintPage_title-container">
            <div className="mintPage_main-content-round">
              <span>{"화이트리스트 체크"}</span>
            </div>
            <div className="mintPage_main-content-round-maxMintInfo">
              <span>
                {/* 트랜잭션 당 개수 - {maxTx}, 지갑당 최대 민팅 가능 -{" "}
                {maxPerWallet} */}
              </span>
            </div>
            <div className="mintPage_main-content-title">
              <span>Curious Pandas</span>
            </div>
          </div>
          <div className="mintPage_main-content">
            <div className="checkWhiteList-title">주소 입력</div>
            <div>
              <input
                className="checkWhiteList_input"
                onChange={onChangeAddress}
                value={checkAddress}
                type="string"
                placeholder="address"
              ></input>
            </div>
            <div className="input-address-container">
              <div className="input-address-container-box">
                <div className="input-address-content">확정</div>
                <div className="input-address-content input-address-content-checkBox">
                  <input
                    type="checkbox"
                    checked={whitelist1CheckBox}
                    onChange={(e) => {}}
                  ></input>
                </div>
              </div>
              <div className="input-address-container-box">
                <div className="input-address-content">경쟁</div>
                <div className="input-address-content input-address-content-checkBox">
                  <input
                    type="checkbox"
                    checked={whitelist2CheckBox}
                    onChange={(e) => {}}
                  ></input>
                </div>
              </div>
            </div>
          </div>

          <div className="mintPage_main-content">
            <div className="mintPage_mintButton-container">
              <Button
                className="mintButton"
                variant="success"
                onClick={onClickChecking}
              >
                Check
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckWhiteList;
