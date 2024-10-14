import Image from "next/image";
import IconDowload from "@/public/landingpage/iconDowload.svg";
import Mobile from "@/public/landingpage/mobile.png";

export default function DownloadMarquis() {
  return (
    <div className="text-center flex flex-col md:gap-20 gap-14">
      <div className="md:mb-12 mb-0">
        <p className="md:text-[32px] text-[16px] text-[#9B9B9B]">
          Marquis on Mobile
        </p>
        <p className="text-[20px] md:text-[48px] color-title">
          Created by gamers, tailored for gamers.
        </p>
      </div>
      <div className="relative w-full lg:h-[550px] h-[150px] lg:mt-[30px] mt-0 detect-bg">
        <div className="absolute detect-bg-circle w-fit md:p-[80px] p-3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Image
            src={Mobile}
            width={637}
            height={711}
            alt="mobile"
            className="mx-auto"
          />
        </div>
      </div>
      <div
        onClick={() =>
          window.open(
            "https://drive.google.com/file/d/1WEpMzjg6lYJLQEqNmc3pY0nrhqQVmO0d/view?usp=share_link",
            "_blank",
          )
        }
        className="flex gap-8 btn-download-mobile normal-button button-style items-center justify-center bg-[#272727]"
        style={{
          margin: "50px auto 0 auto",
        }}
      >
        <p className="md:text-[24px] text-[14px]"> Download on Mobile </p>
        <Image src={IconDowload} width={12} height={12} alt="banner" />
      </div>
    </div>
  );
}
