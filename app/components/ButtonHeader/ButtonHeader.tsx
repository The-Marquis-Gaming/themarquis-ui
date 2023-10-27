/* eslint-disable react/jsx-no-undef */
import React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import DegradeButton from '../DegradeButton/DegradeButton';

const ButtonToggle = () => {
  const [showElements, setShowElements] = useState(false);

  const toggleElements = () => {
    setShowElements(!showElements);
  };

  return (
    <div>
      <DegradeButton onclick={toggleElements} > Connect Wallet</DegradeButton>
      {showElements && (
        <div className='flex gap-4'>
          <DegradeButton>
            <Image alt={image} src="/images/button1.png" width={10} heigth={10}></Image>
            32
          </DegradeButton>
          <button className='border border-solid border-white'></button>
        </div>
      )}
    </div>
  );
};

export default ButtonToggle;
