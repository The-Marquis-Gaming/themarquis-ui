import "./Chips.css";
export enum Color {
  White = "/images-game/5.png",
  Blue = "/images-game/10.png",
  Yellow = "/images-game/50.png",
  Green = "/images-game/100.png",
}

interface ChipsProps {
  children: string;
}

function Chipsduplicate(props: ChipsProps) {
  const { children } = props;
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
    <div
      className="w-[25px] h-[25px] chip-duplicate"
      style={{
        backgroundImage: `url(${backgroundColor})`,
      }}
    ></div>
  );
}

export default Chipsduplicate;
