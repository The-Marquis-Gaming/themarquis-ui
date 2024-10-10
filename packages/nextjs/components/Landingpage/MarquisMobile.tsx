import Image from "next/image";
import Appstore from "@/public/landingpage/appStore.png";
import GooglePlay from "@/public/landingpage/googlePlay.png";
import BoxPlay from "@/public/landingpage/detectDevice.svg";
import AnimationRight from "@/public/landingpage/avaiableRight.png";

export default function MarquisMobile() {
  return (
    <div className="relative z-20 h-[700px]">
      <Image
        src={AnimationRight}
        alt="animation"
        className="absolute bottom-0 right-0 z-10"
      />
      <div className="grid grid-cols-2 gap-10 items-center relative z-20 content-fit-center">
        <div className="col-span-1">
          <div className="relative">
            <div className="absolute top-[20px] w-full flex items-center gap-5 justify-center">
              <Image src={Appstore} alt="button" width={270} height={85} />
              <Image src={GooglePlay} alt="button" width={270} height={85} />
            </div>
            <Image src={BoxPlay} alt="box" />
          </div>
        </div>
        <div className="col-span-1">
          <p className="mb-[45px] text-[48px] font-bold capitalize">
            Available on all <span className="mobile-text">mobile</span>{" "}
            platforms
          </p>
          <p className="landing-desc">
            Marquis is the HUB for strategy games. Using Starknet technology,
            the experience of GamePlay on Mobile is smooth and fun. Download now
            on Appstore or Google Play and start playing with your friends !
          </p>
        </div>
      </div>
    </div>
  );
}
