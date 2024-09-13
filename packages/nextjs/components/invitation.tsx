import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import useReferralCode from "~~/utils/api/hooks/useReferralCode";
import { chooseAppToShare, shareToTwitter } from "~~/utils/shareSocial";
import QRCode from "qrcode";
import { notification } from "~~/utils/scaffold-stark/notification";

function Invitation() {
  const queryClient = useQueryClient();
  const { data }: any = useReferralCode();
  const imageRef = useRef<HTMLImageElement | null>(null);
  const searchParams = useSearchParams();
  const baseUrl = window.location.origin;

  const referralcode = searchParams.get("referralcode");

  if (referralcode) {
    queryClient.setQueryData(["codeUrl"], referralcode);
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
      const qrCodeDataURL = await QRCode.toDataURL(codeInvitation);
      if (imageRef.current) {
        imageRef.current.src = qrCodeDataURL;
      }
    } catch (err) {
      console.error("Failed to generate QR code:", err);
    }
  }, [codeInvitation])

  useEffect(() => {
    if (codeInvitation) {
      generateQRCode();
    }
  }, [codeInvitation, generateQRCode]);

  return (
    <div className="max-w-[500px] h-full max-h-[500px] bg-[#21262B] rounded-[48px] flex flex-col gap-6 px-8 py-8 justify-center items-center modal-container">
      <span>Invite Friend To Sign Up</span>
      <Image
        src={""}
        alt="qr_code"
        width={100}
        height={100}
        className="sm:w-[200px] sm:h-[200px] w-[100px] h-[100px]"
        ref={imageRef}
      />
      <div className="flex flex-col gap-3 w-full justify-center items-center">
        <div className="bg-[#363D43] px-3 py-2 flex items-center justify-between gap-16 text-xs w-full">
          <span className="text-[#919191] min-w-[90px]">Referral Code</span>
          <span className="overflow-hidden whitespace-nowrap truncate">
            {data?.code}
          </span>
          <Image
            src="/copy.svg"
            alt="copy"
            width={100}
            height={100}
            onClick={() => copyToClipboard(data?.code)}
            style={{ cursor: "pointer", width: "15px", height: "15px" }}
          />
        </div>
        <div className="bg-[#363D43] px-3 py-2 flex items-center justify-between gap-6 text-xs w-full">
          <span className="text-[#919191] min-w-[90px]">Referral Link</span>
          <span className="overflow-hidden whitespace-nowrap truncate">
            {codeInvitation}
          </span>
          <Image
            src="/copy.svg"
            alt="copy"
            width={100}
            height={100}
            onClick={() => copyToClipboard(codeInvitation)}
            style={{ cursor: "pointer", width: "15px", height: "15px" }}
          />
        </div>
      </div>
      <div className="flex gap-6 mt-4">
        <div
          className="flex flex-col justify-center items-center text-xs gap-2 cursor-pointer"
          onClick={() =>
            shareToTwitter(`${window.location.origin}/invitation-twitter`)
          }
        >
          <Image src="/x.svg" alt="x" width={40} height={40}></Image>
          <span>X</span>
        </div>
        <div
          className="flex flex-col justify-center items-center text-xs gap-2 cursor-pointer"
          onClick={() => copyToClipboard(codeInvitation)}
        >
          <Image src="/copy-link.svg" alt="x" width={40} height={40}></Image>
          <span>Copy Link</span>
        </div>
        <div
          className="flex flex-col justify-center items-center cursor-pointer text-xs gap-2"
          onClick={() => handleDownloadQRCode()}
        >
          <Image src="/save.svg" alt="x" width={40} height={40}></Image>
          <span>Save Image</span>
        </div>
        <div
          className="flex flex-col justify-center items-center text-xs gap-2 cursor-pointer"
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
