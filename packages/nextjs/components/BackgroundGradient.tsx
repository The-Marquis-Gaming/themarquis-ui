import Image from "next/image";
import LeftAnimation from "@/public/landingpage/leftAnimation.png";
import RightAnimation from "@/public/landingpage/avaiableRight.png";
import Star from "@/public/landingpage/stars.png";

export default function BackgroundGradient() {
  return (
    <div>
      <Image
        src={LeftAnimation}
        alt="leftAnimation"
        width={500}
        className="absolute left-0 top-1/4 transform -translate-y-1/4 z-10"
      />
      <Image
        src={Star}
        alt="star"
        width={300}
        className="absolute left-0 top-1/3 transform -translate-y-1/3 z-10"
      />
      <Image
        src={RightAnimation}
        alt="animation"
        className="absolute bottom-0 right-0 z-10 max-h-fit"
      />
    </div>
  );
}
