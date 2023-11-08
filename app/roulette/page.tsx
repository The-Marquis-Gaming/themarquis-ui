import React from "react"
import Image from "next/image"
import DegradeButton from "../components/DegradeButton/DegradeButton"
import Row from "../components/Row/Row"
import "./roulette.css"
import RouletteChips from "./RouletteChips/rouletteChips"
import GameButtons from "./GameButtons/gameButtons"
import RouletteBoard from "./RouletteBoard/rouletteBoard"

function Roulette() {
    return (
        <Row>
            <section>
                <div className="flex gap-8 items-center">
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
                    <div className="flex flex-col items-center">
                        <Image src="/images/roulette-1.png" alt="roulette" width={540} height={540}></Image>
                        <button className="btn-degrade w-[400px] text-white text-2xl hover:text-gray-200 px-24 py-4">CONFIRM</button>
                    </div>
                    <div className="container-boardgame">
                        <div className="container-board">
                            <RouletteBoard></RouletteBoard>
                        </div>
                        <RouletteChips></RouletteChips>                
                        <GameButtons></GameButtons>
                    </div>
                </div>
            </section>
        </Row>
    )
}

export default Roulette
