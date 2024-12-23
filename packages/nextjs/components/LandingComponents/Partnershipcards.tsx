import baseEclispe from "@/public/landingpage/baseEclipse.svg";
import topEclipse from "@/public/landingpage/topEclipse.svg";
import Image from "next/image";

export default function PartnershipCard({
  icon,
  text,
}: {
  icon: string;
  text: string;
}) {
  return (
    <div className="rounded-tl-[30px] mt-[35.12px] bg-gradient-to-tl to-[#BDBDBD]/[100%]  via-transparent/10 from-[#D4D4D4]/[39%] w-[103px]  lg:w-[412.25px] h-[105px] lg:h-[308px]   p-[1px] rounded-br-[30px] relative">
      <Image
        src={topEclipse}
        className="absolute top-[30px] left-[30px]"
        alt=""
      />
      <Image
        src={baseEclispe}
        className="absolute right-[30px] bottom-[30px]"
        alt=""
      />
      <div className="   rounded-tl-[30px] items-center justify-center gap-[30px] flex flex-col bg-black w-full h-full  rounded-br-[30px] bg-gradient-to-tl from-white/[0%] via-[#0F151A] to-[#0F151A] relative">
        <Image
          src={icon}
          className="lg:w-[100px] w-[34.11px] h-[34.11px] lg:h-[100px]"
          alt=""
        />
        <p className="text-center font-bold text-[9.9px] lg:text-4xl text-white !font-lasserit  ">
          {text}
        </p>
      </div>
    </div>
  );
}
