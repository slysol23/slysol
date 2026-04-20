export function getBlogImageSrc(image?: string | null): string | null {
  if (!image) return null;

  if (
    image.startsWith('http://') ||
    image.startsWith('https://') ||
    image.startsWith('/') ||
    image.startsWith('data:')
  ) {
    return image;
  }

  return `data:image/jpeg;base64,${image}`;
}

export function isEditableBlogImage(image?: string | null): boolean {
  if (!image) return false;

  return (
    image.startsWith('http://') ||
    image.startsWith('https://') ||
    image.startsWith('/')
  );
}
