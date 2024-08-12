import Image from "next/image";
import Link from "next/link";
import { Space_Grotesk } from "@next/font/google";
import { Footer } from "~~/components/Footer";
const SpaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
});
function Page() {
  return (
    <div>
      <div>
        <div
          className="flex flex-col justify-center items-center py-8 gap-4 md:gap-4 h-[630px]"
          style={{
            backgroundImage: `url(/bg-transparent.svg)`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
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
              className={`text-center text-white text-3xl lg:text-3xl max-w-md lg:max-w-2xl px-3 m-0 ${SpaceGrotesk.className}`}
            >
              Media Toolkit{" "}
            </h1>
          </div>
        </div>
        <div className="flex flex-col justify-center my-12">
          <span className="px-6 md:px-24 text-3xl text-[#00ECFF] font-bold">
            Branding guideline
          </span>
          <span className="px-6 md:px-24 text-2xl py-6">
            In short, The Marquis logos represent only The Marquis and should
            not be used to represent you or your projects, products, or company.
            If you have any questions reach out to us at{" "}
            <a href="" className="text-[#FFEB81]">
              contact@quantum3labs.com
            </a>
          </span>
        </div>
        <div className="flex flex-col justify-center my-12">
          <span className="px-6 md:px-24 text-[24px] text-[#00ECFF] font-bold py-5 font-arial">
            Logo
          </span>
          <div className="flex flex-wrap gap-11 justify-center px-6 md:px-24">
            <div className="border border-[#363636] w-full md:w-1/3">
              <div className="flex flex-col justify-center items-center py-10">
                <Image
                  src="logo-marquis.svg"
                  alt="logo"
                  width={280}
                  height={80}
                />
              </div>
              <div className="border-t border-t-[#363636] flex justify-center items-center py-6">
                <a
                  href="/logo-marquis.svg"
                  download="logo-marquis.svg"
                  className={`text-gradient text-xl ${SpaceGrotesk.className}`}
                >
                  Download
                </a>
              </div>
            </div>
            <div className="border border-[#363636] w-full md:w-1/3">
              <div className="flex gap-4 justify-center items-center py-10">
                <Image src="logomark.svg" alt="logo" width={80} height={80} />
              </div>
              <div className="border-t border-t-[#363636] flex justify-center items-center py-6">
                <a
                  href="/logomark.svg"
                  download="logomark.svg"
                  className={`text-gradient text-xl ${SpaceGrotesk.className}`}
                >
                  Download
                </a>
              </div>
            </div>
            <div className="border border-[#363636] w-full md:w-1/3">
              <div className="flex gap-4 justify-center items-center py-10">
                <Image src="wordmark.svg" alt="logo" width={290} height={80} />
              </div>
              <div className="border-t border-t-[#363636] flex justify-center items-center py-6">
                <a
                  href="/wordmark.svg"
                  download="wordmark.svg"
                  className={`text-gradient text-xl ${SpaceGrotesk.className}`}
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center my-12 px-6 md:px-24">
          <span className="mt-4 text-[24px] text-gradient-2 text-[#00ECFF] font-bold font-arial">
            Typography
          </span>
          <div className="w-full mt-6">
            <div className="flex flex-wrap justify-between border-b border-b-[#363636] py-6">
              <div className={`flex flex-col font-arcade`}>
                <span className="text-xs">Arcade Classic By Pizzadude</span>
                <span className="text-2xl">Arcade Classic</span>
              </div>
              <div className="flex justify-center mt-4 md:mt-0">
                <a
                  className={`bg-[#00ECFF] py-3 px-9 rounded-[4px] text-black ${SpaceGrotesk.className}`}
                  href="/fonts/arcade.TTF"
                  download="arcade.TTF"
                  target="_blank"
                >
                  Download
                </a>
              </div>
            </div>
            <div className="flex flex-wrap justify-between border-b border-b-[#363636] py-6 font-valorant">
              <div className={`flex flex-col`}>
                <span className="text-xs">Valorant By Bryan T</span>
                <span className="text-2xl">VALORANT</span>
              </div>
              <div className="flex justify-center mt-4 md:mt-0">
                <a
                  className={`bg-[#00ECFF] py-3 px-9 rounded-[4px] text-black ${SpaceGrotesk.className}`}
                  href="/fonts/valorant.ttf"
                  download="valorant.ttf"
                  target="_blank"
                >
                  Download
                </a>
              </div>
            </div>
            <div className="flex flex-wrap justify-between border-b border-b-[#363636] py-6 font-monserrat">
              <div className={`flex flex-col `}>
                <span className="text-xs">Montserrat By Julieta Ulanovsky</span>
                <span className="text-2xl">Montserrat</span>
              </div>
              <div className="flex justify-center mt-4 md:mt-0">
                <a
                  className={`bg-[#00ECFF] py-3 px-9 rounded-[4px] text-black ${SpaceGrotesk.className}`}
                  href="/fonts/montserrat.ttf"
                  download="montserrat.ttf"
                  target="_blank"
                >
                  Download
                </a>
              </div>
            </div>
            <div className="flex flex-wrap justify-between border-b border-b-[#363636] py-6">
              <div className={`flex flex-col font-orbitron`}>
                <span className="text-xs">Orbitron By Matt McInerney</span>
                <span className="text-2xl">Orbitron</span>
              </div>
              <div className="flex justify-center mt-4 md:mt-0">
                <a
                  className={`bg-[#00ECFF] py-3 px-9 rounded-[4px] text-black ${SpaceGrotesk.className}`}
                  href="/fonts/orbitron.ttf"
                  download="orbitron.ttf"
                  target="_blank"
                >
                  Download
                </a>
              </div>
            </div>
            <div className="flex flex-wrap justify-between border-b border-b-[#363636] py-6 font-arial">
              <div className={`flex flex-col font-arial`}>
                <span className="text-xs">Arial By Robin Nicholas</span>
                <span className="text-2xl">Arial</span>
              </div>
              <div className="flex justify-center mt-4 md:mt-0">
                <a
                  className={`bg-[#00ECFF] py-3 px-9 rounded-[4px] text-black ${SpaceGrotesk.className}`}
                  href="/fonts/arial.TTF"
                  download="arial.TTF"
                  target="_blank"
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center mt-12 mb-20 px-6 md:px-24">
          <span className="my-4 text-[24px] text-gradient-2 text-[#00ECFF] font-bold font-arial">
            Colors
          </span>
          <div>
            <span>Primary</span>
            <div className="w-full flex my-5">
              <div className="w-1/2 md:w-1/6 bg-[#AD6DFF] flex justify-end h-[130px] flex-grow">
                <span className="hidden md:block md:text-xs p-2 text-black">
                  #AD6DFF
                </span>
              </div>
              <div className="w-1/2 md:w-1/6 bg-[#00ECFF] flex justify-end h-[130px] flex-grow">
                <span className="hidden md:block md:text-xs p-2 text-black">
                  #00ECFF
                </span>
              </div>
              <div className="w-1/2 md:w-1/6 bg-[#16828A] flex justify-end h-[130px] flex-grow">
                <span className="hidden md:block md:text-xs p-2 text-white">
                  #16828A
                </span>
              </div>
              <div className="w-1/2 md:w-1/6 bg-[#176369] flex justify-end h-[130px] flex-grow">
                <span className="hidden md:block md:text-xs p-2 text-white">
                  #176369
                </span>
              </div>
              <div className="w-1/2 md:w-1/6 bg-[#0C333A] flex justify-end h-[130px] flex-grow">
                <span className="hidden md:block md:text-xs p-2 text-white">
                  #0C333A
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <span>Secondary</span>
            <div className="w-full flex my-5">
              <div className="w-1/2 md:w-1/6 bg-[#FFFFFF] flex justify-end h-[130px] flex-grow">
                <span className="hidden md:block md:text-xs p-2 text-black">
                  #FFFFFF
                </span>
              </div>
              <div className="w-1/2 md:w-1/6 bg-[#CACACA] flex justify-end h-[130px] flex-grow">
                <span className="hidden md:block md:text-xs p-2 text-black">
                  #CACACA
                </span>
              </div>
              <div className="w-1/2 md:w-1/6 bg-[#7D7D7D] flex justify-end h-[130px] flex-grow">
                <span className="hidden md:block md:text-xs p-2 text-black">
                  #7D7D7D
                </span>
              </div>
              <div className="w-1/2 md:w-1/6 bg-[#46464D] flex justify-end h-[130px] flex-grow">
                <span className="hidden md:block md:text-xs p-2 text-white">
                  #46464D
                </span>
              </div>
              <div className="w-1/2 md:w-1/6 bg-[#363D43] flex justify-end h-[130px] flex-grow">
                <span className="hidden md:block md:text-xs p-2 text-white">
                  #363D43
                </span>
              </div>
              <div className="w-1/2 md:w-1/6 bg-[#21262B] flex justify-end h-[130px] flex-grow">
                <span className="hidden md:block md:text-xs p-2 text-white">
                  #21262B
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full px-6 md:px-24">
          <div className="flex flex-col gap-4 justify-start">
            <Image
              src="logo-marquis.svg"
              alt="logo"
              width={357}
              height={100}
            ></Image>
            <div className="flex gap-4">
              <a>
                <Image src="/x.png" alt="x" width={30} height={30}></Image>
              </a>
              <a>
                <Image
                  src="/message.png"
                  alt="x"
                  width={30}
                  height={30}
                ></Image>
              </a>
              <a>
                <Image
                  src="/discord.png"
                  alt="x"
                  width={30}
                  height={30}
                ></Image>
              </a>
              <a>
                <Image
                  src="/youtube.png"
                  alt="x"
                  width={30}
                  height={30}
                ></Image>
              </a>
            </div>
          </div>
          <div className="flex flex-wrap-reverse justify-between py-20 px-6 md:px-20 font-monserrat">
            <div className="flex gap-10 flex-wrap">
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
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[#939393]">
                Subscribe to our newsletter
              </span>
              <div className="relative py-4">
                <input
                  type="text"
                  placeholder="Your email address"
                  className="bg-[#21262B] rounded-[45px] px-6 py-3 text-small"
                ></input>
                <span className="bg-white text-black px-6 py-3 rounded-[45px] absolute left-48 text-small">
                  Subscribe
                </span>
              </div>
            </div>
          </div>
        </div>
        <Footer></Footer>
      </div>
    </div>
  );
}

export default Page;
