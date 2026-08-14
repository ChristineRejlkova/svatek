import { useRef, useState } from 'react'
import { playVictorySound } from '../utils/sounds'
import SuccessContinue from './SuccessContinue'

/** STRICTLY case-sensitive, must include trailing period */
const CORRECT = 'Haty2026.'

/**
 * Horizontal entries. `keyIndex` is the letter that sits in the highlighted
 * tajenka column. KONFETY has no "0", so a dedicated tajenka cell is prefixed.
 * 2026 contributes both "2" (in-column) and "6" (extra tajenka row).
 */
const ENTRIES = [
  {
    num: 1,
    clue: 'Společné kpjm křestních jmen',
    cells: ['H', 'A', 'T', 'Y'],
    keyIndex: 0,
  },
  {
    num: 2,
    clue: 'Oblíbený ranní nápoj, kterým začíná den',
    cells: ['K', 'Á', 'V', 'A'],
    keyIndex: 3,
  },
  {
    num: 3,
    clue: 'Věty, které neřekneš ven',
    cells: ['T', 'A', 'J', 'E', 'M', 'S', 'T', 'V', 'Í'],
    keyIndex: 0,
  },
  {
    num: 4,
    clue: 'Přívěsek v tvém dekoltu',
    cells: ['S', 'Y', 'M', 'B', 'O', 'L'],
    keyIndex: 1,
  },
  {
    num: 5,
    clue: 'Tvého narození den',
    cells: ['2', '0'],
    keyIndex: 0,
  },
  {
    num: 6,
    clue: 'Papírky, co létají při oslavě jen',
    cells: ['0', 'K', 'O', 'N', 'F', 'E', 'T', 'Y'],
    keyIndex: 0,
  },
  {
    num: 7,
    clue: 'Rok vzniku dohody',
    cells: ['2', '0', '2', '6'],
    keyIndex: 0,
  },
  {
    num: 8,
    clue: 'Znaménko na konec věty',
    cells: ['.'],
    keyIndex: 0,
  },
]

const KEY_COL = Math.max(...ENTRIES.map((e) => e.keyIndex))
const COLS = Math.max(
  ...ENTRIES.map((e) => KEY_COL - e.keyIndex + e.cells.length),
)

function padOf(entry) {
  return KEY_COL - entry.keyIndex
}

function emptyValues() {
  return ENTRIES.map((e) => Array.from({ length: e.cells.length }, () => ''))
}

export default function CrosswordStage({ onContinue, showToast, completed = false }) {
  const [values, setValues] = useState(() =>
    completed ? ENTRIES.map((e) => [...e.cells]) : emptyValues(),
  )
  const [tajenka, setTajenka] = useState(completed ? CORRECT : '')
  const [shake, setShake] = useState(false)
  const [success, setSuccess] = useState(completed)
  const refs = useRef({})

  const coords = []
  ENTRIES.forEach((entry, row) => {
    entry.cells.forEach((_, i) => coords.push([row, i]))
  })

  const focusAt = (row, i) => {
    refs.current[`${row}-${i}`]?.focus()
  }

  const stepFocus = (row, i, dir) => {
    const idx = coords.findIndex(([r, c]) => r === row && c === i)
    const next = coords[idx + dir]
    if (next) focusAt(next[0], next[1])
  }

  const setCell = (row, i, raw) => {
    if (success) return
    const char = raw.slice(-1)
    setValues((prev) => {
      const next = prev.map((r) => [...r])
      next[row][i] = char
      return next
    })
    if (char) stepFocus(row, i, 1)
  }

  const onKeyDown = (e, row, i) => {
    if (e.key === 'ArrowLeft' || (e.key === 'Backspace' && !values[row][i])) {
      e.preventDefault()
      stepFocus(row, i, -1)
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      stepFocus(row, i, 1)
    }
  }

  const tajenkaPreview = ENTRIES.map(
    (entry, row) => values[row][entry.keyIndex] || '',
  ).join('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (success) return

    if (tajenka === CORRECT) {
      setSuccess(true)
      playVictorySound()
      showToast('Tajenka sedí!', 'success')
      return
    }

    setShake(true)
    const almost =
      tajenka.trim().toLowerCase().replace(/\.$/, '') === 'haty2026'
    showToast(
      almost
        ? 'Skoro! Pozor na velká/malá písmena a tečku na konci.'
        : 'Zatím ne — přečti žlutý sloupec shora dolů.',
      'error',
    )
    setTimeout(() => setShake(false), 450)
  }

  return (
    <section
      className={`card-surface pop-in rounded-3xl p-5 sm:p-8 ${success ? 'ring-2 ring-mint-deep/50' : ''}`}
    >
      <p className="mb-1 font-display text-sm font-semibold tracking-wide text-coral uppercase">
        Úkol 4 · Křížovka
      </p>
      <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
        Svislá tajenka
      </h2>
      <p className="mt-2 text-sm text-ink-soft sm:text-base">
        Doplň vodorovná slova. Žlutý sloupec složí kód — pozor na velikost písmen
        a tečku.
      </p>

      <div className={`mt-5 ${shake ? 'shake' : ''}`}>
        <div className="-mx-1 overflow-x-auto pb-2">
          <div
            className="mx-auto grid w-max gap-0.5"
            style={{
              gridTemplateColumns: `1.15rem repeat(${COLS}, minmax(1.65rem, 1.8rem))`,
            }}
          >
            {ENTRIES.map((entry, row) => (
              <Row
                key={`${entry.num}-${entry.ghost ? 'g' : 'w'}`}
                entry={entry}
                row={row}
                pad={padOf(entry)}
                cols={COLS}
                values={values[row]}
                success={success}
                refsMap={refs}
                onChange={setCell}
                onKeyDown={onKeyDown}
              />
            ))}
          </div>
        </div>
        <p className="mt-2 text-center text-[11px] font-semibold tracking-wide text-ink-soft">
          🟨 tajenka · {tajenkaPreview || '…'}
        </p>
      </div>

      <ol className="mt-4 space-y-1.5 text-sm text-ink-soft">
        {ENTRIES.filter((e) => e.clue).map((e) => (
          <li key={e.num} className="flex gap-2">
            <span className="font-display w-4 shrink-0 font-bold text-coral">
              {e.num}.
            </span>
            <span>
              {e.clue}
              <span className="ml-1 text-[11px] text-ink-soft/70">
                ({e.num === 6 ? e.cells.length - 1 : e.cells.length})
              </span>
            </span>
          </li>
        ))}
      </ol>

      {!success ? (
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
          <label htmlFor="tajenka" className="text-sm font-bold text-ink">
            Zadej tajenku křížovky:
          </label>
          <input
            id="tajenka"
            type="text"
            value={tajenka}
            onChange={(e) => setTajenka(e.target.value)}
            placeholder="…………"
            autoComplete="off"
            spellCheck={false}
            className="w-full rounded-2xl border-2 border-peach bg-white px-4 py-3 text-center font-mono text-lg font-semibold tracking-wide text-ink outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/20"
          />
          <button
            type="submit"
            disabled={tajenka === ''}
            className="rounded-2xl bg-coral px-6 py-3 font-display text-lg font-semibold text-white shadow-md shadow-coral/30 transition hover:-translate-y-0.5 hover:bg-coral-deep disabled:opacity-50"
          >
            Ověřit tajenku
          </button>
        </form>
      ) : (
        <SuccessContinue onContinue={onContinue} />
      )}
    </section>
  )
}

function Row({
  entry,
  row,
  pad,
  cols,
  values,
  success,
  refsMap,
  onChange,
  onKeyDown,
}) {
  const boxes = []
  for (let col = 0; col < cols; col += 1) {
    const i = col - pad
    if (i < 0 || i >= entry.cells.length) {
      boxes.push(<div key={`p-${col}`} className="h-7 sm:h-8" />)
      continue
    }
    const isKey = i === entry.keyIndex
    boxes.push(
      <input
        key={`c-${i}`}
        ref={(el) => {
          refsMap.current[`${row}-${i}`] = el
        }}
        type="text"
        inputMode="text"
        maxLength={1}
        value={values[i]}
        disabled={success}
        aria-label={isKey ? `Tajenka ${entry.num}` : `Řádek ${entry.num}, pole ${i + 1}`}
        onChange={(e) => onChange(row, i, e.target.value)}
        onKeyDown={(e) => onKeyDown(e, row, i)}
        className={`h-7 w-full rounded-md border text-center font-display text-sm font-bold outline-none transition sm:h-8 sm:text-base ${
          isKey
            ? 'border-amber-400 bg-amber-200 text-ink ring-2 ring-amber-300/70'
            : 'border-peach bg-white text-ink focus:border-coral'
        } disabled:opacity-80`}
      />,
    )
  }

  return (
    <>
      <div className="flex items-center justify-center font-display text-[11px] font-bold text-coral">
        {entry.ghost ? '↳' : entry.num}
      </div>
      {boxes}
    </>
  )
}
