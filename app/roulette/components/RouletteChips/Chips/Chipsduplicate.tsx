import './Chips.css'
export enum Color {
    White = '/images-game/5.png',
    Blue = '/images-game/10.png',
    Yellow = '/images-game/50.png',
    Green = '/images-game/100.png'
}

interface ChipsProps {
    color: Color ;
    children: string
  }

function Chipsduplicate(props:ChipsProps) {
    const {color, children} = props
    let backgroundColor;

   
      const coinValue = parseInt(children, 10);

      if (coinValue <= 9) {
        backgroundColor = Color.White;
      } else if (coinValue <= 11) {
        backgroundColor = Color.Blue;
      } else if (coinValue <= 51) {
        backgroundColor = Color.Yellow;
      } else {
        backgroundColor = Color.Green;
      }

    return (
    <div className="w-[30px] h-[30px] chip-duplicate" style={{backgroundImage: `url(${backgroundColor})`}} >
       <span className='text-chip'>
       {children}
        </span> 
    </div>
    )
}

export default Chipsduplicate
