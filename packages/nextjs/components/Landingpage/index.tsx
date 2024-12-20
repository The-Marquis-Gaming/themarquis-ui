import DownloadMarquis from "./DownloadMarquis";
import GamesSlider from "./GamesSlider";
import Introduce from "./Introduce";
import LeaderBoard from "./LeaderBoard";
import MarquisMobile from "./MarquisMobile";
import SignupSection from "./SignupSection";
import "./style.css";
import Technical from "./Technical";
import Partnership from "./Partnerships";

export default function LandingPage() {
  return (
    <div>
      <div className="flex flex-col lg:gap-[200px] gap-[36px]">
        <SignupSection />
        <Introduce />
        <GamesSlider />
        <div>
          <MarquisMobile />
          <LeaderBoard />
        </div>
        <Partnership />
        <DownloadMarquis />
        <Technical />
      </div>
    </div>
  );
}
