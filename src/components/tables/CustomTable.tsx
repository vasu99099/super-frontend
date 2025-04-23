'use client';
import React, {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  memo,
  useCallback,
  useEffect
} from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import Button from '../ui/button/Button';
import EditIcon from '@/icons/components/EditIcon';
import { DeleteIcon } from '@/icons/components/DeleteIcon';
import { categoryType } from '../admin/category/CategoryListing';
import Skeleton from '../common/Skeleton';

import { confirm } from '../common/ConfirmBox';
import useTable from '@/hooks/useTable';
import { TableProps } from '@/types/customTableType';
import Pagination from './Pagination';
import SearchInput from '../form/input/SearchInput';
import TruncatedText from '../common/TruncatedText';
import { getNestedValue } from '@/utils/util';
import ArrowDown from '@/icons/components/ArrowDown';
import ArrowUp from '@/icons/components/ArrowUp';
import CustomDropdown from '../ui/dropdown/CustomDorpdown';

function CustomTable(props: TableProps) {
  const {
    hasSr = false,
    hasActions = false,
    tableData,
    tableColumn,
    isLoading = false,
    tableConfig,
    onTableAction,
    totalRow,
    defaultRowsPerPage = 10
  } = props;

  const {
    order,
    orderBy,
    page,
    searchText,
    abortSignal,
    rowsPerPage,
    accordionId,
    onSort,
    onChangeRowsPerPage,
    onChangePage,
    onSearchTextChange,
    handleAccordionIdSet
  } = useTable(defaultRowsPerPage);

  const handleOnEdit = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const id = (e.currentTarget as HTMLDivElement).dataset.id;
      const row = (e.currentTarget as HTMLDivElement).dataset.val;
      if (id && props.hasActions && 'handleEdit' in props) {
        props.handleEdit(id);
      }
    },
    [props]
  );

  useEffect(() => {
    onTableAction(page, order, orderBy, rowsPerPage, searchText, abortSignal);
  }, [page, order, orderBy, rowsPerPage, searchText]);

  const handleOnDelete = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      const id = (e.currentTarget as HTMLDivElement).dataset.id;

      if (id && props.hasActions && 'handleDelete' in props) {
        const isConfirmed = await confirm('Are you sure you want to delete this item?');
        if (isConfirmed) {
          props.handleDelete(id, page, order, orderBy, rowsPerPage, searchText);
        }
      }
    },
    [props]
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-3 ">
        {/* Search Bar */}
        {tableConfig?.searchBar && (
          <div className="w-full sm:w-auto">
            <SearchInput
              value={searchText}
              placeholder={tableConfig.searchBarPlaceholder}
              handleAction={onSearchTextChange}
            />
          </div>
        )}

        {/* Action Buttons */}
        {props.actionButtons && (
          <div className="flex flex-wrap gap-2 sm:space-x-2 justify-start sm:justify-end">
            {props.actionButtons}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px] ">
            <div className="!max-h-[60vh] overflow-auto ">
              <Table>
                {/* Table Header */}
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-brand-25 sticky top-0 z-5">
                  <TableRow>
                    {props.accordionBody && (
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 w-10">
                        {''}
                      </TableCell>
                    )}
                    {hasSr && (
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 w-10">
                        #id
                      </TableCell>
                    )}
                    {tableColumn.map((header) => (
                      <TableCell
                        key={header.key}
                        isHeader
                        className={`px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 ${
                          header.sortable ? 'cursor-pointer' : 'cursor-default'
                        } `}
                        style={{ width: header.width }}
                        onClick={() => header.sortable && onSort(header.key)}>
                        {header.name}

                        {header.sortable && (
                          <span className="ml-1">
                            {orderBy === header.key ? (order === 'asc' ? '▲' : '▼') : '⇅'}
                          </span>
                        )}
                      </TableCell>
                    ))}

                    {hasActions && (
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400 ">
                        Actions
                      </TableCell>
                    )}
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] ">
                  {!isLoading
                    ? tableData.map((col, index) => {
                        const uniqueId = Number(col[tableConfig.idKey as keyof typeof col]);
                        return (
                          <Fragment key={index}>
                            <TableRow
                              key={index}
                              className={`${
                                props.accordionBody && accordionId === uniqueId ? 'border-0' : ''
                              }`}>
                              {props.accordionBody && (
                                <TableCell
                                  isHeader
                                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 w-10"
                                  onClick={() => {
                                    handleAccordionIdSet(
                                      accordionId === uniqueId ? null : uniqueId
                                    );
                                  }}>
                                  {accordionId && accordionId === uniqueId ? (
                                    <ArrowUp />
                                  ) : (
                                    <ArrowDown />
                                  )}
                                </TableCell>
                              )}
                              {hasSr && (
                                <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                                  {index + 1}
                                </TableCell>
                              )}
                              {tableColumn.map((tc) => (
                                <TableCell
                                  key={tc.key}
                                  className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                  {tc.maxLength ? (
                                    <TruncatedText
                                      text={getNestedValue(col, tc.key)}
                                      maxLength={tc.maxLength}
                                    />
                                  ) : (
                                    getNestedValue(col, tc.key)
                                  )}
                                </TableCell>
                              ))}
                              {hasActions && 'handleEdit' in props && 'handleDelete' in props && (
                                <TableCell className="px-4 py-3 text-gray-500 text-start dark:text-gray-400 flex space-x-2">
                                  <div
                                    className="text-brand-500 cursor-pointer"
                                    data-id={String(col[tableConfig.idKey as keyof typeof col])}
                                    data-val={col}
                                    onClick={handleOnEdit}>
                                    <EditIcon />
                                  </div>
                                  <div
                                    className="text-red-600 cursor-pointer"
                                    data-id={String(col[tableConfig.idKey as keyof typeof col])}
                                    onClick={handleOnDelete}>
                                    <DeleteIcon />
                                  </div>
                                  {props.columnExtraBtn &&
                                    'handleEdit' in props &&
                                    'handleDelete' in props && (
                                      <div className="flex flex-wrap gap-2 sm:space-x-2 justify-start sm:justify-end">
                                        {props.columnExtraBtn(col)}
                                      </div>
                                    )}
                                </TableCell>
                              )}
                            </TableRow>
                            {props.accordionBody &&
                              accordionId ===
                                Number(col[tableConfig.idKey as keyof typeof col]) && (
                                <TableRow>
                                  <TableCell
                                    colSpan={
                                      tableColumn.length + Number(hasSr) + Number(hasActions) + 1
                                    }>
                                    {isValidElement(props.accordionBody)
                                      ? cloneElement(props.accordionBody, { col } as any)
                                      : props.accordionBody}
                                  </TableCell>
                                </TableRow>
                              )}
                          </Fragment>
                        );
                      })
                    : Array.from({ length: rowsPerPage }).map((_, index) => (
                        <TableRow key={index}>
                          {hasSr && (
                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                              <Skeleton />
                            </TableCell>
                          )}
                          {tableColumn.map((tc) => (
                            <TableCell
                              key={tc.key}
                              className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                              <Skeleton />
                            </TableCell>
                          ))}
                          {hasActions && 'handleEdit' in props && 'handleDelete' in props && (
                            <TableCell className="px-4 py-3 text-gray-500 text-start dark:text-gray-400 flex space-x-2">
                              <Skeleton width="35px" />
                              <Skeleton width="35px" />
                            </TableCell>
                          )}
                        </TableRow>
                      ))}

                  {!isLoading && tableData?.length === 0 && (
                    <TableRow>
                      <TableCell
                        className="text-gray-500 text-center dark:text-gray-400 h-32"
                        colSpan={tableColumn.length + Number(hasSr) + Number(hasActions)}>
                        No Data Found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <Pagination
              currentPage={page}
              totalRow={totalRow}
              onPageChange={onChangePage}
              rowsPerPage={rowsPerPage}
              onChangeRowsPerPage={onChangeRowsPerPage}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(CustomTable);
