
export enum Color {
    White = '/images-game/5.png',
    Blue = '/images-game/10.png',
    Yellow = '/images-game/50.png',
    Green = '/images-game/100.png'
}

interface ChipsProps {
    color: Color ;
    onClick?: ()=>void ;
    children: string
  }

function Chips(props:ChipsProps) {
    const {color, onClick= ()=>{}, children} = props
    return (
    <button className="chip w-[188px] h-[188px] " style={{backgroundImage: `url(${color})`}} onClick={onClick}>
        <span className="content-chip text-3xl">{children}</span>
    </button>
    )
}

export default Chips
