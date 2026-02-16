import icSearch from '@/assets/imgs/icons/ic_search.png';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
}

export function SearchField({ value, onChange, onSearch, placeholder }: SearchFieldProps) {
  const radiusClass = 'rounded-md';
  return (
    <div className="flex items-center w-full gap-2">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`flex-1 ${radiusClass} border bg-[#F5F5F5] px-4 py-3 text-[#48464C] placeholder:text-[#48464C]/70 focus:outline-none`}
        style={{ borderColor: '#48464C' }}
      />
      <button
        type="button"
        onClick={onSearch}
        className={`${radiusClass} border bg-[#F5F5F5] px-3 py-2`}
        style={{ borderColor: '#48464C' }}
        aria-label="Buscar"
      >
        <img src={icSearch} alt="Buscar" className="w-5 h-5" />
      </button>
    </div>
  );
}
