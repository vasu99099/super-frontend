import Image from 'next/image';

interface AvatarProps {
  src?: string; // Profile picture URL (optional)
  alt?: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt = 'Profile Picture', size = 50 }) => {
  return (
    <Image
      src={src || '/images/user/default.jpg'}
      alt={alt}
      width={size}
      height={size}
      className="rounded-full object-cover"
      priority
    />
  );
};

export default Avatar;
