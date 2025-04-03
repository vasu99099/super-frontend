import React from 'react';
import DocumentUploadPrimary from './DocumentUploadPrimary';
import DocumentUploadSuccess from './DocumentUploadSuccess';
import DocumentUploadError from './DocumentUploadError';

interface PlaceholderType {
  title: string;
  linkTitle: string;
  variant: 'Primary' | 'Success' | 'Error';
  subTitleText?: string;
  disabled: boolean;
}
const Placeholder = ({ title, linkTitle, variant, subTitleText, disabled }: PlaceholderType) => {
  const getIconByVariant = (variant: string) => {
    switch (variant) {
      case 'Primary':
        return <DocumentUploadPrimary />;
      case 'Success':
        return <DocumentUploadSuccess />;
      case 'Error':
        return <DocumentUploadError />;
      default:
        return <DocumentUploadPrimary />;
    }
  };

  return (
    <div
      className="md:flex text-center md:text-left justify-center align-middle gap-3 text-gray-700 dark:text-gray-400"
      style={{ opacity: disabled ? 0.6 : 1 }}>
      <div className="flex justify-center">{getIconByVariant(variant)}</div>
      <div className="">
        <div className="text-lg">
          {title}
          <span className=" text-decoration-underline ps-1">{linkTitle}</span>
        </div>
        {subTitleText && <div className="text-sm">{subTitleText}</div>}
      </div>
    </div>
  );
};

export default Placeholder;
