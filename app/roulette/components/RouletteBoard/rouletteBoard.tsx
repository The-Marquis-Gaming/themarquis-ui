import Chipsduplicate, { Color } from "../RouletteChips/Chips/Chipsduplicate";
import SlotNumber from "../RouletteNumber/SlotNumber"
import { ColorSlot } from "../RouletteNumber/SlotNumber";
import './rouletteBoard.css'

interface Slot {
    color: string; // ajusta el tipo según tu implementación
    coins: number[];
  }

export const slots: Slot[] =[
    {
        color: ColorSlot.Purple,
        coins: []
    },
    {
        color: ColorSlot.Gray,
        coins: []
    },
    {
        color: ColorSlot.Purple,
        coins: []
    },
    {
        color: ColorSlot.Gray,
        coins: []
    },
    {
        color: ColorSlot.Gray,
        coins: []
    },
    {
        color: ColorSlot.Gray,
        coins: []
    },
    {
        color: ColorSlot.Purple,
        coins: []
    },
    {
        color: ColorSlot.Gray,
        coins: []
    },
    {
        color: ColorSlot.Purple,
        coins: []
    },
    {
        color: ColorSlot.Gray,
        coins: []
    },
    {
        color: ColorSlot.Gray,
        coins: []
    },
    {
        color: ColorSlot.Purple,
        coins: []
    },
    {
        color: ColorSlot.Gray,
        coins: []
    },
    {
        color: ColorSlot.Gray,
        coins: []
    },
    {
        color: ColorSlot.Purple,
        coins: []
    },
    {
        color: ColorSlot.Purple,
        coins: []
    },
    {
        color: ColorSlot.Gray,
        coins: []
    },
    {
        color: ColorSlot.Gray,
        coins: []
    },
    {
        color: ColorSlot.Gray,
        coins: []
    },
    {
        color: ColorSlot.Purple,
        coins: []
    },
    {
        color: ColorSlot.Gray,
        coins: []
    },

    {
        color: ColorSlot.Purple,
        coins: []
    },
    {
        color: ColorSlot.Gray,
        coins: []
    },
    {
        color: ColorSlot.Purple,
        coins: []
    },
    {
        color: ColorSlot.Purple,
        coins: []
    },
    {
        color: ColorSlot.Purple,
        coins: []
    },
    {
        color: ColorSlot.Purple,
        coins: []
    },
    {
        color: ColorSlot.Gray,
        coins: []
    },
    {
        color: ColorSlot.Gray,
        coins: []
    },
    {
        color: ColorSlot.Gray,
        coins: []
    },
    {
        color: ColorSlot.Purple,
        coins: []
    },
    {
        color: ColorSlot.Gray,
        coins: []
    },
    {
        color: ColorSlot.Purple,
        coins: []
    },
    {
        color: ColorSlot.Purple,
        coins: []
    },

    {
        color: ColorSlot.Purple,
        coins: []
    },
    {
        color: ColorSlot.Purple,
        coins: []
    },
];

interface ValueChip {
    valueChip: number;
}

function RouletteBoard(props: ValueChip) {
    const { valueChip } = props

    const handleCount =(valueChip: any, index:number)=>{
        console.log(index)
        const fe = slots[index].coins.push(valueChip)
        console.log(fe)
        console.log(slots)
    }
    return (
        <div className="flex">
            <div className="w-[100px]">
                <div className="flex justify-center items-center border border-solid border-white h-[210px] my-6">
                    <span>0</span>
                </div>
                <div></div>
            </div>
            <div>
                <div className="table">
                    {slots.map(({ color }, index) => <SlotNumber
                        background={color}
                        key={index}
                        onClick={()=>handleCount(valueChip, index)}>{index+1}</SlotNumber>)}
                <button className='w-[50px] h-[70px] border border-solid border-white text-center'>1st</button>
                <button className='w-[50px] h-[70px] border border-solid border-white'>2st</button>
                <button className='w-[50px] h-[70px] border border-solid border-white'>3st</button>
            </div>
            <div className="option">
                <div className="flex flex-col w-[200px] justify-center items-center border border-solid border-white">
                    <div className="py-4">1-12</div>
                    <div className="flex">
                        <div className="w-[100px] text-center border border-solid border-white py-4">1-18</div>
                        <div className="w-[100px] text-center border border-solid border-white py-4">EVEN</div>
                    </div>
                </div>
                <div className="flex flex-col w-[200px] justify-center items-center border border-solid border-white">
                    <div className="py-4">13-24</div>
                    <div className="flex">
                        <div className="w-[100px] text-center border border-solid border-white bg-[#2B2A2A] py-4">BLACK</div>
                        <div className="w-[100px] text-center border border-solid border-white bg-[#561589] py-4">PURPLE</div>
                    </div>
                </div>
                <div className="flex flex-col w-[200px] justify-center items-center border border-solid border-white">
                    <div className="py-4">25-35</div>
                    <div className="flex">
                        <div className="w-[100px] text-center border border-solid border-white py-4">ODD</div>
                        <div className="w-[100px] text-center border border-solid border-white py-4">19-35</div>
                    </div>
                </div>
            </div>
        </div>
        </div >
    )
}

export default RouletteBoard
