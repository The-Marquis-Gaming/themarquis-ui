import { useState } from "react"
import Image from "next/image"

function ModalGame() {

    const [isWinner, setIsWinner] = useState(true)

    return (
        <div className="container-modal">
            <div className="content-modal">
                <div className="flex flex-col gap-6">
                    {isWinner ? (
                        <Image src="/images-game/winner.png" alt="winner" width={140} height={140} />
                    ) : (
                        <Image src="/images-game/loser.png" alt="loser" width={140} height={140}/>
                    )}
                    {isWinner ? <p>You won 123 TOKENS</p> : <p>You lost 123 TOKENS</p>}
                </div>
                <div className='flex gap-8'>
                    <button
                        className="w-[258px] btn-degrade rounded-[19px] py-3 px-8"
                    >CLOSE</button>
                </div>
            </div>
        </div>
    )
}

export default ModalGame
