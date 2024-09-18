import Rank1 from "@/public/landingpage/rank1.svg";
import Rank2 from "@/public/landingpage/rank2.svg";
import Rank3 from "@/public/landingpage/rank3.svg";
import Strk from "@/public/landingpage/strkEarned.svg";
import Eth from "@/public/landingpage/ethEarned.svg";
import Image from "next/image";

const data = [
  { name: "YiXuan", rank: 1, earned: 100, token: "STRK", game: "Ludo" },
  { name: "Mehdi", rank: 2, earned: 20, token: "ETH", game: "Ludo" },
  { name: "Jake", rank: 3, earned: 40, token: "ETH", game: "Ludo" },
  { name: "Jake", rank: 0, earned: 50, token: "STRK", game: "Ludo" },
  { name: "Carlos", rank: 0, earned: 20, token: "STRK", game: "Ludo" },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return Rank1;
    case 2:
      return Rank2;
    case 3:
      return Rank3;
    default:
      return null;
  }
};

const RowItem = ({ title, icon }: { title: string; icon?: any }) => {
  return (
    <div className="relative">
      {icon && (
        <Image
          className="absolute top-1/2 left-1/4 transform -translate-y-1/2"
          src={icon}
          alt="icon"
          width={25}
          height={25}
        />
      )}
      <p className="col-span-1 p-2">{title}</p>
    </div>
  );
};

export default function LeaderBoard() {
  const getRowClass = (index: number, totalRows: number) => {
    switch (index) {
      case 0:
        return "bg-[#31353B] rounded-[10px]";
      case totalRows - 1:
        return "opacity-[0.22] bg-[#23292F] rounded-[10px]";
      default:
        return "bg-transparent";
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (a.rank === 0) return 1;
    if (b.rank === 0) return -1;
    return a.rank - b.rank;
  });

  return (
    <div className="text-center leader-board-bg py-[100px]">
      <div className="max-w-[1500px] mx-auto">
        <p className="landing-title mb-16">Leaderboard</p>
        <div className="leader-board-header grid grid-cols-3 mb-3">
          <RowItem title={"Player"} />
          <RowItem title={"Game"} />
          <RowItem title={"Earned"} />
        </div>
        {sortedData?.map((item, index) => {
          const rowClass = getRowClass(index, sortedData.length);
          const rankIcon = getRankIcon(item.rank); // Get the correct rank icon
          return (
            <div
              key={index}
              className={`mb-3 p-3 text-[24px] font-medium grid grid-cols-3 ${rowClass}`}
            >
              <RowItem title={item?.name} icon={rankIcon} />
              <RowItem title={item?.game} />
              <RowItem
                title={item?.earned + " " + item?.token}
                icon={item?.token == "STRK" ? Strk : Eth}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
