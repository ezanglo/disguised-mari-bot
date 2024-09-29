import { Loader2Icon } from 'lucide-react'
import React from 'react'

export default function LoadingPlaceholder() {
  return (
    <div className="size-full flex flex-col items-center justify-center">
       <Loader2Icon className="animate-spin size-20" />
      <span>Loading...</span>
    </div>
  )
}
