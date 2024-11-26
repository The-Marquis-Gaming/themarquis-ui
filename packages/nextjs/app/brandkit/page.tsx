"use client";

import Image from "next/image";
import { Space_Grotesk } from "@next/font/google";
import { Footer } from "~~/components/Footer";
import LeftAnimation from "@/public/landingpage/leftAnimation.png";
import RightAnimation from "@/public/landingpage/avaiableRight.png";
import Star from "@/public/landingpage/stars.png";

const SpaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
});

const DATA_ACCENT = [
  {
    textColor: "#FFF",
    bgColor: "#446C7C",
  },
  {
    textColor: "#000",
    bgColor: "#6FB1C8",
  },
  {
    textColor: "#000",
    bgColor: "#574A2D",
  },
  {
    textColor: "#000",
    bgColor: "#EEBE5A",
  },
  {
    textColor: "#FFF",
    bgColor: "#843C4C",
  },
  {
    textColor: "#000",
    bgColor: "#D95972",
  },
  {
    textColor: "#000",
    bgColor: "#365C4B",
  },
  {
    textColor: "#000",
    bgColor: "#56DB6E",
  },
];

const TYPO_DATA = [
  {
    title: "Arcade Classic By Pizzadude",
    subTitle: "ARCADE CLASSIC",
    fontDowload: "arcade.TTF",
    fontDisplay: "font-arcade",
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

const DOWLOAD_LOGO_DATA = [
  {
    logo: "logo-marquis.svg",
    textDownload: "Download Logotype",
  },
  {
    logo: "logomark.svg",
    textDownload: "Download Logomark",
  },
  {
    logo: "wordmark.svg",
    textDownload: "Download Logomark",
  },
];

const CardLogoDownload = ({
  logo,
  textDownload,
}: {
  logo: string;
  textDownload: string;
}) => {
  const renderImage = () => {
    switch (logo) {
      case "logomark.svg":
        return (
          <Image
            src={logo}
            alt="logo"
            width={1000}
            height={1000}
            className="max-w-[100px]"
          />
        );
      default:
        return (
          <Image
            src={logo}
            alt="logo"
            width={1000}
            height={1000}
            className="max-w-[300px]"
          />
        );
    }
  };

  return (
    <div className="border border-[#363636] w-full ">
      <div className="flex justify-center items-center h-[232px]">
        {renderImage()}
      </div>
      <div className="border-t border-t-[#363636] flex justify-center items-center py-6">
        <a
          href={`/${logo}`}
          download={logo}
          className={`text-white text-[20px] sm:text-[24px] font-arial`}
        >
          {textDownload}
        </a>
      </div>
    </div>
  );
};

const TypographyLine = ({
  title,
  subTitle,
  fontDowload,
  fontDisplay,
}: {
  title: string;
  subTitle: string;
  fontDowload: string;
  fontDisplay: string;
}) => {
  const switchSubtitle = () => {
    switch (subTitle) {
      case "ARCADE CLASSIC": {
        return (
          <p className={`sm:text-[48px] text-[24px] ${fontDisplay}`}>
            {subTitle}
          </p>
        );
      }
      case "VALORANT": {
        return (
          <p className={`sm:text-[32px] text-[24px] ${fontDisplay}`}>
            {subTitle}
          </p>
        );
      }
      case "MONTSERRAT": {
        return (
          <p className={`sm:text-[32px] text-[24px] font-bold ${fontDisplay}`}>
            {subTitle}
          </p>
        );
      }
      case "Orbitron": {
        return (
          <p className={`sm:text-[32px] text-[24px] ${fontDisplay}`}>
            {subTitle}
          </p>
        );
      }
      case "Arial": {
        return (
          <p className={`sm:text-[32px] text-[24px] ${fontDisplay}`}>
            {subTitle}
          </p>
        );
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-0 sm:gap-2 justify-between items-start md:items-center border-b border-b-[#363636]">
      <div className="py-[28px]">
        <p className="capitalize md:text-[24px] text-[12px] font-arial">
          {title}
        </p>
        {switchSubtitle()}
      </div>
      <div className="sm:pb-0 pb-[28px] ">
        <a
          className={`bg-[#00ECFF] text-[14px] sm:text-[24px] sm:w-[200px] w-[110px] sm:h-[67px] h-[37px] flex items-center justify-center text-center rounded-[4px] text-black ${SpaceGrotesk.className}`}
          href={`/fonts/${fontDowload}`}
          download={fontDowload}
          target="_blank"
        >
          Download
        </a>
      </div>
    </div>
  );
};

function Page() {
  return (
    <div className="flex flex-col items-center ">
      <div className="relative sm:h-[910px] h-[470px] flex flex-col justify-center items-center pb-[200px] py-8 gap-4 md:gap-4  w-full">
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
      <div className="w-full max-w-[1700px] mx-auto px-8 md:mt-10 mt-[58px]">
        <div className="flex flex-col gap-[110px]">
          <div className="flex flex-col justify-center">
            <span className=" text-[#00ECFF] sm:text-[36px] text-[24px] font-bold sm:mb-[30px] mb-3">
              Branding guideline
            </span>
            <span className="sm:text-[24px] text-[16px] max-w-[872px] w-full">
              In short, The Marquis logos represent only The Marquis and should
              not be used to represent you or your projects, products, or
              company. If you have any questions reach out to us at{" "}
              <a href="" className="text-[#FFEB81] border-b border-[#FFEB81]">
                contact@quantum3labs.com
              </a>
            </span>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[#00ECFF] sm:text-[36px] text-[24px] mb-[50px] font-bold font-arial">
              Logo
            </span>
            <div className="grid xl:grid-cols-3 sm:grid-cols-1 md:grid-cols-2 gap-[30px] md:gap-[115px]">
              {DOWLOAD_LOGO_DATA.map((item) => (
                <div key={item?.textDownload} className="col-span-1">
                  <CardLogoDownload
                    textDownload={item?.textDownload}
                    logo={item?.logo}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="sm:text-[36px] text-[24px] mb-[38px] text-gradient-2 text-[#00ECFF] font-bold font-arial">
              Typography
            </span>

            {TYPO_DATA.map((item) => (
              <TypographyLine
                key={item?.title}
                title={item?.title}
                subTitle={item?.subTitle}
                fontDowload={item?.fontDowload}
                fontDisplay={item?.fontDisplay}
              />
            ))}
          </div>
          <div>
            <div className="sm:mb-[92px] mb-[50px] sm:text-[36px] text-[24px] text-gradient-2 text-[#00ECFF] font-bold font-arial">
              Colors
            </div>
            <div className="flex flex-col gap-[60px]">
              <div>
                <p className="sm:text-[36px] text-[16px] mb-[10px]">Primary</p>
                <div className="w-full flex">
                  <div className="w-1/2 md:w-1/6 bg-[#0D333A] flex justify-end h-[130px] flex-grow">
                    <p className="hidden text-[16px] md:block md:text-xs p-3 text-white">
                      #0D333A
                    </p>
                  </div>
                  <div className="w-1/2 md:w-1/6 bg-[#185F6C] flex justify-end h-[130px] flex-grow">
                    <p className="hidden text-[16px] md:block md:text-xs p-3 text-white">
                      #185F6C
                    </p>
                  </div>
                  <div className="w-1/2 md:w-1/6 bg-[#176369] flex justify-end h-[130px] flex-grow">
                    <p className="hidden md:block md:text-xs text-[16px] p-3 text-white">
                      #176369
                    </p>
                  </div>
                  <div className="w-1/2 md:w-1/6 bg-[#16828A] flex justify-end h-[130px] flex-grow">
                    <p className="hidden md:block md:text-xs text-[16px] p-3 text-white">
                      #16828A
                    </p>
                  </div>
                  <div className="w-1/2 md:w-1/6 bg-[#00ECFF] flex justify-end h-[130px] flex-grow">
                    <p className="hidden md:block md:text-xs text-[16px] p-3 text-[#000]">
                      #00ECFF
                    </p>
                  </div>
                  <div className="w-1/2 md:w-1/6 bg-[#FFEB81] flex justify-end h-[130px] flex-grow">
                    <p className="hidden md:block md:text-xs text-[16px] p-3 text-[#000]">
                      #FFEB81
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <p className="sm:text-[36px] text-[16px] mb-[10px]">
                  Secondary
                </p>
                <div className="w-full flex">
                  <div className="w-1/2 md:w-1/6 bg-[#FFFFFF] flex justify-end h-[130px] flex-grow">
                    <p className="hidden text-[16px] md:block md:text-xs p-3 text-[#000]">
                      #FFFFFF
                    </p>
                  </div>
                  <div className="w-1/2 md:w-1/6 bg-[#A9A9A9] flex justify-end h-[130px] flex-grow">
                    <p className="hidden text-[16px] md:block md:text-xs p-3 text-[#000]">
                      #A9A9A9
                    </p>
                  </div>
                  <div className="w-1/2 md:w-1/6 bg-[#46464D] flex justify-end h-[130px] flex-grow">
                    <p className="hidden text-[16px] md:block md:text-xs p-3 text-[#000]">
                      #46464D
                    </p>
                  </div>
                  <div className="w-1/2 md:w-1/6 bg-[#363D43] flex justify-end h-[130px] flex-grow">
                    <p className="hidden md:block md:text-xs text-[16px] p-3 text-white">
                      #363D43
                    </p>
                  </div>
                  <div className="w-1/2 md:w-1/6 bg-[#21262B] flex justify-end h-[130px] flex-grow">
                    <p className="hidden md:block md:text-xs text-[16px] p-3 text-white">
                      #21262B
                    </p>
                  </div>
                  <div className="w-1/2 md:w-1/6 bg-[#0F151A] flex justify-end h-[130px] flex-grow">
                    <p className="hidden md:block md:text-xs text-[16px] p-3 text-white">
                      #0F151A
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <p className="sm:text-[36px] text-[16px] mb-[10px]">Accent</p>
                <div className="w-full flex">
                  {DATA_ACCENT.map((item) => (
                    <div
                      key={item.bgColor}
                      className={`w-1/2 md:w-1/6 flex justify-end h-[130px] flex-grow`}
                      style={{ background: `${item.bgColor}` }}
                    >
                      <p
                        className={`hidden text-[16px] md:block md:text-xs p-3 text-[${item.textColor}]`}
                      >
                        {item?.bgColor}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
}

export default Page;
