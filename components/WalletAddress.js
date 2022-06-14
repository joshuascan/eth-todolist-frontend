import Image from "next/image";

const WalletAddress = ({ currentAccount }) => {
  return (
    <div className="flex justify-center sm:justify-end">
      <div className="flex items-center my-2 sm:mt-10 sm:mb-0 sm:mr-14 bg-slate-800 rounded-lg shadow-2xl p-4">
        <div className="flex items-center mr-2">
          <Image
            src={"/images/ethlogo.png"}
            alt="Ethereum Logo"
            width={"20px"}
            height={"25px"}
            objectFit="cover"
          />
        </div>
        {currentAccount ? (
          <p>
            Wallet: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
          </p>
        ) : (
          <p>Not connected</p>
        )}
      </div>
    </div>
  );
};

export default WalletAddress;
