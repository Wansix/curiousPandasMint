import { ethers } from "ethers";
import { curiousPandaNFTAddress } from "./address.js";
import { curiousPandaNFTAbi } from "./abi.js";

import dotenv from "dotenv";
dotenv.config();

export const testFlag = true;

let provider;
let contract;

const makeRandomNum = () => {
  const rr = Math.floor(Math.random() * 10);
  const nn = Date.now();

  let div;
  if (testFlag) div = 3;
  else div = 4;
  const randomNum = (nn * rr) % div;
  return randomNum;
};

const getRandomEndPointBaobab = (r) => {
  if (r === 0) return process.env.REACT_APP_BAOBAB_ENDPOINT1;
  else if (r === 1) return process.env.REACT_APP_BAOBAB_ENDPOINT2;
  else if (r === 2) return process.env.REACT_APP_BAOBAB_ENDPOINT3;
  else return process.env.REACT_APP_BAOBAB_ENDPOINT1;
};

const getRandomEndPointMainnet = (r) => {
  if (r === 0) return process.env.REACT_APP_MAINNET_ENDPOINT1;
  else if (r === 1) return process.env.REACT_APP_MAINNET_ENDPOINT2;
  else if (r === 2) return process.env.REACT_APP_MAINNET_ENDPOINT3;
  else if (r === 3) return process.env.REACT_APP_MAINNET_ENDPOINT4;
  else return process.env.REACT_APP_MAINNET_ENDPOINT1;
};

const randomNum = makeRandomNum();
console.log("random : ", randomNum);

let endPoint;
if (testFlag) endPoint = getRandomEndPointBaobab(0); //randomNum);
else endPoint = getRandomEndPointMainnet(randomNum);

// try {
console.log("endPoint : ", endPoint);
provider = new ethers.providers.JsonRpcProvider(endPoint);
contract = new ethers.Contract(
  curiousPandaNFTAddress,
  curiousPandaNFTAbi,
  provider
);

export const initNode = () => {
  // const randomNum = makeRandomNum();
  // console.log("random : ", randomNum);
  // let endPoint;
  // if (testFlag) endPoint = getRandomEndPointBaobab(0); //randomNum);
  // else endPoint = getRandomEndPointMainnet(randomNum);
  // // try {
  // console.log("endPoint : ", endPoint);
  // provider = new ethers.providers.JsonRpcProvider(endPoint);
  // contract = new ethers.Contract(
  //   curiousPandaNFTAddress,
  //   curiousPandaNFTAbi,
  //   provider
  // );
  // } catch (e) {
  //   console.log("initNode error : ", e);
  // }
};

initNode();

export const getBlockNumber = async () => {
  return await provider.getBlockNumber();
};

export const getCurrentPhase = async () => {
  return await contract.currentPhase();
};

export const getMintStartBlockNumber = async (index) => {
  return await contract.mintStartBlockNumber(index);
};

export const getMintEndBlockNumber = async (index) => {
  return await contract.mintEndBlockNumber(index);
};

export const getSaleTotalAmount = async (index) => {
  return await contract.saleTotalAmount(index);
};

export const getRemainCount = async (index) => {
  return await contract.saleRemainAmount(index);
};

export const getMaxPerWallet = async (index) => {
  return await contract.maxPerWallet(index);
};

export const getMaxPerTx = async (index) => {
  return await contract.maxPerTransaction(index);
};

export const getMintPriceList = async (index) => {
  return await contract.mintPriceList(index);
};

export const getNFTCountsList = async (index, address) => {
  const stage = await getStage();
  const result = await contract.NFTCountsList(stage, address);
  return result[index];
};

export const checkWhitelist = async (index, address) => {
  const stage = await getStage();
  if (index === 0) {
    return await contract._whitelistedAddress(stage, address);
  } else if (index === 1) {
    return await contract._whitelistedAddress2(stage, address);
  }
};

export const balanceOf = async (address) => {
  return await contract.balanceOf(address);
};

export const balanceOfKlay = async (address) => {
  return await provider.getBalance(address);
};

export const getTotalSupply = async () => {
  return await contract.totalSupply();
};

export const getStage = async () => {
  return await contract.stage();
};

export const getDatas = async () => {
  return await contract.getDatas();
};

export const getMintInfo = async (_address) => {
  return await contract.getMintInfo(_address);
};
