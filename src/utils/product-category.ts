// utils/product-category.ts

export function normalizeCategoryName(name: string): string {
  const cleaned = name.trim().replace(/\s+/g, ' ');
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
}

export function normalizeCategoryId(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, '-'); // Simply replace spaces with hyphens
}
