"use client"

import { useState } from "react"
import { Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function CvPreviewButton() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 h-10 rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors group w-full sm:w-auto whitespace-nowrap">
          <Eye className="h-4 w-4 transition-transform group-hover:scale-110 shrink-0" />
          <span>Preview CV</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>CV Preview</DialogTitle>
        </DialogHeader>
        <div className="w-full h-[70vh]">
          <iframe
            src="/cv.pdf"
            className="w-full h-full border-0"
            title="CV Preview"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
