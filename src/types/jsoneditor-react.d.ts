declare module 'jsoneditor-react' {
  import { Component } from 'react';
  import { JSONEditorOptions } from 'jsoneditor';

  interface JsonEditorProps {
    value?: any;
    onChange?: (value: any) => void;
    mode?: 'tree' | 'view' | 'form' | 'code' | 'text';
    allowedModes?: Array<'tree' | 'view' | 'form' | 'code' | 'text'>;
    search?: boolean;
    mainMenuBar?: boolean;
    navigationBar?: boolean;
    history?: boolean;
    [key: string]: any;
  }

  export class JsonEditor extends Component<JsonEditorProps> {}
}
