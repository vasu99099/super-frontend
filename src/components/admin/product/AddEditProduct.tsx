'use client';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';

import ADDEditProductDetails from './ADDEditProductDetails';
import { dispatch } from '@/store';
import { getAllCategoriesList } from '@/store/slices/categorySlice';
import { getProductById } from '@/store/slices/productSlice';

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
        <ADDEditProductDetails isEdit={isEdit} />
      </div>
    </div>
  );
};

export default AddEditProduct;
