import React from "react";
import { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import WalletConnect from "../components/WalletConnect";
import { Signer, ethers } from "ethers";
import { curiousPandaNFTAddress } from "../contracts/address.js";
import { curiousPandaNFTAbi } from "../contracts/abi.js";
import * as readContract from "../contracts/index.js";

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

const provider = new ethers.providers.JsonRpcProvider(
  "https://public-en-baobab.klaytn.net"
);
const contract = new ethers.Contract(
  curiousPandaNFTAddress,
  curiousPandaNFTAbi,
  provider
);

export const AdminBamboo = () => {
  const [txContract, setTxContract] = useState();
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState();
  const [currentPhase, setCurrentPhase] = useState(Phase.INIT);
  const [totalNFTAmount, setTotalNFTAmount] = useState(0);
  const [totalSaleNFTAmount, setTotalSaleNFTAmount] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [mintDeposit, setMintDeposit] = useState("0x");
  const [saleTotalAmount, setSaleTotalAmount] = useState([]);
  const [saleRemainAmount, setSaleRemainAmount] = useState([]);
  const [maxPerWallet, setMaxPerWallet] = useState([]);
  const [maxPerTx, setMaxPerTx] = useState([]);
  const [mintStartBlockNumber, setMintStartBlockNumber] = useState([]);
  const [mintEndBlockNumber, setMintEndBlockNumber] = useState([]);
  const [mintPrice, setMintPrice] = useState([]);
  const [textWhitelist1Price, setTextWhitelist1Price] = useState("");
  const [textWhitelist2Price, setTextWhitelist2Price] = useState("");
  const [textPublic1Price, setTextPublic1Price] = useState("");
  const [textTotalSaleNFTAmount, setTextTotalSaleNFTAmount] = useState("");
  const [initSupply, setInitSupply] = useState(1);
  const [round, setRound] = useState(0);

  const onChangeWhitelist1Price = (e) => {
    setTextWhitelist1Price(e.target.value);
  };
  const onChangeWhitelist2Price = (e) => {
    setTextWhitelist2Price(e.target.value);
  };
  const onChangePublic1Price = (e) => {
    setTextPublic1Price(e.target.value);
  };
  const onChangeTotalSaleNFTAmount = (e) => {
    setTextTotalSaleNFTAmount(e.target.value);
  };

  const setPrice = async (_phase) => {
    if (!account) {
      alert("지갑 연결 해주세요");
      return;
    }
    if (!contract) {
      return;
    }
    // console.log(_phase);

    let _price;
    if (_phase === Index.whitelist1) {
      _price = textWhitelist1Price * 10 ** 18;
    } else if (_phase === Index.whitelist2) {
      _price = textWhitelist2Price * 10 ** 18;
    } else if (_phase === Index.public1) {
      _price = textPublic1Price * 10 ** 18;
    } else {
      alert("가격 설정 할 수 있는 Phase가 아닙니다.");
      return;
    }

    console.log(_phase, _price.toString());

    const tx = await txContract.setMintPrice(_phase, _price.toString());
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

      setTxContract(_contract);
    }
  };

  useEffect(() => {
    const init = async () => {
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

      const _currentPhase = currentBlock;
      let phaseString;
      if (_currentPhase === 0) phaseString = "INIT";
      if (_currentPhase === 1) phaseString = "WHITELIST1";
      if (_currentPhase === 2) phaseString = "WAITING_WHITELIST2";
      if (_currentPhase === 3) phaseString = "WHITELIST2";
      if (_currentPhase === 4) phaseString = "WAITING_PUBLIC1";
      if (_currentPhase === 5) phaseString = "PUBLIC1";
      if (_currentPhase === 6) phaseString = "DONE";

      setCurrentPhase(phaseString);

      // const _totalNFTAmount = await contract.totalNFTAmount();
      setTotalNFTAmount(totalNFTAmount);

      const _totalSupply = await contract.totalSupply();
      setTotalSupply(Number(_totalSupply));

      // const _totalSaleNFTAmount = await contract.totalSaleNFTAmount();
      setTotalSaleNFTAmount(totalSaleNFTAmount);

      const _mintDeposit = await contract.mintDepositAddress();
      setMintDeposit(_mintDeposit);

      // const _initSupply = await contract.initSupply();
      setInitSupply(initSupply);

      // const _round = await contract.stage();
      setRound(stage);

      let _saleTotalAmount = [];
      let _saleRemainAmount = [];
      let _maxPerWallet = [];
      let _maxPerTx = [];
      let _mintStartBlockNumber = [];
      let _mintEndBlockNumber = [];
      let _mintPrice = [];
      for (let i = 0; i < 3; i++) {
        // _saleTotalAmount.push(Number(await contract.saleTotalAmount(i)));
        // _saleRemainAmount.push(Number(await contract.saleRemainAmount(i)));
        // _maxPerWallet.push(Number(await contract.maxPerWallet(i)));
        // _maxPerTx.push(Number(await contract.maxPerTransaction(i)));
        // _mintStartBlockNumber.push(
        //   Number(await contract.mintStartBlockNumber(i))
        // );
        // _mintEndBlockNumber.push(Number(await contract.mintEndBlockNumber(i)));
        // _mintPrice.push(Number(await contract.mintPriceList(i)));

        _saleTotalAmount.push(Number(saleTotalAmounts[i]));
        _saleRemainAmount.push(Number(saleRemainAmounts[i]));
        _maxPerWallet.push(Number(maxPerWallet[i]));
        _maxPerTx.push(Number(maxPerTransaction[i]));
        _mintStartBlockNumber.push(Number(mintStartBlockNumber[i]));
        _mintEndBlockNumber.push(Number(mintEndBlockNumber[i]));
        _mintPrice.push(Number(await contract.mintPriceList(i)));
      }

      setSaleTotalAmount([..._saleTotalAmount]);
      setSaleRemainAmount([..._saleRemainAmount]);
      setMaxPerWallet([..._maxPerWallet]);
      setMaxPerTx([..._maxPerTx]);
      setMintStartBlockNumber([..._mintStartBlockNumber]);
      setMintEndBlockNumber([..._mintEndBlockNumber]);
      setMintPrice([..._mintPrice]);
    };

    init();
  }, []);

  useEffect(() => {
    getContract();

    const connectInit = async () => {
      if (account) {
        // const _balanceNFT = await readContract.balanceOf(account);
        // setBalanceNFT(Number(_balanceNFT));
      }
    };

    connectInit();
  }, [account]);
  return (
    <div
      style={{
        display: "flex",
        // justifyContent: "center",
        // alignItems: "center",
        margin: "100px 200px",
        flexDirection: "column",
        backgroundColor: "beige",
      }}
    >
      <WalletConnect
        getAccount={getAccount}
        getProvider={getProvider}
      ></WalletConnect>
      <div className="adminContent">
        <span>
          INIT - WHITELIST1 - WAITING_WHITELIST2 - WHITELIST2 - WAITING_PUBLIC1
          - PUBLIC1 - DONE
        </span>
      </div>
      <div className="adminContent">
        <span>Round :</span>
        <span> {round}</span>
      </div>
      <div className="adminContent">
        <span>CurrentPhase :</span>
        <span> {currentPhase}</span>
      </div>
      <div className="adminContent">
        <span>Total NFT Amount : </span>
        <span>{totalNFTAmount}</span>
      </div>
      <div className="adminContent">
        <span>TotalSupply :</span>
        <span> {totalSupply}</span>
      </div>
      <div className="adminContent">
        <span>Total sale NFT Amount :</span>
        <span> {totalSaleNFTAmount}</span>
      </div>
      <div className="adminContent">
        <span>Mint deposit :</span>
        <span> {mintDeposit}</span>
      </div>
      <div className="adminContent">
        <span>saleTotalAmount :</span>
        <span>
          {" "}
          {saleTotalAmount[0]} / {saleTotalAmount[1]} / {saleTotalAmount[2]}
        </span>
      </div>
      <div className="adminContent">
        <span>saleRemainAmount :</span>
        <span>
          {" "}
          {saleRemainAmount[0]} / {saleRemainAmount[1]} / {saleRemainAmount[2]}
        </span>
      </div>
      <div className="adminContent">
        <span>maxPerWallet :</span>
        <span>
          {" "}
          {maxPerWallet[0]} / {maxPerWallet[1]} / {maxPerWallet[2]}
        </span>
      </div>
      <div className="adminContent">
        <span>maxPerTx :</span>
        <span>
          {" "}
          {maxPerTx[0]} / {maxPerTx[1]} / {maxPerTx[2]}
        </span>
      </div>
      <div className="adminContent">
        <span>mintStartBlockNumber :</span>
        <span>
          {" "}
          {mintStartBlockNumber[0]} / {mintStartBlockNumber[1]} /{" "}
          {mintStartBlockNumber[2]}
        </span>
      </div>
      <div className="adminContent">
        <span>mintEndBlockNumber :</span>
        <span>
          {" "}
          {mintEndBlockNumber[0]} / {mintEndBlockNumber[1]} /{" "}
          {mintEndBlockNumber[2]}
        </span>
      </div>
      <div className="adminContent">
        <span>initSupply :</span>
        <span>{initSupply}</span>
      </div>
      <div className="adminContent">
        <span>mintPrice :</span>
        <span>
          {" "}
          {mintPrice[0] / 10 ** 18} / {mintPrice[1] / 10 ** 18} /{" "}
          {mintPrice[2] / 10 ** 18}
        </span>
      </div>
      <div className="adminContent">
        whitelist1
        <input
          onChange={onChangeWhitelist1Price}
          value={textWhitelist1Price}
          type="number"
          placeholder="가격 입력(klay)"
        ></input>
        <Button
          // className=""
          variant="success"
          onClick={() => {
            setPrice(Index.whitelist1);
          }}
        >
          set Whitelist1 Price
        </Button>
      </div>
      <div className="adminContent">
        whitelist2
        <input
          onChange={onChangeWhitelist2Price}
          value={textWhitelist2Price}
          type="number"
          placeholder="가격 입력(klay)"
        ></input>
        <Button
          // className=""
          variant="success"
          onClick={() => {
            setPrice(Index.whitelist2);
          }}
        >
          set Whitelist2 Price
        </Button>
      </div>
      <div className="adminContent">
        public
        <input
          onChange={onChangePublic1Price}
          value={textPublic1Price}
          type="number"
          placeholder="가격 입력(klay)"
        ></input>
        <Button
          // className=""
          variant="success"
          onClick={() => {
            setPrice(Index.public1);
          }}
        >
          set Public1 Price
        </Button>
      </div>
    </div>
  );
};

export default AdminBamboo;
