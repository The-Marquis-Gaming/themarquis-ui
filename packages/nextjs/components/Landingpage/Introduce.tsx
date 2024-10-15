import Image from "next/image";
import LeftAnimation from "@/public/landingpage/leftAnimation.png";
import ArrowsIcon from "@/public/landingpage/arrowsIcon.svg";
import PlayGame from "@/public/landingpage/playgame.svg";
import Star from "@/public/landingpage/stars.png";

export default function Introduce() {
  return (
    <div className="relative">
      <div className="md:block hidden absolute left-0 top-0">
        <Image src={LeftAnimation} width={1000} height={1000} alt="animation" />
      </div>
      <div>
        <div className="content-fit-center grid grid-cols-2 md:gap-10 gap-0 items-center">
          <div className="grid-cols-1 md:px-[50px] px-0 md:mt-[20%] mt-0">
            <Image
              src={Star}
              alt="star"
              width={400}
              height={400}
              className="md:block hidden absolute top-1/2 transform -translate-y-1/2 left-[20px]"
            />
            <Image
              src={ArrowsIcon}
              width={100}
              height={100}
              alt="arrow"
              loading="lazy"
            />
            <p className="landing-title-nonecolor md:my-5 my-3">
              Introducing a <br className="lg:block hidden" /> New Age of Gaming
            </p>
            <p className="landing-desc" style={{ textTransform: "none" }}>
              Marquis is an open-source gaming platform built for on-chain
              mobile games on{" "}
              <span
                className="starknet-text cursor-pointer relative"
                style={{ zIndex: 100 }}
                onClick={() =>
                  window.open(" https://www.starknet.io/", "_blank")
                }
              >
                Starknet
              </span>
            </p>
          </div>
          <div className="grid-cols-1 flex justify-end items-end">
            <Image
              src={PlayGame}
              width={700}
              height={800}
              alt="game"
              className="lg:max-w-[700px] lg:max-h-[800px] sm:max-w-[300px] sm:max-h-[320px] max-w-[150px] max-h-[180px] min-h-[180px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
