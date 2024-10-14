"use client";
import { useEffect, useState } from "react";
import Invitation from "~~/components/invitation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useGetUserInfo from "~~/utils/api/hooks/useGetUserInfo";
import { useQueryClient } from "@tanstack/react-query";
import BackgroundGradient from "~~/components/BackgroundGradient";
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
    <div className="font-monserrat">
      <div className="flex flex-col justify-center pt-8 px-12 gap-4">
        <BackgroundGradient />
        <div className="flex justify-between max-w-[1700px] relative z-50 w-full items-center mx-auto">
          <div className="flex gap-2 flex-col w-full">
            <div className="">
              <div className="font-bold sm:text-3xl text-[18px] sm:text-left text-center">
                WELCOME TO <span className="text-gradient">THE MARQUIS,</span>{" "}
                {data && data?.user?.email
                  ? makePrivateEmail(data?.user?.email)
                  : "USER"}
              </div>
            </div>
            <div className={`flex gap-8 mt-20 ${isMobile ? "flex-col" : ""}`}>
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
                    href={"/withdrawal"}
                  >
                    Withdraw
                  </Link>
                  <button
                    className="bg-[#16828A] shadow-button w-full max-w-[305px] py-4 px-10 font-arcade text-shadow-deposit text-2xl"
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
