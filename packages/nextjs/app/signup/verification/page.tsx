"use client";
import OTPInput from "~~/components/verification";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import useVerification from "~~/utils/api/hooks/useVerification";
import { useQueryClient } from "@tanstack/react-query";
import useResend from "~~/utils/api/hooks/useResend";
import { makePrivateEmail } from "~~/utils/ConvertData";
import { notification } from "~~/utils/scaffold-stark/notification";
import { setCookie } from "cookies-next";
import BackgroundGradient from "~~/components/BackgroundGradient";

function Page() {
  const [otpCode, setOtpCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);
  const router = useRouter();

  const queryClient = useQueryClient();
  const email = queryClient.getQueryData<string>(["userEmail"]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleOtpComplete = async (otp: string): Promise<void> => {
    setOtpCode(otp);
    handleVerification(otp);
  };

  const handleVerificationSuccess = (data: any) => {
    queryClient.setQueryData(["accessToken"], data.data.access_token);
    setCookie("accessToken", data.data.access_token);
    queryClient.invalidateQueries({ refetchType: "active" });
    setLoading(false);
    router.push("/signup/welcome");
  };

  const handleVerificationFailed = (error: any) => {
    setLoading(false);
    notification.error(error.response.data.message);
    setOtpCode("");
  };

  const handleResendSuccess = (data: any) => {
    setOtpCode("");
    setTimer(30);
    setCanResend(false);
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
    event.preventDefault();
    if (canResend) {
      resend({
        email: email ?? "",
      });
    }
  };

  return (
    <div className="font-monserrat">
      <div className="flex flex-col py-8 px-12 gap-4 h-screen-minus-80 justify-center">
        <BackgroundGradient />
        <div className="flex flex-col max-w-[1700px] relative z-50 mx-auto w-full h-full max-h-[500px] mb-[100px]">
          <div>
            <div className="text-3xl font-bold title-screen mb-1">
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
              <button
                className={`text-[#00ECFF] w-[200px] cursor-pointer mb-7 ${
                  !canResend ? "text-[#C1C1C1] cursor-auto" : ""
                }`}
                onClick={handleResend}
                disabled={!canResend}
              >
                {canResend ? "Resend" : `Resend in ${timer}s`}
              </button>
            </div>
          </div>
          <div className="button-flow-login">
            <button
              className="shadow-button w-[245px] h-[55px] font-arcade text-shadow-deposit text-2xl"
              onClick={() => handleVerification(otpCode)}
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
