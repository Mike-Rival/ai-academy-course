'use client';

import Editor, { type OnMount } from '@monaco-editor/react';
import { useCallback, useRef } from 'react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  language?: string;
  height?: string | number;
  readOnly?: boolean;
};

export default function CodeEditor({
  value,
  onChange,
  language = 'python',
  height = 280,
  readOnly = false,
}: Props) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const handleMount: OnMount = useCallback((editor) => {
    editorRef.current = editor;
  }, []);

  return (
    <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
      <Editor
        height={height}
        language={language}
        theme="vs-dark"
        value={value}
        onChange={(v) => onChange(v ?? '')}
        onMount={handleMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          scrollBeyondLastLine: false,
          tabSize: 4,
          insertSpaces: true,
          readOnly,
          padding: { top: 12, bottom: 12 },
          wordWrap: 'on',
        }}
      />
    </div>
  );
}
