export default function DateSeparator({ date }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
      <span
        style={{
          backgroundColor: 'var(--color-surface-container-high)',
          color: 'var(--color-on-surface-variant)',
          padding: '4px 12px',
          borderRadius: '9999px',
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: 600
        }}
      >
        {date}
      </span>
    </div>
  );
}
