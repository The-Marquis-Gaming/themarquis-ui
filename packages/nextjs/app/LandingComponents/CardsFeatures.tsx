import { ReactNode } from "react";
interface CardFeatureProps {
  icon: ReactNode;
  text: string;
}

const CardFeature: React.FC<CardFeatureProps> = ({ icon, text }) => {
  return (
    <div className="relative w-[208px] h-[255px]">
      <div className="absolute inset-0 pen-container"></div>
      <div className="absolute inset-[3px] bg-container-card pen-container flex justify-center items-center flex-col gap-10">
        <div className="w-[73px] h-[73px] bg-[#08808C] text-[#00ECFF] rounded-full flex items-center justify-center">
          {icon}
        </div>
        <span className="lg:text-xl text-lg">{text}</span>
      </div>
    </div>
  );
};
export default CardFeature;
