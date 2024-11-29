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
      const qrCodeDataURL = await QRCode.toDataURL(codeInvitation, {
        color: {
          dark: "#FFFFFF",
          light: "#00000000",
        },
      });
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
      <div className="flex justify-center items-center h-full  ">
        <div className="hidden md:block">
          <BackgroundGradient />
        </div>
        <div className="w-full px-6 max-w-[1080px]">
          <div className="flex flex-col md:flex-row justify-between items-start gap-[80px]">
            <div className="flex flex-col items-center pt-44 md:pt-0 h-full justify-between">
              <Image
                onClick={() => (window.location.href = "/")}
                src={"/logo-marquis.svg"}
                width={480}
                height={135}
                className="block md:hidden cursor-pointer my-12"
                alt="logo"
              />
              <div className="flex items-center gap-7 mb-[26px]">
                <p className="font-montserrat text-center font-[600] text-[36px]">
                  JOIN NOW!
                </p>
                <p className="text-[20px]">
                  {makePrivateEmail(
                    data?.user?.email
                      ? data?.user?.email
                      : searchParams.get("email"),
                  )}
                </p>
              </div>
              <p className="font-[200] text-center font-montserrat sm:text-[24px] text-[20px]">
                You can sign up with the referral code or the QR code
              </p>
              <Image
                onClick={() => (window.location.href = "/")}
                src={"/logo-marquis.svg"}
                width={480}
                height={135}
                className="hidden md:block cursor-pointer my-12"
                alt="logo"
              />
              <div className="hidden md:block ">
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
                <p className="text-[#F3F3F3] text-[20px] text-center mb-[2px] font-[200] font-montserrat">
                  Referral Code
                </p>
                <div className="bg-[#363D43] w-[264px] h-[60px] flex items-center justify-between py-1 px-6 rounded-[8px]">
                  <p className="text-[24px] font-[200] font-montserrat">
                    {data?.referral_code
                      ? data?.referral_code
                      : searchParams.get("referralcode")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 my-[30px]"></div>
              <p className="text-[20px] text-center mb-1 font-[200] font-montserrat">
                QR Code
              </p>
              <Image
                src={""}
                alt="qr_code"
                width={100}
                height={100}
                className="w-[264px] h-[264px]"
                ref={imageRef}
              />
              <div className="block md:hidden mb-14">
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
          </div>
        </div>
      </div>
    </div>
  );
}
