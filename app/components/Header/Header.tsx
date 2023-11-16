import React from "react";
import DropdownMenu from "@/app/components/DropDownMenu/DropDownMenu";
import "@/app/styles/styles.css";
import Link from "next/link";
import Row from "../Row/Row";
import ButtonToggle from "../HeaderWallet/HeaderWallet";

interface HeaderProps {
  pageTitle: string;
}

const Header: React.FC<HeaderProps> = ({ pageTitle }) => {
  
  return (
    <header className="h-[100px]  bg-black bg-opacity-50">
      <div className="w-full top-0 left-0 z-10s bg-black bg-opacity-50">
        <Row>
          <div className="flex items-center p-8 justify-between h-[67px]">
            <div className="text-white font-bold text-2xl flex-1 pl-32">
              {pageTitle}
            </div>
            <div className="flex flex-1">
              <div className="flex flex-col justify-center flex-[2] items-end">
                <div className="flex">
                  <DropdownMenu title="Games">
                    <Link href="/">Menu 1</Link>
                    <Link href="/">Menu 2</Link>
                  </DropdownMenu>
                  <DropdownMenu title="Docs">
                    <Link href="/">Menu 2</Link>
                    <Link href="/">Menu 3</Link>
                  </DropdownMenu>
                  <DropdownMenu title="Lenguage">
                    <Link href="/">Menu 4</Link>
                    <Link href="/">Menu 5</Link>
                    <Link href="/">Menu 6</Link>
                  </DropdownMenu>
                </div>
              </div>
              <div className="flex flex-1 justify-end" >
                <ButtonToggle></ButtonToggle>
              </div>
            </div>
          </div>
        </Row>
      </div>
              
    </header>
  );
};

export default Header;
