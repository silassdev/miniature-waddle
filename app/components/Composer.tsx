'use client'
import { useState } from 'react'

export default function Composer({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState('')

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (text.trim()) { onSend(text.trim()); setText('') }}}>
      <div style={{display:'flex',gap:8}}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share what's on your heart..."
          style={{flex:1,padding:10,borderRadius:8,border:'1px solid #e6eef9'}}
        />
        <button type="submit" className="cta">Send</button>
      </div>
    </form>
  )
}
