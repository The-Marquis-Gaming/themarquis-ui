"use client";
import OTPInput from "~~/components/verification";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  const handleSign = () => {
    router.push("/signup/welcome");
  };

  return (
    <div className="font-monserrat">
      <div
        className="flex flex-col py-8 px-12 gap-4 md:gap-4 h-screen justify-center center-screen pt-24"
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
            className="shadow-button my-10 py-5 px-16 font-arcade text-shadow-deposit text-2xl"
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
