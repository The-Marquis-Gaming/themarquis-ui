"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import DegradeButton from "../DegradeButton/DegradeButton";
import "./Carousel.css";
import Link from "next/link";
import { Item } from "@/app/data";

interface CarouselProps {
  items: Item[];
}

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  return (
    <div>
      <Slider {...settings}>
        {items.map((item, index) => (
          <div key={index}>
            <div className="flex bg-dark-gray w-[1100px] h-[400px] rounded-r-lg border-carousel">
              <div className="box-image">
                <Image
                  src={item.image}
                  alt="Descripción de la imagen"
                  width={520}
                  height={400}
                />
              </div>
              <div className="flex flex-col justify-center item-center p-[48px] box-content gap-2">
                <div className="">
                  <p className="text-[56px] font-bold font-agencyFb">
                    {item.title}
                  </p>
                  <span className="w-[439px font-['Helvetica']">
                    {item.description}
                  </span>
                </div>
                <div className="flex justify-end">
                  <Link href="/roulette">
                    <DegradeButton size="small"> PLAY NOW</DegradeButton>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

const CustomPrevArrow = (props: any) => (
  <div className="custom-arrow custom-prev-arrow" onClick={props.onClick}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="81"
      height="90"
      viewBox="0 0 81 90"
      fill="none"
    >
      <g filter="url(#filter0_d_279_22)">
        <path
          d="M51.6665 59.9536C51.6665 61.2008 50.1585 61.8255 49.2766 60.9435L29.3233 40.9901C28.7766 40.4433 28.7766 39.5569 29.3233 39.0102L49.2766 19.0567C50.1585 18.1748 51.6665 18.7994 51.6665 20.0467V59.9536Z"
          fill="white"
        />
        <path
          d="M51.9665 59.9536C51.9665 61.4681 50.1354 62.2266 49.0644 61.1556L29.1112 41.2022C28.4473 40.5383 28.4473 39.4619 29.1112 38.798L49.0644 18.8446C50.1354 17.7736 51.9665 18.5321 51.9665 20.0467V59.9536Z"
          stroke="black"
          strokeWidth="0.6"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_279_22"
          x="11.5135"
          y="1.24267"
          width="68.7529"
          height="88.7147"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="5.59998" dy="5.59998" />
          <feGaussianBlur stdDeviation="11.2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.770833 0 0 0 0 0.619878 0 0 0 0 0.619878 0 0 0 0.32 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_279_22"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_279_22"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  </div>
);

const CustomNextArrow = (props: any) => (
  <div className="custom-arrow custom-next-arrow" onClick={props.onClick}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="80"
      height="90"
      viewBox="0 0 80 90"
      fill="none"
    >
      <g filter="url(#filter0_d_279_7)">
        <path
          d="M28.3335 59.9536C28.3335 61.2008 29.8415 61.8255 30.7234 60.9435L50.6767 40.9901C51.2234 40.4433 51.2234 39.5569 50.6767 39.0102L30.7234 19.0567C29.8415 18.1748 28.3335 18.7994 28.3335 20.0467V59.9536Z"
          fill="white"
        />
        <path
          d="M28.0335 59.9536C28.0335 61.4681 29.8646 62.2266 30.9356 61.1556L50.8888 41.2022C51.5527 40.5383 51.5527 39.4619 50.8888 38.798L30.9356 18.8446C29.8646 17.7736 28.0335 18.5321 28.0335 20.0467V59.9536Z"
          stroke="black"
          strokeWidth="0.6"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_279_7"
          x="10.9335"
          y="1.24267"
          width="68.7529"
          height="88.7147"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="5.59998" dy="5.59998" />
          <feGaussianBlur stdDeviation="11.2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.770833 0 0 0 0 0.619878 0 0 0 0 0.619878 0 0 0 0.32 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_279_7"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_279_7"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  </div>
);

export default Carousel;
