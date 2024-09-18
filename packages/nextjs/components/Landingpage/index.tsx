import DownloadMarquis from "./DownloadMarquis";
import GamesSlider from "./GamesSlider";
import Introduce from "./Introduce";
import LeaderBoard from "./LeaderBoard";
import MarquisMobile from "./MarquisMobile";
import SignupSection from "./SignupSection";
import "./style.css";
import Technical from "./Technical";

export default function LandingPage() {
  return (
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
  );
}
