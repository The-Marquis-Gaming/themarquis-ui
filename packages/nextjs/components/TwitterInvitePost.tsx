import Image from "next/image";
import { useSearchParams } from "next/navigation";
import QRCode from "qrcode";
import { useCallback, useEffect, useRef } from "react";
import useGetUserInfo from "~~/utils/api/hooks/useGetUserInfo";
import { makePrivateEmail } from "~~/utils/ConvertData";
import { notification } from "~~/utils/scaffold-stark";
import BackgroundGradient from "./BackgroundGradient";

export default function TwitterInvitePost() {
  const { data }: any = useGetUserInfo();
  const imageRef = useRef<HTMLImageElement | null>(null);
  const baseUrl = window.location.origin;
  const codeInvitation = `${baseUrl}/signup${data?.code ? `?referralcode=${data?.code}` : ""}`;
  const searchParams = useSearchParams();

  const copyToClipboard = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text).then(
        () => {
          notification.success("Coppied successfully");
        },
        (err) => {
          console.error("Failed to copy: ", err);
        },
      );
    }
  };

  const generateQRCode = useCallback(async () => {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(codeInvitation);
      if (imageRef.current) {
        imageRef.current.src = qrCodeDataURL;
      }
    } catch (err) {
      console.error("Failed to generate QR code:", err);
    }
  }, [codeInvitation]);

  useEffect(() => {
    if (codeInvitation) {
      generateQRCode();
    }
  }, [codeInvitation, generateQRCode]);

  return (
    <div className="h-screen">
      <div className="flex justify-center items-center h-full">
        <BackgroundGradient />
        <div className="w-full px-6 max-w-[843px]">
          <div className="flex justify-between items-start gap-[80px]">
            <div className="flex flex-col items-center h-full justify-between">
              <div className="flex items-center gap-7 mb-[26px]">
                <Image
                  src={"/avatar_twitter_post.svg"}
                  width={46}
                  height={46}
                  className="rounded-full"
                  alt="avatar"
                />
                <p className="text-[20px]">
                  {makePrivateEmail(
                    data?.user?.email
                      ? data?.user?.email
                      : searchParams.get("email"),
                  )}
                </p>
              </div>
              <p className="font-bold sm:text-[24px] text-[20px]">
                Has Invited You To Sign Up On
              </p>
              <Image
                onClick={() => (window.location.href = "/")}
                src={"/logo-marquis.svg"}
                width={480}
                height={135}
                className="cursor-pointer my-12"
                alt="logo"
              />
              <div>
                <p
                  className="text-[20px] text-center text-gradient mb-4 mt-5"
                  style={{ fontWeight: 400 }}
                >
                  Available On
                </p>
                <div className="flex gap-5">
                  <Image
                    src="/appStore.svg"
                    width={100}
                    height={100}
                    className="h-[38px] w-auto"
                    alt="appstore"
                  />
                  <Image
                    src="/google.svg"
                    width={100}
                    height={100}
                    className="h-[38px] w-auto"
                    alt="googleplay"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center w-full sm:w-auto sm:mt-0 mt-4">
              <div>
                <p className="text-[#F3F3F3] text-[20px] text-center mb-[2px]">
                  Referral Code
                </p>
                <div className="bg-[#363D43] w-[264px] h-[60px] flex items-center justify-between py-1 px-6 rounded-[8px]">
                  <p className="text-[24px]">
                    {data?.referral_code
                      ? data?.referral_code
                      : searchParams.get("referralcode")}
                  </p>
                  <Image
                    src="/copy.svg"
                    alt="copy"
                    width={100}
                    height={100}
                    onClick={() => copyToClipboard(data?.referral_code)}
                    style={{ cursor: "pointer", width: "30px", height: "30px" }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 my-[30px]">
                <hr className="h-[1px] w-[30px] bg-[#919191]" />
                <p className="text-[#919191] text-[20px] ">
                  Or Scan to Sign Up
                </p>
                <hr className="h-[1px] w-[30px] bg-[#919191]" />
              </div>
              <p className="text-[20px] text-center mb-1">QR Code</p>
              <Image
                src={""}
                alt="qr_code"
                width={100}
                height={100}
                className="sm:w-[200px] sm:h-[200px] w-[100px] h-[100px]"
                ref={imageRef}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
