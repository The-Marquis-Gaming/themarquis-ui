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
      setIsMobile(window.innerWidth < 1025);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="!font-monserrat">
      <div className="flex flex-col justify-center max-[375px]:pt-2 min-[540px]:pt-4 pt-16 px-2 md:px-6 lg:px-0 gap-4">
        <div className="">
          <BackgroundLogin />
        </div>
        <div className="flex flex-col lg:flex-row justify-center xl:justify-between items-center max-w-[1700px] mx-auto relative z-40 w-full">
          <div className="flex gap-2 flex-col w-full sm:h-fit h-[400px] justify-between max-w-[800px] items-center">
            <div className="xl:flex xl:flex-col items-center">
              <div className="sm:text-4xl !font-monserrat font-bold text-[18px]">
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
              className={`flex max-[375px]:mt-2 min-[540px]:mt-2 mt-8 lg:mt-20 w-full  ${isMobile ? "flex-col max-[375px]:gap-2 gap-4 justify-center" : "gap-8 justify-center"}`}
            >
              {isMobile ? (
                <>
                  <Link
                    className="shadow-button  max-[375px]:py-2 py-4 px-10 font-arcade text-shadow-deposit text-xl text-center"
                    href="/"
                  >
                    MAIN
                  </Link>
                  <button className="bg-[#16828A] shadow-button max-[375px]:py-2 py-4 px-10 font-arcade text-shadow-deposit text-xl text-center">
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
