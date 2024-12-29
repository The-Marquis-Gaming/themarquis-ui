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
    <div className="rounded-tl-[10.24px] lg:rounded-tl-[30px]   bg-gradient-to-tl to-[#BDBDBD]/[100%]   via-transparent/10 from-[#D4D4D4]/[39%] w-[102.13px]  lg:w-[412.25px] md:h-[140px] md:w-[180px] h-[105.13px] lg:h-[308px] p-[1px] rounded-br-[10.24px] lg:rounded-br-[30px] relative">
      <Image
        src={topEclipse}
        className="absolute top-[10.24px] left-[10.24px] lg:top-[30px] lg:left-[30px]"
        alt=""
      />
      <Image
        src={baseEclispe}
        className="absolute right-[10.24px] lg:right-[30px] bottom-[10.24px] lg:bottom-[30px] "
        alt=""
      />
      <div className="rounded-tl-[10.24px] lg:rounded-tl-[30px] lg:py-[40px] py-[13.65px] items-center justify-center lg:gap-[70px] gap-[22px] flex flex-col bg-black w-full h-full rounded-br-[10.24px] lg:rounded-br-[30px] bg-gradient-to-tl from-white/[0%] via-[#0F151A] to-[#0F151A] relative">
        <Image
          src={icon}
          className="lg:w-[100px] md:w-[50px] md:h-[50px] w-[34.11px] h-[34.11px] lg:h-[100px]"
          alt=""
        />
        <p className="text-center font-bold md:text-xl text-[9.9px] xl:text-4xl lg:text-3xl text-white !font-lasserit  ">
          {text}
        </p>
      </div>
    </div>
  );
}
