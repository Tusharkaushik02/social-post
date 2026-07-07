import { IoSearchOutline } from 'react-icons/io5';

export default function SearchBar({ value, onChange, placeholder = "Search conversations..." }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        backgroundColor: 'var(--color-surface-container-low)',
        borderRadius: '9999px',
        border: '1px solid transparent',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-primary)';
        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0, 0, 0, 0.1)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'transparent';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <IoSearchOutline size={18} color="var(--color-on-surface-variant)" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          flex: 1,
          backgroundColor: 'transparent',
          border: 'none',
          outline: 'none',
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--color-on-surface)'
        }}
      />
    </div>
  );
}
