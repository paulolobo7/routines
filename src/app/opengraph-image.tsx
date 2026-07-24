import { ImageResponse } from 'next/og'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #f6f8fb 0%, #eef3f8 55%, #e5fbf1 100%)',
          color: '#172033',
          padding: 72,
          fontFamily: 'Inter, Arial, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 18,
              background: '#4f46e5',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 42,
              fontWeight: 800,
              boxShadow: '0 18px 40px rgba(79,70,229,0.28)',
            }}
          >
            R
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 34, fontWeight: 800 }}>Routines</span>
            <span style={{ fontSize: 22, color: '#526071' }}>Central de foco e produtividade</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 52 }}>
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 650 }}>
            <span style={{ fontSize: 72, lineHeight: 0.94, fontWeight: 850 }}>
              Organize tarefas.
            </span>
            <span style={{ fontSize: 72, lineHeight: 0.94, fontWeight: 850 }}>
              Proteja seu foco.
            </span>
            <span style={{ marginTop: 28, fontSize: 26, lineHeight: 1.35, color: '#526071' }}>
              Timer Pomodoro, planejamento diario e estatisticas em uma interface clara.
            </span>
          </div>

          <div
            style={{
              width: 285,
              height: 285,
              borderRadius: 999,
              border: '18px solid #4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#ffffff',
              boxShadow: '0 28px 70px rgba(23,32,51,0.18)',
            }}
          >
            <span style={{ fontSize: 64, fontWeight: 850, letterSpacing: 0 }}>25:00</span>
          </div>
        </div>
      </div>
    ),
    size
  )
}
