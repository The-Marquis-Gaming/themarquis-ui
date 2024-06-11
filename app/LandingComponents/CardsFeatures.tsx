import { ReactNode } from "react";

interface CardFeatureProps {
  icon: ReactNode;
  text: string;
}

const CardFeature: React.FC<CardFeatureProps> = ({ icon, text }) => {
  return (
    <div className="bg-card w-[305px] h-[374px] flex justify-center items-center flex-col gap-10">
      <div className="w-[73px] h-[73px] bg-[#08808C] text-[#00ECFF] rounded-full flex items-center justify-center">
        {icon}
      </div>
      <span className="text-xl">{text}</span>
    </div>
  );
};
export default CardFeature;
