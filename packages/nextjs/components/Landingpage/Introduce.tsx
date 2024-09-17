import Image from "next/image";
import LeftAnimation from "@/public/landingpage/leftAnimation.png";
import ArrowsIcon from "@/public/landingpage/arrowsIcon.svg";
import PlayGame from "@/public/landingpage/playGame.png";
import Star from "@/public/landingpage/stars.png";

export default function Introduce() {
  return (
    <div className="relative">
      <div className="absolute left-0 top-0">
        <Image src={LeftAnimation} width={1000} height={1000} alt="animation" />
      </div>
      <div>
        <div className="content-fit-center grid grid-cols-2 gap-10 items-center">
          <div className="grid-cols-1 px-[50px]">
            <Image
              src={Star}
              alt="star"
              width={400}
              height={400}
              className="absolute top-1/2 transform -translate-y-1/2 left-[20px]"
            />
            <Image
              src={ArrowsIcon}
              width={100}
              height={100}
              alt="arrow"
              loading="lazy"
            />
            <p className="landing-title-nonecolor my-5">
              Introducing a <br /> New Age of Gaming
            </p>
            <p className="landing-desc">
              Marquis is an open-source gaming platform built for on-chain
              mobile games on <span className="starknet-text">Starknet</span> .
            </p>
          </div>
          <div className="grid-cols-1">
            <Image src={PlayGame} width={700} height={800} alt="game" />
          </div>
        </div>
      </div>
    </div>
  );
}
