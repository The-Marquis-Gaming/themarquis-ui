"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

const games = [
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

const GameCarousel = () => {
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [animatedDescription, setAnimatedDescription] = useState("");

  useEffect(() => {
    const description = games[currentGameIndex].description;

    let index = 0;
    const interval = setInterval(() => {
      setAnimatedDescription(description.substring(0, index + 1));
      index++;
      if (index === description.length) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentGameIndex]);
  const handleClickNext = () => {
    setCurrentGameIndex((prevIndex) =>
      prevIndex === games.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const handleClickPrev = () => {
    setCurrentGameIndex((prevIndex) =>
      prevIndex === 0 ? games.length - 1 : prevIndex - 1,
    );
  };
  const nextIndex =
    currentGameIndex === games.length - 1 ? 0 : currentGameIndex + 1;

  return (
    <div className="flex gap-20">
      <div className="max-w-[400px] flex flex-col justify-center gap-5 text-xl flex-1">
        <span className="font-bold">{games[currentGameIndex].name}</span>
        <span className="font-medium typing-text">{animatedDescription}</span>
        <div className="flex justify-end gap-5 py-10">
          <button
            className="border-[#00FBED] w-[68px] h-[68px] rounded-full border-2 flex items-center justify-center"
            onClick={handleClickPrev}
          >
            <Image src="/ArrowLeft.svg" alt="arrow" width={20} height={20} />
          </button>
          <button
            className="border-[#00FBED] w-[68px] h-[68px] rounded-full border-2 flex items-center justify-center"
            onClick={handleClickNext}
          >
            <Image src="/ArrowRight.svg" alt="arrow" width={20} height={20} />
          </button>
        </div>
      </div>
      <div className="flex-1 flex justify-center gap-5">
        <Image
          src={games[currentGameIndex].image}
          alt={`${games[currentGameIndex].name} image`}
          width={300}
          height={385}
          className="game-image"
        />
        <Image
          src={games[nextIndex].image}
          alt={`${games[nextIndex].name} image`}
          width={300}
          height={385}
          className="game-image opacity-50"
        />
      </div>
    </div>
  );
};

export default GameCarousel;
