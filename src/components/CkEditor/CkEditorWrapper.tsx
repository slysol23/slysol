'use client';
import React, { useEffect, useRef, useState } from 'react';

interface CKEditorWrapperProps {
  id: string;
  initialData?: string;
  onChange?: (data: string) => void;
  config?: Record<string, any>;
  height?: number;
  showImageUpload?: boolean;
  showCharCount?: boolean;
  className?: string;
}

const CKEditorWrapper: React.FC<CKEditorWrapperProps> = ({
  id,
  initialData = '',
  onChange,
  config = {},
  height = 400,
  showCharCount = true,
  className = '',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const editorRef = useRef<any>(null);
  const [charCount, setCharCount] = useState({ chars: 0, words: 0 });
  const [isReady, setIsReady] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const initialDataRef = useRef(initialData);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const configRef = useRef(config);
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  // Update initial data ref when it changes
  useEffect(() => {
    initialDataRef.current = initialData;
  }, [initialData]);

  // Track mount status
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Don't initialize until component is mounted
    if (!isMounted) return;

    // Check if CKEditor is available
    if (
      typeof window === 'undefined' ||
      !window.CKEDITOR ||
      !textareaRef.current
    ) {
      console.error(
        'CKEditor not loaded. Make sure ckeditor.js is in your public folder.',
      );
      return;
    }

    const textarea = textareaRef.current;

    // Wait for textarea to be fully mounted and visible
    if (!textarea.offsetParent && textarea.offsetWidth === 0) {
      // Element not fully rendered yet, retry
      initTimeoutRef.current = setTimeout(() => {
        setIsMounted(false);
        setTimeout(() => setIsMounted(true), 50);
      }, 100);
      return;
    }

    // Clear any pending initialization
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current);
      initTimeoutRef.current = null;
    }

    // Destroy previous instance if exists
    if (editorRef.current) {
      try {
        editorRef.current.destroy(true);
      } catch (e) {
        console.warn('Error destroying editor:', e);
      }
      editorRef.current = null;
      setIsReady(false);
    }

    // Check if an instance already exists for this textarea
    const existingInstance = window.CKEDITOR.instances[id];
    if (existingInstance) {
      try {
        existingInstance.destroy(true);
      } catch (e) {
        console.warn('Error destroying existing instance:', e);
      }
    }

    // Add custom plugin for direct file upload (only once)
    if (!window.CKEDITOR.plugins.get('directimageupload')) {
      window.CKEDITOR.plugins.add('directimageupload', {
        init: function (editor: any) {
          // Command for uploading new image
          editor.addCommand('directImageCommand', {
            exec: function (editor: any) {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.style.display = 'none';
              document.body.appendChild(input);

              input.onchange = function (e: any) {
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')) {
                  const reader = new FileReader();
                  reader.onload = function (event) {
                    const base64Data = event.target?.result as string;
                    const imgHtml = `<img src="${base64Data}" alt="${file.name}" style="max-width: 100%; height: auto;" />`;
                    editor.insertHtml(imgHtml);
                  };
                  reader.readAsDataURL(file);
                }
                document.body.removeChild(input);
              };

              input.click();
            },
          });

          // Add the upload button
          editor.ui.addButton('ImageUpload', {
            label: 'Insert Image from Computer',
            command: 'directImageCommand',
            toolbar: 'insert',
            icon: 'image',
          });
        },
      });
    }

    // Default configuration
    const defaultConfig = {
      height: height,
      toolbar: [
        {
          name: 'document',
          items: ['Source', '-', 'Save', 'NewPage', 'Preview', 'Print'],
        },
        {
          name: 'clipboard',
          items: ['Cut', 'Copy', '-', 'Undo', 'Redo'],
        },
        { name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll'] },
        {
          name: 'basicstyles',
          items: [
            'Bold',
            'Italic',
            'Underline',
            'Strike',
            'Subscript',
            'Superscript',
            '-',
            'RemoveFormat',
          ],
        },
        {
          name: 'paragraph',
          items: [
            'NumberedList',
            'BulletedList',
            '-',
            'Outdent',
            'Indent',
            '-',
            'Blockquote',
            'CreateDiv',
            '-',
            'JustifyLeft',
            'JustifyCenter',
            'JustifyRight',
            'JustifyBlock',
          ],
        },
        { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
        {
          name: 'insert',
          items: [
            'ImageUpload',
            'Image',
            'Table',
            'HorizontalRule',
            'SpecialChar',
          ],
        },
        { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
        { name: 'colors', items: ['TextColor', 'BGColor'] },
        { name: 'tools', items: ['Maximize', 'ShowBlocks'] },
      ],
      allowedContent: true,
      removePlugins: 'elementspath',
      resize_enabled: true,
      versionCheck: false,
      extraPlugins: 'directimageupload',
      disableNativeSpellChecker: false,
      disableObjectResizing: false,
      disableNativeTableHandles: false,
      ...configRef.current,
    };

    // Initialize CKEditor
    try {
      initTimeoutRef.current = setTimeout(() => {
        if (!textareaRef.current || !isMounted) return;

        try {
          editorRef.current = window.CKEDITOR.replace(
            textareaRef.current,
            defaultConfig,
          );

          // Wait for editor to be ready
          editorRef.current.on('instanceReady', () => {
            if (!isMounted) {
              if (editorRef.current) {
                editorRef.current.destroy(true);
                editorRef.current = null;
              }
              return;
            }

            setIsReady(true);

            // Set initial content from ref
            if (initialDataRef.current) {
              editorRef.current.setData(initialDataRef.current);
            }
          });

          // Prevent drag and drop errors
          editorRef.current.on('contentDom', () => {
            if (!editorRef.current) return;
            const editable = editorRef.current.editable();

            // Disable dragstart on images to prevent the equals error
            editable.attachListener(editable, 'dragstart', (evt: any) => {
              if (evt.data.getTarget().is('img')) {
                evt.data.preventDefault();
              }
            });
          });

          // Handle content changes
          editorRef.current.on('change', () => {
            if (!editorRef.current || !isMounted) return;
            const data = editorRef.current.getData();
            onChange?.(data);
          });

          // Handle paste events for images
          editorRef.current.on('paste', (evt: any) => {
            const dataTransfer = evt.data.dataTransfer;
            if (
              dataTransfer &&
              dataTransfer.getFilesCount &&
              dataTransfer.getFilesCount() > 0
            ) {
              const file = dataTransfer.getFile(0);
              if (file && file.type.startsWith('image/')) {
                evt.cancel();
                processImageFile(file);
              }
            }
          });
        } catch (innerError) {
          console.error('Error creating CKEditor instance:', innerError);
        }
      }, 200);
    } catch (error) {
      console.error('Error initializing CKEditor:', error);
    }

    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
        initTimeoutRef.current = null;
      }

      if (editorRef.current) {
        try {
          editorRef.current.destroy(true);
        } catch (e) {
          console.warn('Error destroying editor on cleanup:', e);
        }
        editorRef.current = null;
      }
    };
  }, [id, height, onChange, isMounted]);

  // Process image file and insert as base64
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const base64Data = e.target?.result as string;

      if (editorRef.current && base64Data) {
        const imgHtml = `<img src="${base64Data}" alt="${file.name}" style="max-width: 100%; height: auto;" />`;
        editorRef.current.insertHtml(imgHtml);
      }
    };

    reader.onerror = () => {
      alert('Error reading image file.');
    };

    reader.readAsDataURL(file);
  };

  // Update content when initialData changes externally
  useEffect(() => {
    if (editorRef.current && isReady && initialData !== undefined) {
      const currentData = editorRef.current.getData();
      if (currentData !== initialData) {
        // Prevent updates during drag operations
        try {
          const selection = editorRef.current.getSelection();
          if (selection && !selection.isInTable()) {
            editorRef.current.setData(initialData, {});
          }
        } catch (e) {
          // If there's any error, just set the data
          editorRef.current.setData(initialData);
        }
      }
    }
  }, [initialData, isReady]);

  return (
    <div
      className={`ckeditor-wrapper ${className}`}
      style={{
        minHeight: height + 100,
        position: 'relative',
        visibility: isReady ? 'visible' : 'hidden',
      }}
    >
      <textarea
        ref={textareaRef}
        id={id}
        defaultValue={initialData}
        style={{
          width: '100%',
          height: `${height}px`,
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />

      <style jsx>{`
        .ckeditor-wrapper {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default CKEditorWrapper;
