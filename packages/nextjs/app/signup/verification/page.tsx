"use client";
import OTPInput from "~~/components/verification";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useVerification from "~~/utils/api/hooks/useVerification";
import { useQueryClient } from "@tanstack/react-query";
import useResend from "~~/utils/api/hooks/useResend";
import { makePrivateEmail } from "~~/utils/convertData";
import { notification } from "~~/utils/scaffold-stark/notification";

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
    setLoading(false);
    router.push("/signup/welcome");
  };

  const handleVerificationFailed = (error: any) => {
    setLoading(false);
    notification.error(error.response.data.message);
  };

  const handleResendSuccess = (data: any) => {
    console.log("success", data);
  };

  const handleResendFailed = (error: any) => {
    notification.error(error.response.data.message);
  };

  const { mutate: verification } = useVerification(
    handleVerificationSuccess,
    handleVerificationFailed,
  );

  const { mutate: resend } = useResend(handleResendSuccess, handleResendFailed);

  const handleVerification = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLoading(true);

    verification({
      email: email ?? "",
      code: otpCode ?? "",
    });
  };

  const handleResend = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    resend({
      email: email ?? "",
    });
  };

  return (
    <div className="font-monserrat">
      <div
        className="flex flex-col py-8 px-12 gap-4 h-screen-minus-80 justify-center"
        style={{
          backgroundImage: `url(/bg-transparent.svg)`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex flex-col max-w-[1700px] mx-auto w-full h-full max-h-[500px] mb-[100px]">
          <div>
            <div className="text-3xl font-bold title-screen">
              <span>WELCOME TO </span>
              <span className="text-gradient"> THE MARQUIS !</span>
            </div>
            <span className="text-[#CACACA] xs:text-xl text-sm">
              Verification code has been sent to your email{" "}
              <span>{makePrivateEmail(email ?? "")}</span>
            </span>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-end flex-wrap gap-10">
              <OTPInput onOtpComplete={handleOtpComplete} />
              <span
                className="text-[#00ECFF] w-[200px] cursor-pointer mb-7"
                onClick={handleResend}
              >
                Resend
              </span>
            </div>
          </div>
          <div className="button-flow-login">
            <button
              className="shadow-button w-[245px] h-[55px] font-arcade text-shadow-deposit text-2xl"
              onClick={handleVerification}
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
