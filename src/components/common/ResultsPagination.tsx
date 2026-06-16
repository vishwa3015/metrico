import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../ui/Pagination"
import type { PaginationState } from "@/hooks/useResults"

interface ResultsPaginationProps {
    pagination: PaginationState
    pageSize: 25 | 50 | 100
    onPageChange: (page: number) => void
    onPageSizeChange: (size: 25 | 50 | 100) => void
    loading?: boolean
}

export function ResultsPagination({
    pagination,
    pageSize,
    onPageChange,
    onPageSizeChange,
    loading = false,
}: ResultsPaginationProps) {
    const { page, total, totalPages, hasNext, hasPrev } = pagination

    const from = total === 0 ? 0 : (page - 1) * pageSize + 1
    const to = Math.min(page * pageSize, total)

    const getPageNumbers = (): (number | "...")[] => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1)
        }
        if (page <= 4) {
            return [1, 2, 3, 4, 5, "...", totalPages]
        }
        if (page >= totalPages - 3) {
            return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
        }
        return [1, "...", page - 1, page, page + 1, "...", totalPages]
    }

    return (
        <div className="flex items-center justify-between px-1 py-2">

            <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">
                    {loading ? "Loading…" : total === 0 ? "No results" : `${from}–${to} of ${total}`}
                </span>

                <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5">
                    {([25, 50, 100] as const).map(size => (
                        <button
                            key={size}
                            onClick={() => onPageSizeChange(size)}
                            disabled={loading}
                            className={`px-2.5 py-1 text-xs rounded-md transition ${
                                pageSize === size
                                    ? "bg-teal-600 text-white shadow-sm"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            } disabled:cursor-not-allowed disabled:opacity-40`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
                <span className="text-xs text-slate-400">per page</span>
            </div>

            <Pagination className="mx-0 w-auto">
                <PaginationContent>

                    <PaginationItem>
                        <PaginationPrevious
                            onClick={hasPrev && !loading ? () => onPageChange(page - 1) : undefined}
                            aria-disabled={!hasPrev || loading}
                            className={!hasPrev || loading ? "pointer-events-none opacity-40" : "cursor-pointer"}
                        />
                    </PaginationItem>

                    {getPageNumbers().map((p, i) =>
                        p === "..." ? (
                            <PaginationItem key={`ellipsis-${i}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        ) : (
                            <PaginationItem key={p}>
                                <PaginationLink
                                    isActive={p === page}
                                    onClick={!loading ? () => onPageChange(p) : undefined}
                                    className={loading ? "pointer-events-none opacity-40" : "cursor-pointer"}
                                >
                                    {p}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    )}

                    <PaginationItem>
                        <PaginationNext
                            onClick={hasNext && !loading ? () => onPageChange(page + 1) : undefined}
                            aria-disabled={!hasNext || loading}
                            className={!hasNext || loading ? "pointer-events-none opacity-40" : "cursor-pointer"}
                        />
                    </PaginationItem>

                </PaginationContent>
            </Pagination>
        </div>
    )
}