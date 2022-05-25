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
      <div className="bg-slate-800 w-1/3 px-8 py-16 flex flex-col items-center">
        <h1 className="text-5xl ">To-Do List Dapp</h1>
        <div>
          {!walletConnected ? (
            <button onClick={connectWallet}>Connect Wallet</button>
          ) : (
            <div>
              <div className="flex justify-center">
                <input
                  name="description"
                  value={newTaskDescription}
                  onChange={handleDescriptionChange}
                  placeholder="Task description..."
                  disabled={loading}
                />
                <button
                  onClick={addTask}
                  disabled={loading}
                  className="text-2xl"
                >
                  Add Task
                </button>
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
