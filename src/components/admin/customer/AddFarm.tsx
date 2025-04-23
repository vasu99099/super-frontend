import React, { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import SelectComponent from '@/components/form/FormSelect';
import Button from '@/components/ui/button/Button';
import Alert from '@/components/common/Alert';

import RefreshIcon from '@/icons/components/RefreshIcon';
import { FarmType, customerType } from '@/types/customerType';
import { getVillageList } from '@/store/slices/globalSlice';
import { dispatch, useSelector } from '@/store';
import { AddCustomerFarm, updateFarm } from '@/store/slices/customerSlice';

const validationSchema = Yup.object({
  farm_name: Yup.string()
    .trim()
    .min(2, 'Farm name must be at least 2 characters')
    .max(255, 'Farm name must not exceed 255 characters')
    .required('Farm name is required'),
  customer_id: Yup.number().integer('Invalid Customer').required('Customer is required'),
  village_id: Yup.number().integer('Invalid Village').required('Village is required'),
  longitude: Yup.number().nullable().min(-180, 'Invalid Longitude').max(180, 'Invalid Longitude'),
  latitude: Yup.number().nullable().min(-90, 'Invalid Latitude').max(90, 'Invalid Latitude')
});

const AddFarm = ({
  closeModal,
  customer,
  isEdit = false
}: {
  closeModal: () => void;
  isEdit?: boolean;
  customer?: customerType;
}) => {
  const [gloablError, setGlobalError] = useState<string>('');
  const [locationLoader, setLocationLoader] = useState(false);
  const { isLoading, options: villageOpt } = useSelector((state) => state.global.village);

  useEffect(() => {
    if (villageOpt.length === 0) dispatch(getVillageList());
  }, [villageOpt]);

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
      farm_name: isEdit ? customer?.farms[0]?.farm_name : '',
      customer_id: customer?.customer_id,
      customer_name: customer?.name,
      village_id: isEdit ? customer?.farms[0]?.village_id ?? customer?.village.id : '',
      longitude: isEdit ? Number(customer?.farms[0]?.longitude) : null,
      latitude: isEdit ? Number(customer?.farms[0]?.latitude) : null
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setErrors }) => {
      const payload = {
        farm_id: customer?.farms[0]?.farm_id,
        farm_name: values.farm_name,
        customer_id: Number(values.customer_id),
        village_id: Number(values.village_id),
        longitude: values.longitude ? Number(values.longitude) : null,
        latitude: values.latitude ? Number(values.latitude) : null
      };
      if (!isEdit) {
        delete payload.farm_id;
      }
      const response = isEdit
        ? await dispatch(updateFarm(payload as FarmType))
        : await dispatch(AddCustomerFarm(payload as FarmType));

      if (response.success) {
        setGlobalError('');
        closeModal();
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

  const handleGetLocation = useCallback(() => {
    setLocationLoader(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFieldValue('latitude', position.coords.latitude.toString());
          setFieldValue('longitude', position.coords.longitude.toString());
        },
        (error) => {
          alert('Error getting location: ' + error.message);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
    setLocationLoader(false);
  }, [setFieldValue]);

  if (!customer) {
    return <p>No Customer Selected</p>;
  }
  return (
    <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
      <div className="px-2 pr-14 mb-10">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {isEdit ? 'Edit Farm' : 'Add Farm'}
        </h4>
      </div>
      {gloablError && <Alert message={gloablError} type="error" />}
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="custom-scrollbar h-full overflow-y-auto px-2 pb-3">
          <div className="mt-5">
            <div className="grid gap-y-5 ">
              <div className="col-span-2 ">
                <Label>Customer Name</Label>
                <Input type="text" value={values.customer_name} name="customer_name" disabled />
              </div>
              <div className="col-span-2 ">
                <Label>Farm Name</Label>
                <Input
                  type="text"
                  error={touched.farm_name && errors.farm_name ? true : false}
                  value={values.farm_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="farm_name"
                  hint={errors.farm_name}
                />
              </div>
              <div className="col-span-2">
                <Label>Village</Label>
                <SelectComponent
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
              <div className="col-span-2 lg:col-span-1 flex gap-5 items-end">
                <div className="flex flex-col w-full">
                  <Label>Longitude</Label>
                  <Input
                    type="text"
                    error={touched.longitude && errors.longitude ? true : false}
                    value={values.longitude?.toString() ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="longitude"
                    hint={errors.longitude}
                    disabled
                  />
                </div>

                <div className="flex flex-col w-full">
                  <Label>Latitude</Label>
                  <Input
                    type="text"
                    error={touched.latitude && errors.latitude ? true : false}
                    value={values.latitude?.toString() ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="latitude"
                    hint={errors.latitude}
                    disabled
                  />
                </div>

                <div className="flex items-center justify-center w-full mt-4">
                  <Button
                    onClick={handleGetLocation}
                    startIcon={
                      <RefreshIcon
                        className={`w-5 h-5  text-white ${locationLoader ? 'animate-spin' : ''}`}
                      />
                    }
                    size="sm"
                    variant="secondary">
                    Get Location
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          <Button size="sm" variant="outline" onClick={closeModal}>
            Close
          </Button>
          <Button size="sm" type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
            {isEdit ? 'Save Changes' : 'Add Farm'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddFarm;
