import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { web3Modal } from "./components/web3modal";
import Details from "./components/Details";
import { truncateAddress } from "./utils";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

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
    const acc = await provider.listAccounts();
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
      setaccount(acc);
    }
    setisconnected(true);
  }

  async function Disconnect() {
    await web3Modal.clearCachedProvider();
    setisconnected(false);
    setstate(null);
  }

  return (
    <div style={{ textAlign: "center" }}>
      <div>
        {state !== null ? (
          <div>
            <div className="header">
              <div>
                <p style={{display:'flex',alignItems:'center'}}>
                  <CheckCircleIcon sx={{color:'green'}} />
                  Connected Network
                </p>
                <div style={{ fontWeight: "bold" }}>
                  {state.network.name}
                  {state.network.chainId}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
              >
                <div style={{margin:'10px'}}><AccountCircleIcon sx={{fontSize:'50px'}} /></div>
                <div style={{ fontWeight: "bold" }}>
                  <div> {truncateAddress(state.address)}</div>
                  <div>
                    {isconnected ? (
                      <div
                        onClick={Disconnect}
                        style={{ cursor: "pointer", color: "red" }}
                      >
                        Disconnect Wallet
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button onClick={connectwallet} style={{marginTop:'30px'}}>Connect Wallet</button>
        )}
      </div>
      <div>
        <h1>
          Let's Connect With
          <span>Web3Modal</span>
        </h1>
      </div>

      <div>
        {state !== null ? (
          <>
            <Details
              provider={provider}
              connectwallet={connectwallet}
              account={account}
              balance={state.balance}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
