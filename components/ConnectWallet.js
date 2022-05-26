const ConnectWallet = ({ connectWallet }) => {
  return (
    <div className="flex justify-center">
      <button
        onClick={connectWallet}
        className="text-2xl w-2/3 mt-8 font-bold p-4 rounded bg-teal-400"
      >
        Connect Wallet
      </button>
    </div>
  );
};

export default ConnectWallet;
