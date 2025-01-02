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
    { name: "Flex Marketplace ", icon: flexMarket },
  ];
  return (
    <div className="flex w-full lg:px-[32px] mb-[22px] md:mb-[60px] lg:mb-0 flex-col items-center lg:h-[544px] relative h-[170px] mt-[41.13px] lg:mt-[82.25px] bg-transparent ">
      <div className="lg:h-[166px] h-[43px] w-full flex flex-col items-center">
        <p className="!font-Larsseit font-medium text-center text-[#9B9B9B] lg:leading-[82.25px] text-base lg:text-[32px]">
          Marquis Partnerships
        </p>
        <p className=" !font-Larsseit font-bold text-center text-transparent  text-xl leading-[20px] lg:leading-[56px] lg:text-5xl bg-clip-text bg-gradient-to-t from-white/[0%] via-white to-white">
          Shaping the Future of Gaming Together
        </p>
      </div>

      <div className="top-[80px] lg:top-[70px] lg:mt-[-40px] xl:mt-0  lg:relative  h-fit xl:absolute xl:px-[32px] -left-[17%] lg:left-auto right-[0px] absolute overflow-hidden lg:w-full">
        <Swiper
          breakpoints={{
            640: {
              slidesPerView: 3.5,
              spaceBetween: 22,
            },
            768: {
              slidesPerView: 3.5,
              spaceBetween: 22,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 70,
            },
            1300: {
              slidesPerView: 4,
              spaceBetween: 70,
            },
          }}
          slidesPerView={3.5}
          loop={true}
          initialSlide={Math.floor(partners.length / 2)}
          spaceBetween={22}
        >
          {partners?.map((items, index) => {
            return (
              <SwiperSlide key={index}>
                <div className="w-full items-center justify-center flex">
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
