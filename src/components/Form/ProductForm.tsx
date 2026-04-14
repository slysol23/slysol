'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Controller, UseFormReturn, FieldErrors } from 'react-hook-form';
import {
  FaCheck,
  FaChevronDown,
  FaPlus,
  FaTimes,
  FaTrash,
  FaHeading,
  FaFolder,
  FaImage,
  FaCode,
  FaAlignLeft,
  FaCommentDots,
  FaEye,
  FaExclamationTriangle,
  FaLightbulb,
  FaCheckCircle,
} from 'react-icons/fa';
import Breadcrumb, { BreadcrumbItem } from '@/components/breadCrum';
import Button from '../Button';

const CKEditorWrapper = dynamic(
  () => import('@/components/CkEditor/CkEditorWrapper'),
  { ssr: false },
);

const TECH_STACK_OPTIONS = [
  { label: 'React JS', value: 'react-js' },
  { label: 'Next JS', value: 'next-js' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Node JS', value: 'node-js' },
  { label: 'Express JS', value: 'express-js' },
  { label: 'Nest JS', value: 'nest-js' },
  { label: 'MongoDB', value: 'mongodb' },
  { label: 'PostgreSQL', value: 'postgresql' },
  { label: 'MySQL', value: 'mysql' },
  { label: 'Tailwind CSS', value: 'tailwind-css' },
  { label: 'Bootstrap', value: 'bootstrap' },
  { label: 'Redux', value: 'redux' },
  { label: 'GraphQL', value: 'graphql' },
  { label: 'Firebase', value: 'firebase' },
  { label: 'AWS', value: 'aws' },
  { label: 'Docker', value: 'docker' },
  { label: 'Laravel', value: 'laravel' },
  { label: 'PHP', value: 'php' },
  { label: 'Python', value: 'python' },
];

export interface ProductFormData {
  category_id: string;
  title: string;
  imagesText: string;
  techstackText: string;
  description: string;
  feedback: string;
  overview: string;
  challenges: string;
  approach: string;
  outcomes: string;
  is_published?: boolean;
}

interface ProductFormProps {
  form: UseFormReturn<ProductFormData>;
  categories: Array<{ id: string; name: string }>;
  categoriesLoading: boolean;
  onSubmit: (data: ProductFormData) => void;
  breadcrumbItems: BreadcrumbItem[];
  headerTitle: string;
  submitButtonText: string;
  isSubmitting: boolean;
  headerActions?: React.ReactNode;
  statusBadge?: {
    text: string;
    className: string;
  };
  initialCategoryId?: string;
  initialImages?: string[];
  initialTechStack?: string[];
}

export default function ProductForm({
  form,
  categories,
  categoriesLoading,
  onSubmit,
  breadcrumbItems,
  headerTitle,
  submitButtonText,
  isSubmitting,
  headerActions,
  statusBadge,
  initialCategoryId = '',
  initialImages = [''],
  initialTechStack = [],
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const [imageFields, setImageFields] = React.useState<string[]>(initialImages);
  const [techStackDropdownOpen, setTechStackDropdownOpen] =
    React.useState(false);
  const [selectedTechStacks, setSelectedTechStacks] =
    React.useState<string[]>(initialTechStack);
  const [categorySearch, setCategorySearch] = React.useState(initialCategoryId);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = React.useState(false);
  const initialImagesRef = React.useRef(initialImages);
  const initialTechStackRef = React.useRef(initialTechStack);
  const initialCategoryIdRef = React.useRef(initialCategoryId);

  const techStackDropdownRef = React.useRef<HTMLDivElement>(null);
  const categoryDropdownRef = React.useRef<HTMLDivElement>(null);

  // Initialize with props
  React.useEffect(() => {
    const nextInitialImages = initialImagesRef.current;
    if (nextInitialImages.length > 0 && nextInitialImages[0] !== '') {
      setImageFields(nextInitialImages);
      setValue('imagesText', nextInitialImages.join('\n'));
    }
    const nextInitialTechStack = initialTechStackRef.current;
    if (nextInitialTechStack.length > 0) {
      setSelectedTechStacks(nextInitialTechStack);
      setValue('techstackText', nextInitialTechStack.join('\n'));
    }
    if (initialCategoryIdRef.current) {
      setCategorySearch(initialCategoryIdRef.current);
    }
  }, [setValue]);

  const filteredCategories = React.useMemo(() => {
    if (!categorySearch) return categories;
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(categorySearch.toLowerCase()),
    );
  }, [categories, categorySearch]);

  const updateImageFields = (nextFields: string[]) => {
    setImageFields(nextFields);
    setValue('imagesText', nextFields.join('\n'), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleImageChange = (index: number, value: string) => {
    const nextFields = [...imageFields];
    nextFields[index] = value;
    updateImageFields(nextFields);
  };

  const handleAddImageField = () => updateImageFields([...imageFields, '']);

  const handleRemoveImageField = (index: number) => {
    const nextFields = imageFields.filter((_, i) => i !== index);
    updateImageFields(nextFields.length > 0 ? nextFields : ['']);
  };

  const updateSelectedTechStacks = (nextValues: string[]) => {
    setSelectedTechStacks(nextValues);
    setValue('techstackText', nextValues.join('\n'), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleToggleTechStack = (value: string) => {
    const nextValues = selectedTechStacks.includes(value)
      ? selectedTechStacks.filter((item) => item !== value)
      : [...selectedTechStacks, value];
    updateSelectedTechStacks(nextValues);
  };

  const handleRemoveTechStack = (value: string) => {
    updateSelectedTechStacks(
      selectedTechStacks.filter((item) => item !== value),
    );
  };

  const handleCategorySelect = (categoryName: string) => {
    setCategorySearch(categoryName);
    setValue('category_id', categoryName, { shouldValidate: true });
    setCategoryDropdownOpen(false);
  };

  const handleCategoryInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setCategorySearch(value);
    setValue('category_id', value, { shouldValidate: true });
    setCategoryDropdownOpen(true);
  };

  // Click outside handlers
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        techStackDropdownRef.current &&
        !techStackDropdownRef.current.contains(event.target as Node)
      ) {
        setTechStackDropdownOpen(false);
      }
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="text-black min-h-screen flex flex-col w-full max-w-[100vw] overflow-x-hidden">
      <header className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 w-full">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold truncate">
              {headerTitle}
            </h1>
            {statusBadge && (
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusBadge.className}`}
              >
                {statusBadge.text}
              </span>
            )}
          </div>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {headerActions}
          <Button
            type="submit"
            gray
            form="product-form"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg transition disabled:opacity-50 whitespace-nowrap text-sm sm:text-base"
          >
            {isSubmitting ? 'Saving...' : submitButtonText}
          </Button>
        </div>
      </header>

      <main className="flex-1 py-4 w-full">
        <form
          id="product-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 w-full"
        >
          {/* Row 1: Title & Category */}
          <div className="grid gap-4 md:grid-cols-2 w-full">
            <div className="min-w-0 w-full">
              <label className="text-black font-medium mb-2 flex items-center gap-2">
                <FaHeading className="text-gray-500 shrink-0" size={16} />
                Title
              </label>
              <input
                type="text"
                {...register('title')}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 box-border"
                placeholder="Enter project title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1 wrap-break-word">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="min-w-0 w-full">
              <label className="text-black font-medium mb-2 flex items-center gap-2">
                <FaFolder className="text-gray-500 shrink-0" size={16} />
                Category
              </label>
              <input type="hidden" {...register('category_id')} />
              <div ref={categoryDropdownRef} className="relative w-full">
                <input
                  type="text"
                  value={categorySearch}
                  onChange={handleCategoryInputChange}
                  onFocus={() => setCategoryDropdownOpen(true)}
                  disabled={categoriesLoading}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 box-border"
                  placeholder={
                    categoriesLoading
                      ? 'Loading categories...'
                      : 'Type or select a category'
                  }
                />
                <FaChevronDown
                  size={14}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none ${categoryDropdownOpen ? 'rotate-180' : ''}`}
                />

                {categoryDropdownOpen && !categoriesLoading && (
                  <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg left-0 right-0">
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => handleCategorySelect(category.name)}
                          className={`w-full px-3 py-2 text-left hover:bg-blue-50 transition break-all ${categorySearch === category.name ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                        >
                          {category.name}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-gray-500 text-sm">
                        No matching categories found
                      </div>
                    )}
                  </div>
                )}
              </div>
              {errors.category_id && (
                <p className="text-red-500 text-sm mt-1 wrap-break-word">
                  {errors.category_id.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Images & Tech Stack */}
          <div className="grid gap-4 md:grid-cols-2 w-full">
            <div className="min-w-0 w-full">
              <div className="mb-2 flex items-center justify-between gap-2">
                <label className="text-black font-medium flex items-center gap-2">
                  <FaImage className="text-gray-500 shrink-0" size={16} />
                  Images
                </label>
                <button
                  type="button"
                  onClick={handleAddImageField}
                  className="text-green-600 hover:text-green-700 shrink-0"
                >
                  <FaPlus size={16} />
                </button>
              </div>
              <input type="hidden" {...register('imagesText')} />
              <div className="space-y-3 w-full">
                {imageFields.map((image, index) => (
                  <div key={`image-field-${index}`} className="relative w-full">
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      className="w-full rounded-lg border border-gray-300 p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 box-border"
                      placeholder="Enter image URL or path"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImageField(index)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600 hover:text-red-700"
                      >
                        <FaTrash size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {errors.imagesText && (
                <p className="text-red-500 text-sm mt-1 wrap-break-word">
                  {errors.imagesText.message}
                </p>
              )}
            </div>

            <div className="min-w-0 w-full">
              <label className="text-black font-medium mb-2 flex items-center gap-2">
                <FaCode className="text-gray-500 shrink-0" size={16} />
                Tech Stack
              </label>
              <input type="hidden" {...register('techstackText')} />
              <div ref={techStackDropdownRef} className="relative w-full">
                <button
                  type="button"
                  onClick={() => setTechStackDropdownOpen((p) => !p)}
                  className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white p-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className="truncate text-gray-700">
                    {selectedTechStacks.length > 0
                      ? `${selectedTechStacks.length} selected`
                      : 'Select tech stacks'}
                  </span>
                  <FaChevronDown
                    size={14}
                    className={`shrink-0 transition ${techStackDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {techStackDropdownOpen && (
                  <div className="absolute z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg left-0 right-0">
                    {TECH_STACK_OPTIONS.map((option) => {
                      const isSelected = selectedTechStacks.includes(
                        option.value,
                      );
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleToggleTechStack(option.value)}
                          className={`flex w-full items-center justify-between px-3 py-2 text-left hover:bg-gray-100 ${isSelected ? 'bg-blue-50 text-blue-700' : ''}`}
                        >
                          <span className="wrap-break-word pr-2">
                            {option.label}
                          </span>
                          {isSelected && (
                            <FaCheck size={12} className="shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {selectedTechStacks.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 w-full">
                  {selectedTechStacks.map((value) => {
                    const selectedOption = TECH_STACK_OPTIONS.find(
                      (o) => o.value === value,
                    );
                    return (
                      <div
                        key={value}
                        className="flex items-center gap-2 rounded-full bg-gray-200 px-3 py-1 text-sm max-w-full"
                      >
                        <span className="truncate">
                          {selectedOption?.label ?? value}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTechStack(value)}
                          className="text-black hover:text-gray-500 shrink-0"
                        >
                          <FaTimes size={10} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              {errors.techstackText && (
                <p className="text-red-500 text-sm mt-1 wrap-break-word">
                  {errors.techstackText.message}
                </p>
              )}
            </div>
          </div>

          {/* CKEditor Rows */}
          <div className="grid gap-4 md:grid-cols-2 w-full">
            <div className="min-w-0 w-full overflow-hidden">
              <label className="text-black font-medium mb-2 flex items-center gap-2">
                <FaAlignLeft className="text-gray-500 shrink-0" size={16} />
                Description
              </label>
              <div className="w-full max-w-full overflow-x-hidden">
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <CKEditorWrapper
                      id="description-editor"
                      initialData={field.value}
                      onChange={field.onChange}
                      height={220}
                    />
                  )}
                />
              </div>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1 wrap-break-word">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="min-w-0 w-full overflow-hidden">
              <label className="text-black font-medium mb-2 flex items-center gap-2">
                <FaCommentDots className="text-gray-500 shrink-0" size={16} />
                Client Feedback
              </label>
              <div className="w-full max-w-full overflow-x-hidden">
                <Controller
                  name="feedback"
                  control={control}
                  render={({ field }) => (
                    <CKEditorWrapper
                      id="feedback-editor"
                      initialData={field.value}
                      onChange={field.onChange}
                      height={220}
                    />
                  )}
                />
              </div>
              {errors.feedback && (
                <p className="text-red-500 text-sm mt-1 wrap-break-word">
                  {errors.feedback.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 w-full">
            <div className="min-w-0 w-full overflow-hidden">
              <label className="text-black font-medium mb-2 flex items-center gap-2">
                <FaEye className="text-gray-500 shrink-0" size={16} />
                Overview
              </label>
              <div className="w-full max-w-full overflow-x-hidden">
                <Controller
                  name="overview"
                  control={control}
                  render={({ field }) => (
                    <CKEditorWrapper
                      id="overview-editor"
                      initialData={field.value}
                      onChange={field.onChange}
                      height={260}
                    />
                  )}
                />
              </div>
              {errors.overview && (
                <p className="text-red-500 text-sm mt-1 wrap-break-word">
                  {errors.overview.message}
                </p>
              )}
            </div>

            <div className="min-w-0 w-full overflow-hidden">
              <label className="text-black font-medium mb-2 flex items-center gap-2">
                <FaExclamationTriangle
                  className="text-gray-500 shrink-0"
                  size={16}
                />
                Challenges
              </label>
              <div className="w-full max-w-full overflow-x-hidden">
                <Controller
                  name="challenges"
                  control={control}
                  render={({ field }) => (
                    <CKEditorWrapper
                      id="challenges-editor"
                      initialData={field.value}
                      onChange={field.onChange}
                      height={260}
                    />
                  )}
                />
              </div>
              {errors.challenges && (
                <p className="text-red-500 text-sm mt-1 wrap-break-word">
                  {errors.challenges.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 w-full">
            <div className="min-w-0 w-full overflow-hidden">
              <label className="text-black font-medium mb-2 flex items-center gap-2">
                <FaLightbulb className="text-gray-500 shrink-0" size={16} />
                Approach
              </label>
              <div className="w-full max-w-full overflow-x-hidden">
                <Controller
                  name="approach"
                  control={control}
                  render={({ field }) => (
                    <CKEditorWrapper
                      id="approach-editor"
                      initialData={field.value}
                      onChange={field.onChange}
                      height={260}
                    />
                  )}
                />
              </div>
              {errors.approach && (
                <p className="text-red-500 text-sm mt-1 wrap-break-word">
                  {errors.approach.message}
                </p>
              )}
            </div>

            <div className="min-w-0 w-full overflow-hidden">
              <label className="text-black font-medium mb-2 flex items-center gap-2">
                <FaCheckCircle className="text-gray-500 shrink-0" size={16} />
                Outcomes
              </label>
              <div className="w-full max-w-full overflow-x-hidden">
                <Controller
                  name="outcomes"
                  control={control}
                  render={({ field }) => (
                    <CKEditorWrapper
                      id="outcomes-editor"
                      initialData={field.value}
                      onChange={field.onChange}
                      height={260}
                    />
                  )}
                />
              </div>
              {errors.outcomes && (
                <p className="text-red-500 text-sm mt-1 wrap-break-word">
                  {errors.outcomes.message}
                </p>
              )}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
