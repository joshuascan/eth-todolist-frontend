const SwitchNetwork = ({ switchNetwork }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="mt-4 sm:mt-2 italic text-red-600">
        Please switch to the Rinkeby Test Network
      </h2>
      <button
        onClick={switchNetwork}
        className="text-2xl w-3/4 sm:w-2/3 mt-6 font-bold p-2 sm:p-4 rounded bg-teal-400"
      >
        Switch to Rinkeby
      </button>
    </div>
  );
};

export default SwitchNetwork;
