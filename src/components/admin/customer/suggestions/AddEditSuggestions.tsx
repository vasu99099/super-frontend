'use client';
import SectionLoader from '@/components/common/SectionLoader';
import SelectComponent from '@/components/form/FormSelect';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Button from '@/components/ui/button/Button';
import { ROUTE_PATH } from '@/constant/Routes';
import { dispatch, useSelector } from '@/store';
import { getCustomers, getCustomersById } from '@/store/slices/customerSlice';
import {
  AddDosage,
  DosageSuggestionType,
  UpdateDosage,
  getDosageById
} from '@/store/slices/dosageSlice';
import { getProducts } from '@/store/slices/productSlice';
import { FieldArray, Formik, FormikProps } from 'formik';
import { useRouter, useSearchParams } from 'next/navigation';
import { exit } from 'process';
import React, { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';

const productSchema = Yup.object().shape({
  farm_id: Yup.number().integer('Invalid farm').required('farm is required'),
  customer_id: Yup.number().integer('Invalid customer').required('Customer is required'),

  suggestions: Yup.array().of(
    Yup.object().shape({
      product_id: Yup.number().required('Product is required'),
      note: Yup.string().trim().nullable().optional()
    })
  )
});

const AddEditSuggestions = ({ isEdit = false }) => {
  const formikRef = useRef<FormikProps<DosageSuggestionType>>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [farmOpt, setFarmOption] = useState([]);
  const [gloablError, setGlobalError] = useState<string>('');
  const {
    customers,
    singleActionCus,
    isLoading: customerLoading
  } = useSelector((state) => state.customer);
  const { products, isLoading: productLoading } = useSelector((state) => state.product);
  const searchParams = useSearchParams();
  const router = useRouter();
  const customer_id = searchParams.get('customer_id');
  const dosage_id = searchParams.get('dosage_id');

  useEffect(() => {
    handleLoadProductOpt('');
  }, []);
  useEffect(() => {
    (async () => {
      if (customer_id) {
        const data = await dispatch(getCustomersById(customer_id));
        console.log('data', data);
        if (data.data) {
          formikRef.current?.setFieldValue('customer_id', data.data.customer_id);
          setFarmOption(data.data?.farms);
        }
      }
      if (dosage_id) {
        const result = await dispatch(getDosageById(dosage_id));
        formikRef.current?.setFieldValue('farm_id', result.data.farm_id);
        formikRef.current?.setFieldValue('suggestions', result.data.suggestions);
      }
    })();
  }, [customer_id, dosage_id]);

  const handleLoadCustomerOpt = async (searchText: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current?.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    const data = await dispatch(getCustomers(1, '', '', 10, searchText, abortController.signal));
    return data.data?.customers;
  };

  const handleLoadProductOpt = async (searchText: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current?.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    const data = await dispatch(getProducts(1, '', '', 10, searchText, abortController.signal));
    return data.data?.products;
  };

  return (
    <div className="">
      <Formik<DosageSuggestionType>
        innerRef={formikRef}
        enableReinitialize
        initialValues={{
          farm_id: '',
          customer_id: '',
          suggestions: [{ note: '', product_id: '' }]
        }}
        validationSchema={productSchema}
        onSubmit={async (values, { setFieldValue, resetForm, setErrors }) => {
          console.log(values);
          const payload: {
            customer_id: string | number;
            dosage_id?: string | number;
            farm_id: string | number;
            suggestions: typeof values.suggestions;
          } = {
            customer_id: values.customer_id,
            dosage_id: dosage_id ?? '',
            farm_id: values.farm_id,
            suggestions: values.suggestions
          };
          if (!isEdit) {
            delete payload.dosage_id;
          }
          const response = isEdit
            ? await dispatch(UpdateDosage(payload))
            : await dispatch(AddDosage(payload));
          if (response.success) {
            setGlobalError('');
            router.push(ROUTE_PATH.ADMIN.customer.DETAIL(values.customer_id, values.farm_id));
          } else {
            if (typeof response.message === 'object') {
              setGlobalError('');
              setErrors(response?.message);
            } else {
              setGlobalError(response.message);
            }
          }
        }}>
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          isSubmitting
        }) => {
          console.log('values', values, isEdit);
          return (
            <div className="sm:col-span-2 ">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-1">
                  <div className="col-span-2">
                    <Label>Customer</Label>
                    <SelectComponent
                      isAsync
                      options={customers}
                      defaultValue={customer_id && singleActionCus ? singleActionCus : undefined}
                      labelKey="name"
                      ValueKey="customer_id"
                      name="customer_id"
                      isSearchable
                      onLoadOption={handleLoadCustomerOpt}
                      isDisabled={!!customer_id}
                      error={!!errors.customer_id && touched.customer_id}
                      onChange={(e) => {
                        setFarmOption(e?.farms ?? []);
                        setFieldValue('customer_id', e.customer_id);
                      }}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Farm</Label>
                    <SelectComponent
                      options={farmOpt}
                      defaultValue={
                        isEdit && farmOpt.length ? values.farm_id ?? undefined : undefined
                      }
                      labelKey="farm_name"
                      ValueKey="farm_id"
                      name="farm_id"
                      error={!!errors.farm_id && touched.farm_id}
                      onChange={(e) => {
                        setFieldValue('farm_id', e.farm_id);
                      }}
                    />
                  </div>
                  <FieldArray name="suggestions">
                    {({ push, remove }) => (
                      <div className="space-y-4">
                        {values.suggestions.map((item, index) => (
                          <div key={index} className="md:flex gap-x-4 items-end">
                            <div className="flex-1 mb-3 md:mb-0">
                              <Label>Product</Label>
                              <SelectComponent
                                isAsync
                                options={products}
                                defaultValue={
                                  isEdit ? (item as any).product ?? undefined : undefined
                                }
                                labelKey="name"
                                ValueKey="product_id"
                                name={`ProductPackaging[${index}].product_id`}
                                isSearchable
                                onLoadOption={handleLoadProductOpt}
                                error={
                                  touched.suggestions?.[index]?.product_id &&
                                  !!(errors.suggestions?.[index] as any)?.product_id
                                }
                                onChange={(e) => {
                                  setFieldValue(`suggestions[${index}].product_id`, e.product_id);
                                }}
                              />
                            </div>
                            <div className="flex-1 mb-3 md:mb-0">
                              <Label>Note</Label>
                              <Input
                                error={
                                  touched.suggestions?.[index]?.note &&
                                  !!(errors.suggestions?.[index] as any)?.note
                                }
                                className="!h-[44px]"
                                value={item.note}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                name={`suggestions[${index}].note`}
                                hint={(errors.suggestions?.[index] as any)?.note}
                              />
                            </div>
                            {index !== 0 && (
                              <Button
                                type="button"
                                className="!rounded-none"
                                size="sm"
                                onClick={() => remove(index)}
                                variant="danger">
                                -
                              </Button>
                            )}
                          </div>
                        ))}
                        <div>
                          <Button
                            type="button"
                            className="!rounded-none border border-black"
                            variant="light"
                            onClick={() => push({ product_id: '', note: '' })}
                            size="sm">
                            + Add Product
                          </Button>
                        </div>
                      </div>
                    )}
                  </FieldArray>
                  <div className="col-span-2 text-end">
                    <Button
                      size="sm"
                      type="submit"
                      isLoading={isSubmitting}
                      disabled={isSubmitting}>
                      {isEdit ? 'Save Changes' : 'Add Suggestions'}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          );
        }}
      </Formik>
    </div>
  );
};

export default AddEditSuggestions;
