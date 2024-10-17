"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useSignup from "~~/utils/api/hooks/useSignup";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import BackgroundGradient from "~~/components/BackgroundGradient";
import LoadingTextButton from "~~/components/LoadingTextButton/LoadingTextButton";

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
      setErrorMessage("Invalid email address. Please include '@'.");
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
    <div className="font-monserrat">
      <div className="flex flex-col sm:p-12 p-4 pt-12">
        <BackgroundGradient />
        <div className="max-w-[1700px] w-full mx-auto relative z-50 flex flex-col justify-center h-full">
          <div>
            <div className="sm:text-4xl font-medium text-[16px] mb-[10px]">
              <span>WELCOME TO</span>
              <span className="text-[#00ECFF] text-gradient">
                {" "}
                THE MARQUIS!
              </span>
            </div>
            <span className="text-[#CACACA] text-[14px] sm:text-[20px]">
              Enter your email and referral code to register.
            </span>
          </div>
          <div className="flex flex-col justify-center gap-[24px] mt-[80px]">
            <div className="bg-[#21262B] flex flex-col p-4 gap-4 rounded-[8px] max-w-[650px]">
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
            <div className="flex gap-4 text-red-500 text-center border border-[#662020] px-4 font-monserrat bg-alert w-full max-w-[650px] mb-5 py-4 mt-4">
              <Image src="/alert.svg" alt="icon" width={40} height={45}></Image>
              <span className="py-2">{errorMessage}</span>
            </div>
          )}

          <div className="flex flex-col justify-start md:text-left gap-4 text-sm sm:text-lg mt-[100px]">
            <span className="text-gray">
              Already have an account?
              <Link href="/login" className="text-gradient font-monserrat">
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
                  "NEXT"
                )}
              </button>
            ) : (
              <button
                className={` mt-[70px] cursor-not-allowed font-arcade btn-login-flow-unactive`}
                disabled={true}
              >
                NEXT
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
