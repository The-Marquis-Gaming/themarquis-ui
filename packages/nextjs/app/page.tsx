"use client";
import Image from "next/image";
import React from "react";
import "./styles/styles.css";
import { Footer } from "~~/components/Footer";
import LandingPage from "~~/components/Landingpage";

export default function Home() {
  return (
    <div className="lasserit-font">
      <LandingPage />
      {/* Footer */}
      <div className="mt-[200px]">
        <div className="max-w-[1700px] mx-auto flex flex-col w-full px-8">
          <div className="flex flex-col justify-start m-inline">
            <Image src="logo-marquis.svg" alt="logo" width={357} height={100} />
            <div className="flex gap-4 m-inline mt-[40px] mb-[82px]">
              <a>
                <Image src="/x.png" alt="x" width={30} height={30} />
              </a>
              <a>
                <Image
                  src="/message.png"
                  alt="message"
                  width={30}
                  height={30}
                />
              </a>
              <a>
                <Image
                  src="/discord.png"
                  alt="discord"
                  width={30}
                  height={30}
                />
              </a>
              <a>
                <Image
                  src="/youtube.png"
                  alt="youtube"
                  width={30}
                  height={30}
                />
              </a>
            </div>
          </div>
          <div className="text-footer grid grid-cols-1 md:grid-cols-5 gap-10 font-monserrat">
            <div className="md:col-span-2 md:order-4 order-first">
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
            </div>

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
                <p>Blogs</p>
                <p>Brand Assets</p>
              </div>
            </div>
            <div className="md:col-span-1">
              <p className="title-text-footer">Useful Links</p>
              <div className="sub-title-text">
                <p>Terms and Conditions</p>
                <p>Privacy Policy</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
