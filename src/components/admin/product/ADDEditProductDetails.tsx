'use client';
import ComponentCard from '@/components/common/ComponentCard';
import SelectComponent from '@/components/form/FormSelect';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import FileUploader from '@/components/form/uploadfile/FileUploader';
import Button from '@/components/ui/button/Button';
import {
  IMAGE_FILE_ALLOW,
  MAX_FILE_SIZE_2_MB,
  PACKING_SIZE,
  S3_BASE_URL
} from '@/constant/Constants';
import { FieldArray, Formik, FormikProps, useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import ProductImages from './ProductImages';
import { dispatch, useSelector } from '@/store';
import {
  AddProduct,
  UpdateProduct,
  getPresignProductUrl,
  productImagePresignType,
  uploadImageToS3
} from '@/store/slices/productSlice';
import { Modal } from '@/components/ui/modal';
import { useModal } from '@/hooks/useModal';
import SectionLoader from '@/components/common/SectionLoader';
import Loader from '@/icons/components/Loader';
import Alert from '@/components/common/Alert';
import ErrorIcon from '@/icons/components/ErrorIcon';
import { useRouter } from 'next/navigation';
import { ROUTE_PATH } from '@/constant/Routes';

type ProductPackagingItem = {
  packSize: number | string;
  packagingType: string;
};
export type ProductImageType = {
  file: File | string;
  isPrimary: boolean;
};

type FileOnlyProductImage = Omit<ProductImageType, 'file'> & {
  file: File;
};
export type ProductImageStringType = Omit<ProductImageType, 'file'> & {
  file: string;
};
type ProductFormValues = {
  name: string;
  hsc_code: string;
  content_technical: string;
  categoryId: string | number;
  ProductPackaging: ProductPackagingItem[];
  ProductImage: ProductImageType[];
};

type UploadStatus = 'RESET' | 'IMAGE' | 'PRODUCT_UPDATE' | 'PRODUCT_ADD' | 'ERROR';
const productSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(2, 'Product name must be at least 2 characters')
    .max(255, 'Product name must not exceed 255 characters')
    .required('Product name is required'),

  hsc_code: Yup.string().trim().required('HSC Code is required'),

  content_technical: Yup.string().trim().nullable().optional(),

  categoryId: Yup.number().integer('Invalid Category').required('Category is required'),

  ProductPackaging: Yup.array().of(
    Yup.object().shape({
      packSize: Yup.number()
        .typeError('Packing must be a number')
        .positive('Packing must be positive')
        .required('Packing is required'),
      packagingType: Yup.string().trim().required('Packing unit is required')
    })
  ),
  ProductImage: Yup.array().of(
    Yup.object().shape({
      file: Yup.mixed<File>()
        .required('Image is required')
        .test('fileSize', 'File must be less than 2MB', (value) =>
          value instanceof File ? value.size <= MAX_FILE_SIZE_2_MB : true
        )
        .test('fileType', 'Only JPG, PNG allowed', (value) =>
          value instanceof File ? ['image/jpeg', 'image/png'].includes(value.type) : true
        ),
      isPrimary: Yup.boolean().required()
    })
  )
});

const getLoaderMSG = (Status: UploadStatus) => {
  switch (Status) {
    case 'IMAGE':
      return 'Uploading images...';
    case 'PRODUCT_ADD':
      return 'Adding Product...';
    case 'PRODUCT_UPDATE':
      return 'Adding Product...';
    default:
      return 'Fill Product details';
  }
};
const isFileImage = (p: ProductImageType): p is FileOnlyProductImage => p.file instanceof File;

const isStringImage = (p: ProductImageType): p is ProductImageStringType =>
  typeof p.file === 'string';

const ADDEditProductDetails = ({ isEdit = false }: { isEdit: boolean }) => {
  const formikRef = useRef<FormikProps<ProductFormValues>>(null);
  const categories = useSelector((state) => state.category.categories);
  const editProduct = useSelector((state) => state.product.singleActionProduct);
  const [previewImages, setPreviewImages] = useState<ProductImageStringType[]>([]);
  const [productPostingStatus, setProductPostingStatus] = useState<UploadStatus>('RESET');
  const [gloablError, setGlobalError] = useState<string>('');
  const router = useRouter();
  console.log('previewImages', previewImages);
  useEffect(() => {
    if (isEdit && editProduct?.ProductImage) {
      const updatedPreview = editProduct?.ProductImage?.map((img) => {
        return {
          file: S3_BASE_URL + img.url,
          isPrimary: img.isPrimary
        };
      });
      console.log('updatedPreview', updatedPreview);
      setPreviewImages(updatedPreview);
    }
  }, [isEdit, editProduct]);

  const handleChangeFiles = (images: File[]) => {
    const imgfiles = images.map((i) => ({
      file: i,
      isPrimary: false
    }));

    // Flatten array to prevent nested structure
    const existingImages = formikRef.current?.values.ProductImage ?? [];
    const allImages = [...existingImages, ...imgfiles];

    formikRef.current?.setFieldValue('ProductImage', allImages);

    const tmpImages = allImages.map((i: ProductImageType) => {
      const fileUrl =
        i.file instanceof File
          ? URL.createObjectURL(i.file)
          : isEdit
          ? S3_BASE_URL + i.file
          : i.file;
      return {
        file: fileUrl,
        isPrimary: i.isPrimary ?? false
      };
    });

    setPreviewImages(tmpImages);
  };

  // images
  const markAsPrimary = (index: number) => {
    console.log('index', index);
    const updatedPreview = previewImages.map((img, i) => {
      console.log('i,index', i, index);
      return {
        ...img,
        isPrimary: img.isPrimary && i === index ? false : i === index
      };
    });
    console.log('previewImages v', updatedPreview);
    setPreviewImages(updatedPreview);

    const updatedFormikImages = (formikRef.current?.values.ProductImage ?? []).map((img, i) => ({
      ...img,
      isPrimary: i === index
    }));
    formikRef.current?.setFieldValue('ProductImage', updatedFormikImages);
  };

  const deleteImage = (index: number) => {
    const updatedPreview = [...previewImages];
    updatedPreview.splice(index, 1);
    setPreviewImages(updatedPreview);

    const updatedFormik = [...(formikRef.current?.values.ProductImage || [])];
    updatedFormik.splice(index, 1);
    formikRef.current?.setFieldValue('ProductImage', updatedFormik);
  };

  const closeModal = () => {
    setProductPostingStatus('RESET');
    setGlobalError('');
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-300 mt-5">
      <Formik<ProductFormValues>
        innerRef={formikRef}
        enableReinitialize
        initialValues={{
          name: isEdit ? editProduct?.name ?? '' : '',
          hsc_code: isEdit ? editProduct?.hsc_code ?? '' : '',
          content_technical: isEdit ? editProduct?.content_technical ?? '' : '',
          categoryId: isEdit ? editProduct?.categoryId ?? '' : '',
          ProductPackaging: isEdit ? editProduct?.ProductPackaging ?? [] : [],
          ProductImage: isEdit
            ? editProduct?.ProductImage.map((p: { url: string; isPrimary: boolean }) => {
                return { file: p.url, isPrimary: p.isPrimary };
              }) ?? []
            : []
        }}
        validationSchema={productSchema}
        onSubmit={async (values, { setFieldValue, resetForm, setErrors }) => {
          if (values.ProductImage.length > 0) {
            const existingImages: ProductImageStringType[] =
              values.ProductImage.filter(isStringImage);

            const newImages = values.ProductImage.filter(isFileImage);
            try {
              let uploadedImages: ProductImageStringType[] = [];
              if (newImages.length > 0) {
                setProductPostingStatus('IMAGE');

                // Step 1: Get presigned URLs
                const imagesList = newImages.map((img) => ({
                  fileType: img.file.type,
                  size: img.file.size,
                  fileName: img.file.name
                }));
                const { data: presignedData } = await dispatch(getPresignProductUrl(imagesList));

                // Step 2: Upload new images to S3
                const uploaded = await Promise.all(
                  presignedData.map(
                    async ({
                      fileKey,
                      uploadUrl,
                      fileName
                    }: {
                      fileKey: string;
                      uploadUrl: string;
                      fileName: string;
                    }) => {
                      const matched = newImages.find((img) => img.file.name === fileName);
                      if (!matched) return null;

                      const isUploaded = await uploadImageToS3(uploadUrl, matched.file);
                      return isUploaded
                        ? { file: fileKey, isPrimary: matched.isPrimary ?? false }
                        : null;
                    }
                  )
                );

                uploadedImages = uploaded.filter(
                  (img): img is ProductImageStringType => img !== null
                );
              }
              const allImages: ProductImageStringType[] = [...existingImages, ...uploadedImages];
              setFieldValue('ProductImage', allImages);

              const payload = {
                ...values,
                product_id: isEdit ? editProduct?.product_id : '',
                ProductImage: allImages.map((img) => ({
                  url: img.file,
                  isPrimary: img.isPrimary ?? false
                }))
              };
              if (!isEdit) {
                delete payload.product_id;
              }
              setProductPostingStatus(isEdit ? 'PRODUCT_UPDATE' : 'PRODUCT_ADD');
              const response = isEdit
                ? await dispatch(UpdateProduct(payload))
                : await dispatch(AddProduct(payload));
              if (response.success) {
                if (isEdit) {
                  router.push(ROUTE_PATH.ADMIN.product.INDEX);
                }
                setGlobalError('');
                resetForm();
                setPreviewImages([]);
                setProductPostingStatus('RESET');
              } else {
                if (typeof response.message === 'object') {
                  setGlobalError('');
                  setErrors(response?.message);
                } else {
                  setGlobalError(response.message);
                }
                setProductPostingStatus('ERROR');
              }
            } catch (e) {
              setProductPostingStatus('ERROR');
            }
          }
          console.log(values);
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
          console.log('values', values);
          return (
            <>
              <div className="sm:col-span-2 pr-4">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 pe-5">
                    <div className="col-span-1">
                      <Label>Category</Label>
                      <SelectComponent
                        options={categories}
                        defaultValue={isEdit ? values.categoryId ?? undefined : undefined}
                        labelKey="name"
                        ValueKey="category_id"
                        name="categoryId"
                        isSearchable
                        error={!!errors.categoryId && touched.categoryId}
                        onChange={(e) => {
                          setFieldValue('categoryId', e.category_id);
                        }}
                      />
                    </div>

                    <div className="col-span-1">
                      <Label>Product Name</Label>
                      <Input
                        type="text"
                        error={touched.name && !!errors.name}
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="name"
                        hint={touched.name ? errors.name : ''}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>HSC Code</Label>
                      <Input
                        type="text"
                        error={touched.hsc_code && !!errors.hsc_code}
                        value={values.hsc_code}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="hsc_code"
                        hint={touched.hsc_code ? errors.hsc_code : ''}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Technical Content</Label>
                      <TextArea
                        error={touched.content_technical && !!errors.content_technical}
                        value={values.content_technical}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="content_technical"
                        hint={errors.content_technical}
                      />
                    </div>
                    <div className="col-span-2">
                      <FileUploader
                        onDropAccepted={handleChangeFiles}
                        accept={IMAGE_FILE_ALLOW}
                        maxSize={MAX_FILE_SIZE_2_MB}
                        multiple={true}
                        title={'Drag & drops file or'}
                        linkTitle={'Browse'}
                        subTitleText={'Supported file types: JPG, JPEG, PNG (Max size 2MB)'}
                        error={
                          touched.ProductImage &&
                          errors.ProductImage &&
                          (errors.ProductImage[0] as string)
                        }
                        helperText={
                          touched.ProductImage && errors.ProductImage
                            ? Array.isArray(errors.ProductImage)
                              ? (errors.ProductImage[0] as any)?.file ||
                                (errors.ProductImage[0] as string)
                              : (errors.ProductImage as string)
                            : 'Please select images in JPG, JPEG, PNG (Max size 2MB)'
                        }
                      />
                    </div>

                    <FieldArray name="ProductPackaging">
                      {({ push, remove }) => (
                        <div className="space-y-4">
                          {values.ProductPackaging.map((item, index) => (
                            <div key={index} className="flex gap-x-4 items-end">
                              <div className="flex-1">
                                <Label>Packing</Label>
                                <Input
                                  type="number"
                                  name={`ProductPackaging[${index}].packSize`}
                                  className="!py-0"
                                  value={item.packSize.toString()}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={
                                    touched.ProductPackaging?.[index]?.packSize &&
                                    !!(errors.ProductPackaging?.[index] as any)?.packSize
                                  }
                                />
                              </div>
                              <div className="flex-1">
                                <Label>Unit</Label>
                                <SelectComponent
                                  defaultValue={item.packagingType}
                                  options={PACKING_SIZE}
                                  name={`ProductPackaging[${index}].packagingType`}
                                  onChange={(e) =>
                                    setFieldValue(
                                      `ProductPackaging[${index}].packagingType`,
                                      e.value
                                    )
                                  }
                                />
                              </div>
                              <Button
                                type="button"
                                className="!rounded-none"
                                size="sm"
                                onClick={() => remove(index)}
                                variant="danger">
                                -
                              </Button>
                            </div>
                          ))}
                          <div>
                            <Button
                              type="button"
                              className="!rounded-none border border-black"
                              variant="light"
                              onClick={() => push({ packSize: '', packagingType: '' })}
                              size="sm">
                              + Add Packing
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
                        {isEdit ? 'Save Changes' : 'Add Product'}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </>
          );
        }}
      </Formik>
      {previewImages.length > 0 && (
        <div>
          <ProductImages
            previewImages={previewImages}
            onDelete={deleteImage}
            onMarkPrimary={markAsPrimary}
          />
        </div>
      )}
      <Modal
        isOpen={productPostingStatus != 'RESET'}
        showCloseButton={productPostingStatus === 'ERROR'}
        onClose={closeModal}
        className="max-w-[500px] !rounded-none m-4">
        <div className="m-4 text-center">
          <h3 className="text-2xl font-semibold">Product Submitting!</h3>
          {productPostingStatus != 'ERROR' ? (
            <>
              <div className="flex justify-center my-12">
                <Loader />
              </div>
              <p className="text-gray-600">{getLoaderMSG(productPostingStatus)}</p>
            </>
          ) : (
            <>
              <div className="flex justify-center my-5">
                <ErrorIcon width={70} />
              </div>
              {gloablError}
            </>
          )}
        </div>
      </Modal>

      {/* Right Section */}
    </div>
  );
};

export default ADDEditProductDetails;
