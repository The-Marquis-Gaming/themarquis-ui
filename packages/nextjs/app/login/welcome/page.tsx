"use client";
import { useEffect, useState } from "react";
import Invitation from "~~/components/invitation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useGetUserInfo from "~~/utils/api/hooks/useGetUserInfo";
import { useQueryClient } from "@tanstack/react-query";
import BackgroundLogin from "~~/components/BackgroundLogin";
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
      setIsMobile(window.innerWidth < 1560);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="!font-montserrat lg:max-w-full mx-auto md:mx-28 xl:mx-0">
      <div
        className={`flex flex-col justify-center max-[375px]:pt-2 min-[540px]:pt-2 pt-16 lg:pt-10 px-2 lg:px-6 xl:px-0 gap-4`}
      >
        <div className="hidden xl:block">
          <BackgroundLogin />
        </div>
        <div className="block xl:hidden">
          <BackgroundGradient />
        </div>
        <div className="flex flex-col min-[1560px]:flex-row justify-center xl:justify-between items-center max-w-[1700px] mx-auto relative z-40 w-full">
          <div className="flex gap-2 flex-col w-full sm:h-fit h-[400px] justify-between lg:max-w-[637px] items-center">
            <div className="xl:flex xl:flex-col items-center max-[1560px]:text-center">
              <div className="min-[1560px]:text-3xl lg:text-2xl uppercase !font-montserrat font-bold text-[16px]">
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
              className={`flex lg:max-w-full min-[540px]:mt-2 md:flex-row flex-col  max-[1560px]:mt-8 mt-20 w-full  ${isMobile ? "gap-4  md:justify-between justify-center" : "gap-8 lg:justify-center max-w-80"}`}
            >
              {isMobile ? (
                <>
                  <Link
                    className="shadow-button w-full py-3 px-10 font-arcade text-shadow-deposit text-xl text-center"
                    href="/"
                  >
                    MAIN
                  </Link>
                  <button className="bg-[#16828A] w-full shadow-button py-3 px-10 font-arcade text-shadow-deposit text-xl text-center">
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
