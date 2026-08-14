import { useCallback, useEffect, useMemo, useState } from 'react'
import { playVictorySound } from '../utils/sounds'
import SuccessContinue from './SuccessContinue'

/** Swap this URL anytime for a personal photo */
export const PUZZLE_IMAGE_URL =
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80'

const SIZE = 3
const TOTAL = SIZE * SIZE

function indexToRC(i) {
  return { r: Math.floor(i / SIZE), c: i % SIZE }
}

function isSolvable(board) {
  const flat = board.filter((t) => t !== TOTAL - 1)
  let inversions = 0
  for (let i = 0; i < flat.length; i++) {
    for (let j = i + 1; j < flat.length; j++) {
      if (flat[i] > flat[j]) inversions++
    }
  }
  return inversions % 2 === 0
}

function shuffleBoard() {
  let board
  do {
    board = Array.from({ length: TOTAL }, (_, i) => i)
    for (let i = board.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[board[i], board[j]] = [board[j], board[i]]
    }
  } while (!isSolvable(board) || board.every((v, i) => v === i))
  return board
}

function isSolved(board) {
  return board.every((v, i) => v === i)
}

export default function PuzzleStage({ onContinue, showToast, completed = false }) {
  const [board, setBoard] = useState(() =>
    completed ? Array.from({ length: TOTAL }, (_, i) => i) : shuffleBoard(),
  )
  const [solved, setSolved] = useState(completed)
  const [revealed, setRevealed] = useState(completed)

  const emptyIndex = useMemo(() => board.indexOf(TOTAL - 1), [board])

  const canMove = useCallback(
    (index) => {
      const a = indexToRC(index)
      const b = indexToRC(emptyIndex)
      return (
        (a.r === b.r && Math.abs(a.c - b.c) === 1) ||
        (a.c === b.c && Math.abs(a.r - b.r) === 1)
      )
    },
    [emptyIndex],
  )

  const moveTile = (index) => {
    if (solved || !canMove(index)) return
    const next = [...board]
    ;[next[index], next[emptyIndex]] = [next[emptyIndex], next[index]]
    setBoard(next)

    if (isSolved(next)) {
      setSolved(true)
      playVictorySound()
      showToast('Puzzle složené!', 'success')
      setTimeout(() => setRevealed(true), 400)
    }
  }

  const handleShuffle = () => {
    if (solved) return
    setBoard(shuffleBoard())
    showToast('Zamícháno znovu — hodně štěstí!', 'hint')
  }

  useEffect(() => {
    const img = new Image()
    img.src = PUZZLE_IMAGE_URL
  }, [])

  return (
    <section
      className={`card-surface pop-in rounded-3xl p-5 sm:p-8 ${solved ? 'ring-2 ring-mint-deep/50' : ''}`}
    >
      <p className="mb-1 font-display text-sm font-semibold tracking-wide text-coral uppercase">
        Úkol 5 · Puzzle
      </p>
      <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
        Sliding puzzle
      </h2>
      <p className="mt-2 text-sm text-ink-soft sm:text-base">
        Poskládej obrázek kavárny — poslední zámek před finále.
      </p>

      <div className="relative mx-auto mt-5 aspect-square w-full max-w-sm overflow-hidden rounded-2xl bg-peach shadow-inner">
        <div
          className={`pointer-events-none absolute inset-0 z-20 transition-opacity duration-700 ${
            revealed ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={PUZZLE_IMAGE_URL}
            alt="Completed puzzle — cozy café"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />
        </div>

        <div
          className={`grid h-full w-full grid-cols-3 grid-rows-3 gap-1 p-1 transition-opacity duration-500 ${
            revealed ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {board.map((tileId, index) => {
            if (tileId === TOTAL - 1) {
              return (
                <div
                  key={`empty-${index}`}
                  className="rounded-lg bg-blush/40"
                  aria-hidden
                />
              )
            }

            const { r, c } = indexToRC(tileId)

            return (
              <button
                key={tileId}
                type="button"
                onClick={() => moveTile(index)}
                disabled={solved}
                aria-label={`Tile ${tileId + 1}`}
                className={`relative overflow-hidden rounded-lg transition duration-200 ${
                  canMove(index) && !solved
                    ? 'cursor-pointer ring-2 ring-transparent hover:ring-coral/50 hover:brightness-105 active:scale-[0.98]'
                    : 'cursor-default'
                }`}
                style={{
                  backgroundImage: `url(${PUZZLE_IMAGE_URL})`,
                  backgroundSize: `${SIZE * 100}% ${SIZE * 100}%`,
                  backgroundPosition: `${(c / (SIZE - 1)) * 100}% ${(r / (SIZE - 1)) * 100}%`,
                }}
              />
            )
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        {!solved && (
          <button
            type="button"
            onClick={handleShuffle}
            className="rounded-xl bg-peach px-4 py-2 text-sm font-bold text-ink transition hover:bg-peach-deep"
          >
            Zamíchat znovu
          </button>
        )}
      </div>

      {solved && (
        <SuccessContinue
          onContinue={onContinue}
          label="Odemknout finále ➔"
          message="Puzzle hotové! 🎉"
        />
      )}
    </section>
  )
}
