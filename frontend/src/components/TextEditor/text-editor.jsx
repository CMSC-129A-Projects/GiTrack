/** @jsxImportSource @emotion/react */

import { useEffect } from 'react';

import { useQuill } from 'react-quilljs';

import 'quill/dist/quill.snow.css';
import './text-editor-styles.css';

export default function TextEditor({ onChange }) {
  const formats = [
    'header',
    'script',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'code',
    'code-block',
    'list',
    'bullet',
    'indent',
  ];

  const modules = {
    toolbar: {
      container: [
        [
          'bold',
          'italic',
          'underline',
          'strike',
          'blockquote',
          'code',
          'code-block',
          { header: 1 },
          { header: 2 },
          { script: 'sub' },
          { script: 'super' },
        ],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ],
    },
  };

  const { quill, quillRef } = useQuill({ formats, modules });

  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        const content = quill.root.innerHTML;
        onChange(content);
      });
    }
  }, [quill]);

  return (
    <div>
      <div ref={quillRef} />
    </div>
  );
}
