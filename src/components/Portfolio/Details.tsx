'use client';

import React from 'react';
import { getTechStackLabel } from '@/utils/techstack';
import { getStringList, ProductItem } from 'hooks/useProducts';
import { RichTextHtmlBlock, hasRichTextContent } from './RichTextPreview';
import { MdOutlineDescription } from 'react-icons/md';
import {
  FaExclamationTriangle,
  FaLightbulb,
  FaTrophy,
  FaComments,
  FaCode,
  FaLaptopCode,
} from 'react-icons/fa';
import { GrOverview } from 'react-icons/gr';

interface PortfolioDetailsProps {
  product: ProductItem;
}

const SectionHeading = ({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
}) => (
  <div className="flex items-center gap-2">
    <span className="text-lg text-[#5c5f68] sm:text-xl">{icon}</span>
    <p className="text-xl font-bold uppercase tracking-[0.24em] text-[#5c5f68] sm:text-2xl sm:tracking-[0.28em]">
      {children}
    </p>
  </div>
);

const PortfolioDetails = ({ product }: PortfolioDetailsProps) => {
  const techStack = getStringList(product.techstack);
  const hasTechStack = techStack.length > 0;

  const cases = [
    {
      label: 'Challenge',
      value: product.challenges,
      emptyMessage: 'No challenge notes have been added yet.',
      icon: <FaExclamationTriangle className="text-[#5c5f68]" />,
    },
    {
      label: 'Approach',
      value: product.approach,
      emptyMessage: 'No approach notes have been added yet.',
      icon: <FaLightbulb className="text-[#5c5f68]" />,
    },
    {
      label: 'Outcomes',
      value: product.outcomes,
      emptyMessage: 'No outcome notes have been added yet.',
      icon: <FaTrophy className="text-[#5c5f68]" />,
    },
    {
      label: 'Feedback',
      value: product.feedback,
      emptyMessage: 'No feedback notes have been added yet.',
      icon: <FaComments className="text-[#5c5f68]" />,
    },
  ].filter((block) => hasRichTextContent(block.value));

  const challengeAndApproach = cases.filter(
    (block) => block.label === 'Challenge' || block.label === 'Approach',
  );
  const supportingBlocks = cases.filter(
    (block) => block.label === 'Outcomes' || block.label === 'Feedback',
  );

  const challengeGridColumns =
    challengeAndApproach.length === 1 ? 'md:grid-cols-1' : 'md:grid-cols-2';
  const supportingGridColumns =
    supportingBlocks.length === 1 ? 'md:grid-cols-1' : 'md:grid-cols-2';

  return (
    <section>
      <div className="space-y-4 sm:space-y-6">
        {/* Overview */}
        <div>
          <SectionHeading icon={<GrOverview />}>Overview</SectionHeading>
          <div className="mt-3 max-w-4xl">
            <RichTextHtmlBlock
              value={product.overview}
              emptyMessage="No overview has been added yet."
              className="text-sm leading-7 text-[#535862] sm:text-base sm:leading-8"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <SectionHeading icon={<MdOutlineDescription />}>
            Description
          </SectionHeading>
          <div className="mt-3 max-w-5xl">
            <RichTextHtmlBlock
              value={product.description}
              emptyMessage="No description has been added yet."
              className="text-sm leading-7 text-[#535862] sm:text-[1.02rem] sm:leading-8"
            />
          </div>
        </div>

        {/* Challenge & Approach - 2 columns */}
        {challengeAndApproach.length > 0 && (
          <div className={`grid gap-3 sm:gap-4 ${challengeGridColumns}`}>
            {challengeAndApproach.map((block) => (
              <div
                key={block.label}
                className="w-full rounded-3xl border border-black/5 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#5c5f68] sm:text-base">
                    {block.icon}
                  </span>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-mute sm:text-[11px]">
                    {block.label}
                  </p>
                </div>
                <div className="mt-4">
                  <RichTextHtmlBlock
                    value={block.value}
                    emptyMessage={block.emptyMessage}
                    className="text-sm leading-7 text-[#535862] sm:text-base sm:leading-8"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Outcomes & Feedback */}
        {supportingBlocks.length > 0 && (
          <div className={`grid gap-3 sm:gap-4 ${supportingGridColumns}`}>
            {supportingBlocks.map((block) => (
              <div
                key={block.label}
                className="w-full rounded-3xl border border-black/5 bg-white p-4 shadow-sm sm:p-4"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#5c5f68] sm:text-base">
                    {block.icon}
                  </span>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-mute sm:text-[11px]">
                    {block.label}
                  </p>
                </div>
                <div className="mt-4">
                  <RichTextHtmlBlock
                    value={block.value}
                    emptyMessage={block.emptyMessage}
                    className="text-sm leading-7 text-[#535862] sm:text-base sm:leading-8"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tech Stack */}
        {hasTechStack && (
          <div className="w-full rounded-3xl border border-black/5 bg-white p-3 shadow-sm sm:p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#5c5f68] sm:text-base">
                <FaCode />
              </span>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-mute sm:text-[11px]">
                Tech Stack
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2.5 sm:gap-3">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-black/5 bg-white px-3 py-1.5 text-xs font-semibold text-dark shadow-sm sm:px-4 sm:py-2 sm:text-sm"
                >
                  <span className="mr-1.5 inline-flex items-center">
                    <FaLaptopCode className="text-[10px] text-[#5c5f68] sm:text-xs" />
                  </span>
                  {getTechStackLabel(tech)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PortfolioDetails;
