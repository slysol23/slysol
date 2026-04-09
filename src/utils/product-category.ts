export const normalizeCategoryName = (value: string) =>
  value.trim().replace(/\s+/g, ' ');

export const normalizeCategoryLookupId = (value: string) =>
  value.trim().replace(/\s+/g, '_').toUpperCase();

export const normalizeCategoryId = (value: string) =>
  normalizeCategoryName(value)
    .replace(/[0-9]+/g, ' ')
    .replace(/[^a-zA-Z]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase();
