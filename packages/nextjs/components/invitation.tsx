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
    <div className="lg:w-[700px] lg:h-[630px] bg-[#21262B] rounded-[48px] flex flex-col gap-7 px-2 lg:px-[65px] py-[44px] justify-center items-center modal-container">
      <p className="lg:text-[24px] text-[16px] font-montserrat font-[100]">
        Invite Friend To Sign Up
      </p>
      <Image
        src={""}
        alt="qr_code"
        width={100}
        height={100}
        className="sm:w-[200px] sm:h-[200px] w-[100px] h-[100px]"
        ref={imageRef}
      />
      <div className="flex flex-col gap-3 w-full justify-center items-center">
        <div className="bg-[#363D43] px-3 py-[18px] rounded-[5px] flex items-center justify-between lg:gap-16 text-xs w-full">
          <div className="flex lg:gap-[22px] gap-[12px] items-center lg:text-[20px]">
            <span className="text-[#919191] whitespace-nowrap lg:min-w-[120px] lg:pl-[20px] font-montserrat font-[100]">
              Referral Code
            </span>
            <span className="truncate overflow-hidden py-3 whitespace-nowrap font-montserrat font-[100] ">
              {data?.code}
            </span>
          </div>
          <Image
            src="/copy.svg"
            alt="copy"
            width={100}
            height={100}
            onClick={() => copyToClipboard(data?.code)}
            style={{ cursor: "pointer", width: "24px", height: "24px" }}
          />
        </div>
        <div className="bg-[#363D43] rounded-[5px] px-3 py-[18px] flex items-center justify-between text-xs w-full">
          <div className="flex items-center gap-[12px] lg:gap-[22px] lg:text-[20px]">
            <p className="text-[#919191] max-w-[96px] lg:min-w-[120px] lg:pl-[20px] font-montserrat font-[100]">
              Referral Link
            </p>
            <p className="truncate overflow-hidden py-3 whitespace-nowrap font-montserrat font-[100] ">
              {codeInvitation}
            </p>
          </div>
          <Image
            src="/copy.svg"
            alt="copy"
            width={100}
            height={100}
            onClick={() => copyToClipboard(codeInvitation)}
            style={{ cursor: "pointer", width: "24px", height: "24px" }}
          />
        </div>
      </div>
      <div className="flex gap-6 mt-4 font-montserrat font-[200]">
        <div
          className="flex flex-col justify-center items-center text-xs gap-2 cursor-pointer w-[60px] h-[70px]"
          onClick={() =>
            shareToTwitter(
              `${window.location.origin}/invitation?referralcode=${data?.code}&email=${userInfo?.user?.email}`,
            )
          }
        >
          <Image src="/x.svg" alt="x" width={40} height={40}></Image>
          <span>X</span>
        </div>
        <div
          className="flex flex-col justify-center items-center text-xs gap-2 cursor-pointer w-[60px] h-[70px]"
          onClick={() => copyToClipboard(codeInvitation)}
        >
          <Image src="/copy-link.svg" alt="x" width={40} height={40}></Image>
          <span>Copy Link</span>
        </div>
        <div
          className="flex flex-col justify-center items-center cursor-pointer text-xs gap-2 w-[60px] h-[70px]"
          onClick={() => handleDownloadQRCode()}
        >
          <Image src="/save.svg" alt="x" width={40} height={40}></Image>
          <span className="whitespace-nowrap">Save Image</span>
        </div>
        <div
          className="flex flex-col justify-center items-center text-xs gap-2 cursor-pointer w-[60px] h-[70px]"
          onClick={() => chooseAppToShare(codeInvitation)}
        >
          <Image src="/share.svg" alt="x" width={40} height={40}></Image>
          <span>Share</span>
        </div>
      </div>
    </div>
  );
}

export default Invitation;
