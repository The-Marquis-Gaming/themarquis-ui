import React from "react";
import Image from "next/image";

/**
 * Site footer
 */
export const Footer = () => {
  return (
    <div className="mt-[200px]">
      <div>
        <div className="max-w-[1700px] mx-auto flex flex-col w-full px-8">
          <div className="flex flex-col justify-start m-inline">
            <Image src="logo-marquis.svg" alt="logo" width={357} height={100} />
            <div className="flex gap-4 m-inline mt-[40px] mb-[70px]">
              <Image
                className="cursor-pointer"
                onClick={() =>
                  window.open("https://x.com/TheMarquisOnX", "_blank")
                }
                src="/x.png"
                alt="x"
                width={50}
                height={50}
              />
              <Image src="/message.png" alt="message" width={50} height={50} />
              <Image src="/discord.png" alt="discord" width={50} height={50} />
              <Image src="/youtube.png" alt="youtube" width={50} height={50} />
            </div>
          </div>
          <div className="text-footer grid grid-cols-1 md:grid-cols-5 gap-10 font-monserrat">
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
              <div className="sub-title-text">
                <p>Download</p>
              </div>
            </div>
            <div className="md:col-span-1">
              <p className="title-text-footer">Resources</p>
              <div className="sub-title-text">
                <p>Docs</p>
                <p>
                  <a href="https://x.com/TheMarquisOnX" target="_blank">
                    Blogs
                  </a>
                </p>
                <p>
                  <a href="brandkit">Brand Assets</a>
                </p>
              </div>
            </div>
            <div className="md:col-span-1">
              <p className="title-text-footer">Useful Links</p>
              <div className="sub-title-text">
                <p>Terms and Conditions</p>
                <p>
                  <a href="/privacy-policy" className="cursor-pointer">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="min-h-0 py-5 px-6  mb-6 lg:mb-0 bg-[#0F151A] flex justify-center mt-8 font-monserrat">
        <span className="font-normal">
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
