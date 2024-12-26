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
      <div className="signup-ludo-border md:mt-[125px] mt-0 ">
        <div className="grid lg:grid-cols-2 grid-cols-1 items-center signup-ludo md:px-[32px] lg:px-[72px] lg:py-[10px] px-6 py-6">
          <div className="lg:col-span-1 lg:order-1 order-2 col-span-1 relative md:py-8 py-0 md:mt-0 mt-[10px]">
            <p className="uppercase landing-title mt-2 lg:mt-0">ludo</p>
            <div
              className="landing-desc max-w-[720px] font-lasserit md:mt-8 md:mb-14 mt-1 mb-[20px] md:pr-[60px] mr-0"
              style={{
                textTransform: "none",
              }}
            >
              Strategy board game for two to four players, in which the players
              race their four tokens from start to finish according to the rolls
              of a single die
            </div>

            <div className="relative w-fit">
              <div className="gradient-signup-btn-top">
                <div className="gradient-signup-btn-bottom"></div>
                <button
                  className="relative z-50 normal-button-think !font-arial !font-[300] text-[24px] signup-btn text-white"
                  onClick={() => {
                    router.push(userInfo ? "/#explore-game" : "/signup");
                  }}
                >
                  {userInfo ? "explore games" : "sign up now"}
                </button>
              </div>

              <Image
                src={"/landingpage/animation-btn.png"}
                className="decore-btn-signup-1 absolute -right-2 md:top-0 top-1 z-10 sm:max-w-[143px] sm:max-h-[70px] max-h-[34px] max-w-[70px]"
                alt="button"
                width={130}
                height={100}
              />
              <Image
                src={"/landingpage/animation-btn.png"}
                className="decore-btn-signup-2 absolute -right-2 md:top-0 top-1 z-10 sm:max-w-[143px] sm:max-h-[70px] max-h-[34px] max-w-[70px]"
                alt="button"
                width={130}
                height={100}
              />
              <Image
                src={"/landingpage/animation-btn.png"}
                className="decore-btn-signup-3 absolute -right-2 md:top-0 top-1 z-10 sm:max-w-[249px] sm:max-h-[67px] max-h-[32px] max-w-[120px]"
                alt="button"
                width={130}
                height={100}
              />
            </div>
            {!userInfo && (
              <div className="md:text-[20px] hidden md:block text-[14px] mt-[17px]">
                <span className="!font-[200] !font-montserrat">
                  Already have an account?
                </span>
                <span
                  className="login-text font-bold cursor-pointer"
                  style={{ fontWeight: 700 }}
                  onClick={() => router.push("/login")}
                >
                  {" "}
                  Login
                </span>
              </div>
            )}
            <span className="mt-8 block"></span>
            <div className="custom-swiper-pagination lg:static lg:mt-0 absolute mb-4 left-0 right-0 lg:gap-2 gap-1"></div>
          </div>
          <div className="h-full w-full ml-auto lg:order-2 order-1 lg:col-span-1 col-span-4 relative lg:pb-0 pb-5">
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
              className="swiperSignup mx-auto"
            >
              {data.map((item, index) => (
                <SwiperSlide key={index} className="mt-5">
                  <div className="md:h-full mt-5 mr-1 flex flex-col justify-center">
                    <Image
                      src={item}
                      width={820}
                      height={410}
                      style={{
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                      className="h-full min-w-52 rounded-[24px] w-full max-h-[400px]"
                      alt="banner"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}
