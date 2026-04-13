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
  const initialDataRef = useRef(initialData);

  // keep latest onChange without re-rendering editor
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    initialDataRef.current = initialData;
  }, [initialData]);

  // normalize relative links
  const normalizeLinks = (html: string) =>
    html.replace(
      /href="(?!https?:\/\/|mailto:|tel:|#)([^"]+)"/gi,
      'href="https://$1"',
    );

  // initialize editor once and seed it with the latest available data
  useEffect(() => {
    if (!divRef.current) return;
    let isCancelled = false;

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
      initialData: initialDataRef.current,
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
      link: {
        defaultProtocol: 'https://',
      },
      table: {
        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
      },
      image: {
        toolbar: ['imageTextAlternative'],
      },
    } as any)
      .then((editor) => {
        if (isCancelled) {
          void editor.destroy();
          return;
        }

        editorRef.current = editor;

        (editor.plugins.get('FileRepository') as any).createUploadAdapter = (
          loader: any,
        ) => new Base64UploadAdapter(loader);

        const latestData = initialDataRef.current ?? '';
        if (latestData !== editor.getData()) {
          editor.setData(latestData);
        }

        editor.model.document.on('change:data', () => {
          const data = normalizeLinks(editor.getData());
          onChangeRef.current?.(data);
        });
      })
      .catch((error) => {
        if (!isCancelled) {
          console.error('CKEditor init error:', error);
        }
      });

    return () => {
      isCancelled = true;
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, []);

  // sync external initialData changes after the editor is ready
  useEffect(() => {
    const editor = editorRef.current;
    if (editor && initialData !== editor.getData()) {
      editor.setData(initialData);
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
