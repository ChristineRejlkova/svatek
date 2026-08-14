import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'

let confettiSessionId = 0

export default function FinaleStage({ onReset }) {
  const [secretRevealed, setSecretRevealed] = useState(false)

  useEffect(() => {
    const session = ++confettiSessionId
    const colors = ['#f4845f', '#5ec4a0', '#ffe9a8', '#ffb4a2', '#c9e8ff']

    const burst = (opts) => {
      if (session !== confettiSessionId) return
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.65 },
        colors,
        ...opts,
      })
    }

    burst({ angle: 60, origin: { x: 0.1, y: 0.7 } })
    burst({ angle: 120, origin: { x: 0.9, y: 0.7 } })
    const t1 = setTimeout(
      () => burst({ particleCount: 120, spread: 100, origin: { x: 0.5, y: 0.55 } }),
      280,
    )
    const t2 = setTimeout(() => {
      if (session !== confettiSessionId) return
      confetti({
        particleCount: 40,
        angle: 90,
        spread: 360,
        startVelocity: 25,
        gravity: 0.7,
        ticks: 200,
        origin: { x: 0.5, y: 0.4 },
        colors,
      })
    }, 700)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return (
    <section className="card-surface pop-in overflow-hidden rounded-3xl">
      <div className="relative bg-gradient-to-br from-peach via-blush to-mint px-5 py-8 text-center sm:px-8 sm:py-10">
        <div className="pattern-dots absolute inset-0 opacity-60" aria-hidden />
        <div className="relative">
          <p className="wiggle inline-block text-5xl sm:text-6xl" aria-hidden>
            🎉
          </p>
          <h2 className="mt-3 font-display text-3xl leading-tight font-bold text-ink sm:text-4xl">
            Všechno nejlepší
            <br />
            k svátku Hany!
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm text-ink-soft sm:text-base">
            Všechny zámky padly. Tohle tajemství bylo jen pro tebe.
          </p>
        </div>
      </div>

      <div className="space-y-4 p-5 sm:p-8">
        <div className="rounded-2xl border border-peach bg-gradient-to-br from-white to-butter/40 p-5 text-left shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-3xl" aria-hidden>
              📅
            </span>
            <div>
              <p className="font-display text-xs font-bold tracking-wider text-coral uppercase">
                Pozvánka
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold text-ink sm:text-2xl">
                Rezervuj si odpoledne 17.&nbsp;8.!
              </h3>
              <dl className="mt-3 space-y-2 text-sm text-ink-soft sm:text-base">
                <div className="flex gap-2">
                  <dt className="font-bold text-ink">Kdy:</dt>
                  <dd>17. srpna · odpoledne</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-bold text-ink">Kde:</dt>
                  <dd>záhada ☕ — detaily brzy…</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-bold text-ink">Dress:</dt>
                  <dd>pohoda &amp; úsměv</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Hidden easter egg — white on white until hover / touch */}
        <div className="space-y-2">
          <div
            role="img"
            aria-label="Tajné pole — přejeď myší nebo podrž prst"
            className="group relative select-none overflow-hidden rounded-2xl border border-peach/40 bg-white"
            style={{ minHeight: '5.5rem' }}
            onPointerDown={() => setSecretRevealed(true)}
            onPointerUp={() => setSecretRevealed(false)}
            onPointerLeave={() => setSecretRevealed(false)}
            onPointerCancel={() => setSecretRevealed(false)}
          >
            <p
              className={`flex h-full min-h-[5.5rem] items-center justify-center px-4 text-center font-display text-xl font-bold transition-colors duration-300 sm:text-2xl ${
                secretRevealed
                  ? 'text-ink'
                  : 'text-white group-hover:text-ink'
              }`}
            >
              Unikneme spolu?
            </p>
          </div>
          <p className="text-center text-xs text-ink-soft sm:text-sm">
            🔍 Přejdi myší přes bílé pole pro poslední tajemství…
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="w-full rounded-2xl border-2 border-peach bg-white px-6 py-3 font-display text-lg font-semibold text-ink transition hover:-translate-y-0.5 hover:border-coral hover:bg-blush active:translate-y-0"
        >
          Hrát znovu
        </button>
      </div>
    </section>
  )
}
