import React from 'react';

type ConvertSectionProps = {
  section_title: string;
  children: React.ReactNode;
};

export const ConvertSection: React.FC<ConvertSectionProps> = ({
  section_title,
  children,
}) => {
  return (
    <section className="flex flex-col gap-3 bg-white">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">
          {section_title}
        </h3>
      </div>
      {children}
    </section>
  );
};