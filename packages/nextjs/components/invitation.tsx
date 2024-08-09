import Image from "next/image";

function Invitation() {
  return (
    <div className="w-[500px] h-[500px] bg-[#21262B] rounded-[48px] flex flex-col gap-6 px-8 py-4 justify-center items-center hidden-container ">
      <span>Invite Friend To Sign Up</span>
      <Image src="/qr.png" alt="qr" width={200} height={200}></Image>
      <div className="flex flex-col gap-3 w-full justify-center items-center">
        <div className="bg-[#363D43] px-3 py-2 flex justify-between w-3/4 text-xs">
          <span>Referral Code</span>
          <span>25FE44DA</span>
          <Image src="/copy.svg" alt="copy" width={20} height={20}></Image>
        </div>
        <div className="bg-[#363D43] px-3 py-2 flex justify-between w-3/4 text-xs">
          <span>Referral Link</span>
          <span>https://share.themarquis/u/QR...</span>
          <Image src="/copy.svg" alt="copy" width={20} height={20}></Image>
        </div>
      </div>
      <div className="flex gap-6">
        <div className="flex flex-col justify-center items-center text-xs gap-2">
          <Image src="/x.svg" alt="x" width={40} height={40}></Image>
          <span>X</span>
        </div>
        <div className="flex flex-col justify-center items-center text-xs gap-2">
          <Image src="/copy-link.svg" alt="x" width={40} height={40}></Image>
          <span>Copy Link</span>
        </div>
        <div className="flex flex-col justify-center items-center text-xs gap-2">
          <Image src="/save.svg" alt="x" width={40} height={40}></Image>
          <span>Save Image</span>
        </div>
        <div className="flex flex-col justify-center items-center text-xs gap-2">
          <Image src="/share.svg" alt="x" width={40} height={40}></Image>
          <span>Share</span>
        </div>
      </div>
    </div>
  );
}

export default Invitation;
