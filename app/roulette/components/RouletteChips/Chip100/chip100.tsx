import Image from "next/image"
function Chip100() {
    return (
    <button className="chip">
        <Image src="/images-game/100.png" alt="chip3" width={140} height={140}></Image>
        <span className="content-chip text-3xl">100</span>
    </button>
    )
}

export default Chip100
