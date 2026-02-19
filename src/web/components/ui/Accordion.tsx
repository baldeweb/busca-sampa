
import React, { useState } from 'react';
import { SectionHeading } from './SectionHeading';

interface AccordionItemProps {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ label, children, defaultOpen = false }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className="border-b last:rounded-b-[8px] first:rounded-t-[8px] border-[#8492A6] bg-[#F5F5F5]"
      style={{ color: '#212121' }}
    >
      <div
        className="w-full flex justify-between items-center py-2 px-4 cursor-pointer select-none"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        tabIndex={0}
        role="button"
        style={{ outline: 'none' }}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setOpen(v => !v); }}
      >
        <SectionHeading
          title={label}
          underline={false}
          sizeClass="text-base sm:text-lg"
          className="flex-1 !mb-0 !mt-0"
        />
        <span className={`ml-2 transition-transform duration-200 text-lg ${open ? 'rotate-90' : ''}`}>▶</span>
      </div>
      {open && (
        <div className="pb-4 px-4 text-base animate-fade-in" style={{ color: '#212121' }}>
          {children}
        </div>
      )}
    </div>
  );
}

export function Accordion({ children }: { children: React.ReactNode }) {
  return <div className="rounded-[8px] border border-[#8492A6] bg-[#F5F5F5] divide-y divide-[#8492A6] shadow-sm">{children}</div>;
}
