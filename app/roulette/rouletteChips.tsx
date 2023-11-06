import React from "react"
import Image from "next/image"
import './rouletteChips.css'

function RouletteChips() {
    return (
        <div className="flex gap-4 container-chip">
            <div className="chip">
                <Image src="/images-game/5.png" alt="chip" width={140} height={140}></Image>
                <span className="content-chip text-3xl">5</span>
            </div>
            <div className="chip">
                <Image src="/images-game/10.png" alt="chip1" width={140} height={140}></Image>
                <span className="content-chip text-3xl">10</span>
            </div>
            <div className="chip">
                <Image src="/images-game/50.png" alt="chip2" width={140} height={140}></Image>
                <span className="content-chip text-3xl">50</span>
            </div>
            <div className="chip">
                <Image src="/images-game/100.png" alt="chip3" width={140} height={140}></Image>
                <span className="content-chip text-3xl">100</span>
            </div>
        </div>
    )
}

export default RouletteChips
