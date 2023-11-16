import React from "react"
import {useState} from "react"
import Image from "next/image"
import "./ModalWallet.css"
import DegradeButton from "../DegradeButton/DegradeButton"

type ModalProps = {
  onClose: () => void;
};


export const ModalWallet: React.FC<ModalProps> = ({ onClose }) => {
  const [boton1Color, setBoton1Color] = useState("#293037");
  const [boton2Color, setBoton2Color] = useState("transparent");

  const cambiarColorBoton1 = () => {
    setBoton1Color("#293037");
    setBoton2Color("#1A1E23");
  };

  const cambiarColorBoton2 = () => {
    setBoton1Color("#1A1E23");
    setBoton2Color("#293037");
  };
  
  return (
    <div className=" w-[456] h-[640] modal-container">
      <div className="flex justify-between bg-black p-4">
        <h3 className="text-2xl">Your Marquis Wallet</h3>
        <div className='box-iconclose' onClick={onClose}>
          <Image alt='icon' src="/images/close.png" width={32} height={32}></Image>
        </div>
      </div>
      <div className=" flex flex-col gap-2 px-7 py-10">
        <span className="text-[#718096] text-base pt-2">Balance</span>
        <span className="text-4xl font-bold">32 STRK</span>
        <div className=" flex justify-center bg-[#1A1E23] p-2 border border-solid border-[#39424C] rounded-2xl ">
          <button className=" px-6 py-2 text-base rounded-2xl " style={{ backgroundColor: boton1Color }} onClick={cambiarColorBoton1}>Deposit</button>
          <button className=" px-6 py-2 text-base rounded-2xl" style={{ backgroundColor: boton2Color }} onClick={cambiarColorBoton2} >Withdraw</button>
        </div>
        <div className="flex justify-center gap-8">
          <div className=" flex flex-col gap-2">
            <span>From</span>
            <p className="text-4xl font-bold ">0</p>
            <span>Balance: 70.42</span>
          </div>
          <div className="flex justify-center items-center">
            <Image alt="icon" src="/images/image-eth.png" width={40} height={40}></Image>
            <span className="text-lg">ETH</span>
            <div className="cursor-pointer">
            <Image alt="icon-arrow-down" src="/images/arrow_down.png" width={20} height={20}></Image>
            </div>
          </div>
        </div>
        <div className="border-t-2 border-[#7901D6] m-4 separator">
          <Image alt="buton" src="/images/btn.png" width={24} height={24}></Image>
        </div>
        <div className="flex justify-center gap-8 m-5">
          <div className=" flex flex-col gap-2">
            <span>To</span>
            <p className="text-4xl font-bold ">0</p>
            <span>Balance:-</span>
          </div>
          <div className="flex justify-center items-center gap-2">
            <Image alt="icon" src="/images/starknet.png" width={30} height={30}></Image>
            <span className="text-lg">Starknet</span>
          </div>
        </div>
          <DegradeButton>CONFIRM</DegradeButton>
      </div>

    </div>
  )
}