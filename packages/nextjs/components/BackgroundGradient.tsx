import Image from "next/image";
import loginBg from "@/public/landingpage/loginBG.svg"

export default function BackgroundGradient() {
  return (
    <div className="">
      <Image
        src={loginBg}
        alt="star"
        className="absolute left-0 bottom-0 -z-20"
      />
      {/* <Image
        src={LeftAnimation}
        alt="leftAnimation"
        className="absolute left-0 bottom-32 "
      />
      <Image
        src={Star}
        alt="star"
        width={300}
        className="absolute left-0 bottom-0 "
      />
      <Image
        src={RightAnimation}
        alt=""
        className="absolute bottom-0 right-0 -z-20"
      /> */}
    </div>
  );
}
