import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Ethereum To-Do List Dapp</title>
        <meta name="description" content="To-Do List app built on Ethereum" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>To-Do List Dapp</h1>
    </div>
  );
}
