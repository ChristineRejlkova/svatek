import { useCallback, useEffect, useState } from 'react'
import ProgressBar, { stageRank } from './components/ProgressBar'
import Toast from './components/Toast'
import MathStage from './components/MathStage'
import MorseStage from './components/MorseStage'
import EmailStage from './components/EmailStage'
import CrosswordStage from './components/CrosswordStage'
import PuzzleStage from './components/PuzzleStage'
import FinaleStage from './components/FinaleStage'

/** Set to `false` before sharing the real gift link */
const TEST_MODE = false

const NEXT_STAGE = {
  1: 2,
  2: 3,
  3: 4,
  4: 5,
  5: 'finale',
}

const PREV_STAGE = {
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  finale: 5,
}

export default function App() {
  const [stage, setStage] = useState(1)
  const [unlocked, setUnlocked] = useState(1)
  const [toast, setToast] = useState({ message: '', type: 'hint' })

  const showToast = useCallback((message, type = 'hint') => {
    setToast({ message, type })
  }, [])

  const clearToast = useCallback(() => {
    setToast({ message: '', type: 'hint' })
  }, [])

  const goTo = useCallback((next) => {
    setUnlocked((current) =>
      stageRank(next) > stageRank(current) ? next : current,
    )
    setStage(next)
  }, [])

  const resetGame = () => {
    setStage(1)
    setUnlocked(1)
    showToast('Nová hra — hodně štěstí!', 'hint')
  }

  useEffect(() => {
    if (!TEST_MODE) return

    const onKeyDown = (e) => {
      if (e.key !== 'Enter') return
      if (stage === 'finale') return
      const next = NEXT_STAGE[stage]
      if (!next) return
      e.preventDefault()
      e.stopPropagation()
      showToast(`TEST: Úkol ${stage} přeskočen`, 'success')
      goTo(next)
    }

    window.addEventListener('keydown', onKeyDown, true)
    return () => window.removeEventListener('keydown', onKeyDown, true)
  }, [stage, goTo, showToast])

  const completed = (n) => stageRank(unlocked) > n
  const canBack = Boolean(PREV_STAGE[stage])
  const canForward = Boolean(NEXT_STAGE[stage]) && stageRank(stage) < stageRank(unlocked)

  return (
    <div className="bg-app pattern-dots relative min-h-dvh">
      {TEST_MODE && (
        <div className="sticky top-0 z-40 bg-ink px-3 py-2 text-center text-xs font-bold tracking-wide text-butter">
          TEST MODE — stiskni{' '}
          <kbd className="rounded bg-white/15 px-1.5 py-0.5 font-mono">Enter</kbd>{' '}
          = splnit úkol
        </div>
      )}

      <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 pt-6 pb-10 sm:px-6 sm:pt-10">
        <header className="fade-up mb-6 text-center">
          <p className="font-display text-sm font-semibold tracking-[0.2em] text-coral uppercase">
            Dárek s překvapením
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-ink sm:text-4xl">
            Sváteční hra
          </h1>
          <p className="mt-2 text-sm text-ink-soft sm:text-base">
            Mini-game · 5 zámků · 1 pozvánka
          </p>
        </header>

        <div className="mb-4 fade-up" style={{ animationDelay: '80ms' }}>
          <ProgressBar
            stage={stage}
            unlocked={unlocked}
            onSelect={goTo}
          />
        </div>

        {(canBack || canForward) && (
          <div className="mb-4 flex gap-2">
            <button
              type="button"
              disabled={!canBack}
              onClick={() => setStage(PREV_STAGE[stage])}
              className="flex-1 rounded-xl border-2 border-peach bg-white px-3 py-2 font-display text-sm font-semibold text-ink transition hover:border-coral hover:bg-blush disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Zpět
            </button>
            <button
              type="button"
              disabled={!canForward}
              onClick={() => setStage(NEXT_STAGE[stage])}
              className="flex-1 rounded-xl border-2 border-peach bg-white px-3 py-2 font-display text-sm font-semibold text-ink transition hover:border-coral hover:bg-blush disabled:cursor-not-allowed disabled:opacity-40"
            >
              Vpřed →
            </button>
          </div>
        )}

        <main className="flex-1">
          {stage === 1 && (
            <MathStage
              completed={completed(1)}
              onContinue={() => goTo(2)}
              showToast={showToast}
            />
          )}
          {stage === 2 && (
            <MorseStage
              completed={completed(2)}
              onContinue={() => goTo(3)}
              showToast={showToast}
            />
          )}
          {stage === 3 && (
            <EmailStage
              completed={completed(3)}
              onContinue={() => goTo(4)}
              showToast={showToast}
            />
          )}
          {stage === 4 && (
            <CrosswordStage
              completed={completed(4)}
              onContinue={() => goTo(5)}
              showToast={showToast}
            />
          )}
          {stage === 5 && (
            <PuzzleStage
              completed={completed(5)}
              onContinue={() => goTo('finale')}
              showToast={showToast}
            />
          )}
          {stage === 'finale' && <FinaleStage onReset={resetGame} />}
        </main>

        <footer className="mt-8 text-center text-xs text-ink-soft/70">
          Made with ☕ · for a math &amp; puzzle lover
        </footer>
      </div>

      <Toast message={toast.message} type={toast.type} onClose={clearToast} />
    </div>
  )
}
