"use client"

import { useState } from "react"
import { Eye, X } from "lucide-react"

export function CvPreviewButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        <Eye className="h-4 w-4" />
        Preview CV
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="fixed inset-0 bg-black/80" onClick={() => setOpen(false)} />
          <div className="relative z-[101] bg-background border rounded-lg shadow-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto p-6 m-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">CV Preview</h2>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-sm hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="w-full h-[70vh]">
              <iframe
                src="/cv.pdf"
                className="w-full h-full border-0"
                title="CV Preview"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
