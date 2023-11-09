import Image from "next/image"

export enum Color {
    White = '/images-game/10.png',
    Red = '/images-game/5.png'
}

interface ChipsProps {
    color: Color ;
    onClick?: ()=>void ;
    children: string
  }

function Chips(props:ChipsProps) {
    const {color, onClick= ()=>{}, children} = props
    return (
    <button className="chip w-[198px] h-[198px] " style={{backgroundImage: `url(${color})`}} onClick={onClick}>
        <span className="content-chip text-3xl">{children}</span>
    </button>
    )
}

export default Chips
