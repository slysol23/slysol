import React from 'react';
import { BsFillPlayFill } from 'react-icons/bs';

const VideoButton = () => {
  return (
    <div className="relative max-w-fit">
      <div className="h-[70px] w-[70px] border border-primary2 absolute animate-customPulse rounded-full -top-[10px] -left-[10px]"></div>
      <div className="h-[50px] w-[50px] rounded-full text-white bg-primary2 relative flex items-center justify-center">
        <BsFillPlayFill className="text-2xl" />
      </div>
    </div>
  );
};

export default VideoButton;
