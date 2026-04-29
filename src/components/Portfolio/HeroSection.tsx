'use client';

import Image from 'next/image';
import Carousal from '@/components/Slider';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa6';
import type { ProductItem } from 'hooks/useProducts';
import { getStringList } from 'hooks/useProducts';

interface PortfolioHeroProps {
  product: ProductItem | null;
  imageSrc: string;
  categoryLabel: string;
  headline: string;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

const PortfolioHero = ({
  product,
  imageSrc,
  categoryLabel,
  headline,
  sidebarCollapsed = false,
  onToggleSidebar,
}: PortfolioHeroProps) => {
  const title = product?.title ?? headline;
  const imageList = getStringList(product?.images);
  const displayImages = imageList.length > 0 ? imageList : [imageSrc];
  const hasMultipleImages = displayImages.length > 1;
  const slideHeight =
    'relative h-[clamp(320px,50vh,540px)] w-full sm:h-[clamp(360px,52vh,620px)] md:h-[clamp(380px,56vh,680px)] lg:h-[clamp(420px,60vh,720px)]';

  return (
    <section id="portfolio-hero" className="w-full">
      <div className="overflow-hidden rounded-4xl border border-black/5 bg-white shadow-sm sm:rounded-[2.5rem]">
        <div className="relative isolate min-h-[clamp(200px,40vh,450px)] sm:min-h-[clamp(360px,52vh,620px)] md:min-h-[clamp(380px,56vh,680px)] lg:min-h-[clamp(420px,60vh,720px)]">
          {hasMultipleImages ? (
            <Carousal
              className="pt-4 sm:pt-8 md:pt-10"
              items={1}
              margin={0}
              loop
              autoplay
              autoplayTimeout={3000}
              autoplaySpeed={800}
              autoplayHoverPause={true}
              nav
              navNodes={[
                <div
                  key="portfolio-prev"
                  className="p-2 rounded-full bg-white hidden xs:block"
                >
                  <FaChevronLeft className="h-5 w-5 text-blue-600" />
                </div>,
                <div key="portfolio-next" className="p-2 rounded-full bg-white">
                  <FaChevronRight className="h-5 w-5 text-blue-600" />
                </div>,
              ]}
            >
              {displayImages.map((src, index) => (
                <div key={`${title}-${index}`} className={slideHeight}>
                  <Image
                    src={src}
                    alt={`${title} ${index + 1}`}
                    fill
                    unoptimized
                    priority={index === 0}
                    className="object-contain object-center"
                  />
                </div>
              ))}
            </Carousal>
          ) : (
            <div className="absolute inset-0 z-0">
              <Image
                src={displayImages[0]}
                alt={title}
                fill
                unoptimized
                priority
                className="object-cover"
              />
            </div>
          )}

          {sidebarCollapsed && onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="absolute left-4 top-1/12 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/5 bg-white/95 text-dark shadow-sm backdrop-blur transition hover:shadow-md sm:left-5 sm:h-11 sm:w-11"
              aria-label="Expand sidebar"
              title="Expand sidebar"
            >
              <FaChevronRight className="h-5 w-5" />
            </button>
          )}

          <div>
            <div className="p-4 sm:p-5 lg:p-10">
              <span className="inline-flex rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-dark shadow-sm backdrop-blur sm:px-4 sm:py-2 sm:text-sm">
                {categoryLabel}
              </span>

              <h1 className="mt-4 max-w-[75%] truncate font-neue text-3xl font-bold leading-[1.05] tracking-[-0.05em] text-dark sm:mt-5 sm:text-3xl md:text-4xl lg:text-5xl">
                {title}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioHero;
