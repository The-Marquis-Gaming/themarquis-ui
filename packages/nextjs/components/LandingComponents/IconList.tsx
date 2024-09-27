import React from "react";
import Image from "next/image";
import Marquee from "react-fast-marquee";

interface IconListProps {
  items: string[];
}

const IconList: React.FC<IconListProps> = ({ items }) => {
  return (
    <Marquee gradient={false} speed={50} autoFill={true}>
      <div className="flex lg:py-10 font-bold lg:text-3xl text-sm py-5 ">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex lg:gap-4 lg:mx-14 mx-5 font-valorant"
          >
            <Image
              src="/star.svg"
              alt="icon assets"
              height={16}
              width={16}
              className="lg:w-[36] lg:h-[36]"
            />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </Marquee>
  );
};

export default IconList;
