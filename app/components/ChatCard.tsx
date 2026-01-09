import Link from 'next/link'

export default function ChatCard() {
  return (
    <div>
      <p className="meta">Tap to begin a supportive, scripture-centered conversation.</p>
      <div style={{marginTop:12}}>
        <Link href="/chat" className="cta">Start Chat</Link>
      </div>

      <div style={{marginTop:12}}>
        <small style={{color:'var(--muted)'}}>Signed out — chats stored locally. Sign in to save history.</small>
      </div>
    </div>
  )
}
