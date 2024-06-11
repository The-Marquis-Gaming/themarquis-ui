import Image from "next/image";
import Row from "./components/Row/Row";
import "./styles/styles.css";
import React from "react";
import IconList from "@/app/LandingComponents/IconList";
import { FaUser } from "@react-icons/all-files/fa/FaUser";
import { FaUsers } from "@react-icons/all-files/fa/FaUsers";
import CardsFeatures from "@/app/LandingComponents/CardsFeatures";
import { IoGameControllerSharp } from "@react-icons/all-files/io5/IoGameControllerSharp";
import { VscGlobe } from "@react-icons/all-files/vsc/VscGlobe";
import GameCarousel from "@/app/LandingComponents/GamesCarousel";

export default function Home() {
  const items: string[] = [
    "CRYPTO GAMING",
    "STRATEGY GAME",
    "MIND - BENDING",
    "NFT ASSETS",
  ];
  return (
    <>
      <main className="">
        <div className="bg-[#1F2429] ">
          <div className="flex justify-center items-center ">
            <Row>
              <IconList items={items} />
            </Row>
          </div>
        </div>
        <div className="">
          <div className="flex justify-center items-center ">
            <Row>
              <div className="flex items-center justify-center flex-col pt-52">
                <span className="text-2xl">Powered By</span>
                <div className="flex gap-40 py-10">
                  <Image
                    src="/dojo.svg"
                    alt="logo dojo"
                    width={225}
                    height={120}
                  />
                  <Image
                    src="/starknet.svg"
                    alt="logo starknet"
                    width={99}
                    height={99}
                  />
                  <Image
                    src="/flutter.svg"
                    alt="logo flutter"
                    width={247}
                    height={72}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center justify-center py-52">
                <span className="text-5xl font-bold pb-10">AVAILABLE ON</span>
                <div className="flex gap-40 py-10">
                  <Image
                    src="/appStore.png"
                    alt="logo app store"
                    width={240}
                    height={86}
                  />
                  <Image
                    src="/google.png"
                    alt="logo google"
                    width={269}
                    height={86}
                  />
                </div>
                <div className="text-3xl flex items-center justify-center gap-20 ">
                  <div className="flex flex-col">
                    <span>300+</span>
                    <span className="text-lg">DOWNLOADS</span>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <span>200+</span>
                    <span className="text-lg">ACTIVE USERS</span>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <span>4.9</span>
                    <span className="text-lg">STORE RATING</span>
                  </div>
                </div>
                <div className="flex justify-center gap-20 py-52">
                  <div className="bg-video flex justify-center items-center">
                    <Image
                      src="/play.svg"
                      alt={"icon play"}
                      width={141}
                      height={130}
                    />
                  </div>
                  <div className="max-w-[520px] w-full flex flex-col gap-2">
                    <span className="text-5xl font-bold">
                      ENGAGING IN THE ON-CHAIN GAME NOW
                    </span>
                    <span className="text-xl">
                      We bring you an innovative online platform, designed with
                      Flutter, that delivers a perfect play experience on both
                      iOS and Android. Enjoy seamless, engaging gameplay
                      anytime, anywhere. Join the fun and start playing now!
                    </span>
                  </div>
                </div>
                <div className=" flex flex-col items-center justify-center py-52">
                  <span className="text-5xl pb-10">MAIN FEATURES</span>
                  <div className="flex gap-20">
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
                <div className="w-full pb-52">
                  <div className="flex gap-5 text-5xl items-center justify-start w-full py-10">
                    <Image
                      src="/Frame.svg"
                      alt="frame icon"
                      width={52}
                      height={70}
                    />
                    <span>TRENDING GAMES</span>
                  </div>
                  <GameCarousel />
                  {/*  <div className="flex gap-20">*/}
                  {/*    <div className="max-w-[400px] flex flex-col justify-center gap-5 text-xl flex-1">*/}
                  {/*      <span className="font-bold">LUDO</span>*/}
                  {/*      <span className="font-medium">*/}
                  {/*        Strategy board game for two to four players, in which*/}
                  {/*        the players race their four tokens from start to finish*/}
                  {/*        according to the rolls of a single die*/}
                  {/*      </span>*/}
                  {/*      <div className="flex justify-end gap-5 py-10">*/}
                  {/*        <button className="border-[#00FBED] w-[68px] h-[68px] rounded-full border-2 flex items-center justify-center">*/}
                  {/*          <Image*/}
                  {/*            src="/ArrowLeft.svg"*/}
                  {/*            alt="arrow"*/}
                  {/*            width={20}*/}
                  {/*            height={20}*/}
                  {/*          />*/}
                  {/*        </button>*/}
                  {/*        <button className="border-[#00FBED] w-[68px] h-[68px] rounded-full border-2 flex items-center justify-center">*/}
                  {/*          <Image*/}
                  {/*            src="/ArrowRight.svg"*/}
                  {/*            alt="arrow"*/}
                  {/*            width={20}*/}
                  {/*            height={20}*/}
                  {/*          />*/}
                  {/*        </button>*/}
                  {/*      </div>*/}
                  {/*    </div>*/}
                  {/*    <div className="flex-1 flex ">*/}
                  {/*      <Image*/}
                  {/*        src={"/Ludo.png"}*/}
                  {/*        alt={"ludo image"}*/}
                  {/*        width={300}*/}
                  {/*        height={385}*/}
                  {/*      />*/}
                  {/*      <Image*/}
                  {/*        src={"/yahtzee.png"}*/}
                  {/*        alt={"ludo image"}*/}
                  {/*        width={300}*/}
                  {/*        height={385}*/}
                  {/*      />*/}
                  {/*      <Image*/}
                  {/*        src={"/6nimmt.png"}*/}
                  {/*        alt={"ludo image"}*/}
                  {/*        width={300}*/}
                  {/*        height={385}*/}
                  {/*      />*/}
                  {/*      <Image*/}
                  {/*        src={"/lostCitiex.png"}*/}
                  {/*        alt={"ludo image"}*/}
                  {/*        width={300}*/}
                  {/*        height={385}*/}
                  {/*      />*/}
                  {/*      <Image*/}
                  {/*        src={"/uckers.png"}*/}
                  {/*        alt={"ludo image"}*/}
                  {/*        width={300}*/}
                  {/*        height={385}*/}
                  {/*      />*/}
                  {/*    </div>*/}
                  {/*  </div>*/}
                </div>
              </div>
            </Row>
          </div>
        </div>
      </main>
    </>
  );
}
