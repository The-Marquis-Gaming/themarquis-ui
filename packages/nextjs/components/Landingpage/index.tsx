import { notification } from "~~/utils/scaffold-stark";
import DownloadMarquis from "./DownloadMarquis";
import GamesSlider from "./GamesSlider";
import Introduce from "./Introduce";
import LeaderBoard from "./LeaderBoard";
import MarquisMobile from "./MarquisMobile";
import SignupSection from "./SignupSection";
import "./style.css";
import Technical from "./Technical";
import { useEffect } from "react";
import { useAccount } from "@starknet-react/core";

export default function LandingPage() {
  const { connector } = useAccount();
  useEffect(() => {
    // @ts-ignore
    if (window.starknet && window.starknet.isConnected) {
      if (
        // @ts-ignore
        connector?._wallet?.chainId == "SN_MAIN" ||
        // @ts-ignore
        connector?._wallet?.chainId == "SN_GOERLI"
      ) {
        notification.wrongNetwork("Please connect to Starknet Sepolia network");
      }
    }
    // @ts-ignore
  }, [connector?._wallet?.chainId]);
  return (
    <div>
      <div className="flex flex-col gap-[200px]">
        <SignupSection />
        <Introduce />
        <GamesSlider />
        <div>
          <MarquisMobile />
          <LeaderBoard />
        </div>
        <DownloadMarquis />
        <Technical />
      </div>
    </div>
  );
}
