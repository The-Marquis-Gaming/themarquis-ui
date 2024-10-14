import Image from "next/image";
import FlutterIcon from "@/public/landingpage/flutterIcon.svg";
import StarknetIcon from "@/public/landingpage/starknetIcon.svg";

export default function Technical() {
  return (
    <div>
      <p className="text-center landing-title md:mb-16 mb-4">
        Technologies used
      </p>
      <div className="flex items-center md:flex-nowrap flex-wrap justify-center md:gap-8 gap-3">
        <div className="tech-btn">
          <Image src={StarknetIcon} alt="icon" />
        </div>
        <div className="tech-btn">
          <Image src={FlutterIcon} alt="icon" />
        </div>
      </div>
    </div>
  );
}
