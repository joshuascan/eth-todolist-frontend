import Head from "next/head";
import TaskWindow from "../components/TaskWindow";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState, useCallback } from "react";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [signer, setSigner] = useState();
  const [contract, setContract] = useState();
  const [tasks, setTasks] = useState([]);
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    const instance = await web3ModalRef.current.connect();
    const provider = new providers.Web3Provider(instance);
    const _signer = provider.getSigner();
    const _contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, _signer);
    setSigner(_signer);
    setContract(_contract);

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
    <div className="mt-16 flex justify-center">
      <Head>
        <title>Ethereum To-Do List Dapp</title>
        <meta name="description" content="To-Do List app built on Ethereum" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
            <div className="flex flex-col items-center">
              <button
                onClick={connectWallet}
                className="text-2xl w-2/3 mt-8 font-bold p-4 rounded bg-teal-400"
              >
                Connect Wallet
              </button>
            </div>
          ) : (
            <div>
              <div className="flex justify-center mt-2">
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
              {loading && <div>Loading...</div>}
              <TaskWindow tasks={tasks} handleComplete={handleComplete} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
