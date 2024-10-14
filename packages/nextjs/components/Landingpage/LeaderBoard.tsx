import Rank1 from "@/public/landingpage/rank1.svg";
import Rank2 from "@/public/landingpage/rank2.svg";
import Rank3 from "@/public/landingpage/rank3.svg";
import Strk from "@/public/landingpage/strkEarned.svg";
import Eth from "@/public/logo-eth.svg";
import Image from "next/image";

const data = [
  { name: "YiXuan", rank: 1, earned: 100, token: "STRK", game: "Ludo" },
  { name: "Mehdi", rank: 2, earned: 0.02, token: "ETH", game: "Ludo" },
  { name: "Jake", rank: 3, earned: 0.4, token: "ETH", game: "Ludo" },
  { name: "Vy", rank: 0, earned: 50, token: "STRK", game: "Ludo" },
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

const formatNumber = (num: number) => {
  return num % 1 === 0 ? num.toFixed(0) : num.toFixed(2);
};

const RowItem = ({
  title,
  icon,
  isLeft,
  isRight,
}: {
  title: string;
  icon?: any;
  isLeft?: boolean;
  isRight?: boolean;
}) => {
  return (
    <div
      className={`flex items-center gap-[27px] w-full ${isRight && "justify-end"} ${isLeft && "justify-start"} ${!isLeft && !isRight && "justify-center"}`}
    >
      {icon && (
        <div className="w-[30px] h-[30px]">
          <Image src={icon} alt="icon" width={25} height={25} />
        </div>
      )}
      <div
        className={`${isLeft && "text-left"} ${isRight && "text-right"} col-span-1 p-2 `}
      >
        <p className={`${isRight && "mr-4"}`}>{title}</p>
      </div>
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
      <div className="max-w-[1200px] mx-auto">
        <p className="landing-title mb-16">Leaderboard</p>
        <div className="leader-board-header grid grid-cols-3 mb-3">
          <RowItem title={"Player"} isRight />
          <RowItem title={"Game"} />
          <RowItem title={"Earned"} isLeft />
        </div>
        {sortedData?.map((item, index) => {
          const rowClass = getRowClass(index, sortedData.length);
          const rankIcon = getRankIcon(item.rank);
          return (
            <div
              key={index}
              className={`mb-3 p-3 text-[24px] font-medium grid grid-cols-3 ${rowClass}`}
            >
              <div
                className={`flex items-center gap-[27px] w-full justify-end`}
              >
                {rankIcon && (
                  <div className="w-[30px] h-[30px]">
                    <Image src={rankIcon} alt="icon" width={25} height={25} />
                  </div>
                )}
                <div className={`col-span-1 p-2 `}>
                  <p className="w-[100px] text-center">{item?.name}</p>
                </div>
              </div>
              <RowItem title={item?.game} />
              <RowItem
                isLeft
                title={formatNumber(item?.earned) + " " + item?.token}
                icon={item?.token == "STRK" ? Strk : Eth}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
