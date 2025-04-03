import React, { useState } from 'react';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { useFormik } from 'formik';
import { dispatch, useSelector } from '@/store';
import * as Yup from 'yup';
import TextArea from '@/components/form/input/TextArea';
import { AddCategory, updateCategory } from '@/store/slices/categorySlice';
import Alert from '@/components/common/Alert';

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, 'Category name must be at least 2 characters')
    .required('Category name is required'),
  description: Yup.string().trim().max(500, 'Description must be at max 500 characters').nullable()
});

const CategoryModal = ({
  closeModal,
  isEdit = false
}: {
  closeModal: () => void;
  isEdit: boolean;
}) => {
  const [gloablError, setGlobalError] = useState<string>('');
  const category = useSelector((state) => state.category.singleActionCat);

  const { errors, values, touched, handleSubmit, handleChange, handleBlur, isSubmitting } =
    useFormik({
      initialValues: {
        name: isEdit ? category?.name || '' : '',
        description: isEdit ? category?.description || '' : ''
      },
      validationSchema: validationSchema,
      onSubmit: async (values, { setErrors }) => {
        const payload = {
          category_id: category?.category_id,
          name: values.name,
          description: values.description
        };
        if (!isEdit) {
          delete payload.category_id;
        }
        const response = isEdit
          ? await dispatch(updateCategory(payload))
          : await dispatch(AddCategory(payload));
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

  return (
    <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
      <div className="px-2 pr-14 mb-10">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {isEdit ? 'Edit Category' : 'Add Category'}
        </h4>
      </div>
      {gloablError && <Alert message={gloablError} type="error" />}
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="custom-scrollbar h-[250px] overflow-y-auto px-2 pb-3">
          <div className="mt-5">
            <div className="grid gap-y-5 ">
              <div className="col-span-2 lg:col-span-1">
                <Label>Category Name</Label>
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

              <div className="col-span-2 lg:col-span-1">
                <Label>Description</Label>
                <TextArea
                  error={touched.description && errors.description ? true : false}
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="description"
                  hint={errors.description}
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
            {isEdit ? 'Save Changes' : 'Add Category'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CategoryModal;
