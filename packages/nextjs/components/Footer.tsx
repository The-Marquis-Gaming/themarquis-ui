import React, { useState } from "react";
import Image from "next/image";
import Modal from "./Modal/Modal";
import { notification } from "~~/utils/scaffold-stark/notification";

/**
 * Site footer
 */
export const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleDownloadClick = () => {
    const userAgent =
      typeof window !== "undefined"
        ? window.navigator.userAgent.toLowerCase()
        : "";

    if (/android/i.test(userAgent)) {
      window.open(
        "https://play.google.com/store/apps/details?id=com.marquis.app",
        "_blank",
      );
    } else if (/iphone|ipad|ipod/i.test(userAgent)) {
      window.open(
        "https://apps.apple.com/us/app/the-marquis-early-access/id6695763058",
        "_blank",
      );
    } else {
      notification.warning("Only support on mobile");
    }
  };
  return (
    <div className="md:mt-[200px] mt-[36px]">
      <div>
        <div className="max-w-[1700px] mx-auto flex flex-col w-full md:px-8 px-[20px]">
          <div className="flex flex-col justify-start m-inline">
            <Image
              src="logo-marquis.svg"
              alt="logo"
              width={357}
              height={100}
              className="md:max-w-[357px] md:max-h-[100px] max-w-[210px] max-h-[60px]"
            />
            <div className="flex gap-4 m-inline md:mt-[40px] md:mb-[70px] mt-5 mb-[48px]">
              <Image
                className="cursor-pointer md:max-w-[50px] md:max-h-[50px] max-h-[40px] max-w-[40px]"
                onClick={() =>
                  window.open("https://x.com/TheMarquisOnX", "_blank")
                }
                src="/x.png"
                alt="x"
                width={100}
                height={100}
              />
              <Image
                src="/message.png"
                alt="message"
                width={100}
                height={100}
                className=" md:max-w-[50px] md:max-h-[50px] max-h-[40px] max-w-[40px]"
              />
              <Image
                src="/discord.png"
                alt="discord"
                width={100}
                height={100}
                onClick={() =>
                  window.open("https://discord.gg/ZWkWeypnzv", "_blank")
                }
                className="md:max-w-[50px] md:max-h-[50px] max-h-[40px] max-w-[40px] cursor-pointer"
              />
              <Image
                src="/youtube.png"
                alt="youtube"
                width={100}
                height={100}
                className=" md:max-w-[50px] md:max-h-[50px] max-h-[40px] max-w-[40px]"
              />
            </div>
          </div>
          <div className="text-footer grid grid-cols-1 md:grid-cols-5 md:gap-10 gap-[30px] font-monserrat">
            {/* <div className="md:col-span-2 md:order-4 order-first">
              <p className="title-text-footer">Subscribe to our newsletter</p>
              <div className="relative w-full">
                <input
                  type="email"
                  className="bg-[#21262B] sm:rounded-[45px] rounded-[12px] h-[54px] w-full sm:pr-[190px] pr-[130px] pl-4"
                  placeholder="Your email address"
                  style={{ textIndent: "18px" }}
                />
                <button className="absolute right-0 w-[120px] sm:w-[180px] bg-white text-center h-[54px] leading-[54px] text-[#000000] sm:rounded-[45px] rounded-[12px]">
                  Subscribe
                </button>
              </div>
            </div> */}

            <div className="md:col-span-1">
              <p className="title-text-footer">Game</p>
              <div
                className="sub-title-text cursor-pointer"
                onClick={handleDownloadClick}
              >
                <p>Download</p>
              </div>
            </div>
            <div className="md:col-span-1">
              <p className="title-text-footer !font-lasserit">Resources</p>
              <div className="sub-title-text">
                <p className="!font-lasserit">Docs</p>
                <p>
                  <a
                    className="!font-lasserit"
                    href="https://x.com/TheMarquisOnX"
                    target="_blank"
                  >
                    Blogs
                  </a>
                </p>
                <p>
                  <a className="!font-lasserit" href="brandkit">
                    Brand Assets
                  </a>
                </p>
              </div>
            </div>
            <div className="md:col-span-1">
              <p className="title-text-footer !font-lasserit">Useful Links</p>
              <div className="sub-title-text">
                <p className="!font-lasserit">Terms and Conditions</p>
                <p>
                  <a
                    href="/privacy-policy"
                    className="cursor-pointer !font-lasserit"
                  >
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="min-h-0 md:py-5 py-2 px-6  mb-6 lg:mb-0 bg-[#0F151A] flex justify-center md:mt-[100px] mt-[60px] font-monserrat">
        <span className="text-[12px] !font-lasserit">
          THE MARQUIS. © 2024. All rights reserved. By using out website you
          consent to all cookies in accordance with out{" "}
          <span>
            <a className="font-bold underline" href="/privacy-policy">
              Terms and Privacy Policy
            </a>
          </span>
        </span>
      </div>
    </div>
  );
};
