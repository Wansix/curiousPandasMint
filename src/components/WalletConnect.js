import React from "react";
import { useState, useEffect } from "react";
import * as dotenv from "dotenv";
import { Button } from "react-bootstrap";
import { ethers } from "ethers";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";

dotenv.config();

export const WalletConnect = (props) => {
  const [account, setAccount] = useState("");
  const [viewAccount, setViewAccount] = useState("지갑 연결하기");
  // const [provider, setProvider] = useState({});
  // const [signer, setSigner] = useState({});
  const [connectWalletModal, setConnectWalletModal] = useState(false);

  const handleClose = () => setConnectWalletModal(false);

  const setViewAccountStr = (rawAccount) => {
    const tempAccount = rawAccount;
    const frontAccount = tempAccount.substr(0, 5);
    const backAccount = tempAccount.substr(-5);
    const tempViewAccount = frontAccount + "..." + backAccount;
    return tempViewAccount;
  };

  const getAccount = async (walletName) => {
    let wallet;
    if (walletName === "kaikas") {
      wallet = window.klaytn;
    }
    if (walletName === "metamask") {
      wallet = window.ethereum;
    }
    try {
      if (wallet) {
        const _provider = new ethers.providers.Web3Provider(wallet);
        // setProvider(_provider);

        const accounts = await _provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        // console.log(accounts);

        // const _signer = _provider.getSigner();
        // setSigner(_signer);

        const network = await _provider.getNetwork();
        const chainId = network.chainId;

        if (chainId !== 1001 && chainId !== 8217) {
          Swal.fire({
            icon: "error",
            title: "Wrong network",
            text: "잘못된 네트워크입니다. 네트워크를 변경해주세요!",
          });
          return;
        }

        const tempAccount = accounts[0];
        const tempViewAccount = setViewAccountStr(tempAccount);
        setViewAccount(tempViewAccount);

        props.getAccount(tempAccount);
        props.getProvider(_provider);
      } else {
        Swal.fire({
          icon: "error",
          title: "No wallet",
          text: "연결 할 수 있는 지갑이 없습니다.",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = () => {
    setConnectWalletModal(true);
  };

  const onClickMetamask = () => {
    // setWalletName("metamask");
    getAccount("metamask");
    setConnectWalletModal(false);
  };

  const onClickKaikas = () => {
    // setWalletName("kaikas");
    getAccount("kaikas");
    setConnectWalletModal(false);
  };

  useEffect(() => {
    if (window.klaytn) {
      window.klaytn.on("accountsChanged", function () {
        getAccount("kaikas");
      });
    }

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", function () {
        getAccount("metamask");
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (props.WhitelistCheck === true) {
      document
        .querySelector(".WalletConnect")
        .classList.add("walletConnect-whitelistCheck");
    }
    if (!account) {
      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return (
    <div className="WalletConnect">
      <Button
        className="wallet-connect-button"
        variant="success"
        onClick={connectWallet}
      >
        {viewAccount}
      </Button>
      <Modal show={connectWalletModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>지갑을 선택해주세요</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="WalletSelect-content" onClick={onClickMetamask}>
            <div className="WalletSelect-contect-icon">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                alt="metamask"
              ></img>
            </div>
            <div className="WalletSelect-contect-text">
              <span>Metamask</span>
            </div>
          </div>
          <div className="WalletSelect-content" onClick={onClickKaikas}>
            <div className="WalletSelect-contect-icon">
              <img
                src="https://www.gitbook.com/cdn-cgi/image/width=40,dpr=2,height=40,fit=contain,format=auto/https%3A%2F%2F3237190568-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FzvgdDSwmwvJE7FLb6FCc%252Ficon%252FzKemLV4grODY1vlxlTrU%252Fsymbol_multi_solid.png%3Falt%3Dmedia%26token%3D53643768-91b6-41cb-8a9f-52d6b1194550"
                alt="kaikas"
              ></img>
            </div>
            <div className="WalletSelect-contect-text">
              <span>Kaikas</span>
            </div>
          </div>
        </Modal.Body>
        {/* <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer> */}
      </Modal>
    </div>
  );
};
// => {
//   const [account, setAccount] = useState("");
//   const [viewAccount, setViewAccount] = useState("지갑 연결하기");
//   const [provider, setProvider] = useState({});
//   const [signer, setSigner] = useState({});
//   const [connectWalletModal, setConnectWalletModal] = useState(false);

//   const handleClose = () => setConnectWalletModal(false);

//   const testtest = () => {
//     console.log("testtest");
//   };

//   const getAccount = async (walletName) => {
//     let wallet;
//     if (walletName === "kaikas") wallet = window.klaytn;
//     if (walletName === "metamask") wallet = window.ethereum;
//     try {
//       if (wallet) {
//         const _provider = new ethers.providers.Web3Provider(wallet);
//         setProvider(_provider);

//         const accounts = await _provider.send("eth_requestAccounts", []);
//         setAccount(accounts[0]);
//         console.log(accounts);

//         const _signer = _provider.getSigner();
//         setSigner(_signer);

//         const network = await _provider.getNetwork();
//         const chainId = network.chainId;

//         if (chainId !== 1001 && chainId !== 8217) {
//           Swal.fire({
//             icon: "error",
//             title: "Wrong network",
//             text: "잘못된 네트워크입니다. 네트워크를 변경해주세요!",
//           });
//           return;
//         }

//         const tempAccount = accounts[0];
//         const frontAccount = tempAccount.substr(0, 5);
//         const backAccount = tempAccount.substr(-5);
//         const tempViewAccount = frontAccount + "..." + backAccount;
//         setViewAccount(tempViewAccount);

//         props.getAccount(tempAccount);
//         props.getProvider(_provider);
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "No wallet",
//           text: "연결 할 수 있는 지갑이 없습니다.",
//         });
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const connectWallet = () => {
//     setConnectWalletModal(true);
//   };
//   const test = async () => {
//     console.log(provider);
//     console.log(signer);
//   };

//   const onClickMetamask = () => {
//     getAccount("metamask");
//     setConnectWalletModal(false);
//   };

//   const onClickKaikas = () => {
//     getAccount("kaikas");
//     setConnectWalletModal(false);
//   };

//   useEffect(() => {
//     if (props.WhitelistCheck === true) {
//       document
//         .querySelector(".WalletConnect")
//         .classList.add("walletConnect-whitelistCheck");
//     }
//     if (!account) {
//       return;
//     }

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [account]);

//   return (
//     <div className="WalletConnect">
//       <Button
//         className="wallet-connect-button"
//         variant="success"
//         onClick={connectWallet}
//       >
//         {viewAccount}
//       </Button>
//       <Modal show={connectWalletModal} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>지갑을 선택해주세요</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="WalletSelect-content" onClick={onClickMetamask}>
//             <div className="WalletSelect-contect-icon">
//               <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"></img>
//             </div>
//             <div className="WalletSelect-contect-text">
//               <span>Metamask</span>
//             </div>
//           </div>
//           <div className="WalletSelect-content" onClick={onClickKaikas}>
//             <div className="WalletSelect-contect-icon">
//               <img src="https://www.gitbook.com/cdn-cgi/image/width=40,dpr=2,height=40,fit=contain,format=auto/https%3A%2F%2F3237190568-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FzvgdDSwmwvJE7FLb6FCc%252Ficon%252FzKemLV4grODY1vlxlTrU%252Fsymbol_multi_solid.png%3Falt%3Dmedia%26token%3D53643768-91b6-41cb-8a9f-52d6b1194550"></img>
//             </div>
//             <div className="WalletSelect-contect-text">
//               <span>Kaikas</span>
//             </div>
//           </div>
//         </Modal.Body>
//         {/* <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleClose}>
//             Save Changes
//           </Button>
//         </Modal.Footer> */}
//       </Modal>
//     </div>
//   );
// };

export default WalletConnect;
