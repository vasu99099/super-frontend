'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import ProductAccordionBody from './ProductAccordionBody';
import CustomTable from '@/components/tables/CustomTable';
import Button from '@/components/ui/button/Button';

import { dispatch, useSelector } from '@/store';
import { deleteProduct, getProducts } from '@/store/slices/productSlice';
import { ROUTE_PATH } from '@/constant/Routes';
import { SortOrderType, TableColumn, tableConfigType } from '@/types/customTableType';

export interface categoryType {
  category_id: number;
  name: string;
  description: string;
}

const tableColumn: TableColumn[] = [
  { name: 'Product Name', key: 'name', sortable: true },
  { name: 'HSN Code', key: 'hsc_code', maxLength: 20 },
  { name: 'Category', key: 'category.name' }
];
const tableConfig: tableConfigType = {
  idKey: 'product_id',
  searchBar: true,
  searchBarPlaceholder: 'Search by Product name'
};

const ProductListing = () => {
  const { products = [], totalProduct, isLoading = true } = useSelector((state) => state.product);
  const router = useRouter();

  const handleDelete = async (
    id: number | string,
    page: number,
    order: SortOrderType,
    orderBy: string,
    rowsPerPage: number,
    searchText?: string
  ) => {
    id = Number(id);
    await dispatch(deleteProduct(id, page, order, orderBy, rowsPerPage, searchText));
  };

  const handleAddProduct = () => {
    router.push(ROUTE_PATH.ADMIN.product.ADD_PRODUCT);
  };

  const handleEdit = (id: number | string) => {
    router.push(ROUTE_PATH.ADMIN.product.EDIT_PRODUCT(id));
  };
  const handleTableAction = async (
    page: number,
    order: SortOrderType,
    orderBy: string,
    rowsPerPage: number,
    searchText?: string,
    abortSignal?: AbortSignal
  ) => {
    await dispatch(getProducts(page, order, orderBy, rowsPerPage, searchText, abortSignal));
  };

  return (
    <div>
      <CustomTable
        hasSr
        hasActions
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        tableData={products}
        tableColumn={tableColumn}
        tableConfig={tableConfig}
        isLoading={isLoading}
        onTableAction={handleTableAction}
        totalRow={totalProduct}
        accordionBody={<ProductAccordionBody />}
        actionButtons={[
          <Button size="sm" onClick={handleAddProduct} key="add_cat">
            + Add Product
          </Button>
        ]}
      />
    </div>
  );
};

export default ProductListing;
