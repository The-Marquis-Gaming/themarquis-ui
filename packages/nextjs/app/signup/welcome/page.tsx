"use client";
import { useEffect, useState } from "react";
import Invitation from "~~/components/invitation";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  const handleDeposit = () => {
    router.push("/deposit");
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 700);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="font-monserrat">
      <div
        className="flex flex-col justify-center py-8 px-12 gap-4 md:gap-4 h-screen"
        style={{
          backgroundImage: `url(/bg-transparent.svg)`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex justify-between items-center">
          <div className="flex gap-2 flex-col">
            <span className="font-bold text-3xl">THANK YOU FOR SIGNING UP</span>
            <span className="text-xl text-[#CACACA]">
              Welcome to The Marquis world
            </span>
            <div className={`flex gap-8 mt-20 ${isMobile ? 'flex-col' : ''}`}>
              {isMobile ? (
                <>
                  <button className="shadow-button py-4 px-10">
                  MAIN
                  </button>
                  <button
                    className="bg-[#16828A] shadow-button py-4 px-10"
                  >
                    REMAIN HERE
                  </button>
                </>
              ) : (
                <>
                  <button className="shadow-button py-4 px-10">Home</button>
                  <button
                    className="bg-[#16828A] shadow-button py-4 px-10"
                    onClick={handleDeposit}
                  >
                    Deposit
                  </button>
                </>
              )}
            </div>
          </div>
          <Invitation />
        </div>
      </div>
    </div>
  );
}

export default Page;
