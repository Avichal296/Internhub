import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {currentPage > 1 && (
        <Link href={`?page=${currentPage - 1}`}>
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
        </Link>
      )}

      {pageNumbers.map((page) => (
        <Link key={page} href={`?page=${page}`}>
          <Button
            variant={page === currentPage ? 'default' : 'outline'}
            size="sm"
            className="w-10"
          >
            {page}
          </Button>
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link href={`?page=${currentPage + 1}`}>
          <Button variant="outline" size="sm">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      )}
    </div>
  );
}
