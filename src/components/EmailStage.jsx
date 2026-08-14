import { useState } from 'react'
import { playVictorySound } from '../utils/sounds'
import SuccessContinue from './SuccessContinue'

const CORRECT = 'hanyty2012@gmail.com'

const FRAGMENTS = [
  { id: 'a', text: 'hanyty', hint: 'přezdívka' },
  { id: 'b', text: '2012', hint: 'rok' },
  { id: 'c', text: '@', hint: 'zavináč' },
  { id: 'd', text: 'gmail', hint: 'schránka' },
  { id: 'e', text: '.com', hint: 'doména' },
]

function normalizeEmail(str) {
  return str.trim().toLowerCase().replace(/\s+/g, '')
}

export default function EmailStage({ onContinue, showToast, completed = false }) {
  const [answer, setAnswer] = useState(completed ? CORRECT : '')
  const [shake, setShake] = useState(false)
  const [success, setSuccess] = useState(completed)
  const [hintOpen, setHintOpen] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (success) return

    if (normalizeEmail(answer) === CORRECT) {
      setSuccess(true)
      playVictorySound()
      showToast('Kanál odemčen!', 'success')
      return
    }

    setShake(true)
    showToast('Špatná adresa — poskládej úlomky dohromady.', 'error')
    setTimeout(() => setShake(false), 450)
  }

  return (
    <section
      className={`card-surface pop-in rounded-3xl p-5 sm:p-8 ${success ? 'ring-2 ring-mint-deep/50' : ''}`}
    >
      <p className="mb-1 font-display text-sm font-semibold tracking-wide text-coral uppercase">
        Úkol 3 · Secret Channel
      </p>
      <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
        Email cipher
      </h2>
      <p className="mt-2 text-sm text-ink-soft sm:text-base">
        Odemkni tajný kontaktní kanál. Úlomky adresy jsou zamíchané — slož je
        do správného e-mailu.
      </p>

      <div
        className={`mt-5 rounded-2xl bg-sky/40 p-4 ${shake ? 'shake' : ''}`}
      >
        <p className="mb-3 text-xs font-bold tracking-wider text-ink-soft uppercase">
          Zamíchané úlomky
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {[...FRAGMENTS].reverse().map((f) => (
            <span
              key={f.id}
              className="rounded-xl bg-white px-3 py-2 font-mono text-sm font-semibold text-ink shadow-sm"
              title={f.hint}
            >
              {f.text}
            </span>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-ink-soft">
          Pořadí: přezdívka → rok → @ → schránka → doména
        </p>
      </div>

      <div className="mt-4 rounded-2xl border border-dashed border-peach bg-blush/30 p-3 font-mono text-sm text-ink-soft">
        <span className="text-coral">to:</span> ???@???.???
      </div>

      {!success ? (
        <>
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
            <label htmlFor="email-answer" className="text-sm font-bold text-ink">
              Tajný e-mail
            </label>
            <input
              id="email-answer"
              type="text"
              inputMode="email"
              autoComplete="off"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="jmeno@domena.tld"
              className="w-full rounded-2xl border-2 border-peach bg-white px-4 py-3 text-center font-mono text-base font-semibold text-ink outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/20"
            />
            <button
              type="submit"
              disabled={answer === ''}
              className="rounded-2xl bg-coral px-6 py-3 font-display text-lg font-semibold text-white shadow-md shadow-coral/30 transition hover:-translate-y-0.5 hover:bg-coral-deep disabled:opacity-50"
            >
              Ověřit
            </button>
          </form>

          <button
            type="button"
            onClick={() => setHintOpen((v) => !v)}
            className="mt-4 text-sm font-semibold text-ink-soft underline decoration-peach underline-offset-4 transition hover:text-coral"
          >
            {hintOpen ? 'Skrýt nápovědu' : 'Potřebuješ nápovědu?'}
          </button>

          {hintOpen && (
            <div className="pop-in mt-3 rounded-2xl bg-butter/50 p-4 text-sm text-ink-soft">
              Hint: začíná na <span className="font-mono font-bold text-ink">hanyty</span>,
              končí na <span className="font-mono font-bold text-ink">gmail.com</span>,
              uprostřed je rok <span className="font-mono font-bold text-ink">2012</span>.
            </div>
          )}
        </>
      ) : (
        <SuccessContinue onContinue={onContinue} />
      )}
    </section>
  )
}
