'use client';
import React, { useEffect } from 'react';
import ADDEditProductDetails from './ADDEditProductDetails';
import { dispatch } from '@/store';
import { getAllCategoriesList } from '@/store/slices/categorySlice';
import { getProductById } from '@/store/slices/productSlice';
import { useParams } from 'next/navigation';

const FORM_STEP = [
  { label: 'Product', subLabel: 'Details' },
  { label: 'Product', subLabel: 'Images' },
  { label: 'Confirmation' }
];

const AddEditProduct = ({ isEdit = false }) => {
  const params = useParams();

  useEffect(() => {
    dispatch(getAllCategoriesList());
    if (isEdit && params?.product_id) {
      dispatch(getProductById(params.product_id as string));
    }
  }, [isEdit, params?.product_id, dispatch]);
  return (
    <div>
      <div className="mt-16">
        <ADDEditProductDetails isEdit />
      </div>
    </div>
  );
};

export default AddEditProduct;
