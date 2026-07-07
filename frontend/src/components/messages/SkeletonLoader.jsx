export default function SkeletonLoader({ variant = 'conversations', count = 5 }) {
  const items = Array.from({ length: count });

  if (variant === 'messages') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px' }}>
        {items.map((_, i) => (
          <div 
            key={i} 
            style={{ 
              display: 'flex', 
              justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end',
              marginBottom: '8px'
            }}
          >
            <div 
              className="dm-skeleton" 
              style={{ 
                height: '40px', 
                width: `${40 + (i % 3) * 15}%`,
                borderRadius: '16px',
                borderBottomLeftRadius: i % 2 === 0 ? 0 : '16px',
                borderBottomRightRadius: i % 2 !== 0 ? 0 : '16px',
              }} 
            />
          </div>
        ))}
      </div>
    );
  }

  // conversations variant
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {items.map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px', alignItems: 'center' }}>
          <div className="dm-skeleton-circle" style={{ width: '48px', height: '48px', flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="dm-skeleton" style={{ height: '16px', width: '120px' }} />
            <div className="dm-skeleton" style={{ height: '14px', width: '180px' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
