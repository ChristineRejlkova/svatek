import { useEffect } from 'react'

export default function Toast({ message, type = 'hint', onClose }) {
  useEffect(() => {
    if (!message) return
    const id = setTimeout(onClose, 3200)
    return () => clearTimeout(id)
  }, [message, onClose])

  if (!message) return null

  const styles =
    type === 'error'
      ? 'bg-coral text-white'
      : type === 'success'
        ? 'bg-mint-deep text-white'
        : 'bg-ink text-peach'

  return (
    <div
      role="status"
      className="fixed bottom-6 left-1/2 z-50 w-[min(92vw,22rem)] -translate-x-1/2 fade-up"
    >
      <div
        className={`rounded-2xl px-4 py-3 text-center text-sm font-semibold shadow-lg ${styles}`}
      >
        {message}
      </div>
    </div>
  )
}
