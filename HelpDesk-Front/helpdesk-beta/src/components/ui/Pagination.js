import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];
    const maxVisiblePages = 3;

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const getVisiblePages = () => {
        if (totalPages <= maxVisiblePages) {
            return pageNumbers;
        }

        let start = Math.max(1, currentPage - 1);
        let end = Math.min(totalPages, start + maxVisiblePages - 1);

        if (end - start + 1 < maxVisiblePages) {
            start = Math.max(1, end - maxVisiblePages + 1);
        }

        return pageNumbers.slice(start - 1, end);
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center space-x-1 text-sm">
                {currentPage > 1 && (
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        className="px-2 py-1 rounded text-gray-600 hover:bg-gray-100"
                    >
                        Back
                    </button>
                )}
                {visiblePages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-8 h-8 rounded-full ${currentPage === page
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {page}
                    </button>
                ))}
                {currentPage < totalPages && (
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        className="px-2 py-1 rounded text-gray-600 hover:bg-gray-100"
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    );
};

export default Pagination;