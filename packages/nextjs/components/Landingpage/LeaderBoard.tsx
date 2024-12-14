import Rank1 from "@/public/landingpage/rank1.svg";
import Rank2 from "@/public/landingpage/rank2.svg";
import Rank3 from "@/public/landingpage/rank3.svg";
import Strk from "@/public/landingpage/strkEarned.svg";
import Eth from "@/public/logo-eth.svg";
import Image from "next/image";

const data = [
  {
    name: "Od1n",
    rank: 1,
    earned: 1987.65,
    point: 1500,
    streak: 100,
    tokenImage: "leaderboard/earned.svg",
    widthToken: 45,
  },
  {
    name: "Gurk",
    rank: 2,
    earned: 765.43,
    point: 1200,
    streak: 90,
    tokenImage: "logo-eth.svg",
    widthToken: 28,
  },
  {
    name: "Nadai",
    rank: 3,
    earned: 321.45,
    point: 1100,
    streak: 80,
    tokenImage: "leaderboard/earned.svg",
    widthToken: 45,
  },
  {
    name: "Digger",
    rank: 4,
    earned: 123.45,
    point: 1000,
    streak: 60,
    tokenImage: "/landingpage/strkEarned.svg",
    widthToken: 28,
  },
  {
    name: "Omar",
    rank: 5,
    earned: 44.45,
    point: 900,
    streak: 30,
    tokenImage: "leaderboard/earned.svg",
    widthToken: 45,
  },
  {
    name: "Andee",
    rank: 6,
    earned: 12.45,
    point: 800,
    streak: 20,
    tokenImage: "leaderboard/earned.svg",
    widthToken: 45,
  },
];

const Header = ({ title }: { title: string }) => {
  return (
    <p className="xl:text-[24px] text-[12px] font-bold  !font-lasserit flex items-center justify-center">
      {title}
    </p>
  );
};

const RowItem = ({
  name,
  rank,
  earned,
  point,
  streak,
  tokenImage,
  widthToken,
}: {
  name: string;
  rank: React.ReactNode;
  earned: number;
  point: number;
  streak: number;
  tokenImage: string;
  widthToken: number;
}) => {
  const renderBg = () => {
    switch (rank) {
      case 1:
        return "leader-board-rank1";
      case data.length:
        return "leader-board-item opacity-30";
      case data.length - 1:
        return "leader-board-item opacity-60";
      default:
        return "leader-board-item";
    }
  };
  const renderRank = () => {
    switch (rank) {
      case 1:
        return (
          <Image
            src={Rank1}
            alt="rank1"
            width={24}
            height={24}
            className="xl:max-w-[24px] max-w-[12px]"
          />
        );
      case 2:
        return (
          <Image
            src={Rank2}
            alt="rank2"
            width={24}
            height={24}
            className="xl:max-w-[24px] max-w-[12px]"
          />
        );
      case 3:
        return (
          <Image
            src={Rank3}
            alt="rank3"
            width={24}
            height={24}
            className="xl:max-w-[24px] max-w-[12px]"
          />
        );
      default:
        return rank;
    }
  };

  return (
    <div
      className={`${renderBg()} grid md:grid-cols-4 !font-lasserit grid-cols-5 items-center xl:text-[26px] text-[12px] my-4 xl:px-[150px] px-0`}
    >
      <div className="mx-auto">{renderRank()}</div>
      <div>{name}</div>
      <div className="flex justify-center flex-col items-center xl:px-[20px] px-0">
        <div className="flex items-center justify-end xl:gap-2 gap-[2px]">
          <p className="text-white !font-lasserit ">{point}</p>
          <Image
            src={"/leaderboard/point.svg"}
            alt="point"
            width={24}
            height={24}
            className="xl:max-w-[24px] max-w-[12px]"
          />
        </div>
        <div className="bg-[#034A51] w-fit rounded-[15px] md:px-[10px] px-1 md:py-1 py-[2px] mt-1">
          <p className="xl:text-[16px] !font-lasserit text-[8px] font-medium">
            {streak} win streak
          </p>
        </div>
      </div>
      <div className="flex items-center md:gap-2 gap-1 justify-center md:col-span-1 col-span-2">
        {tokenImage === "leaderboard/earned.svg" ? (
          <Image
            src={tokenImage}
            alt="icon"
            width={widthToken}
            height={25}
            className="xl:max-w-[45px] max-w-[24px]"
          />
        ) : (
          <Image
            src={tokenImage}
            alt="icon"
            width={widthToken}
            height={25}
            className="xl:max-w-[45px] max-w-[16px]"
          />
        )}
        <div className="text-[#00ECFF] flex gap-1 items-center">
          <p className="!font-lasserit">{earned} </p>
          <p className="!font-lasserit">USD</p>
        </div>
      </div>
    </div>
  );
};
export default function LeaderBoard() {
  return (
    <div className="text-center leader-board-bg md:py-[80px] py-10">
      <div className="max-w-[1284px] mx-auto px-[20px]">
        <div className="md:mb-16 mb-3 flex relative w-fit mx-auto">
          <Image
            src={"/leaderboard/star.svg"}
            alt="star"
            width={150}
            height={150}
            className="absolute -bottom-1 md:bottom-0 xl:bottom-[-16px] xl:right-[92%] right-[95%] xl:max-w-[150px] md:max-w-[100px] max-w-[40px]"
          />
          <p className="landing-title !font-black !font-lasserit-bold">Leaderboard</p>
        </div>
        <div className="leader-board-bg-header  grid md:grid-cols-4 grid-cols-5 xl:px-[150px] px-0">
          <Header title="Ranking" />
          <Header title="Name" />
          <Header title="Points" />
          <div className="md:col-span-1 col-span-2 flex items-center justify-center">
            <Header title="Total earned" />
          </div>
        </div>
        {data?.map((item, index) => <RowItem key={index} {...item} />)}
      </div>
    </div>
  );
}
