export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-50">
      <div className="text-center">
        <svg
          className="w-10 h-10 mx-auto mb-3 text-teal-600 animate-spin"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
          <path d="M17 10a7 7 0 00-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <p className="text-ink-500 text-sm">Memuat...</p>
      </div>
    </div>
  );
}
