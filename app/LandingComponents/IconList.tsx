import React from "react";
import Image from "next/image";
import Marquee from "react-fast-marquee";

interface IconListProps {
  items: string[];
}

const IconList: React.FC<IconListProps> = ({ items }) => {
  return (
    <Marquee gradient={false} autoFill={true} speed={50}>
      <div className="flex py-10 font-bold text-3xl ">
        {items.map((item, index) => (
          <div key={index} className="flex gap-4 mx-14">
            <Image src="/star.svg" alt="icon assets" height={36} width={36} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </Marquee>
  );
};

export default IconList;
