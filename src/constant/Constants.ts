const S3_HOST = process.env.NEXT_PUBLIC_S3_HOSTNAME;
export const S3_BASE_URL = S3_HOST ? `https://${S3_HOST}/` : '';
