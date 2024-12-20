import Image from 'next/image';

import pt1 from "@/public/landingpage/partner1.svg";
import pt2 from "@/public/landingpage/partner2.svg";
import pt3 from "@/public/landingpage/partner3.svg";
import pt4 from "@/public/landingpage/partner4.svg";

export default function PartnershipSection() {
  const partners = [
    {
      name: "SwarmZero",
      logo: pt1,
    },
    {
      name: "Flex Marketplace",
      logo: pt2,
    },
    {
      name: "D'islands",
      logo: pt3,
    },
    {
      name: "OpenMark",
      logo: pt4,
    },
  ]

  return (
    <section className="w-full py-10 md:py-20">
      <div className="container px-8 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center">
          <div className="md:mb-12 mb-0">
            <p className="md:text-[32px] text-[16px] !font-lasserit text-[#9B9B9B]">
              Marquis Partnerships
            </p>
          </div>
          
          <div className="md:mb-16 mb-3 flex relative w-fit mx-auto">
            <h2 className="landing-title !font-lasserit ">
              Shaping the Future of Gaming Together
            </h2>
          </div>
          <div className="flex flex-row justify-around items-center w-full">
            {partners?.map((partner) => (
              <div
                key={partner.name}
                className="overflow-x-hidden flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#1A1B1E] to-[#141517] w-[10rem] h-[8.5rem] sm:w-[10rem] sm:h-[8rem] md:w-[17.5rem] md:h-[14.875rem] lg:w-[20rem] lg:h-[17rem] mx-2"
              >
                <div className="sm:w-8 sm:h-8 md:w-16 md:h-16 lg:w-24 lg:h-24 sm:mb-2 md:mb-3 lg:mb-4 relative">
                  <Image
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      sizes="(max-width: 640px) 34px, (max-width: 768px) 64px, (max-width: 1024px) 100px, 100px"
                      
                      style={{
                        
                      }}
                    />
                </div>
                <h3 className="mt-4 text-white sm:text-md lg:text-[2rem] !font-lasserit font-bold whitespace-nowrap">{partner.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

