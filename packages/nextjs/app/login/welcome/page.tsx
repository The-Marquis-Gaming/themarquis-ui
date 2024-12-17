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
      setIsMobile(window.innerWidth < 1280);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="min-h-[82vh] grid min-[1260px]:flex min-[1260px]:items-center place-items-center !font-montserrat lg:max-w-full mx-auto md:w-3/5 xl:w-full xl:mx-0 xl:px-8 pb-10">
      <div
        className={`flex flex-col justify-center py-2 px-4 lg:px-6 xl:px-0 gap-4 md:w-full`}
      >
        <div className="hidden xl:block">
          <BackgroundLogin />
        </div>
        <div className="block xl:hidden">
          <BackgroundGradient />
        </div>
        <div className="flex flex-col xl:flex-row xl:gap-6 min-[1560px]:flex-row justify-center xl:justify-between items-center lg:max-w-[1700px] mx-auto relative z-40 w-full">
          <div className="flex gap-6 xl:gap-2 flex-col w-full xl:w-1/2 sm:h-fit justify-between  items-center">
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
                    Home
                  </Link>
                  <button className="bg-[#16828A] w-full shadow-button py-3 px-10 font-arcade text-shadow-deposit text-xl text-center">
                    Deposit
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
            <div className="w-full xl:w-1/2">
              <Invitation />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Page;
