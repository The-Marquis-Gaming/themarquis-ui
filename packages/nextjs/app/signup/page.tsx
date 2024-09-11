"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useSignup from "~~/utils/api/hooks/useSignup";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const referralCodeFromUrl = params.get("referralcode");

    if (referralCodeFromUrl) {
      setReferralCode(referralCodeFromUrl);
    }
  }, []);

  const handleSignupSuccess = (data: any) => {
    queryClient.setQueryData(["userEmail"], email);
    console.log("success", data);
    router.push("/signup/verification");
  };

  const handleSubscribeFailed = (error: any) => {
    console.log(error);
    setErrorMessage(error.response.data.message);
  };

  const { mutate: signup } = useSignup(
    handleSignupSuccess,
    handleSubscribeFailed
  );

  const handleSignup = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!email.includes("@")) {
      setErrorMessage("Invalid email address. Please include '@'.");
      return;
    }

    setErrorMessage("");

    signup({
      email: email,
      referral_code: referralCode,
    });
  };

  return (
    <div className="font-monserrat">
      <div
        className="flex flex-col py-8 px-12 h-screen-minus-80 justify-center"
        style={{
          backgroundImage: `url(/bg-transparent.svg)`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-[1700px] w-full mx-auto flex flex-col justify-center h-full max-h-[600px]">
          <div>
            <div className="text-4xl font-bold font-monserrat title-screen">
              <span>WELCOME</span>
              <span className="text-[#00ECFF] text-gradient">
                THE MARQUIS!
              </span>
            </div>
            <span className="text-[#CACACA]">
              Use your credentials below and sign up to your account
            </span>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-5">
            <div className="bg-[#21262B] flex flex-col p-4 gap-4 rounded-[8px] max-w-[650px]">
              <span>Email</span>
              <input
                type="text"
                placeholder="example@gmail.com"
                className="bg-transparent focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </div>
            <div className="bg-[#21262B] flex flex-col p-4 gap-4 rounded-[8px] max-w-[650px]">
              <span>Referral Code</span>
              <input
                type="text"
                placeholder="12DE45KK"
                className="bg-transparent focus:outline-none"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
              ></input>
            </div>
          </div>

          {errorMessage && (
            <div className="flex gap-4 text-red-500 mt-2 text-center border border-[#662020] px-4 font-monserrat bg-alert w-full md:w-[400px]">
              <Image src="/alert.svg" alt="icon" width={40} height={45}></Image>
              <span className="py-2">{errorMessage}</span>
            </div>
          )}

          <div className="flex flex-col justify-start md:text-left gap-4">
            <span>
              Already have an account?
              <Link href="/login" className="text-[#00ECFF]">
                {" "}
                Login here.
              </Link>
            </span>
            <div className="flex gap-4 md:justify-start">
              <input type="checkbox" className="lg:w-4"></input>
              <span>Remember me</span>
            </div>
          </div>
          <button
            className="shadow-button w-full md:max-w-[250px] max-w-auto py-4 px-7 mt-[70px] font-arcade text-shadow-deposit text-2xl font-screen"
            onClick={handleSignup}
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;
