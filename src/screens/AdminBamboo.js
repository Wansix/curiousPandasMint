import React from "react";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import WalletConnect from "../components/WalletConnect";
import { ethers } from "ethers";
import { curiousPandaNFTAddress } from "../contracts/address.js";
import { curiousPandaNFTAbi } from "../contracts/abi.js";
import * as readContract from "../contracts/index.js";
import { testFlag } from "../contracts/index.js";

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

let node;
if (testFlag) {
  node = "https://public-en-baobab.klaytn.net";
} else {
  node = "https://public-en-cypress.klaytn.net";
}

const provider = new ethers.providers.JsonRpcProvider(node);
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

  const setPrice = async (_phase) => {
    if (!account) {
      alert("지갑 연결 해주세요");
      return;
    }
    if (!contract) {
      return;
    }

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

    await txContract.setMintPrice(_phase, _price.toString());
  };

  const advancePhase = async () => {
    if (!account) {
      alert("지갑 연결 해주세요");
      return;
    }
    if (!contract) {
      return;
    }
    await txContract.advancePhase();
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

  const setWhitelists = async (whitelistNum) => {
    let whitelists;
    if (!account) {
      alert("지갑 연결 해주세요");
      return;
    }

    if (whitelistNum === Phase.WHITELIST1) {
      whitelists = document.querySelector(".addWhitelists_1").value;
    }
    if (whitelistNum === Phase.WHITELIST2) {
      whitelists = document.querySelector(".addWhitelists_2").value;
    }

    console.log(whitelists);
    const arr = whitelists.split("\n");
    console.log(arr);

    try {
      if (!contract) {
        return;
      }
      if (whitelistNum === Phase.WHITELIST1) {
        txContract.addToWhitelist(0, arr);
      } else if (whitelistNum === Phase.WHITELIST2) {
        txContract.addToWhitelist(1, arr);
      }
    } catch (error) {
      console.log("setWhitelists", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      readContract.initNode();
      const data = await readContract.getDatas();

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

      const _currentPhase = currentPhase;
      let phaseString;
      if (_currentPhase === 0) phaseString = "INIT";
      if (_currentPhase === 1) phaseString = "WHITELIST1";
      if (_currentPhase === 2) phaseString = "WAITING_WHITELIST2";
      if (_currentPhase === 3) phaseString = "WHITELIST2";
      if (_currentPhase === 4) phaseString = "WAITING_PUBLIC1";
      if (_currentPhase === 5) phaseString = "PUBLIC1";
      if (_currentPhase === 6) phaseString = "DONE";

      setCurrentPhase(phaseString);

      setTotalNFTAmount(totalNFTAmount);

      const _totalSupply = await contract.totalSupply();
      setTotalSupply(Number(_totalSupply));

      setTotalSaleNFTAmount(totalSaleNFTAmount);

      const _mintDeposit = await contract.mintDepositAddress();
      setMintDeposit(_mintDeposit);

      setInitSupply(initSupply);

      setRound(stage);

      let _saleTotalAmount = [];
      let _saleRemainAmount = [];
      let _maxPerWallet = [];
      let _maxPerTx = [];
      let _mintStartBlockNumber = [];
      let _mintEndBlockNumber = [];
      let _mintPrice = [];
      for (let i = 0; i < 3; i++) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      ></WalletConnect>

      <div className="adminContent">
        <span>
          INIT - WHITELIST1 - WAITING_WHITELIST2 - WHITELIST2 - WAITING_PUBLIC1
          - PUBLIC1 - DONE
        </span>
      </div>

      <div className="adminContent">
        <Button variant="success" onClick={advancePhase}>
          advance phase
        </Button>
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
          variant="success"
          onClick={() => {
            setPrice(Index.public1);
          }}
        >
          set Public1 Price
        </Button>
      </div>
      <div>
        add whitelist1
        <textarea className="addWhitelists addWhitelists_1"></textarea>
        <Button
          className="Admin_Button"
          variant="success"
          onClick={() => {
            setWhitelists(Phase.WHITELIST1);
          }}
        >
          Add whitelist1
        </Button>
      </div>
      <div>
        add whitelist2
        <textarea className="addWhitelists addWhitelists_2"></textarea>
        <Button
          className="Admin_Button"
          variant="success"
          onClick={() => {
            setWhitelists(Phase.WHITELIST2);
          }}
        >
          Add whitelist1
        </Button>
      </div>
    </div>
  );
};

export default AdminBamboo;
