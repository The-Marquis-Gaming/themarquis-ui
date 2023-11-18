"use client";
import Image from "next/image";
import GameButtons from "../../components/GameButtons/gameButtons";
import Chips, { Color } from "../../components/RouletteChips/Chips/Chips";
import { useState, useEffect, useRef, RefObject } from "react";
import "../../roulette.css";
import { useDojo } from "../../../DojoContext";
import { gql } from "graphql-request";
import { ColorSlot } from "../../components/RouletteNumber/SlotNumber";
import useSWR, { Fetcher } from "swr";
import ChosenNumbers from "../../components/ChosenNumbers/ChosenNumbers"
import SlotNumber from "../../components/RouletteNumber/SlotNumber"
import ModalConfirm from "../../components/Modal/ModalConfirm"
import '../../roulette.css'


interface Slot {
  color: string
  coins: number[];
}

const emptySlots: Slot[] = [

  {
    color: '',
    coins: []
  },

  {
    color: ColorSlot.Purple,
    coins: [],
  },
  {
    color: ColorSlot.Gray,
    coins: [],
  },
  {
    color: ColorSlot.Purple,
    coins: [],
  },
  {
    color: ColorSlot.Gray,
    coins: [],
  },
  {
    color: ColorSlot.Gray,
    coins: [],
  },
  {
    color: ColorSlot.Gray,
    coins: [],
  },
  {
    color: ColorSlot.Purple,
    coins: [],
  },
  {
    color: ColorSlot.Gray,
    coins: [],
  },
  {
    color: ColorSlot.Purple,
    coins: [],
  },
  {
    color: ColorSlot.Gray,
    coins: [],
  },
  {
    color: ColorSlot.Gray,
    coins: [],
  },
  {
    color: ColorSlot.Purple,
    coins: [],
  },
  {
    color: ColorSlot.Gray,
    coins: [],
  },
  {
    color: ColorSlot.Gray,
    coins: [],
  },
  {
    color: ColorSlot.Purple,
    coins: [],
  },
  {
    color: ColorSlot.Purple,
    coins: [],
  },
  {
    color: ColorSlot.Gray,
    coins: [],
  },
  {
    color: ColorSlot.Gray,
    coins: [],
  },
  {
    color: ColorSlot.Gray,
    coins: [],
  },
  {
    color: ColorSlot.Purple,
    coins: [],
  },
  {
    color: ColorSlot.Gray,
    coins: [],
  },

  {
    color: ColorSlot.Purple,
    coins: [],
  },
  {
    color: ColorSlot.Gray,
    coins: [],
  },
  {
    color: ColorSlot.Purple,
    coins: [],
  },
  {
    color: ColorSlot.Purple,
    coins: [],
  },
  {
    color: ColorSlot.Purple,
    coins: [],
  },
  {
    color: ColorSlot.Purple,
    coins: [],
  },
  {
    color: ColorSlot.Gray,
    coins: [],
  },
  {
    color: ColorSlot.Gray,
    coins: [],
  },
  {
    color: ColorSlot.Gray,
    coins: [],
  },
  {
    color: ColorSlot.Purple,
    coins: [],
  },
  {
    color: ColorSlot.Gray,
    coins: [],
  },
  {
    color: ColorSlot.Purple,
    coins: [],
  },
  {
    color: ColorSlot.Purple,
    coins: [],
  },

  {
    color: ColorSlot.Purple,
    coins: [],
  },
  {
    color: ColorSlot.Purple,
    coins: [],
  },
];

type AccountBalance = {
  erc20balanceModels: {
    edges: {
      node: {
        token: string;
        account: string;
        amount: string;
      };
    }[];
  };
};


function buildBalanceQuery(address: string) {
  const slicedAddress = address.slice(2);
  // if account less than 32 bytes, add 0s to the left
  const newAddress = slicedAddress.padStart(64, "0");
  const [currentBetAmount, setCurrentBetAmount] = useState(0);

  return `{
    erc20balanceModels(
      where: {
        account: "0x${newAddress}"
        token: "0x059bbd83d1178b7d10f7ffec372d4593283e9b5aa6075349834162deecfe5108"
      }
    ) {
      edges {
        node {
          token
          account
          amount
        }
      }
    }
  }`;
}


function parseHexToDecimal(hex: string) {
  return parseInt(hex, 16);
}

function Board() {
  const [valueChip, setValuechip] = useState(0);
  const [, setBetsAmount] = useState(0);
  const [slots] = useState<Slot[]>(emptySlots);
  const [timeRemaining, setTimeRemaining] = useState<number>(300);
  const [timerActive, setTimerActive] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState(slots);
  const [eraseMode, setEraseMode] = useState(false);

  const [rotation, setRotation] = useState(0);
const rouletteRef = useRef<HTMLImageElement>(null);
const spinDuration = 10000; // Duración máxima de giro en milisegundos (10 segundos)
const direction = 1; // Dirección de giro: 1 para derecha, -1 para izquierda
const speed = 20; // Velocidad de rotación

const handleSpin = () => {
  setRotation(0); // Restaurar la rotación inicial a cero antes de comenzar

  const interval = setInterval(() => {
    setRotation((prevRotation) => prevRotation + direction * speed);
  }, 100);

  setTimeout(() => {
    clearInterval(interval); // Detener la rotación después de la duración máxima
  }, spinDuration);
};

useEffect(() => {
  if (rouletteRef.current) {
    rouletteRef.current.style.transform = `rotate(${rotation}deg)`;
  }
}, [rotation]);

  

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const updateTimer = () => {
      setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 300));

      if (timeRemaining === 0) {
        setTimerActive(false);
        setTimeout(() => {
          setTimerActive(true);
          setTimeRemaining(5 * 60); // Reinicia el temporizador a 5 minutos
        }, 5000);
      }
    };

    if (timerActive) {
      timer = setInterval(updateTimer, 1000);
    }

    return () => clearInterval(timer);
  }, [timerActive, timeRemaining]);
  
  
  
  
    useEffect(() => {
      let timer: NodeJS.Timeout;
  
      const updateTimer = () => {
        setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      };
  
      timer = setInterval(updateTimer, 1000);
  
      return () => clearInterval(timer);
    }, []);



  const {
    setup: {
      systemCalls: { bet },
      components,
      entityUpdates,
      network: { contractComponents, graphClient },
    },
    account: { create, list, select, account, isDeploying, clear },
  } = useDojo();
  const fetcher: Fetcher<AccountBalance, string> = (query: any) =>
    graphClient().request(query);
  const { data: accountBalance, error } = useSWR(
    buildBalanceQuery(account.address),
    fetcher,
    {
      refreshInterval: 1000,
    }
  );

  console.log("debug accountBalance");
  console.log(accountBalance);
  console.log(buildBalanceQuery(account.address));


  const calculateTotalBets = () => {
    const totalBets = data.reduce((total, slot) => {
      return total + slot.coins.reduce((sum, coin) => sum + coin, 0);
    }, 0);
    return totalBets;
  };

  const handleConfirmClick = () => {
    
    if (slots.some((slot: { coins: string | any[]; }) => slot.coins.length > 0)) {
      bet(account, slots).then((result: any) => {
        setBetsAmount(result);    
        setIsModalOpen(true);
        setRotation((prevRotation: number) => prevRotation + 3600);
      });
    }
  };

  useEffect(() => {
    if (rouletteRef.current) {
      rouletteRef.current.style.transform = `rotate(${rotation}deg)`;
    }
  }, [rotation]);


  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = () => {
    setData((prevData) =>
      prevData.map((slot) => ({
        ...slot,
        coins: [],
      }))
    );
  };

  const handleEraseClick = () => {
    setEraseMode(!eraseMode);
  };


  return (
    <section>
      <div className="flex gap-20 justify-center items-center">
        <div className="flex gap-8">
          <div className="py-4 px-6 border border-solid border-white flex justify-between rounded-2xl w-[400px] bg-[#111]">
            <span>BETS:</span>
            <span>{calculateTotalBets()} USDM</span>

          </div>
          <div className="py-4 px-6 border border-solid border-white flex justify-between rounded-2xl w-[400px] bg-[#111]">
            <span>BALANCE:</span>
            <span>
              {accountBalance &&
                accountBalance.erc20balanceModels.edges.length > 0 &&
                parseHexToDecimal(
                  accountBalance.erc20balanceModels.edges[0].node.amount
                )}{" "}
              USDM
            </span>
          </div>
          <button>
            <Image
              src="/images-game/help_icon.png"
              alt="icon"
              width={30}
              height={30}
            ></Image>
          </button>

        </div>
        <div className="flex items-center">
          <span>BET CLOSED!</span>
          <div className="timer">
          <span className="text-3xl">
            {String(Math.floor(timeRemaining / 60)).padStart(2, '0')}:
            {String(timeRemaining % 60).padStart(2, '0')}
          </span>
          </div>

        </div>
      </div>
      <div className="container-game">
        <div className="flex flex-col items-center justify-between">
        <Image
        ref={rouletteRef as RefObject<HTMLImageElement>}
        src="/images/roulette-1.png"
        alt="roulette"
        width={560}
        height={560}
        style={{ transform: `rotate(${rotation}deg)` }}
      ></Image>
          <button
            className="btn-degrade w-[400px] text-white text-2xl hover:text-gray-200 px-24 py-4"
            onClick={handleConfirmClick}
          >
            CONFIRM
          </button>

        </div>
        {isModalOpen && (
          <ModalConfirm
          setIsModalOpen={() => setIsModalOpen(false)}  
            bets={calculateTotalBets()}
            handleConfirm={handleConfirm}
            handleSpin={handleSpin} 
          ></ModalConfirm>
        )}
        <div className="container-boardgame">
          <div className="container-board">
            <div>

              <ChosenNumbers setData={setData} slots={slots} eraseMode={false} background={""} children={0} index={0}></ChosenNumbers>
            </div>
            <div className="flex flex-col">
              <div className="table">
                {data.map((element, index) => {
                  return (
                    <SlotNumber
                      background={element.color}
                      key={index}
                      slot={element}
                      slots={data}
                      setData={setData}
                      index={index}
                      valueChip={valueChip}
                      eraseMode={eraseMode}

                    >{index}</SlotNumber>);
                }
                )}
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
          </div>
          <div className="flex gap-4 container-chip">
            <Chips color={Color.White} onClick={function () { setValuechip(5) }}>5</Chips>
            <Chips color={Color.Blue} onClick={function () { setValuechip(10) }}>10</Chips>
            <Chips color={Color.Yellow} onClick={function () { setValuechip(50) }}>50</Chips>
            <Chips color={Color.Green} onClick={function () { setValuechip(100) }}>100</Chips>
          </div>

          <GameButtons
                        clear = {handleConfirm}
                        eraseMode={eraseMode}
                        handleEraseClick={handleEraseClick}
                    ></GameButtons>
        </div>
      </div>
    </section>
  )
}

export default Board




