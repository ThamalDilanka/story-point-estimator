import React from 'react';

interface SectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ title, subtitle, children, className = '' }: SectionProps) {
  return (
    <section className={`bg-gray-900 rounded-xl border border-gray-800 p-6 ${className}`}>
      {(title || subtitle) && (
        <header className="mb-6">
          {title && <h2 className="text-xl font-semibold text-white mb-1">{title}</h2>}
          {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
        </header>
      )}
      {children}
    </section>
  );
}