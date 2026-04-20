'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  FiClock,
  FiUser,
} from 'react-icons/fi';

interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
}

export default function CategoryModal({
  isOpen,
  onClose,
  onCategorySelect,
  showSelectOption = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCategorySelect?: (category: Category) => void;
  showSelectOption?: boolean;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/product-category');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message);
      }

      if (Array.isArray(result.data)) {
        console.log('Fetched categories:', result.data); // Debug log
        setCategories(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) fetchCategories();
  }, [isOpen, fetchCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setError('Please enter a category name');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

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
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Delete "${categoryName}"?`)) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/product-category/${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete');
      }

      setSuccessMessage('Category deleted successfully');
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
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
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = (category: Category) => {
    setEditingCategory(category);
    setEditName(category.name);
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
          <div className="bg-linear-to-r from-blue-600 to-purple-600 px-6 py-5 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Categories</h2>
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
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-700">
                <FiAlertCircle />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-700">
                <FiCheckCircle />
                <span className="text-sm">{successMessage}</span>
              </div>
            )}

            {/* Add Form */}
            <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="New category name..."
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  disabled={submitting}
                />
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
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-8">
                  <FiLoader className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FiInbox className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No categories found</p>
                </div>
              ) : (
                categories.map((category) => (
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
                          {/* This is where updatedAt and updatedBy are displayed */}
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
            </div>
          </div>

          <div className="border-t border-gray-100 p-4 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
