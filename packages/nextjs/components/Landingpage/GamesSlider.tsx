import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

import Slide1 from "@/public/landingpage/slide1.png";
import Slide2 from "@/public/landingpage/slide2.png";
import Slide3 from "@/public/landingpage/slide3.png";
import Slide4 from "@/public/landingpage/slide4.png";
import Slide5 from "@/public/landingpage/slide5.png";
import Image from "next/image";
import HotIcon from "@/public/landingpage/hotIcon.svg";

const data = [Slide1, Slide2, Slide3, Slide4, Slide5];

export default function GamesSlider() {
  return (
    <>
      <div>
        <div className="flex items-center gap-5 mb-12 w-full justify-center">
          <p className="landing-title">Latest In Marquis</p>
          <Image
            src={HotIcon}
            width={70}
            height={35}
            loading="lazy"
            alt="icon"
          />
        </div>
        <div className="py-5">
          <Swiper
            slidesPerView={4}
            freeMode={true}
            centeredSlides={true}
            initialSlide={Math.floor(data.length / 2)}
            pagination={{
              clickable: true,
            }}
            className="mySwiper"
          >
            {data?.map((item, index) => {
              return (
                <SwiperSlide key={index} className={`slide-item`}>
                  <div className="slide-content relative inline-block">
                    <Image
                      src={item}
                      alt="slider"
                      width={500}
                      height={500}
                      className="rounded-[15px]"
                    />
                  </div>
                  <div className="absolute w-[95%] inset-0 bg-black opacity-50 rounded-[15px]" />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </>
  );
}
