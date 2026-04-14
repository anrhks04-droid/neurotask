import React from 'react';

export default function App() {
  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#fcfcfc',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#111827' }}>NeuroPad</h1>
      <p style={{ color: '#9ca3af' }}>Debug Mode: Hello World</p>
      <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #e5e7eb', borderRadius: '20px', backgroundColor: 'white' }}>
        서버가 정상적으로 작동 중입니다! ✅
      </div>
    </div>
  );
}
