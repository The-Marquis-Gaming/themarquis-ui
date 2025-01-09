import Image from "next/image";
import FlutterIcon from "@/public/landingpage/flutterIcon.svg";
import StarknetIcon from "@/public/landingpage/starknetIcon.svg";

export default function Technical() {
  return (
    <div className="md:py-24 py-0 md:px-0 px-4">
      <p className="text-center landing-title md:mb-16 mb-4 !font-lasserit">
        Technologies used
      </p>
      <div className="flex items-center justify-center md:gap-8 gap-3">
        <div className="tech-btn md:h-20 h-14 md:rounded-2xl rounded-[10px]">
          <Image
            src={StarknetIcon}
            alt="icon"
            className="md:w-auto w-[120px]"
          />
        </div>
        <div className="tech-btn md:h-20 h-14 md:rounded-2xl rounded-[10px]">
          <Image src={FlutterIcon} alt="icon" className="md:w-auto w-20" />
        </div>
      </div>
    </div>
  );
}
