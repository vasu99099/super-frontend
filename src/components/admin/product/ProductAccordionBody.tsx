import Badge from '@/components/ui/badge/Badge';
import { S3_BASE_URL } from '@/constant/Constants';
import StartIcon from '@/icons/components/StartIcon';
import { ProductType } from '@/store/slices/productSlice';
import Image from 'next/image';
import React from 'react';

const ProductAccordionBody = ({ col }: { col?: ProductType }) => {
  if (!col?.ProductImage?.length) {
    return <div className="m-4 text-gray-500 text-sm">No product images available.</div>;
  }
  return (
    <div className="m-4 ">
      {col.ProductImage.length && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-3">
          {col.ProductImage.map((img, index) => (
            <div
              key={index}
              className={`p-2 relative rounded-2xl overflow-hidden bg-gray-100 ${
                img.isPrimary ? 'ring-2 ring-blue-500' : ''
              }`}>
              {/* Centered image container */}
              <div className="flex items-center justify-center w-full h-48 ">
                <Image
                  src={`${S3_BASE_URL}${img.url}`}
                  alt={`Product image ${index + 1}`}
                  width={300}
                  height={300}
                  className="object-contain max-h-full max-w-full"
                />
              </div>

              {/* Primary Badge */}
              {img.isPrimary && (
                <div className="absolute top-2 right-2">
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Primary</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2">
        <div>
          <p className="text-gray-500 font-medium text-start text-theme-sm dark:text-gray-400">
            Technical Content:
          </p>
          <p className="text-gray-500 text-start text-theme-sm dark:text-gray-400">
            {col.content_technical}
          </p>
        </div>
        <div className="">
          <p className="text-gray-500 font-medium text-start text-theme-sm dark:text-gray-400">
            Packing:
          </p>
          <div className="flex gap-2">
            {col.ProductPackaging.map((p, index) => (
              <Badge variant="solid" color="light" size="sm" key={index}>
                {p.packSize + p.packagingType}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductAccordionBody;
