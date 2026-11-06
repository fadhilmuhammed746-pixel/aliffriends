'use client';

import React, { useState } from 'react';
import {
  Bold,
  Italic,
  List,
  Quote,
  Image as ImageIcon,
  Link as LinkIcon,
  Eye,
  Code,
} from 'lucide-react';

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichEditor: React.FC<RichEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your editorial story here...',
}) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const insertTag = (before: string, after: string = '') => {
    const textarea = document.getElementById('af12-rich-editor') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end) || 'text';
    const replacement = `${before}${selected}${after}`;

    const newValue =
      textarea.value.substring(0, start) + replacement + textarea.value.substring(end);

    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 10);
  };

  const handleInsertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      const caption = prompt('Optional image caption:') || '';
      const html = `\n<figure class="my-6">\n  <img src="${url}" alt="${caption}" class="w-full rounded-xl shadow-card border border-editorial-border" />\n  ${
        caption ? `<figcaption class="text-xs text-ink-muted italic mt-2 text-center font-sans">${caption}</figcaption>` : ''
      }\n</figure>\n`;
      onChange(value + html);
    }
  };

  const handleInsertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      insertTag(`<a href="${url}" class="text-coral underline hover:text-coral-dark" target="_blank" rel="noopener">`, '</a>');
    }
  };

  return (
    <div className="border border-editorial-border rounded-xl overflow-hidden bg-white shadow-subtle">
      {/* Editor Toolbar */}
      <div className="bg-canvas px-3 py-2 border-b border-editorial-border flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center flex-wrap gap-1">
          <button
            type="button"
            onClick={() => insertTag('<h3>', '</h3>')}
            className="p-1.5 hover:bg-white text-forest rounded transition-colors text-xs font-serif font-bold"
            title="Heading 3"
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => insertTag('<h4>', '</h4>')}
            className="p-1.5 hover:bg-white text-forest rounded transition-colors text-xs font-serif font-bold"
            title="Heading 4"
          >
            H4
          </button>
          <button
            type="button"
            onClick={() => insertTag('<strong>', '</strong>')}
            className="p-1.5 hover:bg-white text-forest rounded transition-colors"
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<em>', '</em>')}
            className="p-1.5 hover:bg-white text-forest rounded transition-colors"
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<blockquote class="border-l-2 border-coral pl-4 italic my-4 text-forest font-editorial text-lg">', '</blockquote>')}
            className="p-1.5 hover:bg-white text-forest rounded transition-colors"
            title="Quote"
          >
            <Quote className="w-3.5 h-3.5 text-coral" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<p class="lead font-editorial text-xl text-forest leading-relaxed mb-4">', '</p>')}
            className="p-1.5 hover:bg-white text-forest rounded transition-colors text-xs font-serif font-semibold"
            title="Lead Paragraph"
          >
            Lead
          </button>
          <button
            type="button"
            onClick={() => insertTag('<ul class="list-disc pl-6 space-y-1 my-3 text-ink-light">\n  <li>', '</li>\n</ul>')}
            className="p-1.5 hover:bg-white text-forest rounded transition-colors"
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleInsertImage}
            className="p-1.5 hover:bg-white text-forest rounded transition-colors"
            title="Insert Image"
          >
            <ImageIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleInsertLink}
            className="p-1.5 hover:bg-white text-forest rounded transition-colors"
            title="Insert Hyperlink"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-white rounded-lg p-0.5 border border-editorial-border">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`px-3 py-1 text-xs rounded transition-colors flex items-center gap-1.5 ${
              activeTab === 'write' ? 'bg-forest text-white font-bold' : 'text-ink-muted hover:text-forest'
            }`}
          >
            <Code className="w-3 h-3" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 text-xs rounded transition-colors flex items-center gap-1.5 ${
              activeTab === 'preview' ? 'bg-coral text-white font-bold' : 'text-ink-muted hover:text-forest'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      {activeTab === 'write' ? (
        <textarea
          id="af12-rich-editor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={14}
          className="w-full bg-white p-4 text-sm font-mono leading-relaxed text-ink placeholder-ink-muted focus:outline-none resize-y"
        />
      ) : (
        <div className="p-6 bg-canvas min-h-[300px] overflow-y-auto prose-editorial text-ink-light leading-relaxed">
          {value ? (
            <div dangerouslySetInnerHTML={{ __html: value }} />
          ) : (
            <span className="text-ink-muted italic text-xs">Nothing to preview yet.</span>
          )}
        </div>
      )}
    </div>
  );
};
