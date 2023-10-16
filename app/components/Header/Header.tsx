import React from "react";
import DropdownMenu from "@/app/components/DropDownMenu/DropDownMenu";
import "@/app/styles/styles.css";
import Link from "next/link";
import DegradeButton from "../DegradeButton/DegradeButton";
import Row from "../Row/Row";

interface HeaderProps {
  pageTitle: string;
}

const Header: React.FC<HeaderProps> = ({ pageTitle }) => {
  return (
    <header className="bg-blue-500 px-4 w-full top-0 left-0 z-10s header-style bg-black bg-opacity-50">
      <Row>
        <div className="flex items-center justify-between h-[67px]">
          <div className="text-white font-bold text-2xl flex-1 px-0.5">
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
            <div className="flex flex-1 justify-end">
              <DegradeButton>CONNECT WALLET</DegradeButton>
            </div>
          </div>
        </div>
      </Row>
    </header>
  );
};

export default Header;
