"use client";
import Invitation from "~~/components/invitation";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  const handleClick = () => {
    router.push("/deposit");
  };
  return (
    <div className="font-monserrat">
      <div
        className="flex flex-col justify-center py-8 px-12 gap-4 md:gap-4 h-[630px]"
        style={{
          backgroundImage: `url(/bg-transparent.svg)`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex justify-between items-center">
          <div className="flex gap-2 flex-col">
            <span className="font-bold text-3xl">WELCOME BACK, YIXUAN </span>
            <span className="text-xl">Nice to see you again</span>
            <div className="flex gap-8 mt-20">
              <button className="shadow-button py-4 px-10">Home</button>
              <button
                className="bg-[#16828A] shadow-button py-4 px-10"
                onClick={handleClick}
              >
                Deposit
              </button>
            </div>
          </div>
          <Invitation></Invitation>
        </div>
      </div>
    </div>
  );
}

export default Page;
