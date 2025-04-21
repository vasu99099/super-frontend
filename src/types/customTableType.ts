import { categoryType } from '@/components/admin/category/CategoryListing';
import { customerType } from './customerType';
import { ProductType } from '@/store/slices/productSlice';

export type SortOrderType = 'asc' | 'desc';

type tableDataType = categoryType | customerType | ProductType;

export type TableColumn = {
  name: string;
  key: string;
  render?: (obj: tableDataType) => void;
  sortable?: boolean;
  width?: string;
  maxLength?: number;
};

export interface tableConfigType {
  idKey: string;
  searchBar?: boolean;
  searchBarPlaceholder?: string;
}

interface TableBaseProps {
  hasSr?: boolean;
  tableColumn: TableColumn[];
  tableData: tableDataType[];
  tableConfig: tableConfigType;
  isLoading?: boolean;
  defaultRowsPerPage?: number;
  totalRow: number;
  actionButtons?: React.ReactNode | React.ReactNode[];
  columnExtraBtn?: (row: tableDataType) => React.ReactNode;
  accordionBody?: React.ReactNode;
  onTableAction: (
    page: number,
    order: SortOrderType,
    orderBy: string,
    pageSize: number,
    searchText?: string,
    abortSignal?: AbortSignal
  ) => void;
}

interface TablePropsWithoutActions extends TableBaseProps {
  hasActions: false;
}

interface TablePropsWithActions extends TableBaseProps {
  hasActions: true;
  handleEdit: (id: string | number) => void;
  handleDelete: (
    id: string | number,
    page: number,
    order: SortOrderType,
    orderBy: string,
    pageSize: number,
    searchText?: string
  ) => void;
}

export type TableProps = TablePropsWithoutActions | TablePropsWithActions;
