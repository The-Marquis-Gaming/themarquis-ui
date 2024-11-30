"use client";
import { useEffect, useState } from "react";
import Invitation from "~~/components/invitation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useGetUserInfo from "~~/utils/api/hooks/useGetUserInfo";
import { useQueryClient } from "@tanstack/react-query";
import BackgroundLogin from "~~/components/BackgroundLogin";
import { makePrivateEmail } from "~~/utils/ConvertData";

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
    <div className="!font-monserrat">
      <div className="flex flex-col justify-center pt-8 px-2 lg:px-12 gap-4">
        <div className="hidden md:block">
          <BackgroundLogin />
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-center max-w-[1700px] mx-auto relative z-40 w-full">
          <div className="flex gap-2 flex-col w-full sm:h-fit h-[400px] justify-between max-w-[800px] items-center">
            <div className="">
              <div className="sm:text-3xl font-bold text-[18px] text-center">
                WELCOME TO{" "}
                <span className="text-gradient text-[#00ECFF]">
                  THE MARQUIS,
                </span>{" "}
                {data && data?.user?.email
                  ? makePrivateEmail(data?.user?.email)
                  : "USER"}
              </div>
            </div>
            {isMobile && <Invitation />}
            <div
              className={`flex gap-8 mt-2 lg:mt-20 w-full justify-center ${isMobile ? "flex-col" : ""}`}
            >
              {isMobile ? (
                <>
                  <Link
                    className="shadow-button py-4 px-10 font-arcade text-shadow-deposit text-2xl text-center"
                    href="/"
                  >
                    MAIN
                  </Link>
                  <button className="bg-[#16828A] shadow-button py-4 mb-24 px-10 font-arcade text-shadow-deposit text-2xl">
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
          {!isMobile && (
            <div className="hidden-container">
              <Invitation />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
