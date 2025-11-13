/** @jsxImportSource @emotion/react */
'use client';

import React, { useState, useEffect } from 'react';
import { Global, css } from '@emotion/react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface CKEditorWrapperProps {
  initialData?: string;
  onChange?: (data: string) => void;
}

// Base64 Upload Adapter
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

          reader.onload = () => {
            resolve({ default: reader.result });
          };

          reader.onerror = (error) => {
            reject(error);
          };

          reader.readAsDataURL(file);
        }),
    );
  }

  abort() {}
}

function Base64UploadAdapterPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new Base64UploadAdapter(loader);
  };
}

const CKEditorWrapper: React.FC<CKEditorWrapperProps> = ({
  initialData = '',
  onChange,
}) => {
  const [data, setData] = useState(initialData);

  // Update editor content when initialData changes (for edit mode)
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleChange = (_event: any, editor: any) => {
    const editorData = editor.getData();
    setData(editorData);
    if (onChange) onChange(editorData);
  };

  return (
    <div
      className="ckeditor-wrapper"
      css={css`
        position: relative;
        z-index: 1;
      `}
    >
      <Global
        styles={css`
          :root {
            --ck-border-radius: 4px;
            --ck-color-focus-border: rgba(96, 103, 113, 0.8);
            --ck-color-shadow-inner: rgba(69, 79, 99, 0.2);
            --ck-inner-shadow: 0 0 0 2px var(--ck-color-shadow-inner);
            --ck-spacing-large: var(--ck-spacing-standard);
          }
          .ck.ck-editor__editable_inline {
            border: 1px solid rgba(217, 217, 217, 1);
            transition: all 0.3s;
            color: black;
          }
          .ck.ck-editor__editable_inline:hover {
            border-color: rgba(96, 102, 112, 1);
          }
          .ck-editor__editable.ck-read-only {
            background-color: rgba(245, 245, 245, 1);
            opacity: 1;
            cursor: not-allowed;
            color: rgba(0, 0, 0, 0.25);
          }
        `}
      />
      <CKEditor
        editor={ClassicEditor}
        data={data}
        config={{
          extraPlugins: [Base64UploadAdapterPlugin],
          toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            'blockQuote',
            '|',
            'insertTable',
            'tableColumn',
            'tableRow',
            'mergeTableCells',
            '|',
            'imageUpload',
            'imageStyle:full',
            'imageStyle:side',
            'undo',
            'redo',
          ],
          image: {
            toolbar: [
              'imageTextAlternative',
              'imageStyle:full',
              'imageStyle:side',
            ],
          },
        }}
        onInit={(editor: any) => console.log('CKEditor ready', editor)}
        onChange={handleChange}
      />
    </div>
  );
};

export default CKEditorWrapper;
