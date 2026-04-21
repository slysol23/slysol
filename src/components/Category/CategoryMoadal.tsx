'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  FiX,
  FiPlus,
  FiLoader,
  FiTrash2,
  FiEdit2,
  FiAlertCircle,
  FiCheckCircle,
  FiFolder,
  FiInbox,
  FiSave,
  FiSlash,
  FiSearch,
} from 'react-icons/fi';
import { categoriesPage, ProductCategory } from 'hooks/useProducts';
import Swal from 'sweetalert2';

export default function CategoryModal({
  isOpen,
  onClose,
  onCategorySelect,
  showSelectOption = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCategorySelect?: (category: ProductCategory) => void;
  showSelectOption?: boolean;
}) {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] =
    useState<ProductCategory | null>(null);
  const [editName, setEditName] = useState('');
  const [totalRecords, setTotalRecords] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const refreshCategories = useCallback(async (pagesToLoad = 1) => {
    try {
      setLoading(true);
      setError(null);

      const pageCount = Math.max(1, pagesToLoad);
      const pages = Array.from({ length: pageCount }, (_, index) => index + 1);
      const responses = await Promise.all(
        pages.map((page) => categoriesPage(page)),
      );

      const nextCategories = responses.flatMap(
        (response) => response.data ?? [],
      );
      const meta = responses[0]?.meta;

      setCategories(nextCategories);
      setTotalRecords(meta?.records ?? 0);
      setCurrentPage(pageCount);
      setHasMore(pageCount < (meta?.total_pages ?? 0));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    setEditingCategory(null);
    setEditName('');
    setNewCategoryName('');
    setCategories([]);
    setTotalRecords(null);
    setCurrentPage(0);
    setHasMore(false);
    setSuccessMessage(null);
    setError(null);

    refreshCategories(1);
  }, [isOpen, refreshCategories]);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  const filteredCategories = useMemo(() => {
    if (!newCategoryName.trim()) return categories;

    const searchTerm = newCategoryName.toLowerCase();
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm),
    );
  }, [categories, newCategoryName]);

  const loadMoreCategories = useCallback(async () => {
    if (loading || loadingMore || submitting || !hasMore) return;

    try {
      setLoadingMore(true);
      setError(null);

      const nextPage = currentPage + 1;
      const response = await categoriesPage(nextPage);

      setCategories((current) => {
        const merged = new Map(
          current.map((category) => [category.id, category]),
        );

        response.data?.forEach((category) => {
          merged.set(category.id, category);
        });

        return Array.from(merged.values());
      });
      setTotalRecords(response.meta.records);
      setCurrentPage(nextPage);
      setHasMore(nextPage < response.meta.total_pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch more');
    } finally {
      setLoadingMore(false);
    }
  }, [currentPage, hasMore, loading, loadingMore, submitting]);

  const handleCategoryListScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      if (!hasMore || loading || loadingMore) return;

      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      const nearBottom = scrollHeight - scrollTop - clientHeight < 120;

      if (nearBottom) {
        void loadMoreCategories();
      }
    },
    [hasMore, loadMoreCategories, loading, loadingMore],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setError('Please enter a category name');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch('/api/product-category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message);
      }

      setSuccessMessage('Category added successfully!');
      setNewCategoryName('');
      setEditingCategory(null);
      setEditName('');
      await refreshCategories(Math.max(currentPage, 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (categoryId: string, categoryName: string) => {
    const result = await Swal.fire({
      title: `Do you want to delete "${categoryName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch(`/api/product-category/${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete');
      }

      await Swal.fire(
        'Deleted!',
        'Category has been deleted successfully',
        'success',
      );

      setEditingCategory(null);
      setEditName('');
      await refreshCategories(Math.max(currentPage, 1));
    } catch (err) {
      Swal.fire(
        'Error',
        err instanceof Error ? err.message : 'Failed to delete',
        'error',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editName.trim()) return;

    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch(
        `/api/product-category/${editingCategory.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: editName.trim() }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message);
      }

      setSuccessMessage('Category updated successfully');
      setEditingCategory(null);
      setEditName('');
      await refreshCategories(Math.max(currentPage, 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = (category: ProductCategory) => {
    setEditingCategory(category);
    setEditName(category.name);
    setError(null);
    setSuccessMessage(null);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditName('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => !editingCategory && onClose()}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="bg-blue px-6 py-5 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h2 className=" text-lg sm:text-xl font-bold text-white">
                Categories{' '}
                <span className="text-white/80 text-sm">
                  ({totalRecords ?? categories.length})
                </span>
              </h2>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Messages */}
            {error && (
              <div className="mb-4 flex items-center justify-between gap-2 rounded-lg bg-red-50 p-3 text-red-700">
                <div className="flex items-center gap-2">
                  <FiAlertCircle />
                  <span className="text-sm">{error}</span>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-600"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 flex items-center justify-between gap-2 rounded-lg bg-green-50 p-3 text-green-700">
                <div className="flex items-center gap-2">
                  <FiCheckCircle />
                  <span className="text-sm">{successMessage}</span>
                </div>
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="text-green-400 hover:text-green-600"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Add Form */}
            <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Type to search or add new..."
                    autoComplete="new-password"
                    data-form-type="other"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 text-sm focus:border-blue-500 focus:outline-none"
                    disabled={submitting}
                  />
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <button
                  type="submit"
                  disabled={submitting || !newCategoryName.trim()}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? (
                    <FiLoader className="animate-spin" />
                  ) : (
                    <FiPlus />
                  )}
                  Add
                </button>
              </form>
            </div>

            {/* Categories List */}
            <div
              ref={listContainerRef}
              onScroll={handleCategoryListScroll}
              className="space-y-2 max-h-96 overflow-y-auto"
            >
              {loading ? (
                <div className="flex justify-center py-8">
                  <FiLoader className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {newCategoryName.trim() ? (
                    <>
                      <FiSearch className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No categories match &quot;{newCategoryName}&quot;</p>
                      <button
                        onClick={() => setNewCategoryName('')}
                        className="mt-2 text-blue-600 hover:underline text-sm"
                      >
                        Clear search
                      </button>
                    </>
                  ) : (
                    <>
                      <FiInbox className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No categories found</p>
                    </>
                  )}
                </div>
              ) : (
                filteredCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <FiFolder className="h-5 w-5" />
                    </div>

                    {editingCategory?.id === category.id ? (
                      <form onSubmit={handleEdit} className="flex flex-1 gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          autoComplete="new-password"
                          data-form-type="other"
                          className="flex-1 rounded-lg border border-blue-300 px-3 py-2 text-sm"
                          autoFocus
                        />
                        <button
                          type="submit"
                          disabled={submitting}
                          className="rounded-lg bg-green-600 px-3 py-2 text-white hover:bg-green-700"
                        >
                          <FiSave className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="rounded-lg bg-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-300"
                        >
                          <FiSlash className="h-4 w-4" />
                        </button>
                      </form>
                    ) : (
                      <>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900">
                            {category.name}
                          </h4>
                          <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              Updated at {''}
                              {category.updatedAt
                                ? new Date(category.updatedAt).toLocaleString()
                                : 'N/A'}{' '}
                              by
                            </span>
                            {category.updatedBy && (
                              <span className="text-black">
                                {category.updatedBy}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {showSelectOption && onCategorySelect && (
                            <button
                              onClick={() => {
                                onCategorySelect(category);
                                onClose();
                              }}
                              className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100"
                            >
                              Select
                            </button>
                          )}
                          <button
                            onClick={() => startEditing(category)}
                            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
                          >
                            <FiEdit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(category.id, category.name)
                            }
                            className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}

              {loadingMore && (
                <div className="flex justify-center py-4">
                  <FiLoader className="h-6 w-6 animate-spin text-blue-500" />
                </div>
              )}

              {!loading && hasMore && categories.length > 0 && (
                <div className="px-2 pb-2 text-center text-xs text-gray-400">
                  Scroll to load more categories
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
