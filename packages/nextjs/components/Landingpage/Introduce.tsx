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
        <div className="content-fit-center grid grid-cols-12 md:gap-10 gap-0 items-center">
          <div className="col-span-6 md:col-span-8 lg:col-span-6 md:px-[50px] px-0 md:mt-[25%] mt-0">
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
            <p className="landing-title-nonecolor !font-bold !font-lasserit md:my-5 my-3">
              Introducing a <br className="lg:block hidden" /> New Age of Gaming
            </p>
            <p
              className="landing-desc  !font-lasserit "
              style={{ textTransform: "none" }}
            >
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
          <div className="col-span-6 md:col-span-4 lg:col-span-6 flex justify-end items-end">
            <Image
              src={PlayGame}
              width={700}
              height={800}
              alt="game"
              className="2xl:max-w-[700px] 2xl:max-h-[800px] xl:max-w-[600px] xl:max-h-[700px] lg:max-w-[500px] lg:max-h-[600px] sm:max-w-[300px] sm:max-h-[320px] max-w-[150px] max-h-[180px] min-h-[180px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
