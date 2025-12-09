/** @jsxImportSource @emotion/react */
'use client';

import React, { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface CKEditorWrapperProps {
  initialData?: string;
  onChange?: (data: string) => void;
}

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
          reader.onload = () => resolve({ default: reader.result });
          reader.onerror = (error) => reject(error);
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

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleChange = (_event: any, editor: any) => {
    let editorData = editor.getData();

    editorData = editorData.replace(
      /href="(?!https?:\/\/)([^"]+)"/g,
      'href="https://$1"',
    );

    setData(editorData);
    onChange?.(editorData);
  };

  return (
    <div
      className="ckeditor-wrapper"
      css={css`
        position: relative;
        z-index: 1;
      `}
    >
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
            '|',
            'bulletedList',
            'numberedList',
            'blockQuote',
            '|',
            'insertTable',
            '|',
            'imageUpload',
            'undo',
            'redo',
          ],
          image: {
            toolbar: [
              'imageTextAlternative',
              'resizeImage:original',
              'resizeImage:25',
              'resizeImage:50',
              'resizeImage:75',
            ],
            styles: ['alignLeft', 'alignCenter', 'alignRight'],
          },
          table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
          },
        }}
        onChange={handleChange}
      />
    </div>
  );
};

export default CKEditorWrapper;
