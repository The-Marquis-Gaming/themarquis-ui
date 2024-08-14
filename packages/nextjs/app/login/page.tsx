"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
function Page() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/login/verification");
  };
  return (
    <div className="font-monserrat">
      <div
        className="flex flex-col py-8 px-12 gap-4 md:gap-4 h-screen justify-center center-screen"
        style={{
          backgroundImage: `url(/bg-transparent.svg)`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="text-4xl font-medium">
          <span>WELCOME</span>
          <span className="text-gradient"> BACK !</span>
        </div>
        <span className="text-[#CACACA]">
          Use your credential below and login to your account
        </span>
        <div className="bg-[#21262B] w-[400px] h-[111px] flex flex-col p-4 gap-4 rounded-[8px] input-container">
          <span>Email</span>
          <input
            type="text"
            placeholder="example@gmail.com"
            className="bg-transparent focus:outline-none"
          ></input>
        </div>

        <div className="flex flex-col justify-start gap-2">
          <span className="py-4">
            Don’t have an account?
            <Link href="/signup" className="text-[#00ECFF]">
              {" "}
              Sign up here.
            </Link>
          </span>
          <div className="flex gap-4">
            <input type="checkbox"></input>
            <span>Remember me</span>
          </div>
        </div>
        <button
          className="shadow-button w-[260px] py-4 px-7 mt-6"
          onClick={handleClick}
        >
          NEXT
        </button>
      </div>
    </div>
  );
}

export default Page;
