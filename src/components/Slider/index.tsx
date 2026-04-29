'use client';

import React, { ReactNode, useRef } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface CarouselProps {
  autoplay?: boolean;
  autoplayTimeout?: number;
  autoplaySpeed?: number;
  autoplayHoverPause?: boolean;
  children: ReactNode;
  className?: string;
  center?: boolean;
  responsive?: Record<number, { items: number }>;
  items?: number;
  margin?: number;
  nav?: boolean;
  dots?: boolean;
  loop?: boolean;
  navText?: string[];
  navNodes?: [ReactNode, ReactNode];
  slideBy?: number;
  smartSpeed?: number;
}

export default function Carousal({
  autoplay = true,
  autoplayTimeout = 2000,
  autoplaySpeed = 2000,
  autoplayHoverPause = true,
  children,
  className = '',
  center = false,
  responsive = {},
  items = 1,
  margin = 20,
  nav = false,
  dots = false,
  loop = true,
  navText = [],
  navNodes,
  slideBy = 1,
  smartSpeed,
}: CarouselProps) {
  const slides = React.Children.toArray(children);
  const swiperRef = useRef<SwiperType | null>(null);
  const useCustomNavigation =
    nav && ((navNodes?.length ?? 0) === 2 || navText.length === 2);

  const breakpoints = Object.fromEntries(
    Object.entries(responsive).map(([key, value]) => [
      Number(key),
      {
        slidesPerView: value.items,
        slidesPerGroup: slideBy,
      },
    ]),
  );

  return (
    <div className={className}>
      <div className="relative">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          slidesPerView={items}
          slidesPerGroup={slideBy}
          centeredSlides={center}
          spaceBetween={margin}
          loop={loop}
          navigation={nav && !useCustomNavigation}
          pagination={dots ? { clickable: true } : false}
          autoplay={
            autoplay
              ? {
                  delay: autoplayTimeout,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: autoplayHoverPause,
                }
              : false
          }
          speed={smartSpeed ?? autoplaySpeed}
          breakpoints={breakpoints}
        >
          {slides.map((child, index) => (
            <SwiperSlide key={index}>{child}</SwiperSlide>
          ))}
        </Swiper>
        {useCustomNavigation ? (
          <div className="carousel-nav">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => swiperRef.current?.slidePrev()}
            >
              {navNodes ? (
                navNodes[0]
              ) : (
                <span dangerouslySetInnerHTML={{ __html: navText[0] }} />
              )}
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => swiperRef.current?.slideNext()}
            >
              {navNodes ? (
                navNodes[1]
              ) : (
                <span dangerouslySetInnerHTML={{ __html: navText[1] }} />
              )}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
