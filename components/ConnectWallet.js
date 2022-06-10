import MetaMaskButton from "./MetaMaskButton";

const ConnectWallet = ({ connectWallet }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <MetaMaskButton connectWallet={connectWallet}>
        Connect Wallet
      </MetaMaskButton>
      <p className="mt-8">Don&apos;t have MetaMask?</p>
      <a
        href="https://metamask.io/"
        target="_blank"
        rel="noreferrer"
        className="text-blue-500 underline"
      >
        Download MetaMask
      </a>
    </div>
  );
};

export default ConnectWallet;
