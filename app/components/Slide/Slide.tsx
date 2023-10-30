'use client'
import React from 'react';
import Image from 'next/image';
import DegradeButton from '../DegradeButton/DegradeButton';

interface SlideProps {
  content: React.ReactNode;
}

const Slide: React.FC<SlideProps> = ({ content }) => {
  return (
    <div className="slide">
        <div className="flex bg-dark-gray w-[1100px] h-[400px] rounded-r-lg border-carousel">
            <div className="box-image">
              <Image
                src={`/imagesCarousel/roulette_1.png`}
                alt="Descripción de la imagen"
                width={520}
                height={400}
              />
            </div>
          <div className="flex flex-col justify-center item-center p-[48px] box-content">
            <div className="">
              <p className="text-[56px] font-bold font-agencyFb">
                The Roulette
              </p>
              <span className="w-[439px font-['Helvetica']">
                Roulette is a futuristic version of the classic casino game. Players can choose from traditional betting options or use AI-generated bets based on probability distributions and predictive modeling.
              </span>
            </div>
            <div className="flex justify-end">
              <div>
                <DegradeButton size="small"> PLAY NOW</DegradeButton>
              </div>
            </div>
          </div>
          </div>
        
    </div>
    
  );
};

export default Slide;
