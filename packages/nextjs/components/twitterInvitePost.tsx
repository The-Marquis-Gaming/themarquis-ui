import Image from "next/image";

export default function TwitterInvitePost() {
  return (
    <div
      style={{
        backgroundImage: `url(/bg-transparent.svg)`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
      className="flex justify-center items-center h-screen"
    >
      <div className="w-full px-6 max-w-[1000px]">
        <Image
          src={"/logo-marquis.svg"}
          width={303}
          height={83}
          className="my-14"
          alt="logo"
        />
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-7">
              <Image
                src={"/avatar_twitter_post.svg"}
                width={46}
                height={46}
                className="rounded-full"
                alt="avatar"
              />
              <p className="text-2xl">carlos***@gmail.com</p>
            </div>
            <p className="font-bold text-[32px]">Invite You To Sign Up</p>
            <span className="text-gradient font-bold text-[64px]">
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
          <div className="flex flex-col items-center">
            <p className="text-2xl text-center">Referral Code</p>
            <p className="text-[#00ECFF] font-bold text-4xl text-center">
              25FE44DA
            </p>
            <Image src={"/qr.png"} height={169} width={169} alt="qr_code" />
            <p className="text-xl">Or Scan To Sign Up</p>
          </div>
        </div>
      </div>
    </div>
  );
}
