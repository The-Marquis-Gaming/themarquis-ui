import { ChevronDownIcon } from "@radix-ui/react-icons";
import Image from "next/image";

export default function SelectTokenButton({
  activeToken,
  isSelect,
}: {
  activeToken: string;
  isSelect: boolean;
}) {
  return (
    <div className="select-button font-monserrat cursor-pointer bg-[#252B36] rounded-[8px] px-4 py-2">
      <div className="flex items-center gap-2">
        <Image
          src={activeToken === "Strk" ? "logo-starknet.svg" : "logo-eth.svg"}
          alt={"icon"}
          className="icon"
          width={20}
          height={20}
        />
        <span className="text-sm font-normal">
          {activeToken === "Strk" ? "STRK" : "ETH"}
        </span>
        {isSelect && (
          <span>
            <ChevronDownIcon className="h-6 w-4" />
          </span>
        )}
      </div>
    </div>
  );
}
