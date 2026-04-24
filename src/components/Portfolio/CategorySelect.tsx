'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaCheck, FaChevronDown, FaTableCellsLarge } from 'react-icons/fa6';
import { ProductCategory } from 'hooks/useProducts';

interface PortfolioSelectProps {
  categories: ProductCategory[];
  selectedCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
  isLoading?: boolean;
}

const PortfolioSidebarCategorySelect = ({
  categories,
  selectedCategoryId,
  onCategoryChange,
  isLoading = false,
}: PortfolioSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDisabled = isLoading && categories.length === 0;

  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId,
  );
  const selectedLabel = selectedCategory?.name || 'All Projects';

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isDisabled) {
      setIsOpen(false);
    }
  }, [isDisabled]);

  const handleSelect = (nextCategoryId: string) => {
    onCategoryChange(nextCategoryId);
    setIsOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#5c5f68] sm:text-[11px]">
          Category
        </p>
      </div>

      <div ref={containerRef} className="relative mt-3">
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          disabled={isDisabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className="group flex w-full items-center gap-3 rounded-[1.4rem] border border-black/5  px-4 py-3.5 text-left transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(15,23,42,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f7f4ef] text-[#5c5f68] shadow-inner">
            <FaTableCellsLarge className="h-4 w-4 sm:h-[1.05rem] sm:w-[1.05rem]" />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.24em] text-[#5c5f68] sm:text-[11px]">
              Category
            </span>
            <span className="block truncate p-1 text-sm font-semibold text-dark sm:text-[0.98rem]">
              {isDisabled ? 'Loading categories...' : selectedLabel}
            </span>
          </span>

          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="text-[#5c5f68]"
          >
            <FaChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
          </motion.span>
        </button>

        <AnimatePresence>
          {isOpen && !isDisabled && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.985 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="absolute z-30 mt-3 w-full origin-top overflow-hidden rounded-3xl border border-black/5 bg-white/95 shadow-[0_28px_60px_rgba(15,23,42,0.12)] backdrop-blur p-1"
            >
              <div className="max-h-72 overscroll-contain overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <button
                  type="button"
                  onClick={() => handleSelect('')}
                  className={`flex w-full items-center justify-between rounded-[1.1rem] px-5 py-3 text-left text-sm font-semibold transition-all duration-200 ${
                    selectedCategoryId === ''
                      ? 'bg-[#f7f4ef] text-dark shadow-sm'
                      : 'text-dark/80 hover:bg-[#f7f4ef]/80 hover:text-dark'
                  }`}
                >
                  <span className="truncate">All Projects</span>
                  {selectedCategoryId === '' && (
                    <FaCheck className="h-3.5 w-3.5 text-[#5c5f68]" />
                  )}
                </button>

                {categories.length > 0 && (
                  <div className="my-2 h-px bg-black/5" />
                )}

                {categories.map((category) => {
                  const active = selectedCategoryId === category.id;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleSelect(category.id)}
                      className={`flex w-full items-center justify-between rounded-[1.1rem] px-5 py-3 text-left text-sm font-semibold transition-all duration-200 ${
                        active
                          ? 'bg-[#f7f4ef] text-dark shadow-sm'
                          : 'text-dark/80 hover:bg-[#f7f4ef]/80 hover:text-dark'
                      }`}
                    >
                      <span className="truncate">{category.name}</span>
                      {active && (
                        <FaCheck className="h-3.5 w-3.5 text-[#5c5f68]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PortfolioSidebarCategorySelect;
