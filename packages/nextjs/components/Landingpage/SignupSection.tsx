import Image from "next/image";
import BannerLudo from "@/public/landingpage/bannerLudo.png";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function SignupSection() {
  return (
    <div className="content-fit-center">
      <div className="grid grid-cols-2 items-center signup-ludo mt-[100px] p-[50px]">
        <div className="col-span-1 relative py-[90px]">
          <p className="uppercase landing-title">ludo</p>
          <p className="landing-desc mt-8 mb-14">
            Strategy board game for two to four players, in which the players
            race their four tokens from start to finish according to the rolls
            of a single die
          </p>
          <button className="normal-button-think button-style">
            sign up now
          </button>
          <div className="custom-swiper-pagination flex justify-center"></div>
        </div>
        <div className="h-full w-full col-span-1">
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            modules={[Pagination]}
            pagination={{
              clickable: true,
              el: ".custom-swiper-pagination",
            }}
            className="swiperSignup"
          >
            {new Array(4).fill(null).map((_, index) => (
              <SwiperSlide key={index}>
                <div className="rounded-[24px] h-full">
                  <Image
                    src={BannerLudo}
                    width={1000}
                    height={1000}
                    className="h-full w-full"
                    alt="banner"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
