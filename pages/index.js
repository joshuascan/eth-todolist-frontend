import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState, useCallback } from "react";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    const instance = await web3ModalRef.current.connect();
    const provider = new providers.Web3Provider(instance);

    const { chainId } = await provider.getNetwork();
    if (chainId !== 4) {
      window.alert("Change the network to Rinkeby");
      throw new Error("Change network to Rinkeby");
    }

    if (needSigner) {
      const signer = provider.getSigner();
      return signer;
    }
    return provider;
  };

  const connectWallet = useCallback(async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
      });
      connectWallet();
    }
  }, [walletConnected, connectWallet]);

  const addTask = async (taskDescription) => {
    try {
      const signer = await getProviderOrSigner(true);
      const todolistContract = new Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const tx = await todolistContract.createTask(taskDescription);
      setLoading(true);

      await tx.wait();
      setLoading(false);
    } catch (err) {}
  };

  return (
    <div>
      <Head>
        <title>Ethereum To-Do List Dapp</title>
        <meta name="description" content="To-Do List app built on Ethereum" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>To-Do List Dapp</h1>
      <div>
        {!walletConnected && (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}
      </div>
    </div>
  );
}
