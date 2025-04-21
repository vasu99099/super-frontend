'use client';
import { useDropzone } from 'react-dropzone';
import Placeholder from './Placeholder';
import ErrorIcon from '@/icons/components/ErrorIcon';

type FileUploaderType = {
  error?: string;
  uploadProgress?: number;
  title: string;
  linkTitle: string;
  subTitleText?: string;
  disabled?: boolean;
  helperText?: string;
  [key: string]: any;
};

const FileUploader = ({
  error,
  uploadProgress,
  title,
  linkTitle,
  subTitleText,
  disabled,
  helperText,
  ...other
}: FileUploaderType) => {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    disabled,
    ...other,
    noClick: Boolean(uploadProgress)
  });

  const isError = isDragReject || !!error;

  return (
    <div>
      <div
        style={{
          outline: 'none',
          width: '100%',
          padding: '49px 0px',
          borderRadius: '5px',
          backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%232457A8' stroke-width='3' stroke-dasharray='16' stroke-dashoffset='8' stroke-linecap='square'/%3e%3c/svg%3e")`,
          overflow: 'hidden',
          ...((isDragActive || uploadProgress) && {
            backgroundColor: '#31aa7f0f',
            backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%2331AA7FFF' stroke-width='3' stroke-dasharray='16' stroke-dashoffset='8' stroke-linecap='square'/%3e%3c/svg%3e")`
          }),
          ...(isError && {
            backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23AF3D4DFF' stroke-width='3' stroke-dasharray='16' stroke-dashoffset='8' stroke-linecap='square'/%3e%3c/svg%3e")`,
            backgroundColor: '#AF3D4D0f'
          }),
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
        {...getRootProps()}>
        <input {...getInputProps()} />
        {uploadProgress ? (
          <div>upladiing ...</div>
        ) : (
          <Placeholder
            variant={isError ? 'Error' : isDragActive ? 'Success' : 'Primary'}
            subTitleText={subTitleText}
            disabled={disabled ?? false}
            title={title}
            linkTitle={linkTitle}
          />
        )}
      </div>
      {!!isError && helperText && (
        <div
          style={{
            color: '#AF3D4D',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
          <ErrorIcon width={20} /> {helperText}
        </div>
      )}
    </div>
  );
};
export default FileUploader;
