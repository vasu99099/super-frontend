'use client';
import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import { useModal } from '@/hooks/useModal';
import { dispatch, useSelector } from '@/store';
import { S3_BASE_URL } from '@/constant/Constants';
import { Modal } from '@/components/ui/modal';
import FileUploader from '@/components/form/uploadfile/FileUploader';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '@/components/ui/button/Button';
import { updateUserProfileImage } from '@/store/slices/authSlice';

const FILE_ALLOW = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png']
};
const MAX_FILE_SIZE = 2 * 1024 * 1024;

const profileImageSchema = Yup.object({
  profile_image: Yup.mixed<File>()
    .required('Image is required')
    .test('fileSize', 'File must be less than 2MB', (file) => {
      return file && file.size <= MAX_FILE_SIZE;
    })
    .test('fileType', 'Only JPG, PNG allowed', (file) => {
      return file && ['image/jpeg', 'image/png'].includes(file.type);
    })
});

export default function UserMetaCard() {
  const { user } = useSelector((state) => state.auth);
  const [preview, setPreview] = useState<string | null>(null);

  const { isOpen, openModal, closeModal } = useModal();

  const formik = useFormik({
    initialValues: {
      profile_image: null
    },
    validationSchema: profileImageSchema,
    onSubmit: async (values, { setErrors }) => {
      if (values.profile_image) {
        const formData = new FormData();
        formData.append('profilePic', values.profile_image);
        const response = await dispatch(updateUserProfileImage(formData));
        if (response?.success) {
          closeModal();
        } else {
          if (typeof response.message === 'object') setErrors(response?.message);
          else {
            setErrors({ profile_image: response.message });
          }
        }
      }
    }
  });
  const profileImage = user?.profile_image
    ? S3_BASE_URL + user?.profile_image
    : '/images/user/owner.jpg';

  const handleFileChange = (file: File[] | null) => {
    console.log('first', file);
    if (file && file.length > 0) {
      formik.setFieldValue('profile_image', file[0]);
      setPreview(URL.createObjectURL(file[0]));
    }
  };

  const handleOpenModal = () => {
    setPreview(null);
    formik.resetForm();
    openModal();
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-30 h-30 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <Image width={120} height={120} src={profileImage} alt="user" />
            </div>
          </div>
          <button
            onClick={handleOpenModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto">
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
            Edit
          </button>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Upload Profile Picture
            </h4>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="mt-14">
              <FileUploader
                onDropAccepted={handleFileChange}
                accept={FILE_ALLOW}
                maxSize={MAX_FILE_SIZE}
                multiple={false}
                title={'Drag & drops file or'}
                linkTitle={'Browse'}
                subTitleText={'Supported file types: JPG, JPEG, PNG (Max size 2MB)'}
                error={formik.errors.profile_image}
                helperText={
                  formik.errors.profile_image ||
                  'Please select a image in JPG, JPEG, PNG (Max size 2MB)'
                }
              />
            </div>
            {preview && (
              <div className="mt-10">
                <div className="my-5">Preview :</div>
                <div className="w-30 h-30 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                  <Image width={120} height={120} src={preview} alt="user" />
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button
                size="sm"
                type="submit"
                isLoading={formik.isSubmitting}
                disabled={formik.isSubmitting}>
                Upload
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
