import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PageNavigator({ 
  currentPage, 
  totalPages, 
  onPrevious, 
  onNext, 
  onAddPage,
  onDeletePage
}) {
  const canGoPrevious = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;
  const canDelete = totalPages > 1;

  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20">
      <div className="flex items-center gap-1 bg-white dark:bg-neutral-800 rounded-full shadow-lg border border-border/50 px-2 py-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full"
          onClick={onPrevious}
          disabled={!canGoPrevious}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <span className="text-xs font-medium px-2 min-w-[4rem] text-center tabular-nums">
          {currentPage + 1} / {totalPages}
        </span>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full"
          onClick={onNext}
          disabled={!canGoNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-4 bg-border mx-1" />
        
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full text-primary hover:text-primary"
          onClick={onAddPage}
          title="Add new page"
        >
          <Plus className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onDeletePage}
          disabled={!canDelete}
          title="Delete current page"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
