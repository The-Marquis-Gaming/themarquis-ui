import RouletteNumber from "../RouletteNumber/RouletteNumber"
import RouletteNumber0 from "../RouletteNumber/RouletteNumber0";

const numbers: number[] = [];
for (let i = 1; i <= 36; i++) {
  numbers.push(i);
}

const coloredNumbers = [1, 3, 7, 9, 12, 15, 16, 20, 22, 24, 25, 26, 27, 31, 33, 34, 35, 36];

function RouletteBoard() {
    return (
        <>
            <RouletteNumber0></RouletteNumber0>
            <RouletteNumber numbers={numbers} coloredNumbers={coloredNumbers}></RouletteNumber>
        </>
    )
}

export default RouletteBoard
