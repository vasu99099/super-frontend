import { useState, useCallback } from 'react';
//types
type SortOrderType = 'asc' | 'desc';

export default function useTable(defaultRowsPerPage: number) {
  const [orderBy, setOrderBy] = useState('');

  const [order, setOrder] = useState<SortOrderType>('asc');

  const [page, setPage] = useState(1);

  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  const [accordionId, setAccordionId] = useState<number | null>();

  const [{ text, abortSignal }, setSearchTextAndAbort] = useState<{
    text: string;
    abortSignal: undefined | AbortSignal;
  }>({
    text: '',
    abortSignal: undefined
  });

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      if (id !== '') {
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(id);
      }
    },
    [order, orderBy]
  );

  const onChangePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleAccordionIdSet = useCallback((id: number | null) => {
    setAccordionId(id);
  }, []);

  const onSearchTextChange = useCallback((searchTxt: string, abortSignal?: AbortSignal) => {
    setPage(1);
    setSearchTextAndAbort({ abortSignal, text: searchTxt });
  }, []);

  const onChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setPage(1);
    setRowsPerPage(parseInt(event.target.value, 10));
  }, []);

  return {
    order,
    page,
    orderBy,
    rowsPerPage,
    searchText: text,
    abortSignal,
    accordionId,
    //
    //
    onSort,
    onChangePage,
    onChangeRowsPerPage,
    onSearchTextChange,
    //
    setPage,
    setOrder,
    setOrderBy,
    setRowsPerPage,
    handleAccordionIdSet
  };
}
