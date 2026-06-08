'use client';

import Image from 'next/image';
import { FaChevronRight } from 'react-icons/fa6';
import { getFirstImage, ProductItem } from 'hooks/useProducts';

interface PortfolioSidebarProjectListProps {
  projects: ProductItem[];
  selectedProductId: number | null;
  onSelectProject: (project: ProductItem) => void;
}

const PortfolioSidebarProjectList = ({
  projects,
  selectedProductId,
  onSelectProject,
}: PortfolioSidebarProjectListProps) => {
  if (projects.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-black/10 bg-white/70 p-4 text-sm leading-6 text-mute sm:leading-7">
        No published projects match this category yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => {
        const active = selectedProductId === project.id;
        const image = getFirstImage(project.images);
        const fallbackInitials = project.title.slice(0, 2).toUpperCase();

        return (
          <button
            key={project.id}
            type="button"
            onClick={() => onSelectProject(project)}
            aria-pressed={active}
            className={`group flex w-full items-center gap-2.5 rounded-[1.35rem] border p-2.5 text-left transition duration-300 sm:gap-3 sm:p-3 ${
              active
                ? 'border-primary2/15 bg-white shadow-sm'
                : 'border-transparent hover:-translate-y-0.5 hover:bg-gray-100 hover:shadow-sm'
            }`}
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-slate sm:h-14 sm:w-14">
              {image ? (
                <Image
                  src={image}
                  alt={project.title}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 48px, 56px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate to-white text-xs font-semibold text-dark/60 sm:text-sm">
                  {fallbackInitials}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.92rem] font-semibold text-dark transition group-hover:text-primary2 sm:text-sm">
                {project.title}
              </p>
              <p className="mt-1 text-[11px] text-mute sm:text-xs">
                {project.productCategory?.name || project.category}
              </p>
            </div>

            <FaChevronRight className="hidden h-4 w-4 text-mute transition group-hover:translate-x-0.5 sm:block" />
          </button>
        );
      })}
    </div>
  );
};

export default PortfolioSidebarProjectList;
