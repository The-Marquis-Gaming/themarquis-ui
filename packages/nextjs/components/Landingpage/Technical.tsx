import Image from "next/image";
import FlutterIcon from "@/public/landingpage/flutterIcon.svg";
import StarknetIcon from "@/public/landingpage/starknetIcon.svg";

export default function Technical() {
  return (
    <div>
      <p className="text-center landing-title mb-16">Technologies used</p>
      <div className="flex items-center justify-center gap-8">
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
