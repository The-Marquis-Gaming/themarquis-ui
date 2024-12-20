"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useSignup from "~~/utils/api/hooks/useSignup";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import BackgroundLogin from "~~/components/BackgroundLogin";
import LoadingTextButton from "~~/components/LoadingTextButton/LoadingTextButton";
import BackgroundGradient from "~~/components/BackgroundGradient";

function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const queryClient = useQueryClient();
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleInputBlur = () => {
    if (email && !suggestions.includes(email)) {
      const updatedSuggestions = [...suggestions, email];
      setSuggestions(updatedSuggestions);
      localStorage.setItem(
        "emailSuggestions",
        JSON.stringify(updatedSuggestions),
      );
    }
  };

  const handleSignupSuccess = (data: any) => {
    queryClient.setQueryData(["userEmail"], email);
    setLoading(false);
    router.push("/signup/verification");
  };

  const handleSubscribeFailed = (error: any) => {
    setLoading(false);
    setErrorMessage(error.response.data.message);
  };

  const { mutate: signup } = useSignup(
    handleSignupSuccess,
    handleSubscribeFailed,
  );

  const handleSignup = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!email.includes("@")) {
      setErrorMessage("Invalid Email");
      return;
    }
    setLoading(true);
    setErrorMessage("");

    signup({
      email: email,
      referral_code: referralCode,
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const referralCodeFromUrl = params.get("referralcode");

    if (referralCodeFromUrl) {
      setReferralCode(referralCodeFromUrl);
    }
  }, []);

  useEffect(() => {
    const savedSuggestions = localStorage.getItem("emailSuggestions");
    if (savedSuggestions) {
      setSuggestions(JSON.parse(savedSuggestions));
    }
  }, []);

  return (
    <div className="font-montserrat">
      <div className="flex flex-col sm:p-12 p-4 pt-12">
        <div className="hidden xl:block">
          <BackgroundLogin />
        </div>
        <div className="block xl:hidden">
          <BackgroundGradient />
        </div>
        <div className="max-w-[644px] w-full relative z-50 flex flex-col justify-center h-full mt-[40px] sm:mt-0">
          <div>
            <div className="sm:text-4xl font-bold text-[16px] mb-[10px]">
              <span>WELCOME TO</span>
              <span className="text-[#00ECFF] text-gradient">
                {" "}
                THE MARQUIS!
              </span>
            </div>
            <span className="text-[#CACACA] text-[14px] sm:text-[20px] font-[200]">
              Enter your email and referral code to register.
            </span>
          </div>
          <div className="flex flex-col justify-center gap-[24px] mt-[30px]">
            <div className="bg-[#21262B] flex flex-col p-4 gap-4 rounded-[8px]">
              <span>Email</span>
              <input
                list="suggestions"
                type="text"
                placeholder="example@gmail.com"
                className="bg-transparent focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleInputBlur}
              ></input>
              <datalist id="suggestions">
                {suggestions.map((suggestion, index) => (
                  <option key={index} value={suggestion} />
                ))}
              </datalist>
            </div>
            <div className="bg-[#21262B] flex flex-col p-4 gap-4 rounded-[8px]">
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
            <div className="flex items-center gap-42 text-red-500 text-center border border-[#662020] px-4 bg-alert w-full mb-5 py-2 mt-4 animate-[show_0.3s_linear_1]">
              <Image src="/alert.svg" alt="icon" width={40} height={45}></Image>
              <span className="text-[14px] font-[400] py-2">
                {errorMessage}
              </span>
            </div>
          )}

          <div className="flex flex-col justify-start md:text-left gap-4 text-sm sm:text-lg mt-2">
            <span className="text-gray !font-[200] !font-montserrat">
              Already have an account?
              <Link
                href="/login"
                className="text-[#0DECF8] font-semibold"
              >
                {" "}
                Login
              </Link>
            </span>
            {/* <div className="flex gap-4 md:justify-start">
              <input type="checkbox" className="lg:w-4"></input>
              <span className="text-gray">Remember me</span>
            </div> */}
          </div>
          <div className="button-flow-login">
            {email && referralCode ? (
              <button
                className={` mt-[70px] font-arcade btn-login-flow-active`}
                onClick={handleSignup}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-end gap-2 justify-center">
                    <p>Loading</p>{" "}
                    <div className="mb-2">
                      <LoadingTextButton color="fff" />
                    </div>
                  </div>
                ) : (
                  "GET CODE"
                )}
              </button>
            ) : (
              <button
                className={` mt-[70px] cursor-not-allowed font-arcade btn-login-flow-unactive`}
                disabled={true}
              >
                GET CODE
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
