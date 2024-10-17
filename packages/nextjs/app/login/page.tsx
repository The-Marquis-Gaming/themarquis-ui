"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useLogin from "~~/utils/api/hooks/useLogin";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import BackgroundGradient from "~~/components/BackgroundGradient";
import LoadingTextButton from "~~/components/LoadingTextButton/LoadingTextButton";

function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleLoginSuccess = () => {
    // setLoading(false);
    queryClient.setQueryData(["userEmail"], email);
    queryClient.invalidateQueries({
      refetchType: "active",
    });
    router.push("/login/verification");
  };

  const handleLoginFailed = (error: any) => {
    setErrorMessage(error.response.data.message);
    setLoading(false);
  };

  const { mutate: login } = useLogin(handleLoginSuccess, handleLoginFailed);

  const handleLogin = () => {
    if (!email.includes("@")) {
      setErrorMessage("Invalid email address. Please include '@'.");
      return;
    }
    setErrorMessage("");
    setLoading(true);
    login({
      email: email,
      // password: "LZGTSLJI",
    });
  };

  useEffect(() => {
    const savedSuggestions = localStorage.getItem("emailSuggestions");
    if (savedSuggestions) {
      setSuggestions(JSON.parse(savedSuggestions));
    }
  }, []);

  return (
    <div className="font-monserrat">
      <div className="sm:p-12 p-4 pt-12">
        <BackgroundGradient />
        <div className="max-w-[1700px] relative z-50 mx-auto flex flex-col mt-[40px] sm:mt-0">
          <div>
            <div className="sm:text-4xl font-medium text-[16px] mb-[10px]">
              <span>WELCOME</span>
              <span className="text-gradient"> BACK !</span>
            </div>
            <span className="text-[#CACACA] text-[14px] sm:text-[20px]">
              Use your credential below and login to your account
            </span>
          </div>
          <div className="flex flex-col justify-between sm:justify-start mt-[80px]">
            <div>
              <div className="bg-[#21262B] flex flex-col p-4 gap-4 rounded-[8px] max-w-[650px] w-full">
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
              {errorMessage && (
                <div className="flex gap-4 text-red-500 mt-4 text-center border border-[#662020] p-4 font-monserrat bg-alert w-full max-w-[650px]">
                  <Image
                    src="/alert.svg"
                    alt="icon"
                    width={40}
                    height={45}
                  ></Image>
                  <span className="py-2">{errorMessage}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col justify-start gap-2">
              <span className="py-4 text-gray">
                Don’t have an account?
                <Link href="/signup" className="text-gradient font-monserrat">
                  {" "}
                  Sign up
                </Link>
              </span>
              {/* <div className="flex gap-4">
                <input type="checkbox" className="lg:w-4"></input>
                <span className="text-gray">Remember me</span>
              </div> */}
            </div>
          </div>
          <div className="button-flow-login mt-[146px]">
            {email ? (
              <button
                className={`w-[245px] py-3 px-7 mt-6 font-arcade btn-login-flow-active`}
                onClick={handleLogin}
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
                className={`w-[245px] py-3 px-7 mt-6 cursor-not-allowed font-arcade btn-login-flow-unactive`}
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
