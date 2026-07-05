/**
 * Santa Bodega brand marks. Every mark is single-color and inherits the
 * current text color (`currentColor`), so the same component works white-on-
 * orange and orange-on-white — the two lockups from the brand sheet. Face
 * features on the mascot are true cut-outs (fill-rule="evenodd"), so the
 * background shows through instead of being hard-coded to one color.
 */

export function Halo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 26" className={className} aria-hidden="true">
      <ellipse
        cx="50"
        cy="13"
        rx="42"
        ry="8.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
      />
    </svg>
  );
}

/** The running, haloed saint carrying a box — the primary brand mascot. */
export function Mascot({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Santa Bodega">
      <g fill="currentColor">
        {/* halo */}
        <ellipse cx="95" cy="20" rx="30" ry="6.5" fill="none" stroke="currentColor" strokeWidth="6" />
        {/* head + smiley face as cut-outs */}
        <path
          fillRule="evenodd"
          d="M69 54 a26 26 0 1 1 52 0 a26 26 0 1 1 -52 0 Z
             M82.5 48 a3.6 3.6 0 1 0 7.2 0 a3.6 3.6 0 1 0 -7.2 0 Z
             M100.3 48 a3.6 3.6 0 1 0 7.2 0 a3.6 3.6 0 1 0 -7.2 0 Z
             M85 58 q10 11 21 0 q-10 6.5 -21 0 Z"
        />
      </g>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* torso */}
        <path d="M96 80 L104 120" />
        {/* back leg, kicked up behind */}
        <path d="M104 120 L84 133 L70 150" />
        {/* front leg, planted forward */}
        <path d="M104 120 L120 138 L134 150" />
        {/* rear arm reaching to the box */}
        <path d="M99 90 L74 104" />
      </g>
      {/* the box, held out front */}
      <g fill="none" stroke="currentColor" strokeWidth="7" strokeLinejoin="round">
        <rect x="40" y="92" width="34" height="30" rx="2" transform="rotate(-8 57 107)" />
        <path d="M41 100 L74 96" transform="rotate(-8 57 107)" />
      </g>
      {/* front arm cradling the box */}
      <g fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
        <path d="M99 96 L86 110 L74 112" />
      </g>
    </svg>
  );
}

/** SB monogram with the halo over the S. */
export function Monogram({ className }: { className?: string }) {
  return (
    <span className={`inline-flex flex-col items-start leading-none ${className ?? ""}`}>
      <Halo className="w-6 h-[9px] -mb-[3px] ml-1" />
      <span className="font-display font-bold text-[2em]" style={{ letterSpacing: "-0.04em" }}>
        S<span className="align-super text-[0.9em]">B</span>
      </span>
    </span>
  );
}

/** Full stacked wordmark: SANTA / BODEGA with a halo above. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`inline-flex flex-col items-center leading-[0.9] ${className ?? ""}`}>
      <Halo className="w-10 h-[10px] -mb-1" />
      <span className="font-display font-bold uppercase tracking-tight text-[1.5em]">Santa</span>
      <span className="font-display font-bold uppercase tracking-tight text-[1.9em]">Bodega</span>
    </span>
  );
}

/** Compact horizontal lockup for headers: monogram + name. */
export function LogoLockup({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ""}`}>
      <Mascot className="w-10 h-10" />
      <span className="font-display font-bold uppercase tracking-tight text-xl leading-none">
        Santa Bodega
      </span>
    </span>
  );
}
