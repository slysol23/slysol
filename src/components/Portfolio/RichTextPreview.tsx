'use client';

import DOMPurify from 'dompurify';
import React from 'react';

interface RichTextPreviewProps {
  value?: string | null;
  emptyMessage: string;
  lines?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

const LINE_CLAMP_CLASSES: Record<
  NonNullable<RichTextPreviewProps['lines']>,
  string
> = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
  5: 'line-clamp-5',
  6: 'line-clamp-6',
};

const getVisibleText = (html: string) => {
  if (typeof document === 'undefined') {
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  const container = document.createElement('div');
  container.innerHTML = html;

  return (container.textContent || container.innerText || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const RichTextPreview = ({
  value,
  emptyMessage,
  lines = 4,
  className = '',
}: RichTextPreviewProps) => {
  const sanitized = DOMPurify.sanitize(value || '');
  const visibleText = getVisibleText(sanitized);

  if (!visibleText) {
    return (
      <p
        className={`text-sm leading-6 wrap-break-word text-black ${className}`}
      >
        {emptyMessage}
      </p>
    );
  }

  return (
    <p
      className={`max-w-none wrap-break-word text-sm leading-6 overflow-hidden text-black ${LINE_CLAMP_CLASSES[lines]} ${className}`}
    >
      {visibleText}
    </p>
  );
};

export default RichTextPreview;
