
export default function PrayerSuggestionCard() {
  const sample = {
    title: 'A short prayer for peace',
    body: 'Heavenly Father, grant me your peace in this anxious moment. Help me trust your promises and rest in your love. Amen.',
    verse: 'Philippians 4:6-7'
  }

  return (
    <div className="prayer-preview">
      <strong>{sample.title}</strong>
      <p>{sample.body}</p>
      <small style={{color:'var(--muted)'}}>Suggested verse: {sample.verse}</small>
    </div>
  )
}
