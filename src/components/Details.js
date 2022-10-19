import React, { useState } from "react";
import { toHex } from "../utils";
import { networkParams } from "./network";

export default function Details({ provider, connectwallet, account }) {
  const [anchor, setanchor] = useState("sign");
  const [network, setnetwork] = useState(null);
  const [message, setmessage] = useState("");
  const [signedMessage, setsignMessage] = useState("");
  const [signature, setsignature] = useState(0);
  const [varified, setvarified] = useState(null);

  async function changeNetwork(e) {
    try {
      await provider.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(network) }],
      });
      connectwallet();
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await provider.provider.request({
            method: "wallet_addEthereumChain",
            params: [networkParams[toHex(network)]],
          });
          connectwallet();
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  async function SignMessage() {
    try {
      const signa = await provider.provider.request({
        method: "personal_sign",
        params: [message, account[0]],
      });
      setsignMessage(message);
      setsignature(signa);
    } catch (error) {
      console.log(error);
    }
  }

  async function VarifyMessage() {
    try {
      let vari = await provider.provider.request({
        method: "personal_ecRecover",
        params: [signedMessage, signature],
      });
      setvarified(vari===account[0].toLowerCase());
    } catch (error) {
      console.log(error);
    }
    
  }

  return (
    <>
      <div>
        {varified !== null ? (
          <>
            {varified === true ? (
              <h4 style={{color:'green'}}>Message Varified</h4>
            ) : (
              <h4 style={{color:'red'}}>Message Denied</h4>
            )}
          </>
        ) : null}
      </div>
      <div style={{ display: "flex", justifyContent: "space-around",flexWrap:'wrap' }}>
        <div>
          <button
            onClick={(e) => {
              setanchor("sign");
            }}
          >
            Sign Message
          </button>
          <div className={anchor === "sign" ? "open" : "close"}>
            <div>
              <input
                type="text"
                name="message"
                style={{ width: "80%" }}
                placeholder="Sign Message..."
                onChange={(e) => {
                  setmessage(e.target.value);
                }}
              />
            </div>
            <button style={{ marginBottom: "auto" }} onClick={SignMessage}>
              Sign
            </button>
          </div>
        </div>
        <div>
          <button onClick={() => setanchor("send")}>Send Transaction</button>
          <div className={anchor === "send" ? "open" : "close"}>
            <div>
              <input
                type="text"
                name="message"
                style={{ width: "80%" }}
                placeholder="Enter receiver amount.."
              />
            </div>

            <div>
              <input
                type="text"
                name="message"
                style={{ width: "80%" }}
                placeholder="Enter Amount in Ether.."
              />
            </div>
            <button>Send</button>
          </div>
        </div>
        <div>
          <button
            onClick={(e) => {
              setanchor("varify");
            }}
          >
            Varify Message
          </button>
          <div className={anchor === "varify" ? "open" : "close"}>
            <div>
              <input
                type="text"
                name="message"
                style={{ width: "80%" }}
                placeholder="varify transaction.."
                              defaultValue={signedMessage}
                              onChange={(e)=>{setsignMessage(e.target.value)}}
              />
            </div>
            <button onClick={VarifyMessage}>Varify</button>
          </div>
        </div>
        <div>
          <button
            onClick={(e) => {
              setanchor("change");
            }}
          >
            Change Network
          </button>
          <div className={anchor === "change" ? "open" : "close"}>
            <div>
              <select
                placeholder="Select Network"
                onChange={(e) => {
                  setnetwork(e.target.value);
                }}
              >
                <option>Select Network</option>
                <option value={1}>Mainnet</option>
                <option value={3}>Ropsten</option>
                <option value={4}>Rinkeby</option>
                <option value={5}>Goerli</option>
                <option value={42}>Kovan</option>
                <option value={1666600000}>Harmony</option>
                <option value={42220}>Celo</option>
              </select>
            </div>
            <button style={{ marginBottom: "auto" }} onClick={changeNetwork}>
              Change
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
