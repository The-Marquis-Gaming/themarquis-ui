"use client"
import Image from "next/image"
function Chip5duplicate() {
    return (
        <div className="chip">
            <Image src="/images-game/5.png" alt="chip" width={140} height={140}></Image>
            <span className="content-chip text-3xl">5</span>
        </div>
    )
}

export default Chip5duplicate
