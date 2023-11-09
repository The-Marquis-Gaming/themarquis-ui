import Image from "next/image"
function Chip50() {
    return (
    <button className="chip">
        <Image src="/images-game/50.png" alt="chip2" width={140} height={140}></Image>
        <span className="content-chip text-3xl">50</span>
    </button>
    )
}

export default Chip50
