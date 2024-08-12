import React, { useState } from "react";
import "@/app/styles/styles.css";
import Row from "../Row/Row";
import Image from "next/image";

interface HeaderProps {}

const Banner: React.FC<HeaderProps> = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="bg-header">
      <div className="w-full lg:h-screen">
        <Row>
          <div className="flex justify-center items-center gap-10 lg:pl-0 pl-10 3xl:justify-around ">
            <div className="lg:flex gap-2 font-medium lg:gap-20 hidden 3xl:w-[350px]">
              <span className="text-[#00ECFF]">HOME</span>
              <span>ABOUT</span>
              <span>CONTACT</span>
            </div>

            <div>
              <Image
                src="logo-marquis.svg"
                alt={"logo marquis"}
                height={43}
                width={216}
                className="lg:w-[372px] md:w-[272px] lg:h-[71px] md:h-[63px]"
              />
            </div>
            <div className="lg:hidden">
              <button
                className="text-white text-xl focus:outline-none"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                ☰
              </button>
            </div>
            <div className="lg:flex gap-2 2xl:gap-20 font-medium hidden 2xl:w-[350px]">
              <span>GAMES</span>
              <span>DOWNLOAD</span>
            </div>
          </div>

          <div className="lg:text-7xl text-2xl font-bold flex lg:flex-row flex-col lg:gap-14 gap-5 justify-center items-center lg:pb-52 lg:pt-72 font-[valorant] py-20 px-28">
            <span className="">ON-CHAIN </span>
            <div className="w-7 h-7 rounded-full bg-white lg:block hidden "></div>
            <span>RANDOMNESS </span>
            <div className="w-7 h-7 rounded-full bg-white lg:block hidden "></div>
            <span>STRATEGY</span>
          </div>
          <div className="flex items-center justify-center pb-40 font-bold lg:text-2xl text-lg text-[#00ECFF]">
            <button className="btn-download lg:py-5 lg:px-14 px-7 py-3">
              DOWNLOAD NOW
            </button>
          </div>
        </Row>
      </div>
    </header>
  );
};

export default Banner;
