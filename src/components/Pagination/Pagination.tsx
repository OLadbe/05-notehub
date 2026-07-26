import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";

import css from './Pagination.module.css'

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<ComponentType<ReactPaginateProps>>
).default;

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ totalPages, onPageChange, currentPage }: PaginationProps) {
    const handlePageClick = (event: { selected: number }) => {
        onPageChange(event.selected + 1);
    };

    return (
        <ReactPaginate
            pageCount={totalPages}
            forcePage={currentPage - 1}
            onPageChange={handlePageClick}
            previousLabel="<"
            nextLabel=">"
            activeClassName={css.active}
            containerClassName={css.pagination}
        />
    );
}