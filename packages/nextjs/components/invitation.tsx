import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import useReferralCode from "~~/utils/api/hooks/useReferralCode";
import { chooseAppToShare, shareToTwitter } from "~~/utils/ShareSocial";
import QRCode from "qrcode";
import { notification } from "~~/utils/scaffold-stark/notification";
import useGetUserInfo from "~~/utils/api/hooks/useGetUserInfo";

function Invitation() {
  const queryClient = useQueryClient();
  const { data }: any = useReferralCode();
  const imageRef = useRef<HTMLImageElement | null>(null);
  const searchParams = useSearchParams();
  const { data: userInfo } = useGetUserInfo();
  const baseUrl = window.location.origin;

  const referralcode_pathName = searchParams.get("referralcode");

  if (referralcode_pathName) {
    queryClient.setQueryData(["codeUrl"], referralcode_pathName);
  }

  const codeInvitation = `${baseUrl}/signup${data?.code ? `?referralcode=${data?.code}` : ""}`;

  const handleDownloadQRCode = () => {
    if (imageRef.current) {
      const link = document.createElement("a");
      link.href = imageRef.current.src;
      link.download = "qr_code.png";
      link.click();
    }
  };

  const copyToClipboard = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text).then(
        () => {
          notification.success("Coppied successfully");
        },
        (err) => {
          console.error("Failed to copy: ", err);
        }
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
    <div className="w-full xl:w-4/5 mx-auto max-w-[700px] min-[1560px]:mr-28 lg:h-[630px] bg-[#21262B] lg:rounded-[32px] 2xl:rounded-[48px] flex flex-col gap-3 lg:gap-4 2xl:gap-7 p-6 md:p-8 lg:px-8 lg:py-8 2xl:px-[55px] 2xl:py-[55px] xl:justify-center items-center !h-full modal-container font-montserrat">
      <p className="md:text-base lg:text-lg 2xl:text-2xl text-[14px] font-[400]">
        Invite Friend To Sign Up
      </p>
      <Image
        src={""}
        alt="qr_code"
        width={100}
        height={100}
        className="w-24 h-24 md:w-40 md:h-40 xl:w-[160px] xl:h-[160px] 2xl:w-[200px] 2xl:h-[200px]"
        ref={imageRef}
      />
      <div className="flex flex-col gap-2 lg:gap-3 w-full justify-center items-center">
        <div className="bg-[#363D43] h-[40px] lg:h-full px-3 lg:px-4 py-2 lg:py-3 2xl:py-[18px] rounded-[5px] flex items-center justify-between lg:gap-16 text-xs w-full">
          <div className="flex gap-2 2xl:gap-3 items-center 2xl:text-[20px]">
            <span className="text-[#919191] whitespace-nowrap w-[80px] lg:w-[100px] 2xl:w-[120px] 2xl:pl-2  font-light text-[12px] lg:text-sm 2xl:text-base">
              Referral Code
            </span>
            <span className="truncate overflow-hidden whitespace-nowrap font-light text-[12px] lg:text-sm 2xl:text-base">
              {data?.code}
            </span>
          </div>
          <Image
            src="/copy.svg"
            alt="copy"
            width={100}
            height={100}
            onClick={() => copyToClipboard(data?.code)}
            style={{ cursor: "pointer", width: "14px", height: "14px" }}
          />
        </div>
        <div className="bg-[#363D43] h-[40px] lg:h-full rounded-[5px] px-3 lg:px-4 py-2 lg:py-3 2xl:py-[18px] flex items-center justify-between text-xs w-full">
          <div className="flex items-center gap-2 2xl:gap-3 lg:text-[20px]">
            <p className="text-[#919191] w-[80px] lg:w-[100px] 2xl:w-[120px] 2xl:pl-2 font-montserrat font-light text-[12px] lg:text-sm 2xl:text-base">
              Referral Link
            </p>
            <p className="truncate overflow-hidden max-w-[150px] md:max-w-full whitespace-nowrap font-montserrat font-[100] text-[12px] lg:text-sm 2xl:text-base">
              {codeInvitation}
            </p>
          </div>
          <Image
            src="/copy.svg"
            alt="copy"
            width={100}
            height={100}
            onClick={() => copyToClipboard(codeInvitation)}
            style={{ cursor: "pointer", width: "14px", height: "14px" }}
          />
        </div>
      </div>
      <div className="flex gap-3 lg:gap-6 mt-4 font-montserrat font-[200]">
        <div
          className="flex flex-col justify-center items-center text-[10px] lg:text-xs 2xl:text-sm gap-2 cursor-pointer "
          onClick={() =>
            shareToTwitter(
              `${window.location.origin}/invitation?referralcode=${data?.code}&email=${userInfo?.user?.email}`
            )
          }
        >
          <Image
            src="/x.svg"
            alt="x"
            width={40}
            height={40}
            className="w-8 h-8 md:w-10 md:h-10 lg:w-11 lg:h-11"
          ></Image>
          <span>X</span>
        </div>
        <div
          className="flex flex-col justify-center items-center text-[10px] lg:text-xs 2xl:text-sm gap-2 cursor-pointer "
          onClick={() => copyToClipboard(codeInvitation)}
        >
          <Image
            src="/copy-link.svg"
            alt="x"
            width={40}
            height={40}
            className="w-8 h-8 md:w-10 md:h-10 lg:w-11 lg:h-11"
          ></Image>
          <span>Copy Link</span>
        </div>
        <div
          className="flex flex-col justify-center items-center cursor-pointer text-[10px] lg:text-xs 2xl:text-sm gap-2 "
          onClick={() => handleDownloadQRCode()}
        >
          <Image
            src="/save.svg"
            alt="x"
            width={40}
            height={40}
            className="w-8 h-8 md:w-10 md:h-10 lg:w-11 lg:h-11"
          ></Image>
          <span className="whitespace-nowrap">Save Image</span>
        </div>
        <div
          className="flex flex-col justify-center items-center text-[10px] lg:text-xs 2xl:text-sm gap-2 cursor-pointer "
          onClick={() => chooseAppToShare(codeInvitation)}
        >
          <Image
            src="/share.svg"
            alt="x"
            width={40}
            height={40}
            className="w-8 h-8 md:w-10 md:h-10 lg:w-11 lg:h-11"
          ></Image>
          <span>Share</span>
        </div>
      </div>
    </div>
  );
}

export default Invitation;
