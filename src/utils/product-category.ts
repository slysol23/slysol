export function normalizeCategoryName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

export function normalizeCategoryId(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, '-');
}

export const PRODUCT_CATEGORY_PAGE_SIZE = 20;
