"use client";

import React from "react";
import Image from "next/image";
import { Space_Grotesk } from "@next/font/google";
import { Footer } from "~~/components/Footer";
import LeftAnimation from "@/public/landingpage/leftAnimation.png";
import RightAnimation from "@/public/landingpage/avaiableRight.png";
import Star from "@/public/landingpage/stars.png";

const SpaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

interface ColorBlock {
  color: string;
  textColor?: string;
}

interface Section {
  title: string;
  colors: ColorBlock[];
}

const COLOR_SECTIONS: Section[] = [
  {
    title: "Primary",
    colors: [
      { color: "#0D333A", textColor: "white" },
      { color: "#185F6C", textColor: "white" },
      { color: "#176369", textColor: "white" },
      { color: "#16828A", textColor: "white" },
      { color: "#00ECFF", textColor: "black" },
      { color: "#FFEB81", textColor: "black" },
    ],
  },
  {
    title: "Secondary",
    colors: [
      { color: "#FFFFFF", textColor: "black" },
      { color: "#A9A9A9", textColor: "black" },
      { color: "#46464D", textColor: "black" },
      { color: "#363D43", textColor: "white" },
      { color: "#21262B", textColor: "white" },
      { color: "#0F151A", textColor: "white" },
    ],
  },
  {
    title: "Accent",
    colors: [
      { color: "#446C7C", textColor: "#FFF" },
      { color: "#6FB1C8", textColor: "#000" },
      { color: "#574A2D", textColor: "#000" },
      { color: "#EEBE5A", textColor: "#000" },
      { color: "#843C4C", textColor: "#FFF" },
      { color: "#D95972", textColor: "#000" },
      { color: "#365C4B", textColor: "#000" },
      { color: "#56DB6E", textColor: "#000" },
    ],
  },
];

const TYPOGRAPHY_DATA = [
  {
    title: "Arcade Classic By Pizzadude",
    subTitle: "ARCADE CLASSIC",
    fontDowload: "arcade.TTF",
    fontDisplay: "font-arcade",
    textSize: "sm:text-[48px] text-[24px]",
  },
  {
    title: "Valorant By Bryan T",
    subTitle: "VALORANT",
    fontDowload: "valorant.ttf",
    fontDisplay: "font-valorant",
  },
  {
    title:
      "Montserrat By Julieta Ulanovsky, Sol Matas, Juan Pablo del Peral, Jacques Le Bailly",
    subTitle: "MONTSERRAT",
    fontDowload: "montserrat.ttf",
    fontDisplay: "font-monserrat",
    isBold: true,
  },
  {
    title: "Orbitron By Matt McInerney",
    subTitle: "Orbitron",
    fontDowload: "orbitron.ttf",
    fontDisplay: "font-orbitron",
  },
  {
    title: "Arial By Robin Nicholas, Patricia Saunders",
    subTitle: "Arial",
    fontDowload: "arial.TTF",
    fontDisplay: "font-arial",
  },
];

const LOGO_DOWNLOADS = [
  { logo: "logo-marquis.svg", textDownload: "Download Logotype" },
  { logo: "logomark.svg", textDownload: "Download Logomark", smallLogo: true },
  { logo: "wordmark.svg", textDownload: "Download Logomark" },
];

const SectionTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <span
    className={`text-[#00ECFF] sm:text-[36px] text-[24px] font-bold font-arial ${className}`}
  >
    {children}
  </span>
);

const ColorBlock: React.FC<ColorBlock> = ({ color, textColor = "white" }) => (
  <div
    className="w-1/2 md:w-1/6 flex justify-end h-[130px] flex-grow"
    style={{ background: color }}
  >
    <p
      className="hidden text-[16px] md:block md:text-xs p-3"
      style={{ color: textColor }}
    >
      {color}
    </p>
  </div>
);

const ColorSection: React.FC<Section> = ({ title, colors }) => (
  <div>
    <p className="sm:text-[36px] text-[16px] mb-[10px]">{title}</p>
    <div className="w-full flex">
      {colors.map((block) => (
        <ColorBlock key={block.color} {...block} />
      ))}
    </div>
  </div>
);

const LogoCard: React.FC<{
  logo: string;
  textDownload: string;
  smallLogo?: boolean;
}> = ({ logo, textDownload, smallLogo }) => (
  <div className="border border-[#363636] w-full">
    <div className="flex justify-center items-center sm:h-[232px] h-[170px]">
      <Image
        src={`/${logo}`}
        alt="logo"
        width={1000}
        height={1000}
        className={smallLogo ? "max-w-[100px]" : "max-w-[300px]"}
      />
    </div>
    <div className="border-t border-t-[#363636] flex justify-center items-center py-6">
      <a
        href={`/${logo}`}
        download={logo}
        className="text-white text-[20px] sm:text-[24px] font-arial"
      >
        {textDownload}
      </a>
    </div>
  </div>
);

const TypographyLine: React.FC<{
  title: string;
  subTitle: string;
  fontDowload: string;
  fontDisplay: string;
  textSize?: string;
  isBold?: boolean;
}> = ({
  title,
  subTitle,
  fontDowload,
  fontDisplay,
  textSize = "sm:text-[32px] text-[24px]",
  isBold,
}) => (
  <div className="flex flex-col sm:flex-row gap-0 sm:gap-2 justify-between items-start md:items-center border-b border-b-[#363636]">
    <div className="py-[28px]">
      <p className="capitalize md:text-[24px] text-[12px] font-arial">
        {title}
      </p>
      <p className={`${textSize} ${fontDisplay} ${isBold ? "font-bold" : ""}`}>
        {subTitle}
      </p>
    </div>
    <div className="sm:pb-0 pb-[28px]">
      <a
        className={`bg-[#00ECFF] text-[14px] sm:text-[24px] sm:w-[200px] w-[110px] sm:h-[67px] h-[37px] flex items-center justify-center text-center rounded-[4px] text-black ${SpaceGrotesk.className}`}
        href={`/fonts/${fontDowload}`}
        download={fontDowload}
        target="_blank"
        rel="noopener noreferrer"
      >
        Download
      </a>
    </div>
  </div>
);

const Header: React.FC = () => (
  <div className="relative sm:h-[910px] h-[470px] flex flex-col justify-center items-center pb-[200px] py-8 gap-4 md:gap-4 w-full">
    <div>
      <Image
        src={LeftAnimation}
        alt="leftAnimation"
        width={500}
        className="absolute left-0 top-1/4 transform -translate-y-1/4 z-10"
      />
      <Image
        src={Star}
        alt="star"
        width={300}
        className="absolute left-0 top-1/3 transform -translate-y-1/3 z-10 sm:block hidden"
      />
      <Image
        src={RightAnimation}
        alt="animation"
        className="absolute bottom-0 right-0 z-10 max-h-fit sm:block hidden"
      />
    </div>
    <div className="flex items-center gap-2">
      <div className="flex relative p-3 rounded-full">
        <Image
          alt="SE2 logo"
          className="cursor-pointer sm:w-[653px] sm:h-[182px] h-[58px] w-[220px]"
          src="/logo-marquis.svg"
          width={653}
          height={182}
        />
      </div>
    </div>
    <div className="flex flex-col justify-center items-center gap-8 md:mb-14 mb-0 px-4 text-black">
      <h1
        className={`text-center text-white sm:text-[64px] text-[24px] font-bold ${SpaceGrotesk.className}`}
      >
        Media Toolkit
      </h1>
    </div>
  </div>
);

const Page: React.FC = () => (
  <div className="flex flex-col items-center">
    <div className="relative w-full">
      <Header />
    </div>

    <main className="w-full max-w-[1700px] mx-auto px-8 md:mt-10 mt-[58px]">
      <div className="flex flex-col gap-[110px]">
        <section className="flex flex-col justify-center">
          <SectionTitle className="sm:mb-[30px] mb-3">
            Branding guideline
          </SectionTitle>
          <span className="sm:text-[24px] text-[16px] max-w-[872px] w-full">
            In short, The Marquis logos represent only The Marquis and should
            not be used to represent you or your projects, products, or company.
            If you have any questions reach out to us at{" "}
            <a href="" className="text-[#FFEB81] border-b border-[#FFEB81]">
              contact@quantum3labs.com
            </a>
          </span>
        </section>

        <section className="flex flex-col justify-center">
          <SectionTitle className="mb-[50px]">Logo</SectionTitle>
          <div className="grid xl:grid-cols-3 sm:grid-cols-1 md:grid-cols-2 gap-[30px] md:gap-[115px]">
            {LOGO_DOWNLOADS.map((item) => (
              <div key={item.textDownload} className="col-span-1">
                <LogoCard {...item} />
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col">
          <SectionTitle className="mb-[38px]">Typography</SectionTitle>
          {TYPOGRAPHY_DATA.map((item) => (
            <TypographyLine key={item.title} {...item} />
          ))}
        </section>

        <section>
          <SectionTitle className="sm:mb-[92px] mb-[50px]">Colors</SectionTitle>
          <div className="flex flex-col gap-[60px]">
            {COLOR_SECTIONS.map((section) => (
              <ColorSection key={section.title} {...section} />
            ))}
          </div>
        </section>
      </div>
    </main>

    <div className="w-full sm:mt-0 mt-[200px]">
      <Footer />
    </div>
  </div>
);

export default Page;
