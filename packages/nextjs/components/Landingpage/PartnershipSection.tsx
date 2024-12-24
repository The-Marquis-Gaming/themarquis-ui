import dIsland from "@/public/landingpage/dislands.svg";
import flexMarket from "@/public/landingpage/flex_mark.svg";
import openMarket from "@/public/landingpage/openMark.svg";
import swamZero from "@/public/landingpage/swamZero.svg";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import PartnershipCard from "../LandingComponents/Partnershipcards";

export default function PartnershipSection() {
  const partners = [
    { name: "SwamZero", icon: swamZero },
    { name: "Flex Marketplace ", icon: flexMarket },
    { name: "D'Islands", icon: dIsland },
    { name: "OpenMark", icon: openMarket },
  ];
  return (
    <div className="flex w-full flex-col items-center lg:h-[544px] h-[170px] relative mt-[41.13px] lg:mt-[82.25px] bg-transparent overflow-hidden ">
      <div className="lg:h-[166px] h-[43px] w-full flex flex-col items-center">
        <p className="!font-Larsseit font-medium text-center text-[#9B9B9B] lg:leading-[82.25px] text-base lg:text-[32px]">
          Marquis Partnerships
        </p>
        <p className=" !font-Larsseit font-bold text-center text-transparent  text-xl lg:leading-[56px] lg:text-5xl bg-clip-text bg-gradient-to-t from-white/[0%] via-white to-white">
          Shaping the Future of Gaming Together
        </p>
      </div>
      <div className="absolute lg:top-[70px] top-[65px] lg:left-0 lg:right-0 left-[-13%] right-[0%]">
        <Swiper
          spaceBetween={5}
          breakpoints={{
            640: {
              slidesPerView: 3.5,
            },
            768: {
              slidesPerView: 3.5,
            },
            1024: {
              slidesPerView: 4,
            },
            1300: {
              slidesPerView: 4,
              spaceBetween: 10,
            },
          }}
          slidesPerView={3.5}
          loop={true}
          initialSlide={0}
          pagination={{
            clickable: true,
          }}
        >
          {partners?.map((items, index) => {
            return (
              <SwiperSlide key={index}>
                <div className="slide-content">
                  <PartnershipCard text={items.name} icon={items.icon} />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}
