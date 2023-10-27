import React from "react";
import { useState } from 'react';
import Image from "next/image";

interface ImageCarouselProps {
  images: string;
}


const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  return (
    <div>
      <Image src={images[currentIndex]} alt="Image" />
      <button onClick={prevImage}>Anterior</button>
      <button onClick={nextImage}>Siguiente</button>
    </div>
  );
};

export default ImageCarousel;
