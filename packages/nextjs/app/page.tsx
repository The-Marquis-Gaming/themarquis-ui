import Image from "next/image";
import Row from "./components/Row/Row";
import React from "react";
import { FaUser } from "@react-icons/all-files/fa/FaUser";
import { FaUsers } from "@react-icons/all-files/fa/FaUsers";
import { IoGameControllerSharp } from "@react-icons/all-files/io5/IoGameControllerSharp";
import { VscGlobe } from "@react-icons/all-files/vsc/VscGlobe";
import GameCarousel from "@/app/LandingComponents/GamesCarousel";

import CardsFeatures from "@/app/LandingComponents/CardsFeatures";
import IconList from "@/app/LandingComponents/IconList";
import Link from "next/link";

import "./styles/styles.css";

export default function Home() {
  const items: string[] = [
    "CRYPTO GAMING",
    "STRATEGY GAME",
    "MIND - BENDING",
    "NFT ASSETS",
  ];
  return (
    <>
      <main className="font-monserrat">
        <div className="bg-[#1F2429] ">
          <div className="flex justify-center items-center ">
            <Row>
              <IconList items={items} />
            </Row>
          </div>
        </div>
        <div>
          <div className="flex justify-center items-center">
            <Row>
              <div className="flex items-center justify-center flex-col lg:pt-52 pt-10  w-full">
                <span className="text-2xl w-full text-center">Powered By</span>
                <div className="flex lg:gap-40 lg:py-10 py-5 gap-10 lg:items-center">
                  <Image
                    src="/dojo.svg"
                    alt="logo dojo"
                    width={89}
                    height={47}
                    className="lg:w-[250px] lg:h-[82px]"
                  />
                  <Image
                    src="/starknet.svg"
                    alt="logo starknet"
                    width={38}
                    height={39}
                    className="lg:w-[99px] lg:h-[99px]"
                  />
                  <Image
                    src="/flutter.svg"
                    alt="logo flutter"
                    width={130}
                    height={37}
                    className="lg:w-[250px] lg:h-[120px]"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center justify-center lg:py-52 py-20 px-6">
                <span className="lg:text-5xl font-bold lg:pb-10 pb-4 text-lg">
                  AVAILABLE ON
                </span>
                <div className="flex lg:gap-40 gap-20 lg:py-10 py-5">
                  <Image
                    src="/appStore.png"
                    alt="logo app store"
                    width={109}
                    height={39}
                    className="lg:w-[240px] lg:h-[86px]"
                  />
                  <Image
                    src="/google.png"
                    alt="logo google"
                    width={118}
                    height={38}
                    className="lg:w-[269px] lg:h-[86px]"
                  />
                </div>
                <div className="lg:text-3xl text-sm flex items-center lg:gap-20 gap-5 w-full justify-center font-valorant">
                  <div className="flex flex-col  items-center justify-center">
                    <span>300+</span>
                    <span className="lg:text-lg text-xs ">DOWNLOADS</span>
                  </div>
                  <div className="flex flex-col items-center justify-center ">
                    <span>200+</span>
                    <span className="lg:text-lg text-xs ">ACTIVE USERS</span>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <span>4.9</span>
                    <span className="lg:text-lg text-xs">STORE RATING</span>
                  </div>
                </div>
                <div className="flex justify-center items-center lg:items-start lg:flex-row flex-col-reverse gap-20 lg:py-52 py-20 w-full">
                  <div className="bg-video flex justify-center items-center w-[297px] h-[206px] lg:w-[742px] lg:h-[517px]">
                    <Image
                      src="/play.svg"
                      alt={"icon play"}
                      width={141}
                      height={130}
                    />
                  </div>
                  <div className="max-w-[520px] w-full flex flex-col gap-2">
                    <span className="lg:text-5xl text-2xl font-bold">
                      ENGAGING IN THE ON-CHAIN GAME NOW
                    </span>
                    <span className="lg:text-xl text-lg">
                      We bring you an innovative online platform, designed with
                      Flutter, that delivers a perfect play experience on both
                      iOS and Android. Enjoy seamless, engaging gameplay
                      anytime, anywhere. Join the fun and start playing now!
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center lg:py-52 py-20 ">
                  <span className="lg:text-5xl text-2xl lg:pb-10 pb-5">
                    MAIN FEATURES
                  </span>
                  <div className="flex gap-20 lg:flex-row flex-col lg:flex-wrap lg:justify-center">
                    <CardsFeatures
                      icon={<FaUsers className="w-[30px] h-[30px]" />}
                      text="Online Multiplayer"
                    />
                    <CardsFeatures
                      icon={<FaUser className="w-[30px] h-[30px]" />}
                      text="Offline Bot mode"
                    />
                    <CardsFeatures
                      icon={<VscGlobe className="w-[30px] h-[30px]" />}
                      text="Game Native Token"
                    />
                    <CardsFeatures
                      icon={
                        <IoGameControllerSharp className="w-[30px] h-[30px]" />
                      }
                      text="Mobile-First Design"
                    />
                  </div>
                </div>
                <div className="w-full">
                  <div className="flex gap-5 lg:text-5xl text-2xl items-center justify-start w-full py-10">
                    <Image
                      src="/Frame.svg"
                      alt="frame icon"
                      width={52}
                      height={70}
                    />
                    <span>TRENDING GAMES</span>
                  </div>
                  <GameCarousel />
                </div>
              </div>
            </Row>
          </div>
          <div className="w-full lg:py-52 py-20 bg-degrad">
            <Row>
              <div className="flex items-center">
                <Image
                  src={"/rectan.png"}
                  alt={"rectan"}
                  width={100}
                  height={200}
                />
                <div className="flex gap-10 items-center justify-start w-full py-10 flex-col">
                  <span className="lg:text-xl text-lg text-center">
                    Receive the latest updates from us
                  </span>
                  <span className="lg:text-6xl text-3xl font-bold font-valorant text-center">
                    CONNECT WITH US
                  </span>
                  <Link
                    href={"/"}
                    className="flex bg-[#00ECFF] lg:px-16 px-5 py-5 text-black font-bold lg:text-2xl text-lg rounded-full items-center gap-3"
                  >
                    <Image
                      src="/twitter.svg"
                      alt="logo twitter"
                      height={20}
                      width={21}
                      className="lg:w-[42px] lg:h-[39px]"
                    />
                    Follow Us
                  </Link>
                </div>
                <Image
                  src={"/rectan.png"}
                  alt={"rectan"}
                  width={100}
                  height={200}
                />
              </div>
            </Row>
          </div>
        </div>
      </main>
    </>
  );
}
