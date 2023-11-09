import React from "react"
function GameButtons() {
    return (
        <div className="flex gap-10">
            <button className="py-4 px-20 border border-solid border-[#A962FF] bg-[#111] rounded-[15px]">UNDO</button>
            <button className="py-4 px-20 border border-solid border-[#A962FF] bg-[#111] rounded-[15px]">REDO</button>
            <button className="py-4 px-20 border border-solid border-[#A962FF] bg-[#111] rounded-[15px]">CLEAR</button>
        </div>
    )
}

export default GameButtons
