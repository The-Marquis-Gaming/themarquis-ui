import Image from "next/image";
import BannerLudo from "@/public/landingpage/bannerLudo.png";
import BannerLudo2 from "@/public/landingpage/ludogame2.png";
import BannerLudo3 from "@/public/landingpage/ludogame3.png";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useRouter } from "next/navigation";
import useGetUserInfo from "~~/utils/api/hooks/useGetUserInfo";

const data = [BannerLudo, BannerLudo2, BannerLudo3];

export default function SignupSection() {
  const router = useRouter();
  const { data: userInfo } = useGetUserInfo();

  return (
    <div className="content-fit-center">
      <div className="grid lg:grid-cols-2 grid-cols-1 md:gap-5 gap-0 items-center signup-ludo md:mt-[125px] mt-0 md:px-[72px] md:py-[56px] px-6 py-6">
        <div className="lg:col-span-1 lg:order-1 order-2 col-span-1 relative md:py-[90px] py-0 md:mt-0 mt-[20px]">
          <p className="uppercase landing-title mt-2 lg:mt-0">ludo</p>
          <p
            className="landing-desc md:mt-8 md:mb-14 mt-1 mb-[20px] md:mr-[60px] mr-0"
            style={{
              textTransform: "none",
            }}
          >
            Strategy board game for two to four players, in which the players
            race their four tokens from start to finish according to the rolls
            of a single die
          </p>

          <div className="relative w-fit">
            <button
              className="relative z-50 normal-button-think signup-btn text-white"
              onClick={() => {
                router.push(userInfo ? "/#explore-game" : "/signup");
              }}
            >
              {userInfo ? "explore games" : "sign up now"}
            </button>
            <Image
              src={"/landingpage/animation-btn.png"}
              className="decore-btn-signup absolute right-0 md:top-0 top-1 z-10 sm:max-w-[130px] sm:max-h-[100px] max-h-[30px] max-w-[40px]"
              alt="button"
              width={130}
              height={100}
            />
          </div>
          {!userInfo && (
            <div className="md:text-[20px] text-[14px] mt-[17px] font-monserrat">
              Already have an account?
              <span
                className="login-text cursor-pointer"
                style={{ fontWeight: 700 }}
                onClick={() => router.push("/login")}
              >
                {" "}
                Login
              </span>
            </div>
          )}

          <div className="custom-swiper-pagination justify-center lg:gap-2 gap-1"></div>
        </div>
        <div className="h-full w-full lg:order-2 order-1 lg:col-span-1 col-span-2 relative lg:pb-0 pb-5">
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
                <div className="rounded-[24px] h-full flex flex-col justify-center">
                  <Image
                    src={item}
                    width={1000}
                    height={400}
                    className="h-full w-full max-h-[400px]"
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
