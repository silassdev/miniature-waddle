'use client'
import React from 'react'

export default function MessageList({ messages }: { messages: { id: string; role: 'user' | 'assistant'; text: string }[] }) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      {messages.map(m => (
        <div key={m.id} style={{
          alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
          background: m.role === 'user' ? '#e6f0ff' : 'transparent',
          padding:12,
          borderRadius:10,
          maxWidth: '80%'
        }}>
          <div style={{fontSize:13, marginBottom:6, color: 'var(--muted)'}}>{m.role}</div>
          <div>{m.text}</div>
        </div>
      ))}
    </div>
  )
}
