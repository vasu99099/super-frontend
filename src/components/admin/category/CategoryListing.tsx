'use client';
import CustomTable from '@/components/tables/CustomTable';
import { Modal } from '@/components/ui/modal';
import { useModal } from '@/hooks/useModal';
import { dispatch, useSelector } from '@/store';
import categorySlice, {
  deleteCategory,
  getCategories,
  getCategoriesById
} from '@/store/slices/categorySlice';
import React, { useEffect, useState } from 'react';
import CategoryModal from './CategoryModal';
import Button from '@/components/ui/button/Button';
import { SortOrderType, TableColumn, tableConfigType } from '@/types/customTableType';
import Input from '@/components/form/input/InputField';
import SearchInput from '@/components/form/input/SearchInput';

export interface categoryType {
  category_id: number;
  name: string;
  description: string;
}

const tableColumn: TableColumn[] = [
  { name: 'Category Name', key: 'name', sortable: true },
  { name: 'Description', key: 'description', maxLength: 20 }
];
const tableConfig: tableConfigType = {
  idKey: 'category_id',
  searchBar: true,
  searchBarPlaceholder: 'Search by category name'
};

const CategoryListing = () => {
  const { categories, totalCategory, isLoading = true } = useSelector((state) => state.category);
  const { isOpen, openModal, closeModal } = useModal();
  const [isEdit, setIsEdit] = useState(false);

  const handleOnCLose = () => {
    setIsEdit(false);
    closeModal();
  };

  const handleEdit = async (id: number | string) => {
    setIsEdit(true);
    await dispatch(getCategoriesById(id));
    openModal();
  };

  const handleDelete = async (id: number | string) => {
    id = Number(id);
    await dispatch(deleteCategory({ category_id: id }));
  };

  const handleAddCategory = () => {
    openModal();
  };
  const handleTableAction = async (
    page: number,
    order: SortOrderType,
    orderBy: string,
    rowsPerPage: number,
    searchText?: string,
    abortSignal?: AbortSignal
  ) => {
    await dispatch(getCategories(page, order, orderBy, rowsPerPage, searchText, abortSignal));
  };

  return (
    <div>
      <CustomTable
        hasSr
        hasActions
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        tableData={categories}
        tableColumn={tableColumn}
        tableConfig={tableConfig}
        isLoading={isLoading}
        onTableAction={handleTableAction}
        totalRow={totalCategory}
        actionButtons={[
          <Button size="sm" onClick={handleAddCategory} key="add_cat">
            + Add Category
          </Button>
        ]}
      />
      <Modal isOpen={isOpen} onClose={handleOnCLose} className="max-w-[700px] m-4">
        <CategoryModal closeModal={handleOnCLose} isEdit={isEdit} />
      </Modal>
    </div>
  );
};

export default CategoryListing;
