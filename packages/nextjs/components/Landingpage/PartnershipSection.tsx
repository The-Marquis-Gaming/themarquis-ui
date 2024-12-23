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
    <div className="flex w-full flex-col items-center mt-[41.13px] lg:mt-[82.25px] bg-transparent overflow-hidden">
      <div>
        <p className="!font-Larsseit font-medium text-center text-[#9B9B9B] lg:leading-[82.25px] text-base lg:text-[32px]">
          Marquis Partnerships
        </p>
        <p className=" !font-Larsseit font-bold text-center text-transparent lg:lg:leading-[82.25px] text-xl lg:text-[48px] bg-clip-text bg-gradient-to-t from-white/[0%] via-white to-white">
          Shaping the Future of Gaming Together
        </p>
      </div>
      <Swiper
        spaceBetween={0}
        breakpoints={{
          640: {
            slidesPerView: 2.5,
          },
          767: {
            slidesPerView: 3.5,
          },
          1024: {
            slidesPerView: 3.5,
          },
          1440: {
            slidesPerView: 4,
          },
        }}
        slidesPerView={2.5}
        slideToClickedSlide={true}
        centeredSlides={false}
        loop={true}
        initialSlide={0}
        pagination={{
          clickable: true,
        }}
        className="items-center  lg:gap-[30px] justify-center w-screen flex "
      >
        {partners?.map((items, index) => {
          return (
            <SwiperSlide key={index} className={`slide-item w-full`}>
              <div className="slide-content relative">
                <PartnershipCard text={items.name} icon={items.icon} />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
