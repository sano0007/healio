import * as React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    src?: string;
    alt?: string;
    fallback?: string;
  }
>(({ className, src, alt, fallback, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white bg-brand-lightest',
      className,
    )}
    {...props}
  >
    {src ? (
      <Image
        src={src}
        alt={alt || ''}
        width={40}
        height={40}
        className="aspect-square h-full w-full object-cover"
      />
    ) : (
      <div className="flex h-full w-full items-center justify-center rounded-full bg-brand-light text-brand-dark font-bold text-sm">
        {fallback}
      </div>
    )}
  </div>
));
Avatar.displayName = 'Avatar';

export { Avatar };
