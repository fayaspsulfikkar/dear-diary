'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'
import { Bold, Italic, Heading1, Heading2, List, Quote } from 'lucide-react'

export default function Editor({
  initialContent,
  onChange,
}: {
  initialContent: string
  onChange: (content: string, text: string) => void
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          'prose prose-lg dark:prose-invert prose-pink focus:outline-none min-h-[400px] w-full max-w-none placeholder:text-muted-foreground',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), editor.getText())
    },
  })

  // Destroy editor on unmount
  useEffect(() => {
    return () => {
      editor?.destroy()
    }
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div className="w-full relative border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all bg-white/40 dark:bg-white/5">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-black/20 sticky top-0 z-10 backdrop-blur-md">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${editor.isActive('bold') ? 'bg-black/10 dark:bg-white/10 text-primary' : 'text-muted-foreground'}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${editor.isActive('italic') ? 'bg-black/10 dark:bg-white/10 text-primary' : 'text-muted-foreground'}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-border mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-black/10 dark:bg-white/10 text-primary' : 'text-muted-foreground'}`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-black/10 dark:bg-white/10 text-primary' : 'text-muted-foreground'}`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-border mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${editor.isActive('bulletList') ? 'bg-black/10 dark:bg-white/10 text-primary' : 'text-muted-foreground'}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${editor.isActive('blockquote') ? 'bg-black/10 dark:bg-white/10 text-primary' : 'text-muted-foreground'}`}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>
      </div>
      <div className="p-4 sm:p-6 lg:p-8">
        <EditorContent editor={editor} className="w-full" />
      </div>
    </div>
  )
}
