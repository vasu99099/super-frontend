'use client';
import { AppDispatch } from '@/store';
import { login } from '@/store/slices/authSlice';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const page = () => {
  const dispatch = useDispatch<AppDispatch>();
  return <div>dashboard</div>;
};

export default page;
