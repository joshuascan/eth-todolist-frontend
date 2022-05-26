import Head from "next/head";
import WalletAddress from "../components/WalletAddress";
import ConnectWallet from "../components/ConnectWallet";
import SwitchNetwork from "../components/SwitchNetwork";
import TaskWindow from "../components/TaskWindow";
import Spinner from "../components/Spinner";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState, useCallback } from "react";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  const [contract, setContract] = useState();
  const [network, setNetwork] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    const instance = await web3ModalRef.current.connect();
    const provider = new providers.Web3Provider(instance);
    const signer = provider.getSigner();

    const address = await signer.getAddress();
    setCurrentAccount(address);

    const _contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    setContract(_contract);

    const { chainId } = await provider.getNetwork();
    setNetwork(chainId);

    if (needSigner) {
      const signer = provider.getSigner();
      return signer;
    }
    return provider;
  };

  useEffect(() => {
    const handleAccountChange = (...args) => {
      const accounts = args[0];
      if (accounts[0] !== currentAccount) {
        setCurrentAccount(accounts[0]);
        getTasks();
      }
    };

    window.ethereum?.on("accountsChanged", handleAccountChange);
    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountChange);
    };
  });

  useEffect(() => {
    const handleChainChanged = (_chainId) => {
      window.location.reload();
      setNetwork(_chainId);
    };

    window.ethereum?.on("chainChanged", handleChainChanged);
    return () => {
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  });

  const switchNetwork = async () => {
    if (window.ethereum) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x4" }],
      });
    }
  };

  const getTasks = useCallback(async () => {
    try {
      const _tasks = await contract.getTasks();

      const tasksCleaned = _tasks.map((task, index) => {
        return {
          description: task.description,
          completed: task.completed,
          timestamp: new Date(task.timestamp * 1000),
          id: index,
        };
      });

      setTasks(tasksCleaned);
    } catch (error) {
      console.error(error);
    }
  }, [contract]);

  const connectWallet = useCallback(async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
      });
      connectWallet();
    } else if (walletConnected) {
      getTasks();
    }
  }, [walletConnected, getTasks, connectWallet]);

  const addTask = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const todolistContract = new Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const tx = await todolistContract.createTask(newTaskDescription);
      setLoading(true);

      await tx.wait();
      setLoading(false);
      setNewTaskDescription("");
      getTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDescriptionChange = (event) => {
    setNewTaskDescription(event.target.value);
  };

  const handleComplete = async (event) => {
    try {
      const signer = await getProviderOrSigner(true);
      const todolistContract = new Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const tx = await todolistContract.toggleCompleted(event.target.value);
      setLoading(true);

      await tx.wait();
      setLoading(false);
      getTasks();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Head>
        <title>Ethereum To-Do List Dapp</title>
        <meta name="description" content="To-Do List app built on Ethereum" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WalletAddress currentAccount={currentAccount} />
      <div className="mt-16 flex justify-center">
        <div
          className={`bg-slate-800 rounded-lg shadow-2xl px-8 pt-10 ${
            walletConnected ? "pb-8" : "pb-12"
          } mb-8 flex flex-col items-center w-1/3`}
        >
          <h1 className="text-5xl mb-6 font-bold tracking-wide">
            To-Do List Dapp
          </h1>
          <div className="w-full">
            {!walletConnected ? (
              <ConnectWallet connectWallet={connectWallet} />
            ) : network !== 4 ? (
              <SwitchNetwork switchNetwork={switchNetwork} />
            ) : (
              <div>
                <div className="flex justify-center mt-2 mb-3">
                  <button
                    onClick={addTask}
                    disabled={loading}
                    className="text-2xl h-10 w-10 rounded-l bg-teal-400"
                  >
                    +
                  </button>
                  <input
                    name="description"
                    value={newTaskDescription}
                    onChange={handleDescriptionChange}
                    placeholder="Add task..."
                    disabled={loading}
                    className="rounded-r pl-2 focus:outline-none"
                  />
                </div>
                {loading && (
                  <div className="flex justify-center">
                    <Spinner />
                  </div>
                )}
                <TaskWindow tasks={tasks} handleComplete={handleComplete} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
