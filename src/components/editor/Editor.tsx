'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'

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
    <div className="w-full relative">
      <EditorContent editor={editor} className="w-full" />
    </div>
  )
}
