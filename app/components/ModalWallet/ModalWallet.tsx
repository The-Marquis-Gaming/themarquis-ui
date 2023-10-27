import React from "react"
import Image from "next/image"
import "./ModalWallet.css"

function ModalWallet(){
  return(
    <div>
      <h3>Your Marquis Wallet</h3>
      <span>Balance</span>
      <span>32 STRK</span>
      <div>
        <button>Deposit</button>
        <button>Withdraw</button>
      </div>
      <span>From</span>
      <div>
        <p>0</p>
        <div>
          <Image alt="icon" src="/images/image-eth.png" width={40} height={40}></Image>
          <span>ETH</span>
          <Image alt="icon-arrow-down" src="/images/arrow_down.png" width={30} height={30}></Image>
        </div>
        <p>Balance: 70.42</p>
      </div>
      <div>
          <Image alt="buton" src="/images/btn.png" width={24} height={24}></Image>
      </div>

    </div>
  )
}