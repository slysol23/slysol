// components/JsonEditorWrapper.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { JsonEditor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';

interface JsonEditorWrapperProps {
  value: any;
  onChange: (val: any) => void;
  height?: string | number;
}

export const JsonEditorWrapper: React.FC<JsonEditorWrapperProps> = ({
  value,
  onChange,
  height = '400px',
}) => {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      // Only update if the value is different
      const current = editorRef.current.jsonEditor.get();
      if (JSON.stringify(current) !== JSON.stringify(value)) {
        editorRef.current.jsonEditor.set(value);
      }
    }
  }, [value]);

  return (
    <JsonEditor
      ref={editorRef}
      value={value}
      onChange={onChange}
      mode="code"
      allowedModes={['tree', 'code']}
      navigationBar
      mainMenuBar
      search
      history
      htmlElementProps={{ style: { height } }}
    />
  );
};
