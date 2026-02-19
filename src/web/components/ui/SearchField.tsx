import icSearch from '@/assets/imgs/icons/ic_search.png';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
}

export function SearchField({ value, onChange, onSearch, placeholder }: SearchFieldProps) {
  const radiusClass = 'rounded-full';
  return (
    <div className="flex items-center w-full gap-2">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`flex-1 ${radiusClass} border bg-[#F5F5F5] px-4 py-3 text-[#212121] placeholder:text-[#212121]/70 focus:outline-none`}
        style={{ borderColor: '#212121' }}
      />
      <button
        type="button"
        onClick={onSearch}
        className="bg-[#F5F5F5] px-3.5 py-3.5"
        style={{ borderColor: '#212121' }}
        aria-label="Buscar"
      >
        <img src={icSearch} alt="Buscar" className="w-5 h-5" />
      </button>
    </div>
  );
}
