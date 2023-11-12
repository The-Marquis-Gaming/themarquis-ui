"use client";
import Image from "next/image";
import RouletteBoard from "../../components/RouletteBoard/rouletteBoard";
import GameButtons from "../../components/GameButtons/gameButtons";
import Chips, { Color } from "../../components/RouletteChips/Chips/Chips";
import { useState } from "react";
import "../../roulette.css";
import { useDojo } from "../../../DojoContext";
import { useEffect } from "react";
import { gql } from "graphql-request";
import { ColorSlot } from "../../components/RouletteNumber/SlotNumber";
import useSWR, { Fetcher } from "swr";
export interface Slot {
  color: string;
  coins: number[];
}

const emptySlots: Slot[] = [
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
  const [betsAmount, setBetsAmount] = useState(0);
  const [latestMove, setLatestMove] = useState("");
  const [rotation, setRotation] = useState(0);
  const [maxRotationSpeed, setMaxRotationSpeed] = useState(500);
  const [acceleration, setAcceleration] = useState(2);
  const [spinDuration, setSpinDuration] = useState(1000);
  const [slots, setSlots] = useState<Slot[]>(emptySlots);
  const {
    setup: {
      systemCalls: { bet },
      components,
      entityUpdates,
      network: { contractComponents, graphClient },
    },
    account: { create, list, select, account, isDeploying, clear },
  } = useDojo();
  const fetcher: Fetcher<AccountBalance, string> = (query) =>
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

  const handleBetClick = () => {
    // Validar que haya seleccionado al menos un slot
    if (slots.some(slot => slot.coins.length > 0)) {
      // Calcular la cantidad total de la apuesta
      const totalBetAmount = slots.reduce((total, slot) => total + slot.coins.reduce((sum, coin) => sum + coin, 0), 0);
      
      // Mostrar un cuadro de diálogo de confirmación con la cantidad de la apuesta
      const isConfirmed = window.confirm(`¿Estás seguro de que quieres apostar ${totalBetAmount} STARK?`);
      
      // Si el usuario confirma, realizar la apuesta
      if (isConfirmed) {
        bet(account, slots).then((result: any) => {
          setSlots(emptySlots);
          setBetsAmount(result);
          setSlots(emptySlots);
          setRotation(prevRotation => prevRotation + 3600);
          
        });
      }
    } else {
      // Mostrar un mensaje de error si no se ha seleccionado ningún slot
      alert("Debe seleccionar al menos un slot para realizar la apuesta.");
    }
  };
  

  return (
    <section>
      <div className="flex gap-20 justify-center items-center">
        <div className="flex gap-8">
          <div className="py-4 px-6 border border-solid border-white flex justify-between rounded-2xl w-[400px] bg-[#111]">
            <span>BETS:</span>
            <span>{betsAmount} STARK</span>
          </div>
          <div className="py-4 px-6 border border-solid border-white flex justify-between rounded-2xl w-[400px] bg-[#111]">
            <span>BALANCE:</span>
            <span>
              {accountBalance &&
                accountBalance.erc20balanceModels.edges.length > 0 &&
                parseHexToDecimal(
                  accountBalance.erc20balanceModels.edges[0].node.amount
                )}{" "}
              STARK
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
            <span className="text-3xl">00</span>
          </div>
        </div>
      </div>
      <div className="container-game">
        <div className="flex flex-col items-center justify-between">
        <Image
            src="/images/roulette-1.png"
            alt="roulette"
            width={560}
            height={560}
            style={{
              transformOrigin: "center",
              transform: `rotate(${rotation}deg)`, // Aquí deberías usar el estado de rotación
              transition: "transform 0.5s ease-in-out",
            }}
          ></Image>
          <button
            className="btn-degrade w-[400px] text-white text-2xl hover:text-gray-200 px-24 py-4"
            onClick={handleBetClick}
          >
            BET
          </button>
        </div>
        <div className="container-boardgame">
          <div className="container-board">
            <RouletteBoard
              valueChip={valueChip}
              slots={slots}
              setData={setSlots}
            ></RouletteBoard>
          </div>
          <div className="flex gap-4 container-chip">
            <Chips
              color={Color.White}
              onClick={function () {
                setValuechip(5);
              }}
            >
              5
            </Chips>
            <Chips
              color={Color.Blue}
              onClick={function () {
                setValuechip(10);
              }}
            >
              10
            </Chips>
            <Chips
              color={Color.Yellow}
              onClick={function () {
                setValuechip(50);
              }}
            >
              50
            </Chips>
            <Chips
              color={Color.Green}
              onClick={function () {
                setValuechip(100);
              }}
            >
              100
            </Chips>
          </div>

          <GameButtons></GameButtons>
          <span>{latestMove}</span>
        </div>
      </div>
    </section>
  );
}

export default Board;






