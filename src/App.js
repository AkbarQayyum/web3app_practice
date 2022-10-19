import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { web3Modal } from "./components/web3modal";
import Details from "./components/Details";
export default function App() {
  const [state, setstate] = useState(null);
  const [isconnected, setisconnected] = useState(false);
  const [provider, setprovider] = useState(null);
  const [signer, setsigner] = useState(null);

  const [amount, setamount] = useState(0);
  const [receiver, setreceiver] = useState("");
  const [chainid, setchainid] = useState(null);
  const [network, setnetwork] = useState(null);
  const [account, setaccount] = useState(null);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectwallet();
    }
  }, []);

  async function connectwallet() {
    const instance = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(instance);
    const signer = await provider.getSigner();
    const acc=await provider.listAccounts()
    const net = await provider.getNetwork();
    if (signer) {
      const Balance = await signer.getBalance();
      const Address = await signer.getAddress();
      const obj = {
        balance: Balance,
        address: Address,
        network: net,
      };
      setstate(obj);
      setprovider(provider);
      setsigner(signer);
      setnetwork(net);
      setaccount(acc)
    }
    setisconnected(true);
  }

  async function Disconnect() {
    await web3Modal.clearCachedProvider();
    setisconnected(false);
    setstate(null);
  }

  return (
    <div  style={{ textAlign: "center",padding:'50px' }}>
      <div   >
        <h1>
          Let's Connect With
          <span >
            Web3Modal
          </span>
        </h1>
      </div>
      <div >
        {isconnected ? (
          <button  onClick={Disconnect}>
            Disconnect Wallet
          </button>
        ) : (
          <button  onClick={connectwallet}>
            Connect Wallet
          </button>
        )}
      </div>
      <div>
        {state !== null ? (
          <div>
            <div>
              <h3>
                Connected Network
              </h3>
              <p >
                {state.network.name} {state.network.chainId}
              </p>
            </div>
            <h3>Signer Address</h3>
            <div>
              <p style={{wordBreak:'break-all'}}>{state.address}</p>
            </div>
            <h3>Signer Balance</h3>
            <div>
              <p >
                {ethers.utils.formatEther(state.balance)} ETH
              </p>
            </div>
          </div>
        ) : null}
      </div>
      <div >
        {state !== null ? (
          <>
            <Details provider={provider} connectwallet={connectwallet} account={account}  />
          </>
        ) : null}
      </div>
    </div>
  );
}
