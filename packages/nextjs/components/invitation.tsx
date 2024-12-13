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
    <div className="xl:w-[700px] w-full min-[1560px]:mr-28 lg:h-[630px] bg-[#21262B] rounded-[48px] flex flex-col gap-3 lg:gap-7 lg:px-[55px] py-6 xl:py-[44px] xl:justify-center items-center !h-full modal-container">
      <p className="lg:text-[24px] text-[14px] font-montserrat font-[400]">
        Invite Friend To Sign Up
      </p>
      <Image
        src={""}
        alt="qr_code"
        width={100}
        height={100}
        className="w-20 h-20 lg:w-32 lg:h-32 xl:w-[200px] xl:h-[200px]"
        ref={imageRef}
      />
      <div className="flex flex-col gap-2 px-5 lg:gap-3 w-full justify-center items-center">
        <div className="bg-[#363D43] h-[40px] lg:h-full px-3  py-2 lg:py-[18px] rounded-[5px] flex items-center justify-between lg:gap-16 text-xs w-full">
          <div className="flex lg:gap-[22px] gap-[4px] items-center lg:text-[20px]">
            <span className="text-[#919191] whitespace-nowrap lg:min-w-[120px] lg:pl-[20px] font-montserrat font-[100] text-[12px] lg:text-base">
              Referral Code
            </span>
            <span className="truncate overflow-hidden py-1 lg:py-3 whitespace-nowrap font-montserrat font-[100] text-[12px] lg:text-base">
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
        <div className="bg-[#363D43] h-[40px] lg:max-h-[60px] lg:h-full rounded-[5px] px-2 py-2 lg:py-[18px] flex items-center justify-between text-xs w-full">
          <div className="flex items-center gap-[12px] lg:gap-[22px] lg:text-[20px]">
            <p className="text-[#919191] max-w-[96px] lg:min-w-[120px] lg:pl-[20px] font-montserrat font-[100] text-[12px] lg:text-base">
              Referral Link
            </p>
            <p className="truncate overflow-hidden max-w-[150px] md:max-w-full py-1 lg:py-3 whitespace-nowrap font-montserrat font-[100] text-[12px] lg:text-base">
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
          className="flex flex-col justify-center items-center text-xs gap-2 cursor-pointer w-[60px] h-[70px]"
          onClick={() =>
            shareToTwitter(
              `${window.location.origin}/invitation?referralcode=${data?.code}&email=${userInfo?.user?.email}`,
            )
          }
        >
          <Image
            src="/x.svg"
            alt="x"
            width={40}
            height={40}
            className="w-8 h-8 lg:w-10 lg:h-10"
          ></Image>
          <span>X</span>
        </div>
        <div
          className="flex flex-col justify-center items-center text-xs gap-2 cursor-pointer w-[60px] h-[70px]"
          onClick={() => copyToClipboard(codeInvitation)}
        >
          <Image
            src="/copy-link.svg"
            alt="x"
            width={40}
            height={40}
            className="w-8 h-8 lg:w-10 lg:h-10"
          ></Image>
          <span>Copy Link</span>
        </div>
        <div
          className="flex flex-col justify-center items-center cursor-pointer text-xs gap-2 w-[60px] h-[70px]"
          onClick={() => handleDownloadQRCode()}
        >
          <Image
            src="/save.svg"
            alt="x"
            width={40}
            height={40}
            className="w-8 h-8 lg:w-10 lg:h-10"
          ></Image>
          <span className="whitespace-nowrap">Save Image</span>
        </div>
        <div
          className="flex flex-col justify-center items-center text-xs gap-2 cursor-pointer w-[60px] h-[70px]"
          onClick={() => chooseAppToShare(codeInvitation)}
        >
          <Image
            src="/share.svg"
            alt="x"
            width={40}
            height={40}
            className="w-8 h-8 lg:w-10 lg:h-10"
          ></Image>
          <span>Share</span>
        </div>
      </div>
    </div>
  );
}

export default Invitation;
