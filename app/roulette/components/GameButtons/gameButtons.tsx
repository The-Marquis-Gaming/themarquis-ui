import React from "react"
import Image from "next/image"
import "./gameButtons.css"

interface GameButton{
    clear : ()=>void;
    eraseMode: boolean;
    handleEraseClick: () => void;
}

function GameButtons(props:GameButton) {
    const {clear, eraseMode, handleEraseClick}=props
    return (
        <div className="flex gap-10">
            <button className="py-4 px-20 border border-solid border-[#A962FF] bg-[#111] rounded-[15px]">REPEAT</button>
            <button 
            className={`py-4 px-20 border border-solid border-[#A962FF] bg-[#111] rounded-[15px] button-eraser ${eraseMode ? 'erase-mode' : ''}`}
            onClick={handleEraseClick}
            >
            {/* <Image src="/images/eraser.png" alt="eraser" width={29} height={29}></Image> */}
            ERASE
            </button>
            <button className="py-4 px-20 border border-solid border-[#A962FF] bg-[#111] rounded-[15px]"
            onClick={clear}
            >CLEAR</button>
        </div>
    )
}

export default GameButtons
