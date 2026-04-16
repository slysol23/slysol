'use client';

import DOMPurify from 'dompurify';
import React, { useEffect, useState } from 'react';
import MainHeading from '../MainHeading';
import SubTitle from '../SubTitle';
import { formatDate, getStringList, ProductItem } from 'hooks/useProducts';
import { getTechStackLabel } from '@/utils/techstack';

type TabKey =
  | 'description'
  | 'overview'
  | 'challenges'
  | 'approach'
  | 'outcomes'
  | 'feedback'
  | 'techstack';

interface PortfolioTabsProps {
  product: ProductItem | null;
  isLoading?: boolean;
}

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: 'overview', label: 'Overview' },
  { key: 'description', label: 'Description' },
  { key: 'challenges', label: 'Challenges' },
  { key: 'approach', label: 'Approach' },
  { key: 'outcomes', label: 'Outcomes' },
  { key: 'feedback', label: 'Feedback' },
  { key: 'techstack', label: 'Tech Stack' },
];

const renderRichText = (value: string, emptyMessage: string) => {
  const sanitized = DOMPurify.sanitize(value || '');

  if (!sanitized.trim()) {
    return (
      <p className="text-sm leading-7 wrap-break-word text-mute">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div
      className="ck-content prose prose-slate max-w-none wrap-break-word prose-headings:font-bold prose-headings:wrap-break-word prose-p:my-3 prose-p:wrap-break-word prose-li:my-1 prose-li:wrap-break-word prose-a:text-black prose-a:wrap-break-word prose-pre:whitespace-pre-wrap prose-pre:wrap-break-word prose-table:block prose-table:max-w-full prose-table:overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
};

const PortfolioTabs = ({ product, isLoading = false }: PortfolioTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabKey>('description');

  useEffect(() => {
    setActiveTab('description');
  }, [product?.id]);

  if (isLoading && !product) {
    return (
      <section className="rounded-4xl border border-slate-200 bg-white p-5 shadow-[0_30px_80px_rgba(15,23,42,0.08)] sm:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-40 rounded-full bg-slate" />
          <div className="h-8 w-3/4 rounded-2xl bg-slate" />
          <div className="h-4 w-1/2 rounded-full bg-slate" />
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <div key={tab.key} className="h-10 w-28 rounded-full bg-slate" />
            ))}
          </div>
          <div className="h-56 rounded-3xl bg-slate" />
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="rounded-4xl border border-dashed border-slate-300 bg-white p-5 shadow-[0_30px_80px_rgba(15,23,42,0.08)] sm:p-6">
        <SubTitle text="CASE STUDY DETAILS" />
        <MainHeading text="Pick a category to start" className="mt-2" />
      </section>
    );
  }

  const techStack = getStringList(product.techstack);
  const categoryLabel = product.productCategory?.name || product.category;
  const activeTabLabel =
    tabs.find((tab) => tab.key === activeTab)?.label || 'Overview';

  const overview = () => (
    <div className="space-y-4 overflow-hidden rounded-xl bg-white p-2 text-black">
      {renderRichText(
        product.overview,
        'No overview content has been added yet.',
      )}
    </div>
  );

  const description = () => (
    <div className="space-y-4 overflow-hidden rounded-xl bg-white p-2">
      {renderRichText(
        product.description,
        'No description content has been added yet.',
      )}
    </div>
  );

  const renderWhitePanel = (value: string, emptyMessage: string) => (
    <div className="space-y-4 overflow-hidden rounded-xl bg-white p-2">
      {renderRichText(value, emptyMessage)}
    </div>
  );

  const techstack = () =>
    techStack.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {techStack.map((stack) => (
          <span
            key={stack}
            className="rounded-full border border-primary2/10 bg-white px-3 py-2 text-sm font-semibold text-primary2 shadow-sm"
          >
            {getTechStackLabel(stack)}
          </span>
        ))}
      </div>
    ) : (
      <p className="text-sm leading-7 text-mute">
        No technologies were added for this project yet.
      </p>
    );

  const tabContent = {
    description: description(),
    overview: overview(),
    challenges: renderWhitePanel(
      product.challenges,
      'No challenges content has been added yet.',
    ),
    approach: renderWhitePanel(
      product.approach,
      'No approach content has been added yet.',
    ),
    outcomes: renderWhitePanel(
      product.outcomes,
      'No outcomes content has been added yet.',
    ),
    feedback: renderWhitePanel(
      product.feedback,
      'No feedback content has been added yet.',
    ),
    techstack: techstack(),
  } satisfies Record<TabKey, React.ReactNode>;

  return (
    <section className="rounded-4xl border border-slate-200 bg-white p-5 shadow-[0_30px_80px_rgba(15,23,42,0.08)] sm:p-6">
      <div className="flex flex-col gap-3">
        <SubTitle text="CASE STUDY DETAILS" />
        <MainHeading text={activeTabLabel} className="mt-1" />

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-slate px-3 py-1 text-xs font-semibold text-dark">
            {categoryLabel}
          </span>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto pb-1">
        <div className="flex min-w-max gap-2">
          {tabs.map((tab) => {
            const active = tab.key === activeTab;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? 'bg-primary2 text-white shadow-lg shadow-primary2/20'
                    : 'bg-slate text-dark hover:bg-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-slate p-5">
        {tabContent[activeTab]}
      </div>
    </section>
  );
};

export default PortfolioTabs;
