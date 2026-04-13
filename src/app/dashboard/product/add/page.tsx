'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Controller } from 'react-hook-form';
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
import { useAddProduct } from 'hooks/useAddProduct';

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

export default function AddProductPage() {
  const {
    categories,
    categoriesLoading,
    createProductMutation,
    register,
    handleSubmit,
    onSubmit,
    setValue,
    control,
    formState: { errors },
    watch,
  } = useAddProduct();

  const [imageFields, setImageFields] = React.useState(['']);
  const [techStackDropdownOpen, setTechStackDropdownOpen] =
    React.useState(false);
  const [selectedTechStacks, setSelectedTechStacks] = React.useState<string[]>(
    [],
  );
  const techStackDropdownRef = React.useRef<HTMLDivElement | null>(null);

  // Category searchable dropdown state
  const [categorySearch, setCategorySearch] = React.useState('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = React.useState(false);
  const categoryDropdownRef = React.useRef<HTMLDivElement | null>(null);

  // Filter categories based on search input
  const filteredCategories = React.useMemo(() => {
    if (!categorySearch) return categories;
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(categorySearch.toLowerCase()),
    );
  }, [categories, categorySearch]);

  // Watch category value for controlled input
  const categoryValue = watch('category_id');

  // Sync search input with form value when selected from dropdown
  React.useEffect(() => {
    if (categoryValue && !categorySearch) {
      setCategorySearch(categoryValue);
    }
  }, [categoryValue, categorySearch]);

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

  const handleAddImageField = () => {
    updateImageFields([...imageFields, '']);
  };

  const handleRemoveImageField = (index: number) => {
    const nextFields = imageFields.filter(
      (_, fieldIndex) => fieldIndex !== index,
    );
    updateImageFields(nextFields);
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

  // Category handlers
  const handleCategorySelect = (categoryName: string) => {
    setCategorySearch(categoryName);
    setValue('category_id', categoryName, { shouldValidate: true });
    setCategoryDropdownOpen(false);
  };

  const handleCategoryInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    setCategorySearch(value);
    setValue('category_id', value, { shouldValidate: true });
    setCategoryDropdownOpen(true);
  };

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

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const breadCrumb: BreadcrumbItem[] = [
    { label: 'Products', href: '/dashboard/product' },
    { label: 'Add Product', href: '/dashboard/product/add' },
  ];

  return (
    <div className="text-black overflow-x-hidden min-h-screen flex flex-col">
      <header className="border-b border-gray-200 pb-4 flex flex-col xs:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
        <div className=" flex-1">
          <h1 className="text-xl sm:text-2xl font-bold truncate">
            Add New Product
          </h1>
          <div className="mt-2 sm:mt-4 overflow-x-auto sm:overflow-visible truncate">
            <Breadcrumb items={breadCrumb} />
          </div>
        </div>

        <button
          type="submit"
          form="product-form"
          disabled={createProductMutation.isPending}
          className="px-4 sm:px-6 py-1 mt-2 xs:mt-0 sm:py-3 rounded-lg bg-gray-200 text-black hover:bg-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {createProductMutation.isPending ? 'Saving...' : 'Save Product'}
        </button>
      </header>

      <main className="flex-1 py-4 min-w-0">
        <form
          id="product-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="min-w-0">
              <label className="text-black font-medium mb-2 flex items-center gap-2">
                <FaHeading className="text-gray-500 shrink-0" size={16} />
                Title
              </label>
              <div>
                <input
                  type="text"
                  {...register('title')}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full"
                  placeholder="Enter project title"
                />
              </div>
              {errors.title && (
                <p className="text-red-500 text-sm mt-1 wrap-break-word">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="min-w-0">
              <label className="text-black font-medium mb-2 flex items-center gap-2">
                <FaFolder className="text-gray-500 shrink-0" size={16} />
                Category
              </label>
              <input type="hidden" {...register('category_id')} />
              <div ref={categoryDropdownRef} className="relative">
                <input
                  type="text"
                  value={categorySearch}
                  onChange={handleCategoryInputChange}
                  onFocus={() => setCategoryDropdownOpen(true)}
                  disabled={categoriesLoading}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 max-w-full"
                  placeholder={
                    categoriesLoading
                      ? 'Loading categories...'
                      : 'Type or select a category'
                  }
                />
                <FaChevronDown
                  size={14}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition pointer-events-none ${categoryDropdownOpen ? 'rotate-180' : ''}`}
                />

                {categoryDropdownOpen && !categoriesLoading && (
                  <div className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg max-w-[calc(100vw-2rem)] sm:max-w-none">
                    {/* Added: max-width constraint for mobile viewport */}
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => handleCategorySelect(category.name)}
                          className={`w-full px-3 py-2 text-left hover:bg-blue-50 transition wrap-break-word ${categorySearch === category.name ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
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
              <p className="text-xs text-gray-500 mt-1 wrap-break-word">
                Type to search categories or enter a new one.
              </p>
              {errors.category_id && (
                <p className="text-red-500 text-sm mt-1 wrap-break-word">
                  {errors.category_id.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="min-w-0">
              <div className="mb-2 flex items-center justify-between gap-2">
                <label className="text-black font-medium flex items-center gap-2">
                  <FaImage className="text-gray-500 shrink-0" size={16} />
                  Images
                </label>
                <button
                  type="button"
                  onClick={handleAddImageField}
                  className="text-green-600 transition hover:text-green-700 shrink-0"
                  aria-label="Add image field"
                  title="Add image field"
                >
                  <FaPlus size={16} />
                </button>
              </div>
              <input type="hidden" {...register('imagesText')} />
              <div className="space-y-3">
                {imageFields.map((image, index) => {
                  return (
                    <div key={`image-field-${index}`} className="relative">
                      <input
                        type="text"
                        value={image}
                        onChange={(event) =>
                          handleImageChange(index, event.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full"
                        placeholder="Enter image URL or path"
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveImageField(index)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600 transition hover:text-red-700"
                          aria-label={`Delete image field ${index + 1}`}
                          title="Delete image field"
                        >
                          <FaTrash size={14} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              {errors.imagesText && (
                <p className="text-red-500 text-sm mt-1 wrap-break-word">
                  {errors.imagesText.message}
                </p>
              )}
            </div>

            <div className="min-w-0">
              <label className="text-black font-medium mb-2 flex items-center gap-2">
                <FaCode className="text-gray-500 shrink-0" size={16} />
                Tech Stack
              </label>
              <input type="hidden" {...register('techstackText')} />
              <div ref={techStackDropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setTechStackDropdownOpen((previous) => !previous)
                  }
                  className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white p-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className="truncate text-gray-700">
                    {selectedTechStacks.length > 0
                      ? `${selectedTechStacks.length} tech stacks selected`
                      : 'Select tech stacks'}
                  </span>
                  <FaChevronDown
                    size={14}
                    className={`transition shrink-0 ${techStackDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {techStackDropdownOpen && (
                  <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg max-w-[calc(100vw-2rem)] sm:max-w-none">
                    {TECH_STACK_OPTIONS.map((option) => {
                      const isSelected = selectedTechStacks.includes(
                        option.value,
                      );

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleToggleTechStack(option.value)}
                          className={`flex w-full items-center justify-between px-3 py-2 text-left transition hover:bg-gray-100 ${isSelected ? 'bg-blue-50 text-blue-700' : ''}`}
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
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedTechStacks.map((value) => {
                    const selectedOption = TECH_STACK_OPTIONS.find(
                      (option) => option.value === value,
                    );

                    return (
                      <div
                        key={value}
                        className="flex items-center gap-2 rounded-full bg-gray-200 px-3 py-1 text-sm text-black max-w-full"
                      >
                        <span className="truncate">
                          {selectedOption?.label ?? value}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTechStack(value)}
                          className="text-black transition hover:text-gray-500 shrink-0 cursor-pointer"
                          aria-label={`Remove ${selectedOption?.label ?? value}`}
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

          <div className="grid gap-4 md:grid-cols-2">
            <div className="min-w-0">
              <label className="text-black font-medium mb-2 flex items-center gap-2">
                <FaAlignLeft className="text-gray-500 shrink-0" size={16} />
                Description
              </label>
              <div className="max-w-full overflow-x-hidden">
                {/* Container to prevent CKEditor overflow */}
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <CKEditorWrapper
                      id="product-description-editor"
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
            <div className="min-w-0">
              <label className="text-black font-medium mb-2 flex items-center gap-2">
                <FaCommentDots className="text-gray-500 shrink-0" size={16} />
                Client Feedback
              </label>
              <div className="max-w-full overflow-x-hidden">
                <Controller
                  name="feedback"
                  control={control}
                  render={({ field }) => (
                    <CKEditorWrapper
                      id="product-feedback-editor"
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

          <div className="grid gap-4 md:grid-cols-2">
            <div className="min-w-0">
              <label className="text-black font-medium mb-2 flex items-center gap-2">
                <FaEye className="text-gray-500 shrink-0" size={16} />
                Overview
              </label>
              <div className="max-w-full overflow-x-hidden">
                <Controller
                  name="overview"
                  control={control}
                  render={({ field }) => (
                    <CKEditorWrapper
                      id="product-overview-editor"
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

            <div className="min-w-0">
              <label className="text-black font-medium mb-2 flex items-center gap-2">
                <FaExclamationTriangle
                  className="text-gray-500 shrink-0"
                  size={16}
                />
                Challenges
              </label>
              <div className="max-w-full overflow-x-hidden">
                <Controller
                  name="challenges"
                  control={control}
                  render={({ field }) => (
                    <CKEditorWrapper
                      id="product-challenges-editor"
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

          <div className="grid gap-4 md:grid-cols-2">
            <div className="min-w-0">
              <label className="text-black font-medium mb-2 flex items-center gap-2">
                <FaLightbulb className="text-gray-500 shrink-0" size={16} />
                Approach
              </label>
              <div className="max-w-full overflow-x-hidden">
                <Controller
                  name="approach"
                  control={control}
                  render={({ field }) => (
                    <CKEditorWrapper
                      id="product-approach-editor"
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

            <div className="min-w-0">
              <label className="text-black font-medium mb-2 flex items-center gap-2">
                <FaCheckCircle className="text-gray-500 shrink-0" size={16} />
                Outcomes
              </label>
              <div className="max-w-full overflow-x-hidden">
                <Controller
                  name="outcomes"
                  control={control}
                  render={({ field }) => (
                    <CKEditorWrapper
                      id="product-outcomes-editor"
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
