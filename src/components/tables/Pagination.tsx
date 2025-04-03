type PaginationProps = {
  currentPage: number;
  totalRow: number;
  onPageChange: (page: number) => void;
  rowsPerPage: number;
  onChangeRowsPerPage: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const ROW_PER_PAGE_OPT = [1, 2, 10, 20, 50, 100];

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalRow,
  onPageChange,
  rowsPerPage,
  onChangeRowsPerPage
}) => {
  const totalPages = Math.ceil(totalRow / rowsPerPage);
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, '...' as any, totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...' as any, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(
        1,
        '...' as any,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...' as any,
        totalPages
      );
    }

    return pages;
  };

  return (
    <div className="flex justify-between m-3">
      <div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600 dark:text-gray-300 text-sm">Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={onChangeRowsPerPage}
            className="border border-gray-300 dark:border-gray-600 shadow-none focus:outline-hidden rounded-md px-2 py-1 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-400">
            {ROW_PER_PAGE_OPT.map((size: number) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {totalPages > 0 && (
        <div className="flex items-center">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="mr-2.5 flex items-center h-9 justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] text-sm">
            Previous
          </button>

          <div className="flex items-center gap-2">
            {getPageNumbers().map((page, index) =>
              typeof page === 'number' ? (
                <button
                  key={index}
                  onClick={() => onPageChange(page)}
                  className={`px-4 py-2 rounded ${
                    currentPage === page
                      ? 'bg-brand-500 text-white'
                      : 'text-gray-700 dark:text-gray-400'
                  } flex w-10 items-center justify-center h-9 rounded-lg text-sm font-medium hover:bg-blue-500/[0.08] hover:text-brand-500 dark:hover:text-brand-500`}>
                  {page}
                </button>
              ) : (
                <span key={index} className="px-2">
                  ...
                </span>
              )
            )}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="ml-2.5 flex items-center h-9 justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs text-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]">
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;
