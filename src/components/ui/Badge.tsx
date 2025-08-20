import React from 'react';

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'secondary', size = 'md', children, className = '' }: BadgeProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full';
  
  const variantClasses = {
    primary: 'bg-red-600 text-white',
    secondary: 'bg-gray-800 text-gray-300 border border-gray-700',
    success: 'bg-green-900 text-green-100',
    warning: 'bg-yellow-900 text-yellow-100',
    danger: 'bg-red-900 text-red-100',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return <span className={classes}>{children}</span>;
}