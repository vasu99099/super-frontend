'use client';
import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
import * as Yup from 'yup';

import Checkbox from '@/components/form/input/Checkbox';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import Alert from '@/components/common/Alert';

import { ROUTE_PATH } from '@/constant/Routes';
import { EyeCloseIcon, EyeIcon } from '@/icons';
import { useDispatch } from '@/store';
import { login } from '@/store/slices/authSlice';

export default function SignInForm() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setGlobalError] = useState<string>('');

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const { errors, values, touched, handleSubmit, handleChange, handleBlur, isSubmitting } =
    useFormik({
      initialValues: {
        email: '',
        password: ''
      },
      validationSchema: Yup.object({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string()
          .min(8, 'Must be at least 8 characters')
          .required('Password is required')
      }),
      onSubmit: async (values, { setErrors }) => {
        setGlobalError('');
        const response = await dispatch(login(values));
        if (response.success) {
          const token = response?.data?.token;
          if (token) {
            Cookies.set('authToken', token, { expires: 7, sameSite: 'Strict', secure: false });
            router.push(ROUTE_PATH.ADMIN.DASHBOARD);
          }
        } else {
          if (typeof response.message === 'object') {
            setErrors(response.message);
          } else {
            setGlobalError(response.message || 'Login failed');
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
                  <Label required>Email</Label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="info@gmail.com"
                    value={values.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.email && errors.email)}
                    hint={touched.email && errors.email ? errors.email : undefined}
                  />
                </div>
                <div>
                  <Label required>Password</Label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(touched.password && errors.password)}
                      hint={touched.password && errors.password ? errors.password : undefined}
                    />
                    <span
                      onClick={togglePasswordVisibility}
                      className={`absolute z-30 -translate-y-1/2 cursor-pointer right-4 ${
                        touched.password && errors.password ? 'top-1/3' : 'top-1/2'
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
                  {/* <Link
                    href={ROUTE_PATH.AUTH.FORGOT_PASS}
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400">
                    Forgot password?
                  </Link> */}
                </div>
                <div>
                  <Button
                    type="submit"
                    size="sm"
                    className="w-full"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}>
                    Sign in
                  </Button>
                </div>
              </div>
            </form>
            {/* <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {''}
                <Link
                  href={ROUTE_PATH.AUTH.REGISTER}
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
                  Sign Up
                </Link>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
