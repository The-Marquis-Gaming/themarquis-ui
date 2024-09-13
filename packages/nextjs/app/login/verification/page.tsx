"use client";
import OTPInput from "~~/components/verification";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useVerification from "~~/utils/api/hooks/useVerification";
import { useQueryClient } from "@tanstack/react-query";
import useResend from "~~/utils/api/hooks/useResend";
import { makePrivateEmail } from "~~/utils/convertData";
import { setCookie } from "cookies-next";
import { notification } from "~~/utils/scaffold-stark/notification";

function Page() {
  const [otpCode, setOtpCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const queryClient = useQueryClient();
  const email = queryClient.getQueryData<string>(["userEmail"]);

  const handleOtpComplete = async (otp: string): Promise<void> => {
    setOtpCode(otp);
    handleVerification(otp);
  };

  const handleVerificationSuccess = (data: any) => {
    queryClient.setQueryData(["accessToken"], data.data.access_token);
    setCookie("accessToken", data.data.access_token);
    queryClient.invalidateQueries({ refetchType: "active" });
    setLoading(false);
    router.push("/login/welcome");
  };

  const handleVerificationFailed = (error: any) => {
    queryClient.invalidateQueries({ refetchType: "active" });
    setLoading(false);
    notification.error(error.response.data.message);
    setOtpCode("");
  };

  const handleResendSuccess = (data: any) => {
    console.log("success", data);
    setOtpCode("");
  };

  const handleResendFailed = (error: any) => {
    notification.error(error.response.data.message);
  };

  const { mutate: verification } = useVerification(
    handleVerificationSuccess,
    handleVerificationFailed,
  );

  const { mutate: resend } = useResend(handleResendSuccess, handleResendFailed);

  const handleVerification = async (otp: string) => {
    setLoading(true);
    verification({
      email: email ?? "",
      code: otp ?? otpCode,
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
            <div className="sm:text-3xl font-bold text-[16px] mb-1">
              <span>WELCOME TO </span>
              <span className="text-gradient"> THE MARQUIS !</span>
            </div>
            <span className="text-[#CACACA] sm:text-[20px] text-[14px]">
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
              onClick={() => handleVerification(otpCode)}
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
