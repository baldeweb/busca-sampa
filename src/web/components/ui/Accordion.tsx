import React, { useState } from 'react';
import { AppText } from './AppText';

interface AccordionItemProps {
  label: React.ReactNode;
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
        <div className="flex-1">
          {typeof label === 'string' ? (
            <AppText as="span" variant="title-dark">
              {label}
            </AppText>
          ) : (
            label
          )}
        </div>
        <span className={`ml-2 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}>▶</span>
      </div>
      {open && (
        <div className="pb-4 px-4 animate-fade-in">
          <AppText variant="body-dark">{children}</AppText>
        </div>
      )}
    </div>
  );
}

export function Accordion({ children }: { children: React.ReactNode }) {
  return <div className="rounded-[8px] border border-[#8492A6] bg-[#F5F5F5] divide-y divide-[#8492A6] shadow-sm">{children}</div>;
}
