import Image from "next/image";
import LeftAnimation from "@/public/landingpage/leftAnimation.png";
import RightAnimation from "@/public/landingpage/avaiableRight.png";
import Star from "@/public/landingpage/stars.png";
import newLandingBg from "@/public/landingpage/newLandingBg1.png";

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
    src={newLandingBg}
    alt="animation"
    className="absolute top-1/2 md:block hidden right-0 transform -translate-y-1/2  max-w-[50%] z-0 object-contain"
  />


    </div>
  );
}
