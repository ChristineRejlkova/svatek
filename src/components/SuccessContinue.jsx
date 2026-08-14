export default function SuccessContinue({
  onContinue,
  label = 'Další výzva ➔',
  message = 'Správně! 🎉',
}) {
  return (
    <div className="pop-in mt-5 space-y-3 rounded-2xl border-2 border-mint-deep bg-mint/40 p-4 text-center success-flash">
      <p className="font-display text-lg font-bold text-mint-deep sm:text-xl">
        ✓ {message}
      </p>
      <button
        type="button"
        onClick={onContinue}
        className="pulse-soft w-full rounded-2xl bg-mint-deep px-6 py-3 font-display text-lg font-semibold text-white shadow-md shadow-mint-deep/30 transition hover:-translate-y-0.5 hover:brightness-110 hover:shadow-lg active:translate-y-0"
      >
        {label}
      </button>
    </div>
  )
}
