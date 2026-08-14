import { useState } from 'react'
import { playVictorySound } from '../utils/sounds'
import SuccessContinue from './SuccessContinue'

const CORRECT = 15

export default function MathStage({ onContinue, showToast, completed = false }) {
  const [answer, setAnswer] = useState(completed ? String(CORRECT) : '')
  const [shake, setShake] = useState(false)
  const [success, setSuccess] = useState(completed)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (success) return
    const value = Number(String(answer).trim().replace(',', '.'))

    if (value === CORRECT) {
      setSuccess(true)
      playVictorySound()
      showToast('Správně! 🎉', 'success')
      return
    }

    setShake(true)
    showToast(
      'Špatně — násobení má přednost před sčítáním (× dřív než +).',
      'error',
    )
    setTimeout(() => setShake(false), 450)
  }

  return (
    <section
      className={`card-surface pop-in rounded-3xl p-5 sm:p-8 ${success ? 'ring-2 ring-mint-deep/50' : ''}`}
    >
      <p className="mb-1 font-display text-sm font-semibold tracking-wide text-coral uppercase">
        Úkol 1 · Visual Math Puzzle
      </p>
      <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
        Emoji rovnice
      </h2>
      <p className="mt-2 text-sm text-ink-soft sm:text-base">
        Najdi hodnotu posledního řádku. Každá ikona má své číslo.
      </p>

      <div
        className={`mt-6 space-y-3 rounded-2xl bg-blush/60 p-4 font-display text-lg sm:text-xl ${
          shake ? 'shake' : ''
        }`}
      >
        <EquationRow symbols={['☕', '+', '☕', '+', '☕', '=', '15']} />
        <EquationRow symbols={['☕', '+', '🍰', '+', '🍰', '=', '15']} />
        <EquationRow symbols={['🍰', '+', '🎁', '+', '🎁', '=', '9']} />
        <EquationRow
          symbols={['☕', '+', '🍰', '×', '🎁', '=', '?']}
          highlight
        />
      </div>

      {!success ? (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <label htmlFor="math-answer" className="text-sm font-bold text-ink">
            Zadej výsledné číslo:
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="math-answer"
              type="number"
              inputMode="numeric"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="?"
              className="w-full flex-1 rounded-2xl border-2 border-peach bg-white px-4 py-3 text-center font-display text-2xl font-semibold text-ink outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/20"
            />
            <button
              type="submit"
              disabled={answer === ''}
              className="rounded-2xl bg-coral px-6 py-3 font-display text-lg font-semibold text-white shadow-md shadow-coral/30 transition hover:-translate-y-0.5 hover:bg-coral-deep hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              Ověřit
            </button>
          </div>
        </form>
      ) : (
        <SuccessContinue onContinue={onContinue} />
      )}

      {!success && (
        <button
          type="button"
          onClick={() =>
            showToast('Hint: ☕ = 5, 🍰 = 5, 🎁 = 2. A × má přednost: 5 + (5 × 2).', 'hint')
          }
          className="mt-4 text-sm font-semibold text-ink-soft underline decoration-peach underline-offset-4 transition hover:text-coral"
        >
          Potřebuješ nápovědu?
        </button>
      )}
    </section>
  )
}

function EquationRow({ symbols, highlight = false }) {
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-2 rounded-xl px-2 py-2 ${
        highlight ? 'bg-white/80 ring-2 ring-coral/30' : ''
      }`}
    >
      {symbols.map((s, i) => (
        <span
          key={`${s}-${i}`}
          className={
            /\d|\?/.test(s) && s.length <= 2
              ? 'min-w-8 font-bold text-coral'
              : /[🎁🍰☕]/.test(s)
                ? 'text-2xl sm:text-3xl'
                : 'text-ink-soft'
          }
        >
          {s}
        </span>
      ))}
    </div>
  )
}
