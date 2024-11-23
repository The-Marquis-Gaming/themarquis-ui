import Image from "next/image";
import Appstore from "@/public/landingpage/appStore.png";
import GooglePlay from "@/public/landingpage/googlePlay.png";
import BoxPlay from "@/public/landingpage/detectDevice.svg";
import AnimationRight from "@/public/landingpage/avaiableRight.png";

export default function MarquisMobile() {
  return (
    <div className="relative z-20 md:h-[700px] h-auto py-[36px] md:py-0">
      <Image
        src={AnimationRight}
        alt="animation"
        className="md:block hidden absolute bottom-0 right-0 z-10"
      />
      <div className="grid grid-cols-2 gap-10 items-center relative z-20 content-fit-center">
        <div className="lg:col-span-1 col-span-2 lg:order-1 order-2">
          <div className="relative">
            <div className="absolute top-[20px] w-full flex items-center gap-5 justify-center">
              <a href="https://apps.apple.com/us/app/the-marquis-early-access/id6695763058">
                <Image
                  src={Appstore}
                  alt="button"
                  width={270}
                  height={85}
                  className="max-w-[151px] max-h-[48px] md:max-w-[270px] md:max-h-[85px] transition-opacity opacity-90 ease-in-out delay-75 hover:opacity-100"
                />
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.marquis.app">
                <Image
                  src={GooglePlay}
                  alt="button"
                  width={270}
                  height={85}
                  className="max-w-[151px] max-h-[48px] md:max-w-[270px] md:max-h-[85px] transition-opacity opacity-90 ease-in-out delay-75 hover:opacity-100"
                />
              </a>
            </div>
            <Image src={BoxPlay} alt="box" />
          </div>
        </div>
        <div className="lg:col-span-1 col-span-2 lg:order-2 order-1">
          <p className="lg:mb-[45px] mb-[14px] lg:text-[48px] text-[20px] md:text-center font-bold capitalize">
            Available on all <span className="mobile-text">mobile</span>{" "}
            platforms
          </p>
          <p
            className="landing-desc md:text-center lg:text-justify"
            style={{
              textTransform: "none",
            }}
          >
            Marquis is the HUB for strategy games. Using Starknet technology,
            the experience of GamePlay on Mobile is smooth and fun.
          </p>
          <p
            className="landing-desc mt-2 md:text-center lg:text-justify"
            style={{
              textTransform: "none",
            }}
          >
            Download now on App Store or Google Play and start playing with your
            friends !
          </p>
        </div>
      </div>
    </div>
  );
}
