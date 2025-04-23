'use client';
import React, { useCallback, useState } from 'react';
import CustomTable from '@/components/tables/CustomTable';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';

import CategoryModal from './CategoryModal';
import { useModal } from '@/hooks/useModal';
import { dispatch, useSelector } from '@/store';
import { deleteCategory, getCategories, getCategoriesById } from '@/store/slices/categorySlice';
import { SortOrderType, TableColumn, tableConfigType } from '@/types/customTableType';

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

  const handleOnClose = useCallback(() => {
    setIsEdit(false);
    closeModal();
  }, [closeModal]);

  const handleEdit = useCallback(async (id: number | string) => {
    setIsEdit(true);
    await dispatch(getCategoriesById(Number(id)));
    openModal();
  }, []);

  const handleDelete = useCallback(async (id: number | string) => {
    await dispatch(deleteCategory({ category_id: Number(id) }));
  }, []);

  const handleAddCategory = useCallback(() => {
    setIsEdit(false);
    openModal();
  }, []);

  const handleTableAction = useCallback(
    async (
      page: number,
      order: SortOrderType,
      orderBy: string,
      rowsPerPage: number,
      searchText?: string,
      abortSignal?: AbortSignal
    ) => {
      await dispatch(getCategories(page, order, orderBy, rowsPerPage, searchText, abortSignal));
    },
    []
  );

  return (
    <div>
      <CustomTable
        hasSr
        hasActions
        tableData={categories}
        tableColumn={tableColumn}
        tableConfig={tableConfig}
        isLoading={isLoading}
        totalRow={totalCategory}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        onTableAction={handleTableAction}
        actionButtons={[
          <Button size="sm" onClick={handleAddCategory} key="add_cat">
            + Add Category
          </Button>
        ]}
      />
      <Modal isOpen={isOpen} onClose={handleOnClose} className="max-w-[700px] m-4">
        <CategoryModal closeModal={handleOnClose} isEdit={isEdit} />
      </Modal>
    </div>
  );
};

export default CategoryListing;
