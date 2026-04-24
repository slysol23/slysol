'use client';

import React from 'react';
import PortfolioHero from './HeroSection';
import PortfolioSidebar from './Sidebar';
import PortfolioDetails from './Details';
import PortfolioLoadingState from './LoadingState';
// import PortfolioErrorState from './ErrorState';
import usePortfolioShowcase from '../../hooks/usePortfolioShowcase';

const Showcase = () => {
  const {
    categories,
    categoriesLoading,
    categoriesNotice,
    categoryLabel,
    handleCategoryChange,
    handleReset,
    handleSelectProject,
    heroHeadline,
    heroImage,
    isSidebarCollapsed,
    products,
    productsError,
    productsLoading,
    selectedCategoryId,
    selectedProduct,
    selectedProductId,
    setIsSidebarCollapsed,
    toggleSidebarCollapse,
    visibleProducts,
  } = usePortfolioShowcase();

  if (productsLoading && products.length === 0) {
    return <PortfolioLoadingState />;
  }

  const mainContent = <PortfolioDetails product={selectedProduct} />;

  return (
    <div className="min-h-screen font-basic text-dark">
      <section className="mx-auto max-w-400 px-4 pb-12 pt-6 sm:pb-16 sm:pt-8 lg:pt-10">
        <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-start lg:gap-8">
          <div
            className={`order-1 w-full min-w-0 shrink-0 transition-all duration-300 ease-in-out lg:sticky lg:top-8 lg:self-start lg:overflow-visible ${
              isSidebarCollapsed ? 'lg:w-0' : 'lg:w-90'
            }`}
          >
            <PortfolioSidebar
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onCategoryChange={handleCategoryChange}
              projects={visibleProducts}
              selectedProductId={selectedProductId}
              onSelectProject={handleSelectProject}
              categoriesLoading={categoriesLoading}
              categoriesNotice={categoriesNotice}
              onToggleCollapse={toggleSidebarCollapse}
              isCollapsed={isSidebarCollapsed}
            />
          </div>

          <div className="order-2 min-w-0 flex-1 space-y-6 lg:space-y-8">
            <PortfolioHero
              product={selectedProduct}
              imageSrc={heroImage}
              categoryLabel={categoryLabel}
              headline={heroHeadline}
              sidebarCollapsed={isSidebarCollapsed}
              onToggleSidebar={() => setIsSidebarCollapsed(false)}
            />

            <div className="min-w-0">{mainContent}</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Showcase;
