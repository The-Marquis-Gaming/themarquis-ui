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
        className="absolute left-0 top-1/4 transform -translate-y-1/4 "
      />
      <Image
        src={Star}
        alt="star"
        width={300}
        className="absolute left-0 top-1/3 transform -translate-y-1/3 "
      />
      <Image
        src={RightAnimation}
        alt=""
        className="absolute bottom-0 right-0 mix-blend-color-dodge opacity-70 z-20"
      />
    </div>
  );
}
