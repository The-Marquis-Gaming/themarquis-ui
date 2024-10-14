"use client";

import Image from "next/image";
import { Space_Grotesk } from "@next/font/google";
import { Footer } from "~~/components/Footer";
import BackgroundGradient from "~~/components/BackgroundGradient";

const SpaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
});

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
          className={`text-white text-[24px] font-arial`}
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
        return <p className={`text-[48px] ${fontDisplay}`}>{subTitle}</p>;
      }
      case "VALORANT": {
        return <p className={`text-[32px] ${fontDisplay}`}>{subTitle}</p>;
      }
      case "MONTSERRAT": {
        return (
          <p className={`text-[32px] font-bold ${fontDisplay}`}>{subTitle}</p>
        );
      }
      case "Orbitron": {
        return <p className={`text-[32px] ${fontDisplay}`}>{subTitle}</p>;
      }
      case "Arial": {
        return <p className={`text-[32px] ${fontDisplay}`}>{subTitle}</p>;
      }
    }
  };

  return (
    <div className="flex justify-between items-center border-b border-b-[#363636]">
      <div className="py-[28px]">
        <p className="capitalize text-[24px] font-arial">{title}</p>
        {switchSubtitle()}
      </div>
      <div>
        <a
          className={`bg-[#00ECFF] w-[200px] h-[67px] flex items-center justify-center text-center rounded-[4px] text-black ${SpaceGrotesk.className}`}
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
      <div className="relative h-[910px] flex flex-col justify-center items-center pb-[200px] py-8 gap-4 md:gap-4  w-full">
        <BackgroundGradient />
        <div className="flex items-center gap-2">
          <div className="flex relative p-3 rounded-full">
            <Image
              alt="SE2 logo"
              className="cursor-pointer"
              src="/logo-marquis.svg"
              width={653}
              height={182}
            />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center gap-8 mb-14 px-4 text-black">
          <h1
            className={`text-center text-white text-[64px] font-bold ${SpaceGrotesk.className}`}
          >
            Media Toolkit
          </h1>
        </div>
      </div>
      <div className="w-full max-w-[1700px] mx-auto px-8">
        <div className="flex flex-col gap-[110px]">
          <div className="flex flex-col justify-center">
            <span className=" text-[#00ECFF] text-[36px] font-bold mb-[30px]">
              Branding guideline
            </span>
            <span className="text-[24px] max-w-[872px] w-full">
              In short, The Marquis logos represent only The Marquis and should
              not be used to represent you or your projects, products, or
              company. If you have any questions reach out to us at{" "}
              <a href="" className="text-[#FFEB81] border-b border-[#FFEB81]">
                contact@quantum3labs.com
              </a>
            </span>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[#00ECFF] text-[36px] mb-[50px] font-bold font-arial">
              Logo
            </span>
            <div className="grid grid-cols-3 gap-[115px]">
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
            <span className="text-[36px] mb-[38px] text-gradient-2 text-[#00ECFF] font-bold font-arial">
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
            <div className="mb-[92px] text-[36px] text-gradient-2 text-[#00ECFF] font-bold font-arial">
              Colors
            </div>
            <div className="flex flex-col gap-[60px]">
              <div>
                <p className="text-[36px] mb-[10px]">Primary</p>
                <div className="w-full flex">
                  <div className="w-1/2 md:w-1/6 bg-[#AD6DFF] flex justify-end h-[130px] flex-grow">
                    <p className="hidden text-[16px] md:block md:text-xs p-3 text-[#000]">
                      #AD6DFF
                    </p>
                  </div>
                  <div className="w-1/2 md:w-1/6 bg-[#00ECFF] flex justify-end h-[130px] flex-grow">
                    <p className="hidden text-[16px] md:block md:text-xs p-3 text-[#000]">
                      #00ECFF
                    </p>
                  </div>
                  <div className="w-1/2 md:w-1/6 bg-[#16828A] flex justify-end h-[130px] flex-grow">
                    <p className="hidden md:block md:text-xs text-[16px] p-3 text-white">
                      #16828A
                    </p>
                  </div>
                  <div className="w-1/2 md:w-1/6 bg-[#176369] flex justify-end h-[130px] flex-grow">
                    <p className="hidden md:block md:text-xs text-[16px] p-3 text-white">
                      #176369
                    </p>
                  </div>
                  <div className="w-1/2 md:w-1/6 bg-[#0C333A] flex justify-end h-[130px] flex-grow">
                    <p className="hidden md:block md:text-xs text-[16px] p-3 text-white">
                      #0C333A
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[36px] mb-[10px]">Secondary</p>
                <div className="w-full flex">
                  <div className="w-1/2 md:w-1/6 bg-[#FFFFFF] flex justify-end h-[130px] flex-grow">
                    <p className="hidden text-[16px] md:block md:text-xs p-3 text-[#000]">
                      #FFFFFF
                    </p>
                  </div>
                  <div className="w-1/2 md:w-1/6 bg-[#CACACA] flex justify-end h-[130px] flex-grow">
                    <p className="hidden text-[16px] md:block md:text-xs p-3 text-[#000]">
                      #CACACA
                    </p>
                  </div>
                  <div className="w-1/2 md:w-1/6 bg-[#7D7D7D] flex justify-end h-[130px] flex-grow">
                    <p className="hidden text-[16px] md:block md:text-xs p-3 text-[#000]">
                      #7D7D7D
                    </p>
                  </div>
                  <div className="w-1/2 md:w-1/6 bg-[#46464D] flex justify-end h-[130px] flex-grow">
                    <p className="hidden md:block md:text-xs text-[16px] p-3 text-white">
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
