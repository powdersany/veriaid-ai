import Link from "next/link";

export function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const textColor = variant === "light" ? "text-white" : "text-ink-900";
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 font-display font-extrabold text-lg tracking-tight"
      aria-label="VeriAid AI Home"
    >
      <svg
        className="w-8 h-8"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M16 2L4 8v8c0 7.5 5.1 14.5 12 16 6.9-1.5 12-8.5 12-16V8L16 2z"
          fill="url(#veriaid-logo-grad)"
        />
        <path
          d="M11 16l3.5 3.5L21 13"
          stroke="#fff"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient
            id="veriaid-logo-grad"
            x1="0"
            y1="0"
            x2="32"
            y2="32"
          >
            <stop stopColor="#0F4C5C" />
            <stop offset="1" stopColor="#1B8A8A" />
          </linearGradient>
        </defs>
      </svg>
      <span className={textColor}>
        VeriAid <span className="text-gradient">AI</span>
      </span>
    </Link>
  );
}
