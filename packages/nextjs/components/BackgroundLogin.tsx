import Image from "next/image";
import loginBg from "@/public/landingpage/loginBG.svg";

export default function BackgroundLogin() {
  return (
    <div className="">
      <Image
        src={loginBg}
        alt="star"
        className="absolute left-0 bottom-0 -z-20"
      /> 
    </div>
  );
}


