import React from "react"
import './rouletteChips.css'
import Chip5 from "./Chip5/chip5"
import Chip10 from "./Chip10/chip10"
import Chip50 from "./Chip50/chip50"
import Chip100 from "./Chip100/chip100"

function RouletteChips() {
    return (
        <div className="flex gap-4 container-chip">
           <Chip5></Chip5>
           <Chip10></Chip10>
           <Chip50></Chip50>
           <Chip100></Chip100>
        </div>
    )
}

export default RouletteChips
