"use client"
import Image from "next/image"
import RouletteBoard from "../../components/RouletteBoard/rouletteBoard"
import GameButtons from "../../components/GameButtons/gameButtons"
import Chips, { Color } from "../../components/RouletteChips/Chips/Chips"
import { useState } from "react"
import '../../roulette.css'

function Board() {
    const [colorchip, setColorchip] = useState('')
    return (
        <section>
        <div className="flex gap-8 items-center mx-40">
            <div className="py-4 px-6 border border-solid border-white flex justify-between rounded-2xl w-[400px] bg-[#111]">
                <span>BETS:</span>
                <span>32 STARK</span>
            </div>
            <div className="py-4 px-6 border border-solid border-white flex justify-between rounded-2xl w-[400px] bg-[#111]">
                <span>BALANCE:</span>
                <span>68 STARK</span>
            </div>
            <button>
                <Image src="/images-game/help_icon.png" alt="icon" width={30} height={30}></Image>
            </button>
        </div>
        <div className="container-game">
            <div className="flex flex-col items-center justify-between">
                <Image src="/images/roulette-1.png" alt="roulette" width={560} height={560}></Image>
                <button className="btn-degrade w-[400px] text-white text-2xl hover:text-gray-200 px-24 py-4">CONFIRM</button>
            </div>
            <div className="container-boardgame">
                <div className="container-board">
                    <RouletteBoard colorChip={colorchip}></RouletteBoard>
                </div>
                <div className="flex gap-4 container-chip">
                       <Chips color={Color.White} onClick={function(){setColorchip('white')}}>5</Chips>
                       <Chips color={Color.Blue} onClick={function(){setColorchip('red')}}>10</Chips>
                       <Chips color={Color.Yellow} onClick={function(){setColorchip('red')}}>50</Chips>
                       <Chips color={Color.Green} onClick={function(){setColorchip('red')}}>100</Chips>
                 </div>
                                 
                <GameButtons></GameButtons>
            </div>
        </div>
    </section>
    )
}

export default Board
