'use client';

import { FaChevronLeft } from 'react-icons/fa6';
import { ProductCategory, ProductItem } from 'hooks/useProducts';
import PortfolioSidebarCategorySelect from './CategorySelect';
import PortfolioSidebarProjectList from './ProjectList';

interface PortfolioSidebarProps {
  categories: ProductCategory[];
  selectedCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
  projects: ProductItem[];
  selectedProductId: number | null;
  onSelectProject: (project: ProductItem) => void;
  categoriesLoading?: boolean;
  categoriesNotice?: string | null;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const PortfolioSidebar = ({
  categories,
  selectedCategoryId,
  onCategoryChange,
  projects,
  selectedProductId,
  onSelectProject,
  categoriesLoading = false,
  categoriesNotice,
  isCollapsed,
  onToggleCollapse,
}: PortfolioSidebarProps) => {
  const sidebarContentState = isCollapsed
    ? 'lg:opacity-0 lg:invisible lg:pointer-events-none lg:-translate-x-3 lg:scale-[0.98]'
    : 'lg:opacity-100 lg:visible lg:translate-x-0 lg:scale-100';

  return (
    <aside className="relative w-full">
      <div
        aria-hidden={isCollapsed}
        className={`relative w-full transition-all duration-300 ease-in-out ${sidebarContentState}`}
      >
        <div className="overflow-visible rounded-4xl border border-black/5 bg-white/90 shadow-sm backdrop-blur">
          <div className="space-y-4 p-4 sm:space-y-5 sm:p-5">
            <PortfolioSidebarCategorySelect
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onCategoryChange={onCategoryChange}
              isLoading={categoriesLoading}
            />

            {categoriesNotice && (
              <div className="rounded-[1.35rem] border border-dashed border-black/10 bg-[#faf8f4] px-4 py-3 text-xs leading-6 text-mute sm:text-sm">
                {categoriesNotice}
              </div>
            )}

            <div className="flex items-end justify-between gap-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#5c5f68] sm:text-xs">
                Projects
              </p>
              <span className="text-xs text-mute sm:text-sm">
                {projects.length}
              </span>
            </div>

            <div className="max-h-112 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent sm:max-h-[calc(100vh-320px)]">
              <PortfolioSidebarProjectList
                projects={projects}
                selectedProductId={selectedProductId}
                onSelectProject={onSelectProject}
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleCollapse}
          className="absolute -right-5 top-6 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/5 bg-white text-dark shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md lg:inline-flex"
          aria-label="Collapse sidebar"
          title="Collapse sidebar"
        >
          <FaChevronLeft className="h-5 w-5" />
        </button>
      </div>
    </aside>
  );
};

export default PortfolioSidebar;
