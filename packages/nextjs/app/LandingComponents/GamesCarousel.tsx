"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Game {
  name: string;
  description: string;
  image: string;
}

const games: Game[] = [
  {
    name: "LUDO",
    description:
      "Strategy board game for two to four players, in which the players race their four tokens from start to finish according to the rolls of a single die.",
    image: "/Ludo.png",
  },
  {
    name: "Yahtzee",
    description:
      "A dice game for two or more players where five dice are rolled to achieve combinations such as poker, full house, straight, etc., aiming to score the highest total over a series of rounds.",
    image: "/yahtzee.png",
  },
  {
    name: "6 nimmt!",
    description:
      "A card game for two to ten players where players try to avoid picking up bull cards numbered from 1 to 104, by placing cards in rows based on specific rules and avoiding rows with a total of 6 or more bulls.",
    image: "/6nimmt.png",
  },
  {
    name: "Lost Cities",
    description:
      "A board game for two players where players are explorers trying to discover ancient lost cities and collect valuable treasures, using cards to represent expeditions and managing resources strategically.",
    image: "/lostCitiex.png",
  },
  {
    name: "Uckers",
    description:
      "A strategic and skill-based board game for four players, similar to Ludo and Parcheesi, where players compete to move their pieces from start to finish on the board, with special rules for capturing and blocking opponent's pieces.",
    image: "/uckers.png",
  },
];

const GameCarousel: React.FC = () => {
  const [currentGameIndex, setCurrentGameIndex] = useState<number>(0);
  const [animatedDescription, setAnimatedDescription] = useState<string>("");

  const nextIndex = currentGameIndex + 1;
  const description = games[currentGameIndex % games.length].description;
  const name = games[currentGameIndex % games.length].name;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setAnimatedDescription(description.substring(0, index + 1));
      index++;
      if (index === description.length) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentGameIndex, description]);

  const handleClickNext = () =>
    setCurrentGameIndex((prevIndex) => {
      if (prevIndex === games.length - 1) {
        return 0;
      }
      return prevIndex + 1;
    });

  const handleClickPrev = () =>
    setCurrentGameIndex((prevIndex) => {
      if (prevIndex === 0) {
        return games.length - 1;
      }
      return prevIndex - 1;
    });

  const handleImageClick = (index: number) => {
    setCurrentGameIndex(index);
  };

  return (
    <div className="flex lg:gap-20 gap-5 flex-col lg:flex-row font-monserrat px-8 pl-10 justify-center">
      <div className="max-w-[500px] flex flex-col justify-center lg:text-xl text-lg flex-1 lg:block hidden">
        <div className="flex flex-col gap-3 text-left">
          <span className="font-bold lg:text-3xl text-xl">{name}</span>
          <span className="typing-text lg:w-[500px] h-[200px] w-[330px] py-5">
            {animatedDescription}
          </span>
        </div>
        <div className="flex justify-end gap-5 lg:py-10 py-5">
          <button
            className="border-[#00FBED] lg:w-[68px] lg:h-[68px] w-[38px] h-[38px] rounded-full border-2 flex items-center justify-center"
            onClick={handleClickPrev}
          >
            <Image
              src="/ArrowLeft.svg"
              alt="arrow"
              width={10}
              height={10}
              className="lg:w-[20px] lg:h-[20px]"
            />
          </button>
          <button
            className="border-[#00FBED] lg:w-[68px] lg:h-[68px] w-[38px] h-[38px] rounded-full border-2 flex items-center justify-center"
            onClick={handleClickNext}
          >
            <Image
              src="/ArrowRight.svg"
              alt="arrow"
              width={10}
              height={10}
              className="lg:w-[20px] lg:h-[20px]"
            />
          </button>
        </div>
      </div>
      <div className="gap-4 flex center-mobile">
        <div className="overflow-hidden flex gap-0 w-[136px] h-[auto] lg:w-[200px] lg:h-[270px]">
          {games.map((game, index) => (
            <Image
              onClick={() => handleImageClick(index)}
              style={{ transform: `translateX(-${currentGameIndex * 100}%)` }}
              key={game.image}
              className="game-image transition-transform duration-500 ease-in-out cursor-pointer"
              src={game.image}
              width={200}
              height={0}
              alt={`${game.name} image`}
            />
          ))}
        </div>
        <div className="overflow-hidden flex gap-0 w-[136px] h-[auto] lg:w-[200px] lg:h-[270px]">
          {games.map((game, index) => (
            <Image
              onClick={() => handleImageClick(index)}
              style={{ transform: `translateX(-${nextIndex * 100}%)` }}
              key={game.image}
              className="game-image opacity-30 transition-transform duration-500 ease-in-out cursor-pointer"
              src={game.image}
              width={200}
              height={0}
              alt={`${game.name} image`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameCarousel;
