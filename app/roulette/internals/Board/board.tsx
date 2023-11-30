"use client"
import Image from "next/image"
import GameButtons from "../../components/GameButtons/gameButtons"
import Chips, { Color } from "../../components/RouletteChips/Chips/Chips"
import { useState, useEffect } from "react"
import ChosenNumbers from "../../components/ChosenNumbers/ChosenNumbers"
import SlotNumber from "../../components/RouletteNumber/SlotNumber"
import { ColorSlot , Width} from "../../components/RouletteNumber/SlotNumber";
import ModalConfirm from "../../components/ModalConfirm/ModalConfirm"
import '../../roulette.css'
import MiniatureChips from "../../components/MiniatureChips/MiniatureChips"
import Options from "../../components/Options/Options"
interface Slot {
    id: string
    color: string
    width:string
    coins: number[];
    type: string,
    index?: '1-12' | '13-24' | '25-35' | '1-18' | '19-35' | 'ODD' | 'EVEN' | 'BLACK' | 'PURPLE' | '1st' | '2nd' | '3rd'
}


export const slots: Slot[] = [
    {
        id: '0',
        color: '',
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '1',
        color: ColorSlot.Purple,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '2',
        color: ColorSlot.Gray,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '3',
        color: ColorSlot.Purple,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '4',
        color: ColorSlot.Gray,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '5',
        color: ColorSlot.Gray,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '6',
        color: ColorSlot.Gray,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '7',
        color: ColorSlot.Purple,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '8',
        color: ColorSlot.Gray,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '9',
        color: ColorSlot.Purple,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '10',
        color: ColorSlot.Gray,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '11',
        color: ColorSlot.Gray,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '12',
        color: ColorSlot.Purple,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '13',
        color: ColorSlot.Gray,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '14',
        color: ColorSlot.Gray,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '15',
        color: ColorSlot.Purple,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '16',
        color: ColorSlot.Purple,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '17',
        color: ColorSlot.Gray,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '18',
        color: ColorSlot.Gray,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '19',
        color: ColorSlot.Gray,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '20',
        color: ColorSlot.Purple,
        coins: [],
        type: 'board',
        width:''
    },

    {
        id: '21',
        color: ColorSlot.Gray,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '22',
        color: ColorSlot.Purple,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '23',
        color: ColorSlot.Gray,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '24',
        color: ColorSlot.Purple,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '25',
        color: ColorSlot.Purple,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '26',
        color: ColorSlot.Purple,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '27',
        color: ColorSlot.Purple,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '28',
        color: ColorSlot.Gray,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '29',
        color: ColorSlot.Gray,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '30',
        color: ColorSlot.Gray,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '31',
        color: ColorSlot.Purple,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '32',
        color: ColorSlot.Gray,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '33',
        color: ColorSlot.Purple,
        coins: [],
        type: 'board',
        width:''
    },

    {
        id: '34',
        color: ColorSlot.Purple,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '35',
        color: ColorSlot.Purple,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '36',
        color: ColorSlot.Purple,
        coins: [],
        type: 'board',
        width:''
    },
    {
        id: '1st',
        color: '',
        coins: [],
        type: 'board',
        index: '1st',
        width:''
    },
    {
        id: '2nd',
        color: '',
        coins: [],
        type: 'board',
        index: '2nd',
        width:''
    },
    {
        id: '3rd',
        color: '',
        coins: [],
        type: 'board',
        index: '3rd',
        width:''
    },
    {
        id: '41',
        color: '',
        coins: [],
        type: 'options',
        width: Width.Big,
        index: '1-12'
    },
    {
        id: '42',
        color: '',
        coins: [],
        type: 'options',
        width: Width.Big,
        index: '13-24'
    },
    {
        id: '43',
        color: '',
        coins: [],
        type: 'options',
        width: Width.Big,
        index: '25-35'
    },
    {
        id: '44',
        color: '',
        coins: [],
        type: 'options',
        width: Width.Small,
        index: '1-18'
    },
    {
        id: '45',
        color: '',
        coins: [],
        type: 'options',
        width: Width.Small,
        index: 'EVEN'
    },
    {
        id: '46',
        color: ColorSlot.Gray,
        coins: [],
        type: 'options',
        width: Width.Small,
        index: 'BLACK'
    },
    {
        id: '47',
        color: ColorSlot.Purple,
        coins: [],
        type: 'options',
        width: Width.Small,
        index: 'PURPLE'
    },
    {
        id: '45',
        color: '',
        coins: [],
        type: 'options',
        width: Width.Small,
        index: 'ODD'
    },
    {
        id: '45',
        color: '',
        coins: [],
        type: 'options',
        width: Width.Small,
        index: '19-35'
    },
];

function Board() {
    const [data, setData] = useState(slots)
    const [valueChip, setValuechip] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eraseMode, setEraseMode] = useState(false);
    const [selectedChip, setSelectedChip] = useState<Color | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });


    const handleMouseMove = (e: React.MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleChipClick = (color: Color) => {
        setSelectedChip((prevColor) => (prevColor === color ? null : color));
    };

    const handleBoardClick = () => {
        setSelectedChip(null);
    };

    useEffect(() => {
        if (eraseMode) {
            document.body.classList.add('erase-mode');
        } else {
            document.body.classList.remove('erase-mode');
        }
        return () => {
            document.body.classList.remove('erase-mode');
        };
    }, [eraseMode]);

    const calculateTotalBets = () => {
        const totalBets = data.reduce((total, slot) => {
            return total + slot.coins.reduce((sum, coin) => sum + coin, 0);
        }, 0);
        return totalBets;
    };

    const handleConfirmClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleConfirm = () => {
        const resetSlots = slots.map(slot => ({ ...slot, coins: [] }));
        setData(resetSlots);
    };

    const handleEraseClick = () => {
        setEraseMode(!eraseMode);
    };


    return (
        <section onMouseMove={handleMouseMove} onClick={handleBoardClick}>
            <div className="flex gap-20 justify-center items-center">
                <div className="flex gap-8">
                    <div className="py-4 px-6 border border-solid border-white flex justify-between rounded-2xl w-[400px] bg-[#111]">
                        <span>BETS:</span>
                        <span>{calculateTotalBets()} USDM</span>

                    </div>
                    <div className="py-4 px-6 border border-solid border-white flex justify-between rounded-2xl w-[400px] bg-[#111]">
                        <span>BALANCE:</span>
                        <span>68 USDM</span>
                    </div>
                    <button>
                        <Image src="/images-game/help_icon.png" alt="icon" width={30} height={30}></Image>
                    </button>
                </div>
                <div className="flex items-center">
                    <span>BET CLOSED!</span>
                    <div className="timer">
                        <span className="text-3xl">00</span>
                    </div>
                </div>
            </div>
            <div className="container-game">
                <div className="flex flex-col items-center justify-between">
                    <Image src="/images/roulette-1.png" alt="roulette" width={560} height={560}></Image>
                    <button
                        className="btn-degrade w-[400px] rounded-[12px] text-white text-2xl hover:text-gray-200 px-24 py-4"
                        onClick={handleConfirmClick}
                    >CONFIRM</button>
                </div>
                {isModalOpen && (
                    <ModalConfirm
                        setIsModalOpen={handleCloseModal}
                        bets={calculateTotalBets()}
                        handleConfirm={handleConfirm}
                    ></ModalConfirm>
                )}
                <div className="container-boardgame">
                    <div className="container-board">
                        <div>
                            <ChosenNumbers setData={setData} slots={slots}></ChosenNumbers>
                        </div>
                        <div className="flex flex-col">
                            <div className="table">
                                {data.filter(({ type = '' }) => type === 'board').map((element, index) => {
                                    return (
                                        <SlotNumber
                                            background={element.color}
                                            key={index}
                                            slot={element}
                                            slots={data.filter(({ type = '' }) => type === 'board')}
                                            setData={setData}
                                            index={index}
                                            valueChip={valueChip}
                                            eraseMode={eraseMode}
                                        >{element.id}</SlotNumber>);
                                }
                                )}
                            </div>
                            <div className="container-options">
                            {data.filter(({ type = '' }) => type === 'options').map((element, index) => {
                                return (
                                    <Options
                                        key={index}
                                        background={element.color}
                                        width={element.width}
                                        slots={data.filter(({ type }) => type === 'options')}
                                        setData={setData}
                                        index={index}
                                        valueChip={valueChip}
                                        eraseMode={eraseMode}
                                    >{element.index}</Options>
                             ) }
                            )}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 container-chip">

                        <Chips color={Color.White}
                            onClick={function () { setValuechip(5), handleChipClick(Color.White); }}
                            mousePosition={mousePosition}

                        >5</Chips>
                        <Chips color={Color.Blue}
                            onClick={function () { setValuechip(10), handleChipClick(Color.Blue); }}
                            mousePosition={mousePosition}

                        >10</Chips>

                        <Chips color={Color.Yellow}
                            onClick={function () { setValuechip(50), handleChipClick(Color.Yellow); }}
                            mousePosition={mousePosition}

                        >50</Chips>

                        <Chips color={Color.Green}
                            onClick={function () { setValuechip(100), handleChipClick(Color.Green); }}
                            mousePosition={mousePosition}

                        >100</Chips>
                    </div>
                    <GameButtons
                        clear={handleConfirm}
                        eraseMode={eraseMode}
                        handleEraseClick={handleEraseClick}
                    ></GameButtons>
                    {selectedChip && (
                        <MiniatureChips
                            mousePosition={mousePosition}
                            color={selectedChip}
                        />
                    )}
                </div>
            </div>
        </section>
    )
}

export default Board
