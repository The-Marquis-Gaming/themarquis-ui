"use client";
import OTPInput from "~~/components/verification";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  const handleSign = () => {
    router.push("/login/welcome");
  };

  return (
    <div className="font-monserrat">
      <div
        className="flex flex-col justify-center pb-8 px-4 md:px-12 gap-4 h-screen md:h-screen pt-24 md:pt-8 center-screen"
        style={{
          backgroundImage: `url(/bg-transparent.svg)`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          justifyContent: "center",
        }}
      >
        <div className="flex flex-col p-6 center-screen">
          <div className="text-3xl font-bold">
            <span>WELCOME TO </span>{" "}
            <span className="text-gradient"> THE MARQUIS !</span>
          </div>
          <span className="text-[#CACACA] text-xl py-4">
            Verification code has been sent to your email ng***@gmail.com
          </span>
        </div>
        <OTPInput></OTPInput>
        <span className="text-[#00ECFF] pl-6">Resend</span>
        <div className="pl-6">
          <button
            className="shadow-button my-20 py-5 px-16 font-arcade text-shadow-deposit text-2xl"
            onClick={handleSign}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;
