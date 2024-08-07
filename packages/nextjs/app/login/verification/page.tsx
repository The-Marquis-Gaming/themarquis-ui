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
        className="flex flex-col justify-center py-16 px-12 gap-4 md:gap-4 h-[630px]"
        style={{
          backgroundImage: `url(/bg-transparent.svg)`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex flex-col p-6">
          <div className="text-3xl">
            <span>WELCOME</span> <span className="text-gradient"> BACK</span>
          </div>
          <span className="text-[#CACACA] text-xl py-4">
            Verification code has been sent to your email ng***@gmail.com
          </span>
        </div>
        <OTPInput></OTPInput>
        <div>
          <button
            className="shadow-button my-20 py-5 px-16 text-xl"
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
