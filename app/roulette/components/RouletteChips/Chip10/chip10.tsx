import Image from "next/image"
function Chip10() {
    return (
    <button className="chip">
        <Image src="/images-game/10.png" alt="chip1" width={140} height={140}></Image>
        <span className="content-chip text-3xl">10</span>
    </button>
    )
}

export default Chip10
