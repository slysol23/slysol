import { normalizeCategoryId } from '@/utils/product-category';

export interface PortfolioProductLike {
  productCategory?: {
    id: string;
  } | null;
  categoryId: string;
}

export const normalizePortfolioSlugSegment = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/['"`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const createPortfolioHash = (categoryId: string, title: string) => {
  const categorySegment = normalizeCategoryId(categoryId);
  const slugSegment = normalizePortfolioSlugSegment(title);

  return categorySegment ? `${categorySegment}/${slugSegment}` : slugSegment;
};

export const parsePortfolioHashSegments = (value: string) => {
  const [categorySegment = '', slugSegment = ''] = value.split('/');

  return {
    categorySegment: categorySegment ? decodeURIComponent(categorySegment) : '',
    slugSegment: slugSegment ? decodeURIComponent(slugSegment) : '',
  };
};

export const getPortfolioProductCategoryId = (
  product: PortfolioProductLike,
) => product.productCategory?.id ?? product.categoryId ?? '';
