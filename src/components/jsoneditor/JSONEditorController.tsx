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
  height = '200px',
}) => {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      try {
        const current = editorRef.current.jsonEditor.get();
        if (JSON.stringify(current) !== JSON.stringify(value)) {
          editorRef.current.jsonEditor.set(value);
        }
      } catch (error) {
        console.error('Error updating JSON editor:', error);
      }
    }
  }, [value]);

  const handleChange = (updatedValue: any) => {
    try {
      onChange(updatedValue);
    } catch (error) {
      console.error('Error in onChange handler:', error);
    }
  };

  return (
    <div
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      <JsonEditor
        ref={editorRef}
        value={value || []}
        onChange={handleChange}
        mode="code"
        modes={['code', 'tree', 'form']}
        allowedModes={['code', 'tree', 'form']}
        navigationBar={true}
        statusBar={true}
        search={true}
        history={true}
        indentation={2}
        sortObjectKeys={false}
        escapeUnicode={false}
        htmlElementProps={{
          style: {
            height: '100%',
            width: '100%',
          },
        }}
      />
    </div>
  );
};

export default JsonEditorWrapper;
