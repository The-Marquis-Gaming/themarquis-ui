import Image from "next/image";
import QRCode from "qrcode";
import { useEffect, useRef } from "react";
import useGetUserInfo from "~~/utils/api/hooks/useGetUserInfo";
import { makePrivateEmail } from "~~/utils/convertData";

export default function TwitterInvitePost() {
  const { data } = useGetUserInfo();
  const imageRef = useRef<HTMLImageElement | null>(null);

  const generateQRCode = async (invitationCode: any) => {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(invitationCode);
      if (imageRef.current) {
        imageRef.current.src = qrCodeDataURL;
      }
    } catch (err) {
      console.error("Failed to generate QR code:", err);
    }
  };

  useEffect(() => {
    if (data?.referral_code) {
      const codeInvitation = `${window.location.origin}/signup?referralcode=${data.referral_code}`;
      generateQRCode(codeInvitation);
    }
  }, [data]);

  return (
    <div
      style={{
        backgroundImage: `url(/bg-transparent.svg)`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
      className="flex justify-center items-center h-screen-minus-80"
    >
      <div className="w-full px-6 max-w-[1000px]">
        <Image
          src={"/logo-marquis.svg"}
          width={303}
          height={83}
          className="my-14"
          alt="logo"
        />
        <div className="flex justify-between items-center flex-wrap">
          <div>
            <div className="flex items-center gap-7">
              <Image
                src={"/avatar_twitter_post.svg"}
                width={46}
                height={46}
                className="rounded-full"
                alt="avatar"
              />
              <p className="text-2xl">{makePrivateEmail(data?.user?.email)}</p>
            </div>
            <p className="font-bold sm:text-[32px] text-[20px]">
              Invite You To Sign Up
            </p>
            <span className="text-gradient font-bold sm:text-[64px] text-[32px]">
              THE MARQUIS !
            </span>
            <div>
              <p className="text-xl">Available On</p>
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
            <p className="sm:text-2xl text-md text-center m-0">Referral Code</p>
            <p className="text-[#00ECFF] font-bold sm:text-4xl text-lg text-center">
              {data?.referral_code}
            </p>
            <Image
              src={""}
              alt="qr_code"
              width={100}
              height={100}
              className="sm:w-[200px] sm:h-[200px] w-[100px] h-[100px]"
              ref={imageRef}
            />
            <p className="text-xl">Or Scan To Sign Up</p>
          </div>
        </div>
      </div>
    </div>
  );
}
