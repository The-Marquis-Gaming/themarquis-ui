import { ReactNode } from "react";

interface CardFeatureProps {
  icon: ReactNode;
  text: string;
}

const CardFeature: React.FC<CardFeatureProps> = ({ icon, text }) => {
  return (
    <div className="bg-card lg:w-[305px] lg:h-[374px] w-[208px] h-[255px] flex justify-center items-center flex-col gap-10">
      <div className="w-[73px] h-[73px] bg-[#08808C] text-[#00ECFF] rounded-full flex items-center justify-center">
        {icon}
      </div>
      <span className="lg:text-xl text-lg">{text}</span>
    </div>
  );
};
export default CardFeature;
