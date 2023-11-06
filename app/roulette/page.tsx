import React from "react"
import Image from "next/image"
import DegradeButton from "../components/DegradeButton/DegradeButton"
import Row from "../components/Row/Row"
import "./roulette.css"
import RouletteChips from "./rouletteChips"

function Roulette() {
    return (
        <Row>
            <section>
                <div className="flex justify-end gap-8">
                    <div className="py-4 px-6 border border-solid border-white flex justify-between rounded-2xl w-[400px] bg-[#111]">
                        <span>BETS:</span>
                        <span>32 STARK</span>
                    </div>
                    <div className="py-4 px-6 border border-solid border-white flex justify-between rounded-2xl w-[400px] bg-[#111]">
                        <span>BALANCE:</span>
                        <span>68 STARK</span>
                    </div>
                </div>
                <div className="container-game">
                    <div>
                        <Image src="/images/roulette-1.png" alt="roulette" width={540} height={540}></Image>
                        <DegradeButton>CONFIRM</DegradeButton>
                    </div>
                    <div className="container-boardgame">
                        <div className="container-board"></div>
                        <RouletteChips></RouletteChips>                
                        <div></div> 
                    </div>
                </div>
            </section>
        </Row>
    )
}

export default Roulette
