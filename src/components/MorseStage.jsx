import { useState } from 'react'
import { playVictorySound } from '../utils/sounds'
import SuccessContinue from './SuccessContinue'

const MORSE_LETTERS = [
  { code: '...', letter: 'S' },
  { code: '.-.', letter: 'R' },
  { code: '.--.', letter: 'P' },
  { code: '.', letter: 'E' },
  { code: '-.', letter: 'N' },
]

const CORRECT = 'SRPEN'

const MORSE_CHART = [
  ['A', '.-'],
  ['E', '.'],
  ['N', '-.'],
  ['P', '.--.'],
  ['R', '.-.'],
  ['S', '...'],
]

function normalize(str) {
  return str
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z]/g, '')
    .trim()
}

export default function MorseStage({ onContinue, showToast, completed = false }) {
  const [answer, setAnswer] = useState(completed ? 'SRPEN' : '')
  const [shake, setShake] = useState(false)
  const [success, setSuccess] = useState(completed)
  const [hintOpen, setHintOpen] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (success) return

    if (normalize(answer) === CORRECT) {
      setSuccess(true)
      playVictorySound()
      showToast('SRPEN dekódován!', 'success')
      return
    }

    setShake(true)
    showToast('Ještě ne — zkontroluj tečky a čárky.', 'error')
    setTimeout(() => setShake(false), 450)
  }

  return (
    <section
      className={`card-surface pop-in rounded-3xl p-5 sm:p-8 ${success ? 'ring-2 ring-mint-deep/50' : ''}`}
    >
      <p className="mb-1 font-display text-sm font-semibold tracking-wide text-mint-deep uppercase">
        Úkol 2 · Morse Code
      </p>
      <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
        Morseovka
      </h2>
      <p className="mt-2 text-sm text-ink-soft sm:text-base">
        Dekóduj zprávu z teček a čárek. Mezery oddělují písmena.
      </p>

      <div
        className={`mt-5 rounded-2xl bg-ink px-4 py-6 text-center ${shake ? 'shake' : ''}`}
      >
        <p className="mb-4 text-xs font-bold tracking-wider text-peach uppercase">
          Signál
        </p>
        <div className="flex flex-wrap items-end justify-center gap-3 sm:gap-4">
          {MORSE_LETTERS.map((item) => (
            <div key={item.code + item.letter} className="flex flex-col items-center gap-2">
              <MorseVisual code={item.code} />
              <span className="font-mono text-sm tracking-widest text-butter">
                {item.code}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 font-mono text-lg tracking-[0.35em] text-peach sm:text-xl">
          ...&nbsp;&nbsp;.-.&nbsp;&nbsp;.--.&nbsp;&nbsp;.&nbsp;&nbsp;-.
        </p>
      </div>

      {!success ? (
        <>
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
            <label htmlFor="morse-answer" className="text-sm font-bold text-ink">
              Dekódované slovo
            </label>
            <input
              id="morse-answer"
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="?????"
              autoComplete="off"
              autoCapitalize="characters"
              className="w-full rounded-2xl border-2 border-peach bg-white px-4 py-3 text-center font-display text-xl font-semibold tracking-widest text-ink uppercase outline-none transition focus:border-mint-deep focus:ring-4 focus:ring-mint-deep/20"
            />
            <button
              type="submit"
              disabled={answer === ''}
              className="rounded-2xl bg-mint-deep px-6 py-3 font-display text-lg font-semibold text-white shadow-md shadow-mint-deep/30 transition hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-50"
            >
              Ověřit
            </button>
          </form>

          <button
            type="button"
            onClick={() => setHintOpen((v) => !v)}
            className="mt-4 text-sm font-semibold text-ink-soft underline decoration-peach underline-offset-4 transition hover:text-coral"
            aria-expanded={hintOpen}
          >
            {hintOpen
              ? 'Skrýt nápovědu'
              : 'Potřebuješ nápovědu? / Morseovka převodník'}
          </button>

          {hintOpen && (
            <div className="pop-in mt-3 rounded-2xl border border-peach bg-blush/50 p-4">
              <p className="mb-3 text-xs font-bold tracking-wider text-ink-soft uppercase">
                Morseovka převodník (výběr)
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {MORSE_CHART.map(([letter, code]) => (
                  <div
                    key={letter}
                    className="flex items-center justify-between rounded-xl bg-white px-3 py-2 font-mono text-sm"
                  >
                    <span className="font-display font-bold text-coral">{letter}</span>
                    <span className="text-ink-soft">{code}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <SuccessContinue onContinue={onContinue} />
      )}
    </section>
  )
}

function MorseVisual({ code }) {
  return (
    <div className="flex h-8 items-center gap-1" aria-hidden>
      {[...code].map((ch, i) =>
        ch === '.' ? (
          <span
            key={i}
            className="h-2.5 w-2.5 rounded-full bg-butter"
          />
        ) : (
          <span
            key={i}
            className="h-2.5 w-6 rounded-full bg-coral"
          />
        ),
      )}
    </div>
  )
}
