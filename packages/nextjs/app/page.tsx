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
import { id } from "ethers";

export default function Home() {
  const items: string[] = [
    "CRYPTO GAMING",
    "STRATEGY GAME",
    "MIND - BENDING",
    "NFT ASSETS",
  ];

  const users = [
    {
      id: 1,
      medal: "/gold-medal.png",
      avatar: "/avatar.png",
      name: "YIXUAN",
      points: "8888"
    },
    {
      id: 2,
      medal: "/silver-medal.png",
      avatar: "/avatar.png",
      name: "YIXUAN",
      points: "8888"
    },
    {
      id: 3,
      medal: "/bronce-medal.png",
      avatar: "/avatar.png",
      name: "YIXUAN",
      points: "8888"
    }
  ]
  return (
    <>
      <div className="top-0 bg-image w-full h-[850px] flex justify-center items-center flex-col gap-16">
        <div className="flex gap-6 text-white text-[40px] font-bold">
          <span>ON-CHAIN</span>
          <span>•</span>
          <span>RANDOMNESS</span>
          <span>•</span>
          <span>STRATEGY</span>
        </div>
        <button className="bg-black text-white text-[20px] py-4 px-20">DOWNLOAD</button>
      </div>
      <main className="font-monserrat">
        <div className="bg-transparent">
          <div className="flex justify-center items-center ">
            <IconList items={items} />
          </div>
        </div>
        <div>
          <div className="flex justify-center items-center ">

            <div className="flex flex-col items-center justify-center lg:pt-52 pt-20 px-6">
              <span className="lg:text-5xl font-bold lg:pb-10 pb-4 text-lg">
                AVAILABLE ON
              </span>
              <div className="w-full flex justify-between pb-20 items-center">
                <div> <div className="lg:text-3xl text-sm flex items-center lg:gap-20 gap-5 w-full justify-center font-valorant">
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
                  </div></div>
                <div className="flex flex-col gap-4">
                  <span className="text-3xl">Leaderboard</span>

                  <div className="flex flex-col gap-4">
                    {users.map((user) => (
                      <>
                        <div key={user.id} className="flex bg-[#21262B] py-3 px-4 items-center rounded-[17px] w-[600px]">
                          <Image src={user.medal} alt="medal" width={45} height={65}></Image>
                          <div className="flex gap-80">
                            <div className="flex gap-4">
                              <Image src={user.avatar} alt="avatar" width={40} height={40}></Image>
                              <span>{user.name}</span>
                            </div>
                            <div>{user.points} pts. </div>
                          </div>
                        </div>
                      </>
                    ))}
                  </div>
                </div>
              </div>


              <div className="flex justify-center items-center gap-60">
                <div className="flex justify-center items-center w-[297px] h-[206px] lg:w-[742px] lg:h-[517px]">
                  <Image
                    src="/video-highlights.png"
                    alt={"icon play"}
                    width={745}
                    height={517}
                  />
                </div>
                <div className="max-w-[520px] w-full flex flex-col gap-2">
                  <span className="lg:text-5xl text-2xl font-bold">
                    PLAY STRATEGY ON-CHAIN NOW !
                  </span>
                  <span className="lg:text-xl text-lg">
                    We bring you an innovative online platform, built with Flutter & Rust on Starknet,
                    that delivers a perfect play experience on both iOS and Android. Enjoy seamless,
                    engaging gameplay anytime, anywhere. Join the fun and start playing now!
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
                    text="Offline mode"
                  />
                  <CardsFeatures
                    icon={<VscGlobe className="w-[30px] h-[30px]" />}
                    text="Play And Earn"
                  />
                  <CardsFeatures
                    icon={
                      <IoGameControllerSharp className="w-[30px] h-[30px]" />
                    }
                    text="Mobile-First Design"
                  />
                </div>
              </div>
              <div className="w-full bg-games">
                <div className="flex gap-5 lg:text-5xl text-2xl items-center justify-center w-full py-10 ">
                  <span>GAMES</span>
                </div>
                <GameCarousel />
              </div>
              <div className="w-full py-40">
                <div className="flex items-center">
                  <Image
                    src={"/rectan.png"}
                    alt={"rectan"}
                    width={100}
                    height={200}
                  />
                  <div className="flex gap-10 items-center justify-start w-full py-10 flex-col">
                    <span className="lg:text-4xl text-2xl font-bold font-valorant text-center">
                      POWERED BY
                    </span>
                    <div>
                      <div>
                        <Image src="/starknet.svg" alt="starknet" width={500} height={60}></Image>
                      </div>
                    </div>
                  </div>
                  <Image
                    src={"/rectan.png"}
                    alt={"rectan"}
                    width={100}
                    height={200}
                  />
                </div>
              </div>
              <div className="flex flex-col w-full">
                <div className="flex flex-col gap-4 justify-start">
                  <Image src="logo-marquis.svg" alt="logo" width={357} height={100}></Image>
                  <div className="flex gap-4">
                    <a>
                      <Image src="/x.png" alt="x" width={30} height={30}></Image>
                    </a>
                    <a >
                      <Image src="/message.png" alt="x" width={30} height={30}></Image>
                    </a>
                    <a>
                      <Image src="/discord.png" alt="x" width={30} height={30}></Image>
                    </a>
                    <a>
                      <Image src="/youtube.png" alt="x" width={30} height={30}></Image>
                    </a>
                  </div>
                </div>
                <div className="flex justify-between py-20 px-20">
                  <div className="flex flex-col">
                    <span className="text-[#939393]">Game</span>
                    <a>Download</a>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#939393]">Resources</span>
                    <a>Docs</a>
                    <a>Blogs</a>
                    <Link href="/brankit">Brand Assets</Link>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#939393]">Useful Links</span>
                    <a>Terms and Conditions</a>
                    <a>Privacy Policy</a>
                  </div>
                  <div className="flex flex-col gap-4">
                    <span className="text-[#939393]">Subscribe to our newsletter</span>
                    <div className="relative">
                      <input type="text" placeholder="Your email address" className="bg-[#21262B] rounded-[45px] px-6 py-3"></input>
                      <span className="bg-white text-black px-6 py-3 rounded-[45px] absolute left-48">Subscribe</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
