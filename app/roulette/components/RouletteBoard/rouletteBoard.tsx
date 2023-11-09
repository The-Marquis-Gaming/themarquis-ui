import SlotNumber from "../RouletteNumber/SlotNumber"
import RouletteNumber0 from "../RouletteNumber/RouletteNumber0";
import { ColorSlot } from "../RouletteNumber/SlotNumber";

const numbers: number[] = [];
for (let i = 1; i <= 36; i++) {
    numbers.push(i);
}

const slots = [
    {
        color: ColorSlot.Purple,
        coins: ['white']
    },
    {
        color: ColorSlot.Gray,
        coins: ['white','purple']
    },
    {
        color: ColorSlot.Purple,
        coins: []
    },

];

function RouletteBoard() {
    return (
        <>
            <RouletteNumber0></RouletteNumber0>
            <div className="flex flex-wrap">
                {slots.map(({ color }, index) => <SlotNumber background={color} key={index} onClick={function (number) { console.log(number) }}>{index + 1}</SlotNumber>)}
            </div>
        </>
    )
}

export default RouletteBoard
