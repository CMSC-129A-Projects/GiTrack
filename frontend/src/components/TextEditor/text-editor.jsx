/** @jsxImportSource @emotion/react */

import { useEffect } from 'react';

import { useQuill } from 'react-quilljs';

import 'quill/dist/quill.snow.css';
import './text-editor-styles.css';

export default function TextEditor({ children }) {
  const { quill, quillRef } = useQuill();

  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        const content = quill.root.innerHTML;
        console.log(content);
      });
    }
  }, [quill]);

  return (
    <div>
      <div ref={quillRef} />
    </div>
  );
}
