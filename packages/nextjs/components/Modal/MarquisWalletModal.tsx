import Image from "next/image";
import LogoutIcon from "@/public/logout-icon.svg";
import { notification } from "~~/utils/scaffold-stark";
import useScaffoldStrkBalance from "~~/hooks/scaffold-stark/useScaffoldStrkBalance";
import useScaffoldEthBalance from "~~/hooks/scaffold-stark/useScaffoldEthBalance";
import useGetUserInfo from "~~/utils/api/hooks/useGetUserInfo";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import useLogout from "~~/utils/api/hooks/useLogout";

interface ModalMarquisWalletProps {
  isOpen: boolean;
  onClose: () => void;
}
export default function MarquisWalletModal({
  isOpen,
  onClose,
}: ModalMarquisWalletProps) {
  const { data } = useGetUserInfo();
  const [animateModal, setAnimateModal] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const strkBalanceWallet = useScaffoldStrkBalance({
    address: data?.account_address,
  });
  const ethBalanceWallet = useScaffoldEthBalance({
    address: data?.account_address,
  });

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

  const handleLogoutSuccess = () => {
    queryClient.setQueryData(["userEmail"], null);
    queryClient.removeQueries({ queryKey: ["userInfo"] });
    queryClient.invalidateQueries({
      refetchType: "active",
    });
    queryClient.setQueryData(["userInfo"], null);
    onClose();
    notification.success("Logout successfully");
    router.push("/login");
  };

  const handleLogoutFailed = (error: any) => {
    console.log("Logout failed", error);
  };

  const { mutate: logout } = useLogout(handleLogoutSuccess, handleLogoutFailed);

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      setAnimateModal(true);
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      setAnimateModal(false);
      setTimeout(() => {
        document.removeEventListener("mousedown", handleClickOutside);
      }, 300);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-500 ${
          animateModal ? "opacity-100" : "opacity-0"
        }`}
        style={{ zIndex: 1000 }}
      ></div>
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ zIndex: 1000 }}
      >
        <div
          ref={modalRef}
          className={` w-[550px] rounded-[24px] p-[20px] bg-[#171C20] transition-all duration-300 transform ${
            animateModal
              ? "scale-100 translate-y-0 opacity-100"
              : "scale-90 translate-y-10 opacity-0"
          }`}
          style={{
            border: "1px solid #5C5C5C",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src="/marquis-icon.svg"
                alt="logo"
                width={22}
                height={22}
              />
              <p className="font-bold text-[24px]">Marquis Wallet</p>
            </div>
            <div
              className="cursor-pointer bg-[#00ECFF] rounded-[2px] py-2 px-3 flex items-center gap-2 "
              onClick={handleLogout}
            >
              <p className="text-[#000] font-medium text-xs">Log Out</p>
              <Image src={LogoutIcon} width={15} height={15} alt="icon" />
            </div>
          </div>
          <div
            className="text-sm font-semibold my-3 cursor-pointer  flex items-center gap-2"
            onClick={() => copyToClipboard(data?.user?.email)}
          >
            <p className="m-0">{data?.user?.email}</p>
            <Image
              src="/copy.svg"
              alt="copy"
              width={100}
              height={100}
              style={{ cursor: "pointer", width: "15px", height: "15px" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-[80px]">
            <div className="flex flex-col gap-3 col-span-1">
              <p className="font-bold mb-3">Marquis Balance</p>
              <div className="flex justify-between items-center">
                <Image
                  src={"/logo-starknet.svg"}
                  alt="icon"
                  width={20}
                  height={20}
                />
                <p className="m-0 text-sm uppercase text-right">
                  {parseFloat(strkBalanceWallet.formatted).toFixed(2)} STRK
                </p>
              </div>
              <div className="flex justify-between items-center">
                <Image
                  src={"/logo-eth.svg"}
                  alt="icon"
                  width={20}
                  height={20}
                />
                <p className="m-0 text-sm uppercase text-right">
                  {parseFloat(ethBalanceWallet.formatted).toFixed(8)} ETH
                </p>
              </div>
              <div className="flex justify-between items-center">
                <Image src={"/usdc.svg"} alt="icon" width={20} height={20} />
                <p className="m-0 text-sm uppercase text-right text-[#7A7A7A]">
                  0.00 USDC
                </p>
              </div>
            </div>
            <div className="col-span-1 flex flex-col gap-1">
              <p className="m-0 font-bold">Marquis Points</p>
              <div className="flex items-center gap-2">
                <Image
                  src="/marquis-point.svg"
                  height={20}
                  width={20}
                  alt="icon"
                />
                <p>{data?.user?.points} Pts.</p>
              </div>
              <p className="m-0 font-bold mt-5">Actions</p>
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => {
                  router.push("/withdrawal");
                  onClose();
                }}
              >
                <Image
                  src={"/withdraw-icon.svg"}
                  width={10}
                  height={10}
                  alt="icon"
                />
                <p>Withdraw</p>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => copyToClipboard(data?.referral_code ?? "")}
              >
                <Image
                  src="/copy.svg"
                  alt="copy"
                  width={100}
                  height={100}
                  style={{ cursor: "pointer", width: "15px", height: "15px" }}
                />
                <p>Copy Referral Code</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
