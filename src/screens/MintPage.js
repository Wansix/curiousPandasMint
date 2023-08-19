import React from "react";
import { useState, useEffect, useRef } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import Button from "react-bootstrap/Button";
import WalletConnect from "../components/WalletConnect";
import { Signer, ethers } from "ethers";
import { curiousPandaNFTAddress } from "../contracts/address.js";
import { curiousPandaNFTAbi } from "../contracts/abi.js";
import * as readContract from "../contracts/index.js";
import Swal from "sweetalert2";
const Phase = {
  INIT: 0,
  WHITELIST1: 1,
  WAITING_WHITELIST2: 2,
  WHITELIST2: 3,
  WAITING_PUBLIC1: 4,
  PUBLIC1: 5,
  DONE: 6,
};

const Index = {
  whitelist1: 0,
  whitelist2: 1,
  public1: 2,
};

export const MintPage = () => {
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState();
  const [currentBlockNumber, setCurrentBlockNumber] = useState(0);
  const [startBlockNumber, setStartBlockNumber] = useState("");
  const [endBlockNumber, setEndBlockNumber] = useState("");
  // const [mintState, setMintState] = useState(false);
  const [mintIndex, setMintIndex] = useState(Index.whitelist1);
  const [mintPhaseString, setMintPhaseString] = useState("");
  const [currentPhase, setCurrentPhase] = useState(Phase.INIT);
  const [mintCount, setMintCount] = useState(0);
  const [maxCount, setMaxCount] = useState(0);
  const [remainCount, setRemainCount] = useState(0);
  const [mintAmount, setMintAmount] = useState(1);
  const [contract, setContract] = useState();
  const [balanceNFT, setBalanceNFT] = useState(0);
  const [maxTx, setMaxTx] = useState(1);
  const [maxPerWallet, setMaxPerWallet] = useState(0);
  const [remainingTime, setRemainingTime] = useState("");
  const [isShowStartBlock, setIsShowStartBlock] = useState(true);

  const walletConnectRef = useRef();
  const interval = useRef();

  const calculateTimeDiff = () => {
    const blockHeightIncreasePerSecond = 1;

    let blockHeightDifference;
    if (isShowStartBlock) {
      blockHeightDifference = startBlockNumber - currentBlockNumber;
    } else {
      blockHeightDifference = endBlockNumber - currentBlockNumber;
    }

    if (blockHeightDifference >= 0) {
      const seconds = Math.floor(
        blockHeightDifference / blockHeightIncreasePerSecond
      );
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;

      const formattedTime = `남은 시간 : ${padTime(hours)}:${padTime(
        minutes
      )}:${padTime(remainingSeconds)}`;
      setRemainingTime(formattedTime);
    } else {
      setRemainingTime("");
    }
  };

  const padTime = (number) => {
    return number.toString().padStart(2, "0");
  };

  const getAccount = (_address) => {
    setAccount(_address);
  };

  const getProvider = (_provider) => {
    setProvider(_provider);
  };

  const getContract = async () => {
    if (provider != null) {
      const signer = provider.getSigner();

      const _contract = new ethers.Contract(
        curiousPandaNFTAddress,
        curiousPandaNFTAbi,
        signer
      );

      setContract(_contract);
    }
  };

  const checkSaleAvailable = (_NFTCount) => {
    try {
      if (Number(mintCount) + Number(mintAmount) > Number(maxCount)) {
        Swal.fire({
          icon: "error",
          title: "buy error",
          text: "판매 수량을 초과하였습니다.",
        });
        return false;
      }

      // const NFTCount = await readContract.getNFTCountsList(mintIndex, account);
      // console.log("maxPerWallet:", maxPerWallet);

      if (Number(_NFTCount) + Number(mintAmount) > maxPerWallet) {
        Swal.fire({
          icon: "error",
          title: "buy error",
          text: "지갑당 구매 한도를 초과하였습니다.",
        });
        return false;
      }
    } catch (e) {
      console.log("checkSaleAvailable : ", e);
    }
  };

  const checkWhiteLists = (_currentPhase, whitelist1, whitelist2) => {
    let response = true;

    if (_currentPhase === Phase.WHITELIST1) {
      response = whitelist1; // await readContract.checkWhitelist(0, account);
    }
    if (_currentPhase === Phase.WHITELIST2) {
      response = whitelist2; //await readContract.checkWhitelist(1, account);
    }

    return response;
  };

  // 민팅 가능한 block인지 확인.
  const checkMintBlockNumber = (
    currnetBlock,
    startBlockNumber,
    endBlockNumber
  ) => {
    // const _currentBlock = await readContract.getBlockNumber();
    // const startBlockNumber = await readContract.getMintStartBlockNumber(
    //   _mintIndex
    // );
    // const endBlockNumber = await readContract.getMintEndBlockNumber(_mintIndex);

    if (startBlockNumber > currnetBlock) return false;
    if (endBlockNumber < currnetBlock) return false;

    return true;
  };

  const onClickMinting = async () => {
    try {
      if (contract) {
        // 추후 민팅시 가격 들어갈 때 수정 필요.
        const price = 0;

        // console.log("account : ", account);

        const selectedAddress = provider.provider.selectedAddress;

        if (account.toString() != selectedAddress.toString()) {
          setAccount(selectedAddress);
          walletConnectRef.current.updateAccount(selectedAddress);
        }

        const klayBalance = await provider.getBalance(selectedAddress);
        // console.log("klayBalance : ", Number(klayBalance));
        // const klayBalance = await readContract.balanceOfKlay(account);
        const totalPrice = Number(price) * Number(mintAmount);
        // console.log("totalPrice : ", totalPrice);
        if (totalPrice > Number(klayBalance)) {
          Swal.fire({
            icon: "error",
            title: "klay amount error ",
            text: "klay가 부족합니다.",
          });
          return;
        }

        const tx = await contract.batchMintNFT(mintAmount, {
          value: totalPrice.toString(),
        });

        // console.log("tx : ", tx);
        if (tx) {
          try {
            const _remainCount = await readContract.getRemainCount(mintIndex);
            setRemainCount(Number(_remainCount));
            // const _totalAmount = await readContract.getTotalSupply();
            setMintCount(maxCount - Number(_remainCount));
            const _balanceNFT = await readContract.balanceOf(selectedAddress);
            setBalanceNFT(Number(_balanceNFT));
          } catch (e) {
            console.log("mint complete. update remain count error", e);
          }
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Not connected wallet",
          text: "지갑을 연결하세요.",
        });
      }
    } catch (error) {
      const data = await readContract.getDatas();

      const currentBlock = Number(data[0]);
      const stage = Number(data[1]);
      const currentPhase = data[2];
      const totalNFTAmount = Number(data[3]);
      const totalSaleNFTAmount = Number(data[4]);
      const initSupply = Number(data[5]);
      const saleTotalAmounts = data[6];
      const saleRemainAmounts = data[7];
      const maxPerWallet = data[8];
      const maxPerTransaction = data[9];
      const mintStartBlockNumber = data[10];
      const mintEndBlockNumber = data[11];

      const mintInfo = await readContract.getMintInfo(account);

      const mintPrice = mintInfo[0];
      const NFTCount = mintInfo[1];
      const isWhitelist1 = mintInfo[2];
      const isWhitelist2 = mintInfo[3];

      // const _currentPhase = await readContract.getCurrentPhase();

      const _mintIndex = getMintIndex(currentPhase);

      if (
        currentPhase !== Phase.PUBLIC1 &&
        currentPhase !== Phase.WHITELIST1 &&
        currentPhase !== Phase.WHITELIST2
      ) {
        Swal.fire({
          icon: "error",
          title: "Not Mint stage",
          text: "민팅 단계가 아닙니다.",
        });
        return;
      }
      const isMintAvailableTime = checkMintBlockNumber(
        currentBlock,
        Number(mintStartBlockNumber[_mintIndex]),
        Number(mintEndBlockNumber[_mintIndex])
      );

      if (!isMintAvailableTime) {
        Swal.fire({
          icon: "error",
          title: "It's not a mintable block height",
          text: "민팅 가능 블록 높이가 아닙니다.",
        });
        return;
      }
      const isWhiteList = checkWhiteLists(
        currentPhase,
        isWhitelist1,
        isWhitelist2
      );
      if (isWhiteList === false) {
        Swal.fire({
          icon: "error",
          title: "Not Whitelist",
          text: "화이트리스트가 아닙니다.",
        });
        return;
      }
      const saleAvailable = checkSaleAvailable(NFTCount);
      if (saleAvailable === false) {
        return;
      }

      console.log("mint error", error);
    }
  };

  const _setCurrentPhase = async () => {
    const _currentPhase = await readContract.getCurrentPhase();
    setCurrentPhase(_currentPhase);
    return _currentPhase;
  };

  const getMintState = async (_currentPhase, _mintIndex) => {
    if (
      _currentPhase === Phase.WHITELIST1 ||
      _currentPhase === Phase.WHITELIST2 ||
      _currentPhase === Phase.PUBLIC1
    ) {
      const isMintAvailableTime = await checkMintBlockNumber(_mintIndex);
      if (isMintAvailableTime) return true;
      else return false;
    } else {
      return false;
    }
  };

  const getMintIndex = (_currentPhase) => {
    if (_currentPhase <= Phase.WHITELIST1) {
      return Index.whitelist1;
    } else if (_currentPhase <= Phase.WHITELIST2) {
      return Index.whitelist2;
    } else {
      return Index.public1;
    }
  };

  const getPhaseString = (_currentPhase) => {
    if (_currentPhase === Phase.INIT) {
      return "확정 화이트리스트 민팅 대기";
    } else if (_currentPhase === Phase.WHITELIST1) {
      return "확정 화이트리스트 민팅";
    } else if (_currentPhase === Phase.WAITING_WHITELIST2) {
      return "경쟁 화이트리스트 민팅 대기";
    } else if (_currentPhase === Phase.WHITELIST2) {
      return "경쟁 화이트리스트 민팅";
    } else if (_currentPhase === Phase.WAITING_PUBLIC1) {
      return "퍼블릭 민팅 대기";
    } else if (_currentPhase === Phase.PUBLIC1) {
      return "퍼블릭 민팅";
    } else if (_currentPhase === Phase.DONE) {
      return "민팅 종료";
    }
  };

  const onClickMinus = () => {
    if (mintAmount === 1) return;
    const amount = mintAmount - 1;
    setMintAmount(amount);
  };
  const onClickPlus = () => {
    if (mintAmount >= maxTx) return;
    const amount = mintAmount + 1;
    setMintAmount(amount);
  };

  const initPage = async () => {
    try {
      readContract.initNode();
      const data = await readContract.getDatas();
      const currentBlock = Number(data[0]);
      const stage = Number(data[1]);
      const currentPhase = data[2];
      const totalNFTAmount = Number(data[3]);
      const totalSaleNFTAmount = Number(data[4]);
      const initSupply = Number(data[5]);
      const saleTotalAmounts = data[6];
      const saleRemainAmounts = data[7];
      const maxPerWallet = data[8];
      const maxPerTransaction = data[9];
      const mintStartBlockNumber = data[10];
      const mintEndBlockNumber = data[11];

      setCurrentBlockNumber(currentBlock);

      // const _currentPhase = await _setCurrentPhase();
      setCurrentPhase(currentPhase);
      const _mintIndex = getMintIndex(currentPhase);

      setStartBlockNumber(mintStartBlockNumber[_mintIndex].toString());
      setEndBlockNumber(mintEndBlockNumber[_mintIndex].toString());

      // readContract
      //   .getMintStartBlockNumber(_mintIndex)
      //   .then((_startBlockNumber) => {
      //     setStartBlockNumber(_startBlockNumber.toString());
      //   });

      // readContract.getMintEndBlockNumber(_mintIndex).then((_endBlockNumber) => {
      //   setEndBlockNumber(_endBlockNumber.toString());
      // });

      setMintIndex(_mintIndex); // whitelis1, whitelist2, public

      const _mintPhaseString = getPhaseString(currentPhase);
      setMintPhaseString(_mintPhaseString);

      // const [_saleTotalAmount, _remainCount, _maxTx, _maxPerWallet] =
      //   await Promise.all([
      // readContract.getSaleTotalAmount(_mintIndex),
      // readContract.getRemainCount(_mintIndex),
      //     readContract.getMaxPerTx(_mintIndex),
      //     readContract.getMaxPerWallet(_mintIndex),
      //   ]);

      const saleTotalAmount = Number(saleTotalAmounts[_mintIndex]);
      const saleRemainAmount = Number(saleRemainAmounts[_mintIndex]);

      setMaxCount(saleTotalAmount);
      setRemainCount(saleRemainAmount);
      setMintCount(saleTotalAmount - saleRemainAmount);
      setMaxPerWallet(Number(maxPerTransaction[_mintIndex]));
      setMaxTx(Number(maxPerWallet[_mintIndex]));

      // setMaxCount(Number(_saleTotalAmount));
      // setRemainCount(Number(_remainCount));
      // setMintCount(Number(_saleTotalAmount) - Number(_remainCount));
      // setMaxTx(Number(_maxTx));
      // setMaxPerWallet(Number(_maxPerWallet));

      // const _mintState = await getMintState(_currentPhase, _mintIndex);
      // setMintState(_mintState); // true, false
    } catch (e) {
      console.log("init error", e);
    }
  };

  useEffect(() => {
    const init = () => {
      // readContract.getBlockNumber().then((_blockNumber) => {
      //   setCurrentBlockNumber(_blockNumber);
      // });
      initPage();
      interval.current = setInterval(() => {
        setCurrentBlockNumber((currentBlockNumber) => currentBlockNumber + 1);
      }, 1000);
      return () => {
        clearInterval(interval.current);
      };
    };
    init();
  }, []);

  useEffect(() => {
    calculateTimeDiff();

    if (startBlockNumber > currentBlockNumber) {
      if (isShowStartBlock === false) setIsShowStartBlock(true);
    } else {
      if (isShowStartBlock === true) {
        setIsShowStartBlock(false);
      }
    }
  }, [currentBlockNumber]);

  useEffect(() => {
    getContract();

    const connectInit = async () => {
      if (account) {
        const _balanceNFT = await readContract.balanceOf(account);
        setBalanceNFT(Number(_balanceNFT));
      }
    };

    connectInit();
  }, [account]);

  return (
    <div className="mintPage_main-container">
      <div className="mintPage_main-header">
        <div className="mintPage_main-header-container">
          <div className="mintPage_main-header-content">
            <div className="mintPage_main-header-logo">
              <img src="https://lh3.googleusercontent.com/N539sLqOcoGSs0qy9gvfwXiOF2rro3a4L03djiMGiq5No8Sf8QK1yf4K0TRjYxmuHBHhRGCAYnKC80pqau5335gdrhoGXq4SRaAbxtsifjhUNsBpY-k6=s0"></img>
            </div>
          </div>
          <div className="mintPage_main-header-content">
            <WalletConnect
              getAccount={getAccount}
              getProvider={getProvider}
              ref={walletConnectRef}
            ></WalletConnect>
          </div>
        </div>
      </div>
      {/* <div className="mintPage_main-subject-container">
        <div className="mintPage_main-subject">
          <span>Curious Pandas</span>
        </div>
      </div> */}
      <div className="mintPage_main-body">
        <div className="mintPage_main_left-container">
          {/* <div className="mintPage_main_left-header">
            <img src="https://lh3.googleusercontent.com/N539sLqOcoGSs0qy9gvfwXiOF2rro3a4L03djiMGiq5No8Sf8QK1yf4K0TRjYxmuHBHhRGCAYnKC80pqau5335gdrhoGXq4SRaAbxtsifjhUNsBpY-k6=s0"></img>
          </div> */}
          <div className="mintPage_main_left-content">
            <img src="https://lh3.googleusercontent.com/RV0mMHqAGw1gUJXOFZxueJtlaesy5KX8yPd2cEvhglV8UCI8eePMLm3Ja_sI7aPj8j3ezVfUcWZgHiHu4Q70adhGINcrh02p4zENZxX9E7gsa9pY_0DkUA=s0"></img>
          </div>
          <div className="mintPage_main_left-content">
            <div className="mintPage_main_left-content_description-box">
              <div className="mintPage_main_left-content_description-text">
                확정 WL라운드 - 트랜잭션당 1개, 지갑당 1개
              </div>
              <div className="mintPage_main_left-content_description-text">
                경쟁 WL라운드 - 트랜잭션당 1개, 지갑당 2개
              </div>
              <div className="mintPage_main_left-content_description-text">
                퍼블릭 라운드 - 트랙잭션당 1개, 지갑당 2개
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
              <span>
                Round {mintIndex + 1} : {mintPhaseString}
              </span>
            </div>
            <div className="mintPage_main-content-round-maxMintInfo">
              <span>
                트랜잭션 당 개수 - {maxTx}, 지갑당 최대 민팅 가능 -{" "}
                {maxPerWallet}
              </span>
            </div>
            <div className="mintPage_main-content-title">
              <span>Curious Pandas</span>
            </div>
          </div>
          <div className="mintPage_main-content">
            <div className="mintPage_blockHeight-container">
              <div className="mintPage_blockHeight-left-container">
                <div className="mintPage_blockHeight-title">
                  <span>현재 블록 높이</span>
                </div>
                <div className="mintPage_blockHeight-number">
                  <span>#{currentBlockNumber}</span>
                </div>
              </div>
              <div className="mintPage_blockHeight-right-container">
                <div className="mintPage_blockHeight-title">
                  <span>
                    {isShowStartBlock ? "시작 블록 높이" : "종료 블록 높이"}
                  </span>
                </div>
                <div className="mintPage_blockHeight-number mingPage_blockHeight-startBlock">
                  <span>
                    #{isShowStartBlock ? startBlockNumber : endBlockNumber}
                  </span>
                </div>
              </div>
            </div>
            <div className="mintPage_blockHeight-container blockHeight-showTime">
              {remainingTime}
            </div>
            <div className="mintPage_blockHeight-container blockHeight-description">
              <span>정확한 블록 높이는 &nbsp;</span>

              <a href="https://scope.klaytn.com/" target="_blank">
                klaytn scope
              </a>

              <span>를 참고하세요.</span>
            </div>
          </div>
          <div className="mintPage_main-content">
            <div className="mintPage_main-content_count-title">
              <div>
                <span>판매 수량</span>
              </div>
              <div>
                <span>
                  {mintCount}/{maxCount}
                </span>
              </div>
            </div>
            <div className="mintPage_main-content_count-bar">
              <ProgressBar
                striped
                variant="success"
                now={mintCount}
                min={0}
                max={maxCount}
              />{" "}
            </div>
          </div>
          <div className="mintPage_main-content">
            {/* <div>Price</div> */}
            {/* <div>0 klaytn</div> */}
            <div className="mintPage_main-content_mintAmount-container">
              <Button
                className="mintAmountButton"
                variant="success"
                onClick={onClickMinus}
              >
                -
              </Button>
              <div className="mintPage_mintAmount-amount">
                <span>{mintAmount}</span>
              </div>

              <Button
                className="mintAmountButton"
                variant="success"
                onClick={onClickPlus}
              >
                +
              </Button>
            </div>
          </div>
          <div className="mintPage_main-content">
            <div className="mintPage_mintButton-container">
              <Button
                className="mintButton"
                variant="success"
                onClick={onClickMinting}
              >
                Minting
              </Button>
            </div>
          </div>

          <div className="mintPage_main-content">
            <div>My NFT 개수 - {balanceNFT}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MintPage;
