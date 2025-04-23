'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import TextArea from '@/components/form/input/TextArea';
import Alert from '@/components/common/Alert';
import Checkbox from '@/components/form/input/Checkbox';
import ComponentCard from '@/components/common/ComponentCard';
import SelectComponent from '@/components/form/FormSelect';
import SectionLoader from '@/components/common/SectionLoader';

import { AddCustomer, getCustomersById, updateCustomer } from '@/store/slices/customerSlice';
import { getVillageList } from '@/store/slices/globalSlice';
import { dispatch, useSelector } from '@/store';

import { ROUTE_PATH } from '@/constant/Routes';

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, 'Customer name must be at least 2 characters')
    .max(255, 'Customer name must not exceed 255 characters')
    .required('Customer name is required'),
  phone: Yup.string()
    .matches(/^\d{10,20}$/, 'Phone number must be between 10 and 20 digits')
    .required('Phone number is required'),
  whatsapp_number: Yup.string()
    .matches(/^\d{10,20}$/, 'Whatsapp number must be between 10 and 20 digits')
    .nullable()
    .optional(),
  email: Yup.string().email('Invalid email format').nullable().optional(),
  address: Yup.string()
    .max(1000, 'Address must not exceed 1000 characters')
    .optional()
    .nullable()
    .typeError('Address must be a string'),
  village_id: Yup.number().integer('Invalid Village').required('Village is required')
});

const CustomerAddEdit = ({ isEdit = false }: { isEdit: boolean }) => {
  const [gloablError, setGlobalError] = useState<string>('');
  const { singleActionCus: customer, isLoading: customerLoader } = useSelector(
    (state) => state.customer
  );
  const { isLoading, options: villageOpt } = useSelector((state) => state.global.village);
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;
  useEffect(() => {
    if (villageOpt.length === 0) {
      dispatch(getVillageList());
    }
    if (isEdit && customerId) {
      dispatch(getCustomersById(customerId));
    }
  }, []);
  const {
    errors,
    values,
    touched,
    setFieldValue,
    handleSubmit,
    handleChange,
    handleBlur,
    isSubmitting
  } = useFormik({
    initialValues: {
      customer_id: isEdit ? customer?.customer_id || '' : '',
      name: isEdit ? customer?.name || '' : '',
      address: isEdit ? customer?.address || '' : '',
      village_id: isEdit ? customer?.village.id || '' : '',
      village: isEdit
        ? customer?.village
          ? { value: customer?.village.id, name: customer?.village.name }
          : undefined
        : '',
      phone: isEdit ? customer?.phone || '' : '',
      isWhatsappSameAsPhone: false,
      whatsapp_number: isEdit ? customer?.whatsapp_number || '' : '',
      email: isEdit ? customer?.email || '' : ''
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values, { setErrors }) => {
      const payload = {
        customer_id: customer?.customer_id,
        name: values?.name,
        address: values?.address,
        village_id: values?.village_id,
        phone: values?.phone,
        whatsapp_number: values?.whatsapp_number,
        email: values?.email
      };
      if (!isEdit) {
        delete payload.customer_id;
      }
      const response = isEdit
        ? await dispatch(updateCustomer(payload))
        : await dispatch(AddCustomer(payload));
      if (response.success) {
        setGlobalError('');
        router.push(ROUTE_PATH.ADMIN.customer.INDEX);
        toast.success(isEdit ? 'Customer Updated Successfully' : 'Customer Added successfully');
      } else {
        if (typeof response.message === 'object') {
          setGlobalError('');
          setErrors(response?.message);
        } else {
          setGlobalError(response.message);
        }
      }
    }
  });
  return (
    <ComponentCard title={isEdit ? 'Customer Edit' : 'Customer Add'}>
      {gloablError && <Alert message={gloablError} type="error" />}
      <SectionLoader isLoading={isEdit && customerLoader}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="col-span-2">
              <Label>Customer Name</Label>
              <Input
                type="text"
                error={touched.name && errors.name ? true : false}
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                name="name"
                hint={errors.name}
              />
            </div>
            <div className="col-span-2">
              <Label>Village</Label>
              <SelectComponent
                error={touched.village_id && !!errors.village_id}
                defaultValue={
                  customer?.village && isEdit
                    ? { value: customer.village.id, label: customer.village.name }
                    : undefined ?? undefined
                }
                options={villageOpt}
                name="village_id"
                isSearchable
                isLoading={isLoading}
                onChange={(e) => {
                  setFieldValue('village_id', e.value);
                }}
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <Label>Phone Number</Label>
              <Input
                type="text"
                error={touched.phone && errors.phone ? true : false}
                value={values.phone}
                onChange={(e) => {
                  handleChange(e);
                  if (values.isWhatsappSameAsPhone) {
                    setFieldValue('whatsapp_number', e.target.value);
                  }
                }}
                onBlur={handleBlur}
                name="phone"
                hint={errors.phone}
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <Label>Whatsapp Number</Label>
              <Input
                type="text"
                error={touched.whatsapp_number && errors.whatsapp_number ? true : false}
                value={values.whatsapp_number}
                disabled={values.isWhatsappSameAsPhone}
                onChange={handleChange}
                onBlur={handleBlur}
                name="whatsapp_number"
                hint={errors.whatsapp_number}
              />
            </div>
            <div className="col-span-2">
              <Checkbox
                checked={values.isWhatsappSameAsPhone}
                label="Is whatsapp number same as Phone number?"
                onChange={(isChecked) => {
                  setFieldValue('whatsapp_number', values.phone);
                  setFieldValue('isWhatsappSameAsPhone', isChecked);
                }}
              />
            </div>
            <div className="col-span-2">
              <Label>Email</Label>
              <Input
                type="email"
                error={touched.email && errors.email ? true : false}
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                name="email"
                hint={errors.email}
              />
            </div>
            <div className="col-span-2">
              <Label>Address</Label>
              <TextArea
                error={touched.address && errors.address ? true : false}
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
                name="address"
                hint={errors.address}
              />
            </div>
            <div className="col-span-2 text-end">
              <Button size="sm" type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
                {isEdit ? 'Save Changes' : 'Add Customer'}
              </Button>
            </div>
          </div>
        </form>
      </SectionLoader>
    </ComponentCard>
  );
};

export default CustomerAddEdit;
