import React from "react";
import DropdownMenu from "@/app/components/DropDownMenu/DropDownMenu";
import "@/app/styles/styles.css";
import Link from "next/link";
import Row from "../Row/Row";
import ButtonToggle from "../HeaderWallet/HeaderWallet";
import Image from "next/image";

interface HeaderProps {
  pageTitle: string;
}

const Header: React.FC<HeaderProps> = ({ pageTitle }) => {
  return (
    <header className="bg-header">
      <div className="w-full h-screen">
        <Row>
          <div className="flex justify-center items-center gap-10">
            <div className="flex gap-2">
              <span>HOME</span>
              <span>ABOUT</span>
              <span>CONTACT</span>
            </div>

            <div className="">
              <Image
                src="logo-marquis.svg"
                alt={"logo marquis"}
                height={71}
                width={372}
              />
            </div>
            <div className="flex gap-2">
              <span>GAMES</span>
              <span>DOWNLOAD</span>
            </div>
          </div>

          <div className="text-7xl font-bold flex gap-10 justify-center items-center py-52">
            <span>ON-CHAIN </span>
            <div className="w-7 h-7 rounded-full bg-white"></div>
            <span>RANDOMNESS </span>
            <div className="w-7 h-7 rounded-full bg-white"></div>
            <span>STRATEGY</span>
          </div>
          <div className="flex items-center justify-center py-40 font-bold text-2xl text-[#00ECFF]">
            <button className="btn-download py-5 px-14">DOWNLOAD NOW</button>
          </div>
        </Row>
      </div>
    </header>
  );
};

export default Header;
