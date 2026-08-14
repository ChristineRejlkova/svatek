const STAGES = [
  { id: 1, label: 'Math' },
  { id: 2, label: 'Morse' },
  { id: 3, label: 'Email' },
  { id: 4, label: 'Křížovka' },
  { id: 5, label: 'Puzzle' },
]

const TOTAL = STAGES.length

export function stageRank(stage) {
  return stage === 'finale' ? TOTAL + 1 : stage
}

export default function ProgressBar({ stage, unlocked, onSelect }) {
  const viewRank = stageRank(stage)
  const unlockedRank = stageRank(unlocked)
  const progress =
    unlocked === 'finale'
      ? 100
      : Math.max(0, ((unlockedRank - 1) / TOTAL) * 100 + 100 / (TOTAL * 2))

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs font-bold tracking-wide text-ink-soft uppercase">
        <span>
          {stage === 'finale' ? 'Odemčeno!' : `Úkol ${stage} ze ${TOTAL}`}
        </span>
        <span className="font-display text-coral">{progress.toFixed(0)}%</span>
      </div>

      <div className="relative h-2.5 overflow-hidden rounded-full bg-peach/70">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-coral to-mint-deep transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-3 flex justify-between gap-1 sm:gap-2">
        {STAGES.map((s) => {
          const done = s.id < unlockedRank
          const current = s.id === viewRank
          const reachable = s.id <= unlockedRank
          return (
            <button
              key={s.id}
              type="button"
              disabled={!reachable}
              onClick={() => reachable && onSelect(s.id)}
              className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl py-1 transition-all duration-300 ${
                reachable
                  ? 'cursor-pointer hover:-translate-y-0.5'
                  : 'cursor-not-allowed opacity-40'
              } ${current ? 'opacity-100' : done ? 'opacity-100' : ''}`}
            >
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300 sm:h-7 sm:w-7 sm:text-xs ${
                  current
                    ? 'scale-110 bg-coral text-white shadow-md shadow-coral/40'
                    : done
                      ? 'scale-100 bg-mint-deep text-white'
                      : 'bg-peach text-ink-soft'
                }`}
              >
                {done && !current ? '✓' : s.id}
              </div>
              <span className="font-display max-w-full truncate text-[9px] text-ink-soft sm:text-xs">
                {s.label}
              </span>
            </button>
          )
        })}
      </div>

      {unlocked === 'finale' && (
        <button
          type="button"
          onClick={() => onSelect('finale')}
          className={`mt-3 w-full rounded-xl py-1.5 font-display text-xs font-semibold transition ${
            stage === 'finale'
              ? 'bg-coral text-white'
              : 'bg-peach text-ink hover:bg-peach-deep'
          }`}
        >
          🎉 Finále
        </button>
      )}
    </div>
  )
}
