"use client"
import React from "react";
import { useState } from "react";
import Image from "next/image"
import Chip5duplicate from "./chip5duplicate";
function Chip5() {
    const [duplicatedDivs, setDuplicatedDivs] = useState<JSX.Element[]>([]);

      const handleDuplicateDiv = () => {
        const newDuplicatedDiv = <Chip5duplicate key={duplicatedDivs.length} />;
        setDuplicatedDivs([...duplicatedDivs, newDuplicatedDiv]);
        console.log(newDuplicatedDiv)
    };


    return (
        <button className="chip" onClick={handleDuplicateDiv}>
            <Image src="/images-game/5.png" alt="chip" width={140} height={140}></Image>
            <span className="content-chip text-3xl">5</span>
        </button>
    )
}

export default Chip5
