import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', ...props }) => {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variant === 'default' ? "border-transparent bg-primary text-primary-foreground hover:bg-primary/80" : "border-input bg-background hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    />
  );
};
