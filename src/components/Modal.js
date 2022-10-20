import React,{useState} from 'react'
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import { toHex } from '../utils'
import { networkParams } from './network';
import { ethers } from 'ethers';

export default function Modal({ open, setopen, state,provider,connectwallet,account,setverify,transactions,settransactions }) {
    console.log(state)
  const [network, setnetwork] = useState(null);
  const [message, setmessage] = useState("");
  const [signedMessage, setsignMessage] = useState("");
    const [signature, setsignature] = useState(0);
    const [sendt, setsendt] = useState({})
    


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
        setopen(!open)
        } catch (error) {
          console.log(error);
          setopen(!open)
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
      setopen(!open)
    } catch (error) {
      console.log(error);
      setopen(!open)
      }
  }

  async function VarifyMessage() {
    try {
      let vari = await provider.provider.request({
        method: "personal_ecRecover",
        params: [signedMessage, signature],
      });
      setverify(vari === account[0].toLowerCase());
      setopen(!open)
    } catch (error) {
      console.log(error);
      setopen(!open)
      }
  }


    async function sendTransaction()
    {
        try {
            let signer = await provider.getSigner();
          let tx= await signer.sendTransaction({
              to: sendt.receiver,
              value:ethers.utils.parseEther(sendt.amount),
          })
            let receipt = await tx.wait()
            console.log(receipt)
            settransactions([...transactions,receipt])
            setopen(!open)
        } catch (error) {
            console.log(error)
            setopen(!open)
        }
    }
    
  return (
    <div className={open == true ? "open" : "close"}>
      <div className="modal">
        <div>
          <DoDisturbOnIcon
            sx={{ color: "black", cursor: "pointer" }}
            onClick={() => {
              setopen(!open);
            }}
          />
        </div>
        {state === "sign" ? (
          <>
            <input
              type="text"
              name="message"
              placeholder="Sign Message..."
              onChange={(e) => {
                setmessage(e.target.value);
              }}
            />
            <button onClick={SignMessage}>Sign </button>
          </>
        ) : state === "verify" ? (
          <>
            <input
              type="text"
              name="message"
              style={{ width: "80%" }}
              placeholder="verify transaction.."
              defaultValue={signedMessage}
              onChange={(e) => {
                setsignMessage(e.target.value);
              }}
            />
            <button onClick={VarifyMessage}>Verify</button>
          </>
        ) : state === "send" ? (
          <>
            <input
              type="text"
              name="receiver"
              placeholder="Enter Receiver Address"
              onChange={(e) => {
                setsendt({ ...sendt, [e.target.name]: e.target.value });
              }}
            />
            <input
              type="number"
              name="amount"
              placeholder="Enter Amount"
              onChange={(e) => {
                setsendt({ ...sendt, [e.target.name]: e.target.value });
              }}
            />
            <button onClick={sendTransaction}>Send</button>
          </>
        ) : state === "change" ? (
          <>
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
            <button onClick={changeNetwork}>Change</button>
          </>
        ) : null}
      </div>
    </div>
  );
}
