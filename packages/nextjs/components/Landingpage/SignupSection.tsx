import Image from "next/image";
import BannerLudo from "@/public/landingpage/bannerLudo.png";
import BannerLudo2 from "@/public/landingpage/ludogame2.png";
import BannerLudo3 from "@/public/landingpage/ludogame3.png";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useRouter } from "next/navigation";
// import SignupButtonAnimation from '@/public/landingpage/signup-btn-animation.svg'

const data = [BannerLudo, BannerLudo2, BannerLudo3];

export default function SignupSection() {
  const router = useRouter();

  return (
    <div className="content-fit-center">
      <div className="grid grid-cols-2 items-center signup-ludo mt-[125px] px-[72px] py-[56px]">
        <div className="col-span-1 relative py-[90px]">
          <p className="uppercase landing-title">ludo</p>
          <p className="landing-desc mt-8 mb-14">
            Strategy board game for two to four players, in which the players
            race their four tokens from start to finish according to the rolls
            of a single die
          </p>

          <button
            className="normal-button-think signup-btn"
            onClick={() => {
              router.push("/signup");
            }}
          >
            sign up now
          </button>
          <div className="custom-swiper-pagination flex justify-center"></div>
        </div>
        <div className="h-full w-full col-span-1">
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            modules={[Pagination, Autoplay]}
            pagination={{
              clickable: true,
              el: ".custom-swiper-pagination",
            }}
            className="swiperSignup"
          >
            {data.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="rounded-[24px] h-full">
                  <Image
                    src={item}
                    width={1000}
                    height={400}
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
