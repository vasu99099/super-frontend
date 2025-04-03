'use client';
import React, { useState } from 'react';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { dispatch, useSelector } from '@/store';
import { updateUserProfile } from '@/store/slices/authSlice';
import Alert from '@/components/common/Alert';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  firstname: Yup.string()
    .trim()
    .min(2, 'First name must be at least 2 characters')
    .required('First name is required'),
  lastname: Yup.string()
    .trim()
    .min(2, 'Last name must be at least 2 characters')
    .required('Last name is required'),
  contact_number: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone number is required')
});

const EditProfile = ({ closeModal }: { closeModal: () => void }) => {
  const [gloablError, setGlobalError] = useState<string>('');
  const { user } = useSelector((state) => state.auth);

  const {
    errors,
    values,
    touched,
    handleSubmit,
    handleChange,
    handleBlur,
    isSubmitting,
    setErrors
  } = useFormik({
    initialValues: { ...user },
    validationSchema: validationSchema,
    onSubmit: async (values, { setErrors }) => {
      setGlobalError('');
      const payload = {
        firstname: values.firstname,
        lastname: values.lastname,
        email: values.email,
        contact_number: values.contact_number
      };
      const response = await dispatch(updateUserProfile(payload));
      if (response.success) {
        closeModal();
      } else {
        if (typeof response.message === 'object') setErrors(response?.message);
        else {
          setGlobalError(response.message);
        }
      }
    }
  });

  return (
    <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
      <div className="px-2 pr-14">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Edit Personal Information
        </h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
          Update your details to keep your profile up-to-date.
        </p>
      </div>
      {gloablError && <Alert message={gloablError} type="error" />}
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
          <div className="mt-7">
            <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
              Personal Information
            </h5>

            <div className="grid gap-y-5 ">
              <div className="col-span-2 lg:col-span-1">
                <Label>First Name</Label>
                <Input
                  type="text"
                  error={touched.firstname && errors.firstname ? true : false}
                  value={values.firstname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="firstname"
                  hint={errors.firstname}
                />
              </div>

              <div className="col-span-2 lg:col-span-1">
                <Label>Last Name</Label>
                <Input
                  type="text"
                  error={touched.lastname && errors.lastname ? true : false}
                  value={values.lastname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="lastname"
                  hint={errors.lastname}
                />
              </div>

              <div className="col-span-2 lg:col-span-1">
                <Label>Email Address</Label>
                <Input
                  type="text"
                  error={touched.email && errors.email ? true : false}
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="email"
                  hint={errors.email}
                />
              </div>

              <div className="col-span-2 lg:col-span-1">
                <Label>Phone</Label>
                <Input
                  type="text"
                  error={touched.contact_number && errors.contact_number ? true : false}
                  value={values.contact_number}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="contact_number"
                  hint={errors.contact_number}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          <Button size="sm" variant="outline" onClick={closeModal}>
            Close
          </Button>
          <Button size="sm" type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
