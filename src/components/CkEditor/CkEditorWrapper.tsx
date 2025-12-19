'use client';
import React, { useEffect, useRef } from 'react';
import ClassicPlusEditor from 'ckeditor5-build-classic-plus';

interface CKEditorWrapperProps {
  id: string;
  initialData?: string;
  onChange?: (data: string) => void;
  height?: number;
  className?: string;
}

const CKEditorWrapper: React.FC<CKEditorWrapperProps> = ({
  id,
  initialData = '',
  onChange,
  height = 400,
  className = '',
}) => {
  const editorRef = useRef<any>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);

  // Keep latest onChange in ref
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!divRef.current) return;

    // Base64 image upload adapter inside effect
    class Base64UploadAdapter {
      loader: any;
      constructor(loader: any) {
        this.loader = loader;
      }
      upload() {
        return this.loader.file.then(
          (file: File) =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () =>
                resolve({ default: reader.result as string });
              reader.onerror = (err) => reject(err);
              reader.readAsDataURL(file);
            }),
        );
      }
      abort() {}
    }

    ClassicPlusEditor.create(divRef.current, {
      toolbar: [
        'heading',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'subscript',
        'superscript',
        '|',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'outdent',
        'indent',
        'blockQuote',
        '|',
        'insertTable',
        'horizontalLine',
        'specialCharacters',
        'imageUpload',
        '|',
        'undo',
        'redo',
        '|',
        'fontSize',
        'fontFamily',
        '|',
        'alignment',
        'removeFormat',
      ],
      list: { properties: { styles: true, startIndex: true, reversed: true } },
      image: {
        toolbar: ['imageTextAlternative', '|', 'resizeImage'],
        resizeUnit: '%',
      },
      table: { contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'] },
    } as any)
      .then((editor) => {
        editorRef.current = editor;

        (editor.plugins.get('FileRepository') as any).createUploadAdapter = (
          loader: any,
        ) => new Base64UploadAdapter(loader);

        editor.setData(initialData);

        editor.model.document.on('change:data', () => {
          onChangeRef.current?.(editor.getData());
        });
      })
      .catch((err) => console.error('CKEditor error:', err));

    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, [divRef, initialData]); // only depend on divRef and initialData

  // Sync editor if initialData changes
  useEffect(() => {
    if (editorRef.current && initialData !== editorRef.current.getData()) {
      editorRef.current.setData(initialData);
    }
  }, [initialData]);

  return (
    <div
      id={id}
      ref={divRef}
      className={`ckeditor-wrapper ${className}`}
      style={{ minHeight: height, width: '100%' }}
    />
  );
};

export default CKEditorWrapper;
