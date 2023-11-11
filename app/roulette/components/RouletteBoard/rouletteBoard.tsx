import { useState } from "react";
import SlotNumber from "../RouletteNumber/SlotNumber";
import { ColorSlot } from "../RouletteNumber/SlotNumber";
import "./rouletteBoard.css";
import ChosenNumbers from "../ChosenNumbers/ChosenNumbers";

interface ValueChip {
  valueChip: number;
  slots: any[];
  setData: Function;
}

function RouletteBoard(props: ValueChip) {
  const { slots, setData, valueChip } = props;

  return (
    <>
      <div>
        <ChosenNumbers setData={setData} slots={slots}></ChosenNumbers>
      </div>
      <div className="flex">
        <div className="w-[100px]">
          <div className="flex justify-center items-center border border-solid border-white h-[210px] my-6">
            <span>0</span>
          </div>
          <div></div>
        </div>
        <div>
          <div className="table">
            {slots.map((element, index) => {
              return (
                <SlotNumber
                  background={element.color}
                  key={index}
                  slot={element}
                  slots={slots}
                  setData={setData}
                  index={index}
                  valueChip={valueChip}
                >
                  {index + 1}
                </SlotNumber>
              );
            })}
            <button className="w-[50px] h-[70px] border border-solid border-white text-center">
              1st
            </button>
            <button className="w-[50px] h-[70px] border border-solid border-white">
              2st
            </button>
            <button className="w-[50px] h-[70px] border border-solid border-white">
              3st
            </button>
          </div>
          <div className="option">
            <div className="flex flex-col w-[200px] justify-center items-center border border-solid border-white">
              <div className="py-4">1-12</div>
              <div className="flex">
                <div className="w-[100px] text-center border border-solid border-white py-4">
                  1-18
                </div>
                <div className="w-[100px] text-center border border-solid border-white py-4">
                  EVEN
                </div>
              </div>
            </div>
            <div className="flex flex-col w-[200px] justify-center items-center border border-solid border-white">
              <div className="py-4">13-24</div>
              <div className="flex">
                <div className="w-[100px] text-center border border-solid border-white bg-[#2B2A2A] py-4">
                  BLACK
                </div>
                <div className="w-[100px] text-center border border-solid border-white bg-[#561589] py-4">
                  PURPLE
                </div>
              </div>
            </div>
            <div className="flex flex-col w-[200px] justify-center items-center border border-solid border-white">
              <div className="py-4">25-35</div>
              <div className="flex">
                <div className="w-[100px] text-center border border-solid border-white py-4">
                  ODD
                </div>
                <div className="w-[100px] text-center border border-solid border-white py-4">
                  19-35
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RouletteBoard;
