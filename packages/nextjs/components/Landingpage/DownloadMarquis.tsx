import Image from "next/image";
import IconDowload from "@/public/landingpage/iconDowload.svg";
import Mobile from "@/public/landingpage/mobile.png";

export default function DownloadMarquis() {
  return (
    <div className="text-center flex flex-col gap-20">
      <div className="mb-12">
        <p className="text-[32px] text-[#9B9B9B]">Marquis on Mobile</p>
        <p className="landing-title ">
          Created by gamers, tailored for gamers.
        </p>
      </div>
      <div className="relative w-full h-[550px] mt-[30px] detect-bg">
        <div className="absolute detect-bg-circle w-fit p-[80px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
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
        className="flex gap-8 normal-button button-style items-center justify-center bg-[#272727]"
        style={{
          margin: "50px auto 0 auto",
        }}
      >
        <p> Download on Mobile </p>
        <Image src={IconDowload} width={12} height={12} alt="banner" />
      </div>
    </div>
  );
}
