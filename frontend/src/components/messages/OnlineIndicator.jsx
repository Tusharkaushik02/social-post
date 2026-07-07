export default function OnlineIndicator({ size = 12, borderColor = 'var(--color-surface)' }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: '#22c55e', // green-500
        border: `2px solid ${borderColor}`,
        borderRadius: '9999px',
        zIndex: 1
      }}
    />
  );
}
