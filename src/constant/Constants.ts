const S3_HOST = process.env.NEXT_PUBLIC_S3_HOSTNAME;
export const S3_BASE_URL = S3_HOST ? `https://${S3_HOST}/` : '';

export const PACKING_SIZE = [
  { label: 'mg', value: 'mg' },
  { label: 'g', value: 'g' },
  { label: 'kg', value: 'kg' },
  { label: 'ml', value: 'ml' },
  { label: 'l', value: 'l' }
];

export const IMAGE_FILE_ALLOW = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png']
};
export const MAX_FILE_SIZE_2_MB = 2 * 1024 * 1024;
