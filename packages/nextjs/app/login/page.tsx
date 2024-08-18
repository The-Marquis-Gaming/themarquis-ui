"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useLogin from "~~/utils/api/hooks/useLogin";
import { useQueryClient } from "@tanstack/react-query";

function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleLoginSuccess = (data: any) => {
    queryClient.setQueryData(["userEmail"], email);
    console.log("Login successful", data);
    router.push("/login/verification");
  };

  const handleLoginFailed = (error: any) => {
    console.log("Login failed", error);
  };

  const { mutate: login } = useLogin(handleLoginSuccess, handleLoginFailed);

  const handleLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    login({
      email: email ?? "",
      password: "LZGTSLJI",
    });
  };
  return (
    <div className="font-monserrat">
      <div
        className="flex flex-col py-8 px-12 gap-4 md:gap-4 h-screen justify-center center-screen font-screen"
        style={{
          backgroundImage: `url(/bg-transparent.svg)`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="text-4xl font-medium font-screen title-screen">
          <span>WELCOME</span>
          <span className="text-gradient"> BACK !</span>
        </div>
        <span className="text-[#CACACA]">
          Use your credential below and login to your account
        </span>
        <div className="bg-[#21262B] w-[400px] h-[111px] flex flex-col p-4 gap-4 rounded-[8px] input-container input-screen">
          <span>Email</span>
          <input
            type="text"
            placeholder="example@gmail.com"
            className="bg-transparent focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>

        <div className="flex flex-col justify-start gap-2">
          <span className="py-4">
            Don’t have an account?
            <Link href="/signup" className="text-[#00ECFF]">
              {" "}
              Sign up here.
            </Link>
          </span>
          <div className="flex gap-4">
            <input type="checkbox" className="lg:w-4"></input>
            <span>Remember me</span>
          </div>
        </div>
        <button
          className="shadow-button w-[260px] py-4 px-7 mt-6 font-arcade text-shadow-deposit text-2xl"
          onClick={handleLogin}
          disabled={loading}
        >
          NEXT
        </button>
      </div>
    </div>
  );
}

export default Page;
