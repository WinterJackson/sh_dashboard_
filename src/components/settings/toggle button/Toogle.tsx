"use client";  // Add this at the top

import { useState } from 'react';

const Toggle = () => {
  const [isFirstImage, setIsFirstImage] = useState(true);

  return (
    <div className="flex  flex-1 h30px items-center  justify-between">
    
      {/* First Image */}
      <div className="relative flex h-full  "
        onClick={() => setIsFirstImage(!isFirstImage)}
        >
      <img
        src="/images/Property 1=off.svg"
        alt="First"
        className={`object-cover transition-opacity duration-500 ${isFirstImage ? 'opacity-100' : 'opacity-0'}`}
      />
      {/* Second Image */}
      <img
        src="/images/Property 1=on.svg"
        alt="Second"
        className={`absolute object-cover transition-opacity duration-500 ${isFirstImage ? 'opacity-0' : 'opacity-100'}`}
      />
      </div>
    </div>
  );
};

export default Toggle;