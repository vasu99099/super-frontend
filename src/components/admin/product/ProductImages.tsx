import { DeleteIcon } from '@/icons/components/DeleteIcon';
import StartIcon from '@/icons/components/StartIcon';
import Image from 'next/image';
import React from 'react';
import { ProductImageStringType, ProductImageType } from './ADDEditProductDetails';

interface ProductImagesProps {
  previewImages: ProductImageStringType[];
  onMarkPrimary: (index: number) => void;
  onDelete: (index: number) => void;
}

const ProductImages: React.FC<ProductImagesProps> = ({
  previewImages,
  onMarkPrimary,
  onDelete
}) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Image Preview</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-4">
        {previewImages.map((img, index) => (
          <div
            key={index}
            className={`relative border rounded-xl overflow-hidden shadow transition-shadow duration-300 ${
              img.isPrimary ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'
            }`}>
            <Image
              src={img.file}
              alt={`Product image ${index + 1}`}
              width={300}
              height={300}
              className="object-cover w-full h-48"
            />

            {/* Actions */}
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => onMarkPrimary(index)}
                className={`p-1 rounded-full ${
                  img.isPrimary ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                } shadow hover:scale-110 transition-transform`}
                title="Mark as Primary">
                <StartIcon isFilled={img.isPrimary} />
              </button>
              <button
                onClick={() => onDelete(index)}
                className="p-1 bg-white text-red-600 rounded-full shadow hover:scale-110 transition-transform"
                title="Delete Image">
                <DeleteIcon />
              </button>
            </div>

            {/* Primary label */}
            {img.isPrimary && (
              <span className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                Primary
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
