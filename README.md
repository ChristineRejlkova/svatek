# Name Day Escape Mini-Game

A playful, mobile-first puzzle adventure that unlocks a Name Day greeting, invitation, and hidden message.

## Stages

1. **Math Puzzle** — emoji equations (answer: `15`)
2. **Morse Code** — `... .-. .--. . -.` → `SRPEN`
3. **Email Cipher** — assemble `hanyty2012@gmail.com`
4. **Crossword** — tajenka `Haty2026.` (case + period)
5. **Sliding Puzzle** — cozy café 3×3
6. **Finale** — confetti, invitation (17. 8.), easter egg

Correct answers show a success state; the player advances only via **Další výzva ➔**.

## Run locally

```bash
npm install
npm run dev
```

## Customize

- Puzzle image: `PUZZLE_IMAGE_URL` in `src/components/PuzzleStage.jsx`
- Invitation / secret text: `src/components/FinaleStage.jsx`
- Test skip (`Enter`): `TEST_MODE` in `src/App.jsx` — set to `false` before gifting

## Stack

React (Vite) · Tailwind CSS v4 · canvas-confetti
