"use client";
import { useEffect, useState } from "react";
import Invitation from "~~/components/invitation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useGetUserInfo from "~~/utils/api/hooks/useGetUserInfo";
import { useQueryClient } from "@tanstack/react-query";

function Page() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useGetUserInfo();

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

  const getFirstNameFromEmail = (email: string) => {
    return email.split("@")[0];
  };

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
        <div className="flex justify-between items-center justify-screen">
          <div className="flex gap-2 flex-col font-screen">
            <span className="font-bold text-3xl title-screen">
              WELCOME BACK,{" "}
              {data && data.email ? getFirstNameFromEmail(data.email) : "USER"}
            </span>
            <span className="text-xl text-[#CACACA] font-screen">
              Nice to see you again
            </span>
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
                    className="shadow-button py-4 px-10 font-arcade text-shadow-deposit text-2xl font-screen"
                    href={"/"}
                  >
                    Home
                  </Link>
                  <button
                    className="bg-[#16828A] shadow-button py-4 px-10 font-arcade text-shadow-deposit text-2xl font-screen"
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
