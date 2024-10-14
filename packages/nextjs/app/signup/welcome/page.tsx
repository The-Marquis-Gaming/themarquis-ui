"use client";
import { useEffect, useState } from "react";
import Invitation from "~~/components/invitation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useGetUserInfo from "~~/utils/api/hooks/useGetUserInfo";
import { useQueryClient } from "@tanstack/react-query";
import { makePrivateEmail } from "~~/utils/ConvertData";
import BackgroundGradient from "~~/components/BackgroundGradient";

function Page() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const queryClient = useQueryClient();
  const { data } = useGetUserInfo();

  queryClient.setQueryData(["userId"], data?.id);

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
      <div className="flex flex-col justify-center pt-8 px-12 gap-4">
        <BackgroundGradient />
        <div className="flex justify-between items-center max-w-[1700px] mx-auto relative z-40 w-full">
          <div className="flex gap-2 flex-col w-full sm:h-fit h-[400px] justify-between max-w-[800px] items-center">
            <div className="uppercase">
              <div className="sm:text-3xl text-[18px] text-center">
                You are now registered
              </div>
              <div className="sm:text-3xl text-[18px] text-[#CACACA] text-center">
                Welcome to <span className="text-gradient">The Marquis, </span>
                {data && <span>{makePrivateEmail(data?.user?.email)}</span>}
              </div>
            </div>
            <div
              className={`flex gap-8 mt-20 w-full justify-center ${isMobile ? "flex-col" : ""}`}
            >
              {isMobile ? (
                <>
                  <Link
                    className="shadow-button py-4 px-10 font-arcade text-shadow-deposit text-2xl text-center"
                    href="/"
                  >
                    MAIN
                  </Link>
                  <button className="bg-[#16828A] shadow-button py-4 px-10 font-arcade text-shadow-deposit text-2xl">
                    REMAIN HERE
                  </button>
                </>
              ) : (
                <>
                  <Link
                    className="shadow-button w-full max-w-[245px] text-center py-4 px-10 font-arcade text-shadow-deposit text-2xl"
                    href="/"
                  >
                    Home
                  </Link>
                  <button
                    className="bg-[#16828A] w-full max-w-[305px] shadow-button py-4 px-10 font-arcade text-shadow-deposit text-2xl"
                    onClick={handleDeposit}
                  >
                    Deposit
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="hidden-container">
            <Invitation />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
