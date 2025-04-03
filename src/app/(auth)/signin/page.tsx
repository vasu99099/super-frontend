'use client';
import Checkbox from '@/components/form/input/Checkbox';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { ROUTE_PATH } from '@/constant/Routes';
import { EyeCloseIcon, EyeIcon } from '@/icons';
import { useDispatch } from '@/store';
import { login } from '@/store/slices/authSlice';
import { useFormik } from 'formik';
import Link from 'next/link';
import React, { useState } from 'react';
import Cookies from 'js-cookie';

import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import Alert from '@/components/common/Alert';

export default function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setGlobalError] = useState<string>('');
  const dispatch = useDispatch();

  const { errors, values, touched, handleSubmit, handleChange, handleBlur, isSubmitting } =
    useFormik({
      initialValues: {
        email: '',
        password: ''
      },
      validationSchema: Yup.object({
        email: Yup.string().email('Invalid email address').required('email is required'),
        password: Yup.string()
          .min(8, 'Must be 8 characters or less')
          .required('password is required')
      }),
      onSubmit: async (values, { setErrors }) => {
        setGlobalError('');
        const response = await dispatch(login(values));
        console.log('response', response);
        if (response.success) {
          const token = response?.data?.token;
          if (token) {
            Cookies.set('authToken', token, { expires: 7, sameSite: 'Strict', secure: false });
            router.push(ROUTE_PATH.ADMIN.DASHBOARD);
          }
        } else {
          if (typeof response.message === 'object') setErrors(response?.message);
          else {
            setGlobalError(response.message);
          }
        }
      }
    });
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            {error && <Alert message={error} type="error" />}
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{' '}
                  </Label>
                  <Input
                    placeholder="info@gmail.com"
                    type="email"
                    error={touched.email && errors.email ? true : false}
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="email"
                    hint={errors.email}
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{' '}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      error={touched.password && errors.password ? true : false}
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="password"
                      hint={errors.password}
                      placeholder="Enter your password"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute z-30 -translate-y-1/2 cursor-pointer right-4 ${
                        errors.password ? 'top-1/3' : 'top-1/2'
                      }`}>
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    href={ROUTE_PATH.AUTH.FORGOT_PASS}
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400">
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button
                    className="w-full"
                    size="sm"
                    type="submit"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}>
                    Sign in
                  </Button>
                </div>
              </div>
            </form>
            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {''}
                <Link
                  href={ROUTE_PATH.AUTH.REGISTER}
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
