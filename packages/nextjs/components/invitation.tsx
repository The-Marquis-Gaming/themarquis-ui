import Image from "next/image";
import useReferralCode from "~~/utils/api/hooks/useReferralCode";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

function Invitation() {
  const queryClient = useQueryClient();
  const { data } = useReferralCode();
  const searchParams = useSearchParams();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const referralcode = searchParams.get("referralcode");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        console.log("Copied to clipboard successfully!");
      },
      (err) => {
        console.error("Failed to copy: ", err);
      }
    );
  };

  if (referralcode) {
    queryClient.setQueryData(["codeUrl"], referralcode);
  }

  // const referralLink = `${baseUrl}/signup?referralcode=${referralcode || ""}`;
  const codeInvitation = `${baseUrl}/signup?referralcode=${data?.code || ""}`;

  return (
    <div className="w-[500px] h-[500px] bg-[#21262B] rounded-[48px] flex flex-col gap-6 px-8 py-8 justify-center items-center modal-container">
      <span>Invite Friend To Sign Up</span>
      <Image src="/qr.png" alt="qr" width={200} height={200}></Image>
      <div className="flex flex-col gap-3 w-full justify-center items-center">
        <div className="bg-[#363D43] px-3 py-2 flex justify-between gap-16 text-xs w-full">
          <span className="text-[#919191]">Referral Code</span>
          <span className="flex justify-center items-center">{data?.code}</span>
          <Image
            src="/copy.svg"
            alt="copy"
            width={15}
            height={15}
            onClick={() => copyToClipboard(data?.code || "")}
            style={{ cursor: "pointer" }}
          />
        </div>
        <div className="bg-[#363D43] px-3 py-2 flex justify-between gap-6 text-xs w-full">
          <span className="text-[#919191]">Referral Link</span>
          <span className="flex justify-center items-center">
            {codeInvitation}
          </span>
          <Image
            src="/copy.svg"
            alt="copy"
            width={15}
            height={15}
            onClick={() => copyToClipboard(codeInvitation)}
            style={{ cursor: "pointer" }}
          />
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
