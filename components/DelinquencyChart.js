export default function DelinquencyChart({ buckets }) {
  const items = [
    ['Current (0)', buckets.current || 0],
    ['1-29', buckets.bucket_1_29 || 0],
    ['30-59', buckets.bucket_30_59 || 0],
    ['60-89', buckets.bucket_60_89 || 0],
    ['90+', buckets.bucket_90_plus || 0]
  ];
  const max = Math.max(...items.map(([, v]) => Number(v)), 1);

  return (
    <div className="card">
      <h2>Delinquency Distribution (Latest Performance)</h2>
      {items.map(([label, value]) => (
        <div key={label} style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{label}</span><span>{value}</span></div>
          <div style={{ background: '#e2e8f0', height: 10, borderRadius: 6 }}>
            <div style={{ width: `${(Number(value) / max) * 100}%`, background: '#0f766e', height: '100%', borderRadius: 6 }} />
          </div>
        </div>
      ))}
    </div>
  );
}
