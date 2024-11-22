import Image from "next/image";
import IconDowload from "@/public/landingpage/iconDowload.svg";
import Mobile from "@/public/landingpage/mobile.png";
import Modal from "../Modal/Modal";
import { useState } from "react";

export default function DownloadMarquis() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleDownloadClick = () => {
    const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent.toLowerCase() : '';
    
    if (/android/i.test(userAgent)) {
      window.open('https://play.google.com/store/apps/details?id=com.marquis.app', '_blank');
    } else if (/iphone|ipad|ipod/i.test(userAgent)) {
      window.open('https://apps.apple.com/us/app/the-marquis-early-access/id6695763058', '_blank');
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="text-center flex flex-col md:gap-20 gap-14">
      <div className="md:mb-12 mb-0">
        <p className="md:text-[32px] text-[16px] text-[#9B9B9B]">
          Marquis on Mobile
        </p>
        <p className="text-[20px] md:text-[48px] color-title">
          Created by gamers, tailored for gamers.
        </p>
      </div>
      <div className="relative w-full lg:h-[550px] h-[150px] lg:mt-[30px] mt-0 detect-bg">
        <div className="absolute detect-bg-circle w-fit md:p-[80px] p-3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Image
            src={Mobile}
            width={637}
            height={711}
            alt="mobile"
            className="mx-auto"
          />
        </div>
      </div>
      <div
        onClick={handleDownloadClick}
        className="flex gap-8 btn-download-mobile normal-button button-style hover:bg-[#353535] items-center justify-center bg-[#272727]"
        style={{
          margin: "50px auto 0 auto",
        }}
      >
        <p className="md:text-[24px] text-[14px]">Download on Mobile</p>
        <Image src={IconDowload} width={12} height={12} alt="banner" />
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div 
          className={`transform transition-all duration-300 ease-out ${isModalOpen ? 'translate-y-0' : 'translate-y-full'} bg-[#272727] p-8 rounded-lg text-center`}
        >
          <h2 className="text-xl font-bold mb-4">Mobile App Only</h2>
          <p className="mb-6">This application is only available on mobile devices.</p>
          <button 
            onClick={handleCloseModal} 
            className="bg-black text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}
