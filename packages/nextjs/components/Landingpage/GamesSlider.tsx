import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import Slide1 from "@/public/landingpage/slide1.png";
import Slide2 from "@/public/landingpage/slide2.png";
import Slide3 from "@/public/landingpage/slide3.png";
import Slide4 from "@/public/landingpage/slide4.png";
import Slide5 from "@/public/landingpage/slide5.png";
import Image from "next/image";
import HotIcon from "@/public/landingpage/hotIcon.svg";

const data = [
  Slide1,
  Slide2,
  Slide3,
  Slide4,
  Slide5,
  Slide1,
  Slide2,
  Slide3,
  Slide4,
  Slide5,
];

export default function GamesSlider() {
  return (
    <div id="explore-game">
      <div className="mt-3 md:mt-0">
        <div className="flex items-center gap-5 md:mb-12 mb-[10px] w-full justify-center">
          <p className="landing-title">Latest In Marquis</p>
          <Image
            src={HotIcon}
            width={70}
            height={35}
            loading="lazy"
            alt="icon"
            className="md:max-w-[70px] md:max-h-[35px] max-w-[44px] max-h-[22px]"
          />
        </div>
        <div
        // className="py-5"
        >
          <Swiper
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
              1300: {
                slidesPerView: 4,
              },
            }}
            slidesPerView={2}
            slideToClickedSlide={true}
            centeredSlides={true}
            loop={true}
            initialSlide={Math.floor(data.length / 2)}
            pagination={{
              clickable: true,
            }}
            className="mySwiper"
          >
            {data?.map((item, index) => {
              return (
                <SwiperSlide key={index} className={`slide-item`}>
                  <div className="slide-content relative">
                    <Image
                      src={item}
                      alt="slider"
                      width={500}
                      height={500}
                      className="rounded-[15px]"
                    />
                    {/* <div className="slide-deco-bg flex justify-center absolute inset-0 bg-black opacity-50 rounded-[15px]" /> */}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
