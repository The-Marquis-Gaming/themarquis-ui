"use client";
import OTPInput from "~~/components/verification";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useVerification from "~~/utils/api/hooks/useVerification";
import { useQueryClient } from "@tanstack/react-query";
import useResend from "~~/utils/api/hooks/useResend";
import { makePrivateEmail } from "~~/utils/convertData";

function Page() {
  const [otpCode, setOtpCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const queryClient = useQueryClient();
  const email = queryClient.getQueryData<string>(["userEmail"]);

  const handleOtpComplete = (otp: string) => {
    setOtpCode(otp);
  };

  const handleVerificationSuccess = (data: any) => {
    queryClient.setQueryData(["accessToken"], data.data.access_token);
    localStorage.setItem('token', data.data.access_token)
    queryClient.invalidateQueries({ refetchType: "active" });
    setLoading(false);
    router.push("/login/welcome");
  };

  const handleVerificationFailed = (error: any) => {
    console.log(error);
    queryClient.invalidateQueries({ refetchType: "active" });
    setLoading(false);
  };

  const handleResendSuccess = (data: any) => {
    console.log("success", data);
  };

  const handleResendFailed = (error: any) => {
    console.log(error);
  };

  const { mutate: verification } = useVerification(
    handleVerificationSuccess,
    handleVerificationFailed,
  );

  const { mutate: resend } = useResend(handleResendSuccess, handleResendFailed);

  const handleVerification = () => {
    setLoading(true);
    console.log(email);
    verification({
      email: email ?? "",
      code: otpCode ?? "",
    });
  };

  const handleResend = (event: React.MouseEvent<HTMLButtonElement>) => {
    resend({
      email: email ?? "",
    });
  };

  return (
    <div className="font-monserrat">
      <div
        className="flex flex-col py-8 px-12 gap-4 md:gap-4 h-screen justify-center center-screen pt-24 font-screen"
        style={{
          backgroundImage: `url(/bg-transparent.svg)`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          justifyContent: "center",
        }}
      >
        <div className="flex flex-col p-6">
          <div className="text-3xl font-bold title-screen">
            <span>WELCOME TO </span>
            <span className="text-gradient"> THE MARQUIS !</span>
          </div>
          <span className="text-[#CACACA] text-xl py-4 font-screen">
            Verification code has been sent to your email <span>{makePrivateEmail(email ?? '')}</span>
          </span>
        </div>
        <OTPInput onOtpComplete={handleOtpComplete} />
        <span
          className="text-[#00ECFF] w-[200px] pl-6 cursor-pointer"
          onClick={handleResend}
        >
          Resend
        </span>
        <div className="pl-6">
          <button
            className="shadow-button my-10 py-5 px-16 font-arcade text-shadow-deposit text-2xl font-screen"
            onClick={handleVerification}
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;
