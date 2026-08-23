import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Show limited page numbers
  const getVisiblePages = () => {
    if (totalPages <= 7) return pages;
    if (page <= 4) return [...pages.slice(0, 5), -1, totalPages];
    if (page >= totalPages - 3) return [1, -1, ...pages.slice(totalPages - 5)];
    return [1, -1, page - 1, page, page + 1, -1, totalPages];
  };

  const visiblePages = getVisiblePages();

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="h-8 w-8 cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {visiblePages.map((p, idx) =>
        p === -1 ? (
          <span
            key={`ellipsis-${idx}`}
            className="w-8 text-center text-muted-foreground text-sm"
          >
            …
          </span>
        ) : (
          <Button
            key={p}
            variant={p === page ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? "page" : undefined}
            className="h-8 w-8 text-sm cursor-pointer"
          >
            {p}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="h-8 w-8 cursor-pointer"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </nav>
  );
}
