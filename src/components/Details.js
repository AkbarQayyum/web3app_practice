import React, { useState } from "react";
import { toHex ,truncateAddress} from "../utils";
import Modal from "./Modal";
import { networkParams } from "./network";
import {Table,TableCell,TableRow,TableHead, TableBody} from '@mui/material'
import { ethers } from "ethers";
export default function Details({ provider, connectwallet, account, balance }) {

  const [open, setopen] = useState(false)
  const [state,setstate]=useState(null)
  const [verify,setverify]=useState(null)
  const [transactions,settransactions]=useState([])
  
  return (
    <>
      <div className="parent">
        <h3>ACTIONS</h3>
        <h2 style={{color:'skyblue'}}>{ethers.utils.formatEther(balance)} ETH</h2>
        {verify !== null ? (
          <>
            {verify === true ? (
              <h4 style={{ color: "green" }}>Message Verified</h4>
            ) : (
              <h4 style={{ color: "red" }}>Message Denied</h4>
            )}
          </>
        ) : null}
        <div className="container">
          <div>
            <button
              onClick={() => {
                setopen(!open);
                setstate("sign");
              }}
            >
              Sign Message
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                setopen(!open);
                setstate("verify");
              }}
            >
              Verify Message
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                setopen(!open);
                setstate("send");
              }}
            >
              Send Transaction
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                setopen(!open);
                setstate("change");
              }}
            >
              Change Network
            </button>
          </div>
        </div>
      </div>
      <Modal
        open={open}
        setopen={setopen}
        state={state}
        provider={provider}
        account={account}
        connectwallet={connectwallet}
        setverify={setverify}
        transactions={transactions}
        settransactions={settransactions}
      />

      <div>
        <Table sx={{width:{md:'60%',xs:'100%'},margin:'10px auto'}}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "white", textAlign: "center",fontWeight:'bold' }}>
                Sender
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center",fontWeight:'bold' }}>
                Receiver
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center",fontWeight:'bold' }}>
                Amount
              </TableCell>
              <TableCell sx={{ color: "white", textAlign: "center",fontWeight:'bold' }}>
                Block Number
              </TableCell>
            
            </TableRow>
          </TableHead>
          <TableBody>
            {
             transactions && transactions.map((m)=>{
               return (
                 <TableRow>
                   <TableCell sx={{ color: "white", textAlign: "center" }}>
                     {truncateAddress(m.from).toString()}
                   </TableCell>
                   <TableCell sx={{ color: "white", textAlign: "center" }}>
                     {truncateAddress(m.to).toString()}
                   </TableCell>
                   <TableCell sx={{ color: "white", textAlign: "center" }}>
                     {truncateAddress(m.transactionHash).toString()}
                   </TableCell>
                   <TableCell sx={{ color: "white", textAlign: "center" }}>
                     {m.blockNumber}
                   </TableCell>
                 </TableRow>
               );
              })
            }
          </TableBody>
        </Table>
      </div>
    </>
  );
}
